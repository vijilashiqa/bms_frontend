import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LogService } from '../pages/_service/indexService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Md5 } from 'ts-md5/dist/md5';
import { userInfo } from 'os';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.css']
})

export class LoginComponent implements OnInit {
    submit: boolean = false; LoginForm; deviceInfo: DeviceInfo; mobile; tablet; desktop;
    user_pwd: boolean = false;

    constructor(
        private router: Router,
        private alert: ToasterService,
        private service: LogService,
        public activeModal: NgbModal,
        private deviceService: DeviceDetectorService
    ) {
        this.deviceInfo = this.deviceService.getDeviceInfo();
        this.mobile = this.deviceService.isMobile();
        this.tablet = this.deviceService.isTablet();
        this.desktop = this.deviceService.isDesktop();
    }

    login() {
        if (this.LoginForm.invalid) {
            this.submit = true;
            return;
        }
        const md5 = new Md5;
        this.LoginForm.value['password_en'] = md5.appendStr(this.LoginForm.value['password']).end();
        this.LoginForm.value['browser'] = this.deviceInfo.browser;
        this.LoginForm.value['browser_version'] = this.deviceInfo.browser_version;
        this.LoginForm.value['os'] = this.deviceInfo.os;
        this.LoginForm.value['os_version'] = this.deviceInfo.os_version;
        this.LoginForm.value['userAgent'] = this.deviceInfo.userAgent;
        this.LoginForm.value['devicetype'] = this.mobile == true ? 'mobile' : this.tablet == true ? 'tablet' : this.desktop == true ? 'desktop' : 'N/A';
        this.service.login(this.LoginForm.value).subscribe(result => {
            const toast: Toast = {
                type: result[0][0]['status'] == 1 ? 'success' : 'warning',
                title: result[0][0]['status'] == 1 ? 'Success' : 'Failure',
                body: result[0][0]['msg'],
                timeout: 5000,
                showCloseButton: true,
                bodyOutputType: BodyOutputType.TrustedHtml,
            };
            this.alert.popAsync(toast)
            if (result[0][0]['status'] == 1) {
                localStorage.setItem('token', JSON.stringify(result[0][0]['token']))
                localStorage.setItem('ref_token', JSON.stringify(result[0][0]['refresh_token']))
                localStorage.setItem('userinfo', JSON.stringify(result[0][1]));
                window.localStorage.setItem('subsexp_date', result[0][1].exp_date)
                this.router.navigate(['/pages/iot-dashboard'])
            } else {
                localStorage.clear();
            }
        });
    }

    ngOnInit() {
        localStorage.removeItem('token');
        this.createForm();
        // let menu = document.getElementById('noContextMenu');
        // menu.addEventListener("contextmenu", function (e) {
        //     e.preventDefault();
        // }, false);
    }

    showPwd() {
        this.user_pwd = !this.user_pwd;
    }


    createForm() {
        this.LoginForm = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
        });
    }
}

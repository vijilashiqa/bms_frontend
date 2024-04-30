import 'style-loader!angular2-toaster/toaster.css';
import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminuserService, CustService, RoleService } from '../../../pages/_service/indexService';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';



@Component({
  selector: 'ngx-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})


export class ChangepasswordComponent implements OnInit {

  submit: boolean = false; AddNasForm; datas; id;


  constructor(

    public activeModal: NgbActiveModal,
    private alert: ToasterService,
    private ser: AdminuserService,
    private custser: CustService,
    private router: Router,
    public role: RoleService
  ) { this.id = JSON.parse(localStorage.getItem('details')); }

  closeModal() {
    this.activeModal.close();
  }

  ngOnInit() {
    this.createForm();
  }

  async addNas() {
    if (this.AddNasForm.invalid || this.AddNasForm.value['Password'] != this.AddNasForm.value['CPassword']) {
      this.submit = true;
      return;
    }

    const md5 = new Md5;
    this.AddNasForm.value['password_en'] = md5.appendStr(this.AddNasForm.value['Password']).end();

    if (this.role.getroleid() != 111) {
      let result = await this.ser.changeadminpwd(this.AddNasForm.value)
      this.datas = result;
      const toast: Toast = {
        type: result['status'] == 1 ? 'success' : 'warning',
        title: result['status'] == 1 ? 'Success' : 'Failure',
        body: result['msg'],
        timeout: 5000,
        showCloseButton: true,
        bodyOutputType: BodyOutputType.TrustedHtml,
      };
      this.alert.popAsync(toast);
      if (result['status'] == 1) {
        this.activeModal.close();
        setTimeout(() => this.router.navigateByUrl('/auth/login'), 2500);
      }
    }
    if (this.role.getroleid() == 111) {
      let result = await this.custser.changeprofilepwd(this.AddNasForm.value)
      this.datas = result;
      const toast: Toast = {
        type: result['status'] == 1 ? 'success' : 'warning',
        title: result['status'] == 1 ? 'Success' : 'Failure',
        body: result['msg'],
        timeout: 5000,
        showCloseButton: true,
        bodyOutputType: BodyOutputType.TrustedHtml,
      };
      this.alert.popAsync(toast);
      if (result['status'] == 1) {
        this.activeModal.close();
        setTimeout(() => this.router.navigateByUrl('/auth/login'), 2500);
      }
    }

  }

  createForm() {
    this.AddNasForm = new FormGroup({
      Password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,32}$')]),
      CPassword: new FormControl('', Validators.required)
    });
  }
}
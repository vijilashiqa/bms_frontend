import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';
import { ResellerService, RoleService } from '../../_service/indexService';

@Component({
  selector: 'Password',
  templateUrl: './profilepass.component.html',

})

export class PasswordComponent implements OnInit {
  submit: boolean = false; AddNasForm; datas; id; modalHeader; config; item;

  constructor(
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private ser: ResellerService,
    private router: Router,
    public role: RoleService,
  ) { this.id = JSON.parse(localStorage.getItem('details')) }

  closeModal() {
    this.activeModal.close();
    // this.router.navigate(['/pages/reseller/viewreseller'])
  }
  ngOnInit() {
    this.createForm();
  }

  async addPropass() {
    if (this.AddNasForm.invalid || this.AddNasForm.value['Password'] != this.AddNasForm.value['CPassword']) {
      this.submit = true;
      return;
    }
    if (this.role.getroleid() >= 775 || (this.role.getroleid() > 444 && (this.item['resid'] || this.item['id']) )) {
      console.log('item', this.item)
      if (this.id) {
        this.AddNasForm.value['id'] = this.id;
      } else if (this.item['resid']) {
        this.AddNasForm.value['id'] = this.item['resid']
      } else if (this.item['id']) {
        this.AddNasForm.value['id'] = this.item['id']
      }
    }else if (this.role.getroleid() <= 444) {
      this.AddNasForm.value['id'] = this.role.getresellerid();
    }else{
      this.AddNasForm.value['id'] = this.role.getresellerid();
    }

    const md5 = new Md5;
    this.AddNasForm.value['password_en'] = md5.appendStr(this.AddNasForm.value['Password']).end();
    let result = await this.ser.changepassword(this.AddNasForm.value)
    this.datas = result;
    // console.log(result)
    const toast: Toast = {
      type: result['status'] == 1 ? 'success' : 'warning',
      title: result['status'] == 1 ? 'Success' : 'Failure',
      body: result['msg'],
      timeout: 3000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
    if (result['status'] == 1) {
      await this.closeModal();
    }
  }


  createForm() {
    this.AddNasForm = new FormGroup({
      Password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,32}$')]),
      CPassword: new FormControl('', Validators.required),

    });
  }
}
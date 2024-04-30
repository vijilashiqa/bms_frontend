import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminuserService, CustService } from '../../_service/indexService';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';

@Component({

  selector: 'ngx-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']

})

export class ChangepasswordComponent implements OnInit {
  submit: boolean = false; ChangePassForm; datas; id; modalHeader;item;

  constructor(
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private ser: AdminuserService,
    private router: Router
  ) {  }

  closeModal() {
    this.activeModal.close();
    this.router.navigate(['/pages/administration/list-adminuser'])
  }

  ngOnInit() {
    this.createForm();

  }
  
  async ChangePassword() {
    if (this.ChangePassForm.invalid || this.ChangePassForm.value['Password'] != this.ChangePassForm.value['CPassword']) {
      this.submit = true;
      return;
    }
    this.ChangePassForm.value['id'] = this.item.id;
    const md5 = new Md5;
    this.ChangePassForm.value['password_en'] = md5.appendStr(this.ChangePassForm.value['Password']).end();
    this.datas = await this.ser.changeadminpwd(this.ChangePassForm.value);

    const toast: Toast = {
      type: this.datas['status'] == 1 ? 'success' : 'warning',
      title: this.datas['status'] == 1 ? 'Success' : 'Failure',
      body: this.datas['msg'],
      timeout: 3000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
    if (this.datas['status'] == 1) {
      this.closeModal();
    }
  }


  createForm() {
    this.ChangePassForm = new FormGroup({
      Password: new FormControl('',[Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,32}$')]),
      CPassword: new FormControl('', Validators.required)

    });
  }
}

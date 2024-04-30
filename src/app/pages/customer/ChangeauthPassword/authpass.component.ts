import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustService } from '../../_service/indexService';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'ChangeauthPassword',
  templateUrl: './authpass.component.html',

})

export class AuthpassComponent implements OnInit {
  submit: boolean = false; changeauthPassForm; datas; id; modalHeader; config;item;

  constructor(
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private ser: CustService,
    private router: Router
  ) { this.id = JSON.parse(localStorage.getItem('details')) }

  closeModal() {
    this.activeModal.close();
    if(this.item.card_flag){
      this.router.navigate(['/pages/cust/list-card-user'])
    }else{
    this.router.navigate(['/pages/cust/viewcust'])
    }
  }
  ngOnInit() {
    this.createForm();

  }

  async changeAuthpass() {
    if (this.changeauthPassForm.invalid || this.changeauthPassForm.value['password'] != this.changeauthPassForm.value['CPassword']) {
      this.submit = true;
      return;
    }
    // console.log('qqqq')
    // this.changeauthPassForm.value['id'] = this.id;
    if(this.id){
      this.changeauthPassForm.value['id'] = this.id;
    }else{
      this.changeauthPassForm.value['id'] = this.item['id'];
    }
    const md5 = new Md5;
    this.changeauthPassForm.value['password_en'] = md5.appendStr(this.changeauthPassForm.value['password']).end();
    // this.changeauthPassForm.value['password_en']= this.changeauthPassForm.value['password'] ;
    // console.log("changeauthpassword",this.changeauthPassForm.value)

    let result = await this.ser.changeauthpwd(this.changeauthPassForm.value)
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
      this.closeModal();
      // this.router.navigate(['/pages/cust/viewcust'])
    }
  }

  createForm() {
    this.changeauthPassForm = new FormGroup({
      password: new FormControl('', Validators.required),
      CPassword: new FormControl('', Validators.required),

    });
  }
}
import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';
import { CustService } from '../../_service/indexService';


@Component({
  selector: 'ProfilePassword',
  templateUrl: './profilepass.component.html',

})

export class ProfilePasswordComponent implements OnInit {
  submit: boolean = false; PropassForm; datas; id; modalHeader;item;

  constructor(
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private ser: CustService,
    private router: Router
  ) { this.id = JSON.parse(localStorage.getItem('details')) }

  closeModal() {
    this.activeModal.close();
    if(this.id && !this.item['card_flag']){
      this.router.navigate(['/pages/cust/viewcust'])
    }else{
      if(this.item.card_flag){
        this.router.navigate(['/pages/cust/list-card-user'])
      }else{
        this.router.navigate(['/pages/cust/custList'])
      }
    }
  }
  ngOnInit() {
    this.createForm();

  }

  async Propasssubmit() {
    if (this.PropassForm.invalid || this.PropassForm.value['Password'] != this.PropassForm.value['CPassword']) {
      this.submit = true;
      return;
    }
     if(this.id){
      this.PropassForm.value['id'] = this.id;
    }else{
      this.PropassForm.value['id'] = this.item['id'];
    }
    const md5 = new Md5;
    this.PropassForm.value['password_en'] = md5.appendStr(this.PropassForm.value['Password']).end();
    let result = await this.ser.changeprofilepwd(this.PropassForm.value)
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
    // console.log("hii")
    if (result['status'] == 1) {
      this.closeModal();
      // this.router.navigate(['/pages/cust/viewcust'])
    }
  }


  createForm() {
    this.PropassForm = new FormGroup({
      Password: new FormControl('', [Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,32}$')]),
      CPassword: new FormControl('', Validators.required)

    });
  }
}
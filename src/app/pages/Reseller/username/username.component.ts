import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResellerService, RoleService } from '../../_service/indexService';
@Component({
  selector: 'username',
  templateUrl: './username.component.html',

})

export class UsernameComponent implements OnInit {
  submit: boolean = false; AddNasForm; datas; id; modalHeader; config;
  item;
  constructor(
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private ser: ResellerService,
    private router: Router,
    public role : RoleService,
  ) { this.id = JSON.parse(localStorage.getItem('details')) }

  closeModal() {
    this.activeModal.close();
  }
  ngOnInit() {
    this.createForm();

  }

  async addUsername() {
    if (this.AddNasForm.invalid) {
      this.submit = true;
      return;
    }
    if(this.role.getroleid()>=775){
      this.AddNasForm.value['id'] = this.item['resid'];
    }
    if(this.role.getroleid()<775){
      this.AddNasForm.value['id'] = this.role.getresellerid();
    }
    let result = await this.ser.changereselusername(this.AddNasForm.value)
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
      username: new FormControl(''),

    });
  }
}
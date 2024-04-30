import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustService } from '../../_service/indexService';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'showauthpassword',
  templateUrl: './showauthpass.component.html',

})

export class ShowAuthpassComponent implements OnInit {
  submit: boolean = false; AuthPassform; datas; id; modalHeader; config;
  item; data;isReadOnly=true;
  constructor(
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private ser: CustService,
    private router: Router
  ) { this.id = JSON.parse(localStorage.getItem('details')) }

  closeModal() {
    this.activeModal.close();
    this.router.navigate(['/pages/cust/viewcust'])
  }
  async ngOnInit() {
    this.createForm();
    await this.showpassword();
  }

  async showpassword() {
    if (this.item['password'] == 1) {
      let res = await this.ser.getuserpassword({ uid: this.item['id'], password: this.item['password'] })
      this.data = res;
    } else {
      let res = await this.ser.getuserpassword({ uid: this.item })
      this.data = res;
    }

    // console.log(res)
    this.createForm();
  }

  createForm() {
    this.AuthPassform = new FormGroup({
      Password: new FormControl(this.data ? this.data['value'] : '', Validators.required),

    });
  }
}
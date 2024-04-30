import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService,  RoleService } from '../../_service/indexService';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'viewqrcode',
  templateUrl: './viewqrcode.component.html',

})

export class ViewQrCodeComponent implements OnInit {
  submit: boolean = false; changeauthPassForm; datas; id; modalHeader; config;qrimage;item

  constructor(
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private ser: AccountService,
    public role: RoleService,
    private router: Router
  ) {}

  closeModal() {
    this.activeModal.close();
  }

  async ngOnInit() {
    await this.qrcode();
  }

  async qrcode() {
    let result = await this.ser.getQrcode({invid:this.item['invid']});
    // console.log("imageres",result);
    this.qrimage = result;
    if (this.qrimage) {
      for (const key in result) {
        if (Object.prototype.hasOwnProperty.call(result, key)) {
          const element = result[key];
          this.qrimage[key] = 'data:image/png;base64,' + element
          // console.log("image", this.pro_pic)

        }
      }
    }
  }
 
}
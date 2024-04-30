import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BusinessService, AdminuserService, GroupService } from '../../_service/indexService';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'add-ott',
  templateUrl: './add-ott.component.html',

})

export class AddOTTComponent implements OnInit {
  submit: boolean = false; AddOTTForm; datas; id; modalHeader; config;item;
  busname; grup;
  constructor(
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private adminser: AdminuserService,
    private busser: BusinessService,
    private groupser: GroupService,
    private router: Router
  ) { }

  closeModal() {
    this.activeModal.close();
    this.router.navigate(['/pages/administration/list-ott'])
  }

  async ngOnInit() {
    this.createForm();
  }

  async addOTT() {
    if (this.AddOTTForm.invalid) {
      this.submit = true;
      return;
    }
    let method = 'addOTTPlatforms';
    if(this.item){
      method = 'editOTTPlatforms';
      this.AddOTTForm.value['ott_id'] = this.item['ott_id'];
    }
    let result = await this.adminser[method](this.AddOTTForm.value)
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
    this.AddOTTForm = new FormGroup({
      ott_name: new FormControl(this.item ? this.item['ott_platform']:'', Validators.required),
    });
  }
}
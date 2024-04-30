import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';
import { CustService } from '../../_service/indexService';


@Component({
  selector: 'unassignevoice',
  templateUrl: './unassignevoice.component.html',

})

export class UnAssignedVoiceComponent implements OnInit {
  submit: boolean = false; UnassignForm; datas; id; modalHeader;item;

  constructor(
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private ser: CustService,
    private router: Router
  ) {  }

  closeModal() {
    this.activeModal.close();
    
  }

  ngOnInit() {
    this.createForm();

  }

  async Unassignsubmit() {
    if (this.UnassignForm.invalid) {
      this.submit = true;
      return;
    }
    this.UnassignForm.value['id'] = this.item.vid;
    this.UnassignForm.value['uid'] = this.item.uid;
    let unassigndata = [this.UnassignForm.value]
    let result = await this.ser.updateVoice({ voice:unassigndata })
    const toast: Toast = {
      type: result[0]['error_msg'] == 0 ? 'success' : 'warning',
      title: result[0]['error_msg'] == 0 ? 'Success' : 'Failure',
      body: result[0]['msg'],
      timeout: 3000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
    if (result[0]['error_msg'] == 0) {
      this.closeModal();
    }
  }


  createForm() {
    this.UnassignForm = new FormGroup({
      bus_id: new FormControl( this.item ? this.item.busname:''),
      voice_num : new FormControl(this.item ? this.item.vnumber:''),
      sub_id : new FormControl(this. item ? this.item.cust_profile_id:''),
      status : new FormControl(0)

    });
  }
}
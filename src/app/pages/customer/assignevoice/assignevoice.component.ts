import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';
import { CustService,ResellerService } from '../../_service/indexService';
import { FocusMonitor } from '@angular/cdk/a11y';


@Component({
  selector: 'assignevoice',
  templateUrl: './assignevoice.component.html',

})

export class AssigneVoiceComponent implements OnInit {
  submit: boolean = false; AssigneVoiceForm; datas; id; modalHeader;item;
  resell;custlogid
  constructor(
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private resser : ResellerService,
    private ser: CustService,
    private router: Router
  ) {  }

  closeModal() {
    this.activeModal.close();
    
  }

  async ngOnInit() {
    this.createForm();
    if(this.item){
      await this.showReseller();
    }
  }

  async showReseller($event = '') {
    this.resell = await this.resser.showResellerName({ voice_flag:1,bus_id: this.item.isp_id, except:1,like: $event });
    // console.log(this.resell);

  }

  async showUser($event = '') {
      this.custlogid = await this.ser.showUser({ resel_id:this.AssigneVoiceForm.value['reseller'],bus_id: this.item.isp_id, like: $event })
      // console.log("customer", this.custname)
  }

  async assigneSubmit() {
    if (this.AssigneVoiceForm.invalid) {
      this.submit = true;
      return;
    }
    this.AssigneVoiceForm.value['assign'] = 1;
    this.AssigneVoiceForm.value['id'] = this.item.vid;
    let assigndata = [this.AssigneVoiceForm.value];
    let result = await this.ser.updateVoice({ voice:assigndata })
    // console.log(result)
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
    this.AssigneVoiceForm = new FormGroup({
      bus_id : new FormControl(this.item ? this.item.busname:''),
      voice_num: new FormControl(this.item ? this.item.vnumber:''),
      reseller : new FormControl('',Validators.required),
      sub_id : new FormControl('',Validators.required),
    });
  }
}
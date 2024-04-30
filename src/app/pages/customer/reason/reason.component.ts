import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleService, CustService } from '../../_service/indexService';
import { TemperatureDraggerComponent } from '../../dashboard/temperature/temperature-dragger/temperature-dragger.component';

@Component({
  selector: 'reason',
  templateUrl: './reason.component.html',
})

export class ReasonComponent implements OnInit {
  modalHeader: string; item; busname; grup; resell; pro;
  SubsStatusForm; id
  submit: boolean;
  Make;
  constructor(
    public activeModal: NgbActiveModal,
    private alert: ToasterService,
    public role: RoleService,
    private custser: CustService,
  ) { }

  closeModal() {
    this.activeModal.close();
  }

  async ngOnInit() {
    this.createForm();
    // console.log(this.role.getroleid())
  };

  async subsupdate() {
    // console.log(this.SubsStatusForm.value)
    if (this.SubsStatusForm.invalid) {
      return;
    }
    if(this.item['flag']==1){
      this.SubsStatusForm.value['id'] = this.item['custid'];
      this.SubsStatusForm.value['holdstatus'] = true;
      let res = await this.custser.changeSubscriberStatus(this.SubsStatusForm.value);
      const toast: Toast = {
        type: res[0]['error_msg'] == 0 ? 'success' : 'warning',
        title: res[0]['error_msg'] == 0 ? 'Success' : 'Failure',
        body: res[0]['msg'],
        timeout: 3000,
        showCloseButton: true,
        bodyOutputType: BodyOutputType.TrustedHtml,
      };
      this.alert.popAsync(toast);
      if (res[0]['error_msg'] == 0) {
        // await this.view();
        await this.closeModal()
      }
    }
    if(this.item['flag']==2){
      this.SubsStatusForm.value['id'] = this.item['custid'];
      this.SubsStatusForm.value['holdstatus'] = false;
      let res = await this.custser.changeSubscriberStatus(this.SubsStatusForm.value);
      const toast: Toast = {
        type: res[0]['error_msg'] == 0 ? 'success' : 'warning',
        title: res[0]['error_msg'] == 0 ? 'Success' : 'Failure',
        body: res[0]['msg'],
        timeout: 3000,
        showCloseButton: true,
        bodyOutputType: BodyOutputType.TrustedHtml,
      };
      this.alert.popAsync(toast);
      if (res[0]['error_msg'] == 0) {
        // await this.view();
        await this.closeModal()

      }
    }
    if(this.item['flag']==3){
      this.SubsStatusForm.value['id'] = this.item['custid'];
      this.SubsStatusForm.value['suspendstatus'] = true;
      let res = await this.custser.changeSuspendStatus(this.SubsStatusForm.value);
      const toast: Toast = {
        type: res[0]['error_msg'] == 0 ? 'success' : 'warning',
        title: res[0]['error_msg'] == 0 ? 'Success' : 'Failure',
        body: res[0]['msg'],
        timeout: 3000,
        showCloseButton: true,
        bodyOutputType: BodyOutputType.TrustedHtml,
      };
      this.alert.popAsync(toast);
      if (res[0]['error_msg'] == 0) {
        // await this.view();
        await this.closeModal()

      }
    }
    if(this.item['flag']==4){
      this.SubsStatusForm.value['id'] = this.item['custid'];
      this.SubsStatusForm.value['suspendstatus'] = false;
      let res = await this.custser.changeSuspendStatus(this.SubsStatusForm.value);
      const toast: Toast = {
        type: res[0]['error_msg'] == 0 ? 'success' : 'warning',
        title: res[0]['error_msg'] == 0 ? 'Success' : 'Failure',
        body: res[0]['msg'],
        timeout: 3000,
        showCloseButton: true,
        bodyOutputType: BodyOutputType.TrustedHtml,
      };
      this.alert.popAsync(toast);
      if (res[0]['error_msg'] == 0) {
        // await this.view();
        await this.closeModal()

      }
    }
  };

  createForm() {
    this.SubsStatusForm = new FormGroup({
      reason: new FormControl('',Validators.required),

    });
  }
}

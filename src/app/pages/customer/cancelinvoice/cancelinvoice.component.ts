import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';
import { CustService, OperationService } from '../../_service/indexService';


@Component({
  selector: 'cancelinvoice',
  templateUrl: './cancelinvoice.component.html',

})

export class CancelInvoiceComponent implements OnInit {
  submit: boolean = false; CancelInvForm; datas; id; modalHeader;item;

  constructor(
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private ser: CustService,
    private opser : OperationService,
    private router: Router
  ) {  }

  closeModal() {
    this.activeModal.close();
    this.router.navigate(['/pages/cust/viewcust'])
  }
  ngOnInit() {
    this.createForm();
    // console.log("invid",this.item['invid']);
  }

  async invoicecancel() {
    if (this.CancelInvForm.invalid ) {
      this.submit = true;
      return;
    }
    if(this.item['flag']==1){
      this.CancelInvForm.value['invid'] = this.item['invid'];
      let canceldat =[this.CancelInvForm.value]
      let result = await this.opser.cancel_renewal({crenewal:canceldat})
      // window.alert(result[0]['msg'])
      const toast: Toast = {
        type: result[0]['error_msg'] == 0 ? 'success' : 'warning',
        // progressBar: true,
        // progressBarDirection: 'increasing',
        title: result[0]['error_msg'] == 0 ? 'Success' : 'Failure',
        body: result[0]['msg'],
        timeout: 3000,
        showCloseButton: true,
       
        // position-class:toast-top-full-width,
        bodyOutputType: BodyOutputType.TrustedHtml,
      };
      
      this.alert.popAsync(toast);
      if (result[0]['error_msg'] == 0) {
        this.closeModal();
      }
    }
    if(this.item['flag']==2){
    let result = await this.opser.cancelReceipt({ reason:this.CancelInvForm.value['reason'],id:this.item['invrecid'] })
    const toast: Toast = {
      type: result[0]['error_msg'] == 0 ? 'success' : 'warning',
      title: result[0]['error_msg'] == 0 ? 'Success' : 'Failure',
      body: result[0]['msg'],
      timeout: 3000,
      showCloseButton: true,
      // bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
    if (result[0]['error_msg'] == 0) {
      this.closeModal();
    }
    }
    
  }


  createForm() {
    this.CancelInvForm = new FormGroup({
      reason: new FormControl('', Validators.required),
    });
  }
}
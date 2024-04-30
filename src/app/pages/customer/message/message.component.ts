import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OperationService } from '../../_service/operationservice';
import { ngxLoadingAnimationTypes } from 'ngx-loading';


@Component({
  selector: 'ngx-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  submit: boolean = false; item; modalHeader;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;
	constructor(
		private alert: ToasterService,
 		private router: Router,
		public activeModal: NgbActiveModal,
    private opsrv: OperationService
	) { }

	closeModal() {
		this.activeModal.close(true);
		
	}

  async paymentStatus(){
    this.loading = true
    const result =  await this.opsrv.changePaymentStatus({invid:this.item.invid,uid:this.item.uid,inv_type:this.item.inv_type})
    this.loading = false
    console.log('response', result);
    this.toastalert(result[0].msg,result[0].error_msg)
    if(result[0].error_msg == 0){
      this.closeModal()
    }
    
  }

  toastalert(msg, status = 1) {
    const toast: Toast = {
      type: status == 0 ? 'success' : 'warning',
      title: status == 0 ? 'Success' : 'Failure',
      body: msg,
      timeout: 5000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
  }
	 
	ngOnInit() {

    console.log('item---',this.item);
    
	}
}

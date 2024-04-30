import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService, RoleService} from '../../_service/indexService';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { LocalDataFactory } from 'ng2-completer';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';

@Component({
	selector: 'paystatus',
	templateUrl: './paystatus.component.html'
})

export class PaystatusCheckComponent implements OnInit {
	submit: boolean = false; item;modalHeader;paydata;CompHistroyForm;
	orderid;status_descp;resp_code;trascn_num;msg;

	public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
	public primaryColour = '#dd0031';
	public secondaryColour = '#006ddd';
	public loading = false;
	constructor(
		private alert: ToasterService,
		private payser: PaymentService,
		private router: Router,
		public activeModal: NgbActiveModal,
		public role : RoleService
	) { }

	closeModal() {
		// console.log(this.addprice)
		this.activeModal.close(true);
		
	}

	async ngOnInit() {
		console.log('Pay Status Check---',this.item);
		if(this.item.error_msg==4 || this.item.error_msg==5 || this.item.error_msg==0){
			console.log('Item',this.item['error_msg'])
			this.status_descp = this.item.StatusDesc;
			this.orderid = this.item.OrderId;
			this.trascn_num = this.item.TrnRefNo;
			this.resp_code = this.item.ResponseCode ;
		}else{
			this.msg = this.item.msg;
		}
	}

	async paymentstatus(){
		
	}

	
}


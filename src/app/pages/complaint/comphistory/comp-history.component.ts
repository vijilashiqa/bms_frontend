import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ComplaintService, RoleService} from '../../_service/indexService';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { LocalDataFactory } from 'ng2-completer';


@Component({
	selector: 'comphistory',
	templateUrl: './comp-history.component.html'
})

export class CompliantHistoryComponent implements OnInit {
	submit: boolean = false; item;modalHeader;compdata;CompHistroyForm;
	constructor(
		private alert: ToasterService,
		private ser: ComplaintService,
		private router: Router,
		public activeModal: NgbActiveModal,
		public role : RoleService
	) { }

	closeModal() {
		// console.log(this.addprice)
		this.activeModal.close(true);
		
	}

	async ngOnInit() {
		await this.comphistory();
	}

	async comphistory(){
		let result = await this.ser.getComplaintHistory({comp_id : this.item.id});
		this.compdata = result;
		// console.log("histroy",this.compdata);
		if(this.compdata){
			this.createForm();
		}
		
	}

	async compupdate(){
		let datalength = this.compdata.length;
		if(datalength>1){
			this.CompHistroyForm.value['comp_id'] = this.compdata[datalength-1]['comp_id'];
			this.CompHistroyForm.value['comp_type'] = this.compdata[datalength-1]['comp_type_id'];
			this.CompHistroyForm.value['emp'] = this.compdata[datalength-1]['emp_id'];
		}else{
			this.CompHistroyForm.value['comp_id'] = this.compdata[0]['comp_id'];
			this.CompHistroyForm.value['comp_type'] = this.compdata[0]['comp_type_id'];
			this.CompHistroyForm.value['emp'] = this.compdata[0]['emp_id'];
		} 
		
		// console.log(this.CompHistroyForm.value)
		let comphistdata = [this.CompHistroyForm.value];
		let result = await this.ser.updateComplaintHistory({complainthistory:comphistdata});
		// console.log("updatehist",result);
		const toast: Toast = {
			type: result[0]['error_msg'] == 0 ? 'success' : 'warning',
			title: result[0]['error_msg'] == 0 ? 'success' : 'warning',
			body: result[0]['msg'],
			timeout: 3000,
			showCloseButton: true,
			bodyOutputType: BodyOutputType.TrustedHtml,
		};
		this.alert.popAsync(toast);
		if(result[0]['error_msg'] == 0 ){
			this.closeModal();
		}
	}

	createForm(){
		this.CompHistroyForm = new FormGroup({
			status : new FormControl(''),
			comment : new FormControl(''),

		})
	}
}


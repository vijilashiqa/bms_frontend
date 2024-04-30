import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
	selector: 'success',
	templateUrl: './add-success.component.html'
})

export class AddSuccessComponent implements OnInit {
	submit: boolean = false; item; modalHeader;
	constructor(
		private alert: ToasterService,
		private router: Router,
		public activeModal: NgbActiveModal,

	) { }

	closeModal() {
		this.activeModal.close(true);
		// console.log(this.item)
		if (this.item[0]['error_msg'] == 0 && this.item['sms'] == 1) {
			this.router.navigate(['/pages/administration/list-smsgateway']);
		}
		if (this.item[0]['error_msg'] == 0 && this.item['admin'] == 1) {
			this.router.navigate(['/pages/administration/list-adminuser']);
		}
		if (this.item[0]['error_msg'] == 0 && this.item['ott'] == 1) {
			this.router.navigate(['/pages/administration/list-ottauth']);
		}
		if(this.item[0]['error_msg'] == 0 && this.item['ott'] == 2){
			this.router.navigate(['/pages/administration/list-ottplan']);
		}
		 
	}

	ngOnInit() {

	}
}


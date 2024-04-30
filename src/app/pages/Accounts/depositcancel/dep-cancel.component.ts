import { Component, createPlatform, createPlatformFactory, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../../_service/indexService';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'depositcancel',
	templateUrl: './dep-cancel.component.html'
})

export class DepositCancelComponent implements OnInit {
	submit: boolean = false; item; modalHeader; DepositCancelForm;
	constructor(
		private alert: ToasterService,
		private ser: AccountService,
		private router: Router,
		public activeModal: NgbActiveModal,

	) { }

	closeModal() {
		this.activeModal.close(true);
		this.router.navigate(['/pages/Accounts/depositlist']);
	}

	async ngOnInit() {
		this.createForm();
	}

	async updatedep_cancel() {
		this.DepositCancelForm.value['id'] = this.item;
		this.DepositCancelForm.value['status'] = 1;

		let result = await this.ser.cancelDeposit(this.DepositCancelForm.value);
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
		this.DepositCancelForm = new FormGroup({
			cancel_reason: new FormControl('', Validators.required),
		})

	}

}
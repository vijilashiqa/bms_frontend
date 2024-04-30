import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { S_Service } from '../../_service/indexService';

@Component({
	selector: 'toprescount',
	templateUrl: './resel-count.component.html'
})

export class TopupReselcountComponent implements OnInit {
	submit: boolean = false; item; modalHeader;
	constructor(
		private alert: ToasterService,
		private ser: S_Service,
		private router: Router,
		public activeModal: NgbActiveModal,

	) { }

	closeModal() {
		this.activeModal.close(true);
	}

	ngOnInit() {
	}
}


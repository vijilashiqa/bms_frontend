import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustService } from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Component({
	selector: 'success',
	templateUrl: './add-success.component.html'
})

export class AddSuccessComponent implements OnInit {
	submit: boolean = false; item; modalHeader; add_res; edit_res; voice_res; limit_flag;
	add_card_res;
	constructor(
		private alert: ToasterService,
		private ser: CustService,
		private router: Router,
		public activeModal: NgbActiveModal,

	) { }

	closeModal() {
		this.activeModal.close(true);
		if (this.item[0]['error_msg'] == 0) {
			if (this.add_res == true) {
				this.router.navigate(['/pages/cust/custList']);
			}
			if (this.edit_res == true) {
				this.router.navigate(['/pages/cust/custList']);
			}
			if (this.edit_res == false) {
				this.router.navigate(['/pages/cust/viewcust']);
			}
			if (this.add_card_res == true) {
				this.router.navigate(['/pages/cust/list-card-user']);
			}
		}
	}
	download() {
		if (this.item) {
			let tempdata = [], temp: any = this.item;
			for (var i = 0; i < temp.length; i++) {
				let param = {};
				param['Message'] = temp[i]['msg'];
				param['Error Code'] = temp[i]['error_msg'];
				tempdata[i] = param
			}
			const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
			const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
			JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
			JSXLSX.writeFile(wb, 'Response Message' + EXCEL_EXTENSION);
		}
	}

	ngOnInit() {


	}
}


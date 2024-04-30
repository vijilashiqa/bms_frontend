import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { S_Service,NasService } from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
	selector: 'nascount',
	templateUrl: './nas-count.component.html',
	styleUrls: ['./nas-count.component.scss']
})

export class NascountComponent implements OnInit {
	submit: boolean = false; item; modalHeader; nascount;
	constructor(
		private alert: ToasterService,
		private ser: S_Service,
		private nasser : NasService,
		private router: Router,
		public activeModal: NgbActiveModal,

	) { }

	closeModal() {
		// console.log(this.addprice)
		this.activeModal.close(true);
		
	}

	ngOnInit() {
		// console.log(this.item)
		this.nascount = this.item['data']
	}

	async download() {
		let res = await this.nasser.showCountNas({ srvid: this.item['srvid'] });
		if (res) {
			let tempdata = [], temp: any = res;
			for (var i = 0; i < temp.length; i++) {
			  let param = {};
			  param['NAS NAME'] = temp[i]['shortname']; 
			  param['NAS IP'] = temp[i]['nasname'];
			  tempdata[i] = param;
			}
			const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
			const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
			JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
			JSXLSX.writeFile(wb, 'Nas Count' + EXCEL_EXTENSION);
		  }
	}
}


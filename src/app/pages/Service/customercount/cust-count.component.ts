import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { S_Service,CustService } from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
	selector: 'customercount',
	templateUrl: './cust-count.component.html',
	styleUrls: ['./cust-count.component.scss']
})

export class CustomercountComponent implements OnInit {
	submit: boolean = false; item; modalHeader;subcount;custcount;
	constructor(
		private alert: ToasterService,
		private ser: S_Service,
		private router: Router,
		private custser : CustService,
		public activeModal: NgbActiveModal,

	) { }

	closeModal() {
		// console.log(this.addprice)
		this.activeModal.close(true);
		
	}

	ngOnInit() {
		this.custcount = this.item['data']
	}

	async download(){
		let res = await this.custser.showSelectUser({ srvid: this.item['srvid'] });
		if (res) {
			let tempdata = [], temp: any = res;
			for (var i = 0; i < temp.length; i++) {
			  let param = {};
			  param['SERVICE NAME'] = temp[i]['srvname']; 
			  param['RESELLER NAME'] = temp[i]['company'];
			  param['FIRST NAME'] = temp[i]['firstname'];
			  param['LAST NAME'] = temp[i]['lastname'];
			  param['LOGIN ID'] = temp[i]['cust_profile_id'];
			  tempdata[i] = param;
			}
			const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
			const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
			JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
			JSXLSX.writeFile(wb, 'Subscriber Count' + EXCEL_EXTENSION);
		  }
	}
}


import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { S_Service,ResellerService } from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
	selector: 'resellercount',
	templateUrl: './resell-count.component.html',
	styleUrls:['./resell-count.component.scss'],
})

export class ResellercountComponent implements OnInit {
	submit: boolean = false; item;modalHeader;rescount;
	constructor(
		private alert: ToasterService,
		private ser: S_Service,
		private router: Router,
		private resser : ResellerService,
		public activeModal: NgbActiveModal,

	) { }

	closeModal() {
		// console.log(this.addprice)
		this.activeModal.close(true);
		
	}

	ngOnInit() {
		// console.log(this.item)
		this.rescount = this.item['data']
	}

	async download(){
		let res = await this.resser.showCountResel({ srvid: this.item['srvid'] });
		if (res) {
			let tempdata = [], temp: any = res;
			for (var i = 0; i < temp.length; i++) {
			  let param = {};
			  param['SERVICE NAME'] = temp[i]['srvname']; 
			  param['RESELLER TYPE'] = temp[i]['role'] == 444 ? 'Bulk Resellre' : temp[i]['role'] == 333 ? 'Deposit Reseller' : temp[i]['role'] == 666 ? 'Sub ISP Bulk' :
			  temp[i]['role'] == 555 ? 'Sub ISP Deposit' : temp[i]['role'] == 551 ? 'Sub Distributor Deposit' : temp[i]['role'] == 661 ? 'Sun Distributor Bulk' : 'Hotel';
			  param['RESELLER NAME'] = temp[i]['company'];
			  param['SHARING TYPE'] = temp[i]['sharing_type'] == 1 ? 'Common Sharing': 'Packagewise Sharing';
			  tempdata[i] = param;
			}
			const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
			const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
			JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
			JSXLSX.writeFile(wb, 'Reseller Count' + EXCEL_EXTENSION);
		  }
	}
}


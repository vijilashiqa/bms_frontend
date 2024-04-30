import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as JSXLSX from 'xlsx';
import { GroupService, RoleService, BusinessService, SelectService, NasService, AccountService } from '../../_service/indexService';
import { ThemeModule } from '../../../@theme/theme.module';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
	selector: 'inv-acknowledge',
	templateUrl: './inv-acknowledge.component.html'
})

export class InvoiceAcknowlodgeComponent implements OnInit {
	submit: boolean = false; InvAckForm; item; data; grup; busname; bulkdata = [];
	bulk = []; arrayBuffer: any; failure: any[]; s = 0; f = 0; file: any[]; bulkNas = []; id; modalHeader;
	constructor(
		private activeModal: NgbActiveModal,
		private alert: ToasterService,
		private ser: AccountService,
		private select: SelectService,
		private busser: BusinessService,
		private groupser: GroupService,
		public role: RoleService,
	) { }

	async ngOnInit() {
		await this.business();
		this.createForm();
		if (this.role.getroleid() <= 777) {
			this.InvAckForm.controls['bus_id'].setValue(this.role.getispid())
			// await this.GroupName();

		}
	}

	async business() {
		this.busname = await this.busser.showBusName({});
		// this.select.showBusName({}).subscribe(result => {
		// console.log(this.busname)
	}

	async addACK() {
		this.submit = true
		this.filereader(this.file, async res => {
			// console.log(res);
			this.bulk = res;
			let bulkvald: boolean = false;
			for (var i = 0; i < this.bulk.length; i++) {
				if (!this.bulk[i].hasOwnProperty('Ack No')) {
					this.toastalert('Please fill the Ack No in Excel Sheet');
					bulkvald = true;
					break;
				}
				else {
					let ackno = this.bulk[i]['Ack No']
					// console.log(ackno)
					this.bulk[i].ack_no = ackno;
				}
				if (!this.bulk[i].hasOwnProperty('Ack Date')) {
					this.toastalert('Please Fill the Ack Date in Excell Sheet')
				}
				else {
					let ackdate = this.bulk[i]['Ack Date']
					let date = new Date((ackdate - (25567 + 2)) * 86400 * 1000); // Date Format in YYYY-MM-DD
					this.bulk[i].ack_date = date;
				}
				if (!this.bulk[i].hasOwnProperty('Doc No')) {
					this.toastalert('Please Fill the Doc No in Excell Sheet')
				}
				else {
					let docno = this.bulk[i]['Doc No']
					this.bulk[i].doc_no = docno;
				}
				if (!this.bulk[i].hasOwnProperty('Status')) {
					this.toastalert('Please Fill the Status in Excell Sheet')
				}
				else {
					let status = this.bulk[i]['Status']
					this.bulk[i].status = status;
				}
				if (!this.bulk[i].hasOwnProperty('IRN')) {
					this.toastalert('Please Fill the IRN in Excell Sheet')
				}
				else {
					let irn = this.bulk[i]['IRN']
					this.bulk[i].irn_no = irn;
				}
				if (!this.bulk[i].hasOwnProperty('SignedQrCOde')) {
					this.toastalert('Please Fill the SignedQrCOde in Excell Sheet')
				}
				else {
					let signqrcode = this.bulk[i]['SignedQrCOde']
					this.bulk[i].signqr_code = signqrcode;
				}

				this.bulk[i].bus_id = this.InvAckForm.value['bus_id']

			}
			this.s = 0; this.f = 0;
			let s = 0;
			this.failure = [];
			// console.log(this.InvAckForm.value)
			if (this.InvAckForm.invalid) {
				this.submit = true;
				return;
			}
			console.log(this.bulk)
			let result = await this.ser.eInvoicing({ acknowledge: this.bulk });
			console.log(result)
			const toast: Toast = {
				type: result[0]['error_msg'] == 0 ? 'success' : 'warning',
				title: result[0]['error_msg'] == 0 ? 'success' : 'warning',
				body: result[0]['msg'],
				timeout: 3000,
				showCloseButton: true,
				bodyOutputType: BodyOutputType.TrustedHtml,
			};
			this.alert.popAsync(toast);
			if (result[0]['error_msg'] == 0)
				this.closeModal();
		})
	}

	changeListener(file) {
		this.file = file;
		this.filereader(this.file, result => {
			this.bulk = result;
		});
	}

	filereader(file, callback) {
		if (file) {
			let fileReader = new FileReader(), filedata;
			fileReader.onload = (e) => {
				this.arrayBuffer = fileReader.result;
				var data = new Uint8Array(this.arrayBuffer);
				var arr = new Array();
				for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
				var bstr = arr.join("");
				var workbook = JSXLSX.read(bstr, { type: "binary" });
				var first_sheet_name = workbook.SheetNames[0];
				var worksheet = workbook.Sheets[first_sheet_name];
				// console.log(JSXLSX.utils.sheet_to_json(worksheet,{raw:true}));
				callback(JSXLSX.utils.sheet_to_json(worksheet, { raw: true }))
			}
			fileReader.readAsArrayBuffer(file);
		} else {
			callback([])
		}
	}

	toastalert(msg, status = 0) {
		const toast: Toast = {
			type: status == 1 ? 'success' : 'warning',
			title: status == 1 ? 'Success' : 'Failure',
			body: msg,
			timeout: 5000,
			showCloseButton: true,
			bodyOutputType: BodyOutputType.TrustedHtml,
		};
		this.alert.popAsync(toast);
	}


	closeModal() {
		this.activeModal.close();
	}

	createForm() {
		this.InvAckForm = new FormGroup({
			bus_id: new FormControl('', Validators.required),

		});
	}
}
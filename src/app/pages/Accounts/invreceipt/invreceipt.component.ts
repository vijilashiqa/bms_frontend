import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService, RoleService, S_Service, OperationService } from '../../_service/indexService';
import { ViewReceiptComponent } from '../viewreceipt/viewreceipt.component';
import { NgbModal,NgbModule} from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'invreceipt',
	templateUrl: './invreceipt.component.html',
	styleUrls: ['./invreceipt.component.scss']
})

export class InvoiceReceiptComponent implements OnInit {
	submit: boolean = false; item; modalHeader; data; receiptdata; receiptlist;bus_address;
	constructor(
		private alert: ToasterService,
		private ser: S_Service,
		private router: Router,
		private acntser: AccountService,
		public role: RoleService,
		public activeModal: NgbActiveModal,
		public nasmodel: NgbModal,
		private opser: OperationService,

	) { }

	closeModal() {
		// console.log(this.addprice)
		this.activeModal.close(true);

	}

	async ngOnInit() {
		// console.log(this.item)
		if (this.data) {
			await this.invreceipt();
		}
	}

	async invreceipt() {
		let result = await this.acntser.listInvReceipt({ invid: this.data['invdata'] });
		this.receiptlist = result[0];
		// console.log("invreceipts",result);

	}
	async view_receipt(invrecid) {
		let result = await this.acntser.listInvReceipt({ invrecid: invrecid })
		if (result) {
			this.receiptdata = result[0][0];
			this.bus_address = this.receiptdata['bus_address'].replace(/<br>/g, '');
			// this.rcptvalue = this.receiptdata ? result[1][0]['receipt_num'] : '';
			// console.log("res", result)
			// console.log('pay', this.data['pay_status'])
			// console.log('name', this.data['user_name'])
		}
	}

	print(): void {
		let printContents, popupWin;
		printContents = document.getElementById('main_cont').innerHTML;
		popupWin = window.open();
		popupWin.document.open();
		popupWin.document.write(`
        <html>
          <head>
            <title>Receipt</title>
            
            <style>
          
            </style>
          </head>
      <body onload="window.print();window.close()">${printContents}</body>
        </html>`
		);
		popupWin.document.close();
	}


	//    view_receipt(recid){
	//       this.closeModal();
	//       const activeModal = this.nasmodel.open(ViewReceiptComponent, { size: 'lg', container: 'nb-layout' });
	//       activeModal.componentInstance.modalHeader = 'View Receipt';
	//       activeModal.componentInstance.data = {recid:recid};
	//       activeModal.result.then((data) => {

	//       })
	//    }

}
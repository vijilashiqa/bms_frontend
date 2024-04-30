import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService, RoleService, S_Service } from '../../_service/indexService';

@Component({
	selector: 'transaction',
	templateUrl: './transaction.component.html',
	styleUrls:['./transaction.component.scss']
})

export class InvTransactionComponent implements OnInit {
	submit: boolean = false; item;modalHeader;data;transdata;
	constructor(
		private alert: ToasterService,
		private ser: AccountService,
		private router: Router,
		public activeModal: NgbActiveModal,
		public role : RoleService

	) { }

	closeModal() {
		// console.log(this.addprice)
		this.activeModal.close(true);
		
	}

	async transacn(){
		let res = await this.ser.listInvoiceBalancelog({invid:this.data['invdata']});
      this.transdata = res[0];
      // console.log("transaction",res);
      
	}

	async ngOnInit() {
		// console.log(this.item)
      if(this.data){
         await this.transacn()
      }
	}
}


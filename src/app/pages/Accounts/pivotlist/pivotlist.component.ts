// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { PaymentReceived } from '../PaymentReceived/payment_received.component'
// import { CancelPayment } from '../CancelPayment/cancel_payment.component'
// import { ViewDeposit } from '../ViewDeposit/view_deposit.component'
// import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { acctService } from '../../_service/indexService';
// import { FailedDepositComponent } from '../FailedDeposit/faileddeposit.component';
// import { formatDate } from '@angular/common';
// import * as FileSaver from 'file-saver';
// import * as JSXLSX from 'xlsx';
// import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';

// const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
// const EXCEL_EXTENSION = '.xlsx';
// @Component({
//   selector: 'pivotlist',
//   templateUrl: './pivotlist.component.html',
// })
// export class pivotlistComponent implements OnInit {
//   data; now: any = new Date();
//   pager: any = {}; tot: any = [];
//   pagedItems: any = [];
//   page: number = 1; head: any = [];
//   search: boolean; opt: any = [];
//   head_opt = ''; status = '';
//   limit: number = 25; value: any = '';
//   headend: any = ''; sum: number;
//   operator_name = '';
//   from_date; to_date
//   op_type = '';

//   constructor(
//     private nasmodel: NgbModal,
//     private router: Router,
//     private acct: acctService,

//     private alert: ToasterService,



//   ) { this.now = formatDate(this.now.getTime(), 'dd-MM-yyyy', 'en-US', '+0530'); }

//   ngOnInit() {
  
//   }
//   }

import { Component,OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RoleService } from '../../_service/indexService';


@Component({
 selector: 'pivotlist',
  templateUrl: './pivotlist.component.html',
  // styleUrls:['./custstyle.scss'],
})

export class pivotlistComponent implements OnInit{
  submit:boolean=false;paymentForm;addNas;headend;from_date;to_date;page;
  search;modalHeader;op_type='';status='';tot
	constructor(
	 	private alert: ToasterService,
    private router: Router,
    public role : RoleService
	) {}
  ngOnInit(){
	  // this.createForm();
  }
  //  createForm() {
  //   this.paymentForm = new FormGroup({
   
  //   });
  // }
}
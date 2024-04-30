// import { Component, OnInit } from '@angular/core';
// import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
// import 'style-loader!angular2-toaster/toaster.css';
// import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { acctService } from'../../_service/indexService';

// @Component({
//   selector: 'PaymentReceived',
//   templateUrl: './payment_received.component.html',
// })

// export class PaymentReceived implements OnInit {
//   modalHeader: string;
//   paymentForm; item;
//   submit: boolean;
//   imageURL: any; selectedfile: File = null;
//   constructor(
//     public activeModal: NgbActiveModal,
//     private alert: ToasterService,
//     private acct: acctService,
//   ) {
//     this.item
//     // console.log(this.item)
//   }
//   ngOnInit() {
//     this.createForm();
//     this.item;
//   };



//   createForm() {
//     this.paymentForm = new FormGroup({
//       deposited_amt: new FormControl({ value: this.item['amt'], disabled: true }),
//       received_amt: new FormControl('', [Validators.required, Validators.pattern('(?:0[1-9][0-9]*|[1-9]{1}[0-9]*?)*')]),
//       previous_received: new FormControl({ value: this.item['payamt'], disabled: true }),
//       pay_type: new FormControl('', Validators.required),
//       reason: new FormControl(''),
//       utr: new FormControl(''),
//       upload: new FormControl('')
//     });
//   }

// }

import { Component,OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
 selector: 'PaymentReceived',
 templateUrl: './payment_received.component.html',
  // styleUrls:['./custstyle.scss'],
})

export class PaymentReceivedComponent implements OnInit{
	submit:boolean=false;paymentForm;modalHeader;
	constructor(
	 	private alert: ToasterService,
    private router: Router,
    public activeModal   :NgbActiveModal,

  ) {}
  
  closeModal(){
    // console.log(this.item)
    this.activeModal.close(true);
    // this.router.navigate(['/pages/Accounts/depositlist']);
  }
  ngOnInit(){
	  this.createForm();
  }
  addNas(){

  }
   createForm() {
    this.paymentForm = new FormGroup({
   
    });
  }
}
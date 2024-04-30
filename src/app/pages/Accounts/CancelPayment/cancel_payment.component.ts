// import { Component, OnInit } from '@angular/core';
// import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
// import 'style-loader!angular2-toaster/toaster.css';
// import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { acctService } from '../../_service/indexService';
// @Component({
//   selector: 'CancelPayment',
//   templateUrl: './cancel_payment.component.html',
// })

// export class CancelPayment implements OnInit {
//   modalHeader: string;
//   paymentForm; id; status;
//   submit: boolean;

//   constructor(
//     public activeModal: NgbActiveModal,
//     private alert: ToasterService,
//     private acct: acctService
//   ) { }

//   ngOnInit() {
//     this.createForm();
//   };



//   createForm() {
//     this.paymentForm = new FormGroup({
//       reason: new FormControl('11', Validators.required),
//       other_reason: new FormControl(''),
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'CancelPayment',
  templateUrl: './cancel_payment.component.html',
  // styleUrls:['./custstyle.scss'],
})

export class CancelPaymentComponent implements OnInit {
  submit: boolean = false; paymentForm; modalHeader;
  constructor(
    private alert: ToasterService,
    private router: Router,
    public activeModal: NgbActiveModal,

  ) { }

  closeModal() {
    this.activeModal.close(true);
    // this.router.navigate(['/pages/Accounts/depositlist']);
  }
  ngOnInit() {
    this.createForm();
  }
  addNas() {

  }
  createForm() {
    this.paymentForm = new FormGroup({

    });
  }
}
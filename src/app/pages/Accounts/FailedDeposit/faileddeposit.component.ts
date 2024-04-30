// import { Component, OnInit } from '@angular/core';
// import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
// import 'style-loader!angular2-toaster/toaster.css';
// import { FormControl, FormGroup, Validators, FormArray, FormBuilder, } from '@angular/forms';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { acctService } from '../../_service/indexService';

// @Component({
//   selector: 'FailedDeposit',
//   templateUrl: './faileddeposit.component.html',
// })

// export class FailedDepositComponent implements OnInit {
//   modalHeader: string;
//   Failedform; item: any = [];
//   submit: boolean; editpytm;
//   constructor(
//     public activeModal: NgbActiveModal,
//     private alert: ToasterService,
//     private acct: acctService,

//   ) { }

//   ngOnInit() {
//     this.createForm();
//   };




//   createForm() {
//     this.Failedform = new FormGroup({
//       amount: new FormControl(this.item.depamt, Validators.required),
//       order_id: new FormControl(this.item.order_id, Validators.required),
//       utr: new FormControl('', Validators.required),
//       desc: new FormControl('', Validators.required),
//       paymode: new FormControl('', Validators.required),
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
  selector: 'FailedDeposit',
  templateUrl: './faileddeposit.component.html',
  // styleUrls:['./custstyle.scss'],
})

export class FailedDepositComponent implements OnInit {
  submit: boolean = false; Failedform; modalHeader;
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
    this.Failedform = new FormGroup({

    });
  }
}
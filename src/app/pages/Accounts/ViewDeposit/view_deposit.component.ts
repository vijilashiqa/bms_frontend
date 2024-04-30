// import { Component, OnInit } from '@angular/core';
// import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
// import 'style-loader!angular2-toaster/toaster.css';
// import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// @Component({
//   selector: 'ViewDeposit',
//   templateUrl: './view_deposit.component.html',
// })

// export class ViewDeposit implements OnInit {
//   modalHeader: string;
//   paymentForm;
//   submit: boolean;
//   constructor(
//     public activeModal: NgbActiveModal,
//     private alert: ToasterService,
//   ) { }
//   ngOnInit() {

//   };
// }

import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'ViewDeposit',
  templateUrl: './view_deposit.component.html',
  // styleUrls:['./custstyle.scss'],
})

export class ViewDepositComponent implements OnInit {
  submit: boolean = false; Failedform; addNas;modalHeader;
  constructor(
    private alert: ToasterService,
    private router: Router,
    public activeModal: NgbActiveModal,

  ) { }

  closeModal() {
    // console.log(this.item)
    this.activeModal.close(true);
    // this.router.navigate(['/pages/Accounts/depositlist']);
  }
  ngOnInit() {

  }
  //  createForm() {
  //   this.Failedform = new FormGroup({

  //   });
  // }
}
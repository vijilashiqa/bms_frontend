import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { S_Service } from '../../_service/indexService';

@Component({
   selector: 'success',
   templateUrl: './add-success.component.html'
})

export class AddSuccessComponent implements OnInit {
   submit: boolean = false; item; addprice; addpackage; editpackage; editprice; servicemap;
   modalHeader;
   constructor(
      private alert: ToasterService,
      private ser: S_Service,
      private router: Router,
      public activeModal: NgbActiveModal,

   ) { }

   closeModal() {
      this.activeModal.close(true);
      if (this.item[0]['error_msg'] == 0) {
         if (this.addpackage == true) {
            this.router.navigate(['/pages/service/service-list']);
         }
         if (this.editpackage == true) {
            this.router.navigate(['/pages/service/service-list']);
         }
         if (this.addprice == true) {
            this.router.navigate(['/pages/service/list-price'])
         }
         if (this.editprice == true) {
            this.router.navigate(['/pages/service/list-price'])
         }
         if (this.servicemap == true) {
            this.router.navigate(['/pages/service/servicemap'])
         }
      }

   }

   ngOnInit() {

   }
}


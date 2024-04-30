import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import { Router } from '@angular/router';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder, } from '@angular/forms';
import { AccountService } from '../../_service/indexService';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import jsPDF from 'jspdf';

@Component({
   selector: 'viewackinvoice',
   templateUrl: './viewackinvoice.component.html',
   styleUrls: ['./viewackinvoice.component.scss']
})

export class ViewAckInvoiceComponent implements OnInit {
   modalHeader: string; invdata; views; item; qrimage;
   submit: boolean; cuser: any = []; data; receiptdata; rcptvalue; paystatus; username; invperiod;
   busAddress;
   constructor(
      private router: Router,
      private ser: AccountService,
      public activeModal: NgbActiveModal,

   ) { }

   async ngOnInit() {
      if (this.item) {
         await this.view();
         await this.qrcode();
      }
   }

   closeModal() {
      this.activeModal.close();
   }

   print(): void {
      let printContents, popupWin;
      printContents = document.getElementById('main_cont').innerHTML;
      popupWin = window.open();
      popupWin.document.open();
      popupWin.document.write(`
      <html>
        <head>
          <title>Tax Invoice</title>
          <style>
          @media print {
            @page { margin: 0; }
            body { margin: 1cm; }
          }
          </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`
      );
      popupWin.document.close();
   }

   async view() {
      let result = await this.ser.viewEInvoicing({ invid: this.item['invid'] })
      console.log(result);
      if (result) {
         this.data = result[0];
         // this.invperiod = result[1];
         let totamnt = Number(this.data['inv_amt']) + Number(this.data['inv_tax']);
         this.data['totamount'] = totamnt;
         this.busAddress = this.data['bus_address'].replace(/<br>/g, '')
         // console.log('pay', this.data['pay_status'])
         // console.log('name', this.data['user_name'])
         // console.log("res", result)
      }
   }

   async qrcode() {
      let result = await this.ser.getQrcode({ invid: this.item['invid'] });
      // console.log("imageres", result);
      this.qrimage = result;
      if (this.qrimage) {
         for (const key in result) {
            if (Object.prototype.hasOwnProperty.call(result, key)) {
               const element = result[key];
               this.qrimage[key] = 'data:image/png;base64,' + element
               // console.log("image", this.pro_pic)

            }
         }
      }
   }
}
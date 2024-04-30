import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import { Router } from '@angular/router';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder, } from '@angular/forms';
import { AccountService } from '../../_service/indexService';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import jsPDF from 'jspdf';
@Component({
  selector: 'viewreceipt',
  templateUrl: './viewreceipt.component.html',
  styleUrls: ['./viewreceipt.component.css']
})

export class ViewReceiptComponent implements OnInit {
  modalHeader: string;
  submit: boolean; cuser: any = []; invdata; data; receiptdata; rcptvalue; paystatus; username;
  balanceamt; totinvamnt; item; receiptlist;bus_address;
  constructor(
    private router: Router,
    private ser: AccountService,
    public activeModal: NgbActiveModal,

  ) { }

  async ngOnInit() {
    // console.log(this.data);
    // await this.invreceipt();
    await this.view();
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
          <title>Receipt</title>
          
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

  // balancecal() {
  //   if (this.receiptdata.received_amt < this.receiptdata.total_amount) {
  //     let balance = Number(this.receiptdata.total_amount) - Number(this.receiptdata.received_amt);
  //     this.balanceamt = balance.toFixed(3)
  //   } else {
  //     this.balanceamt = 0;
  //   }

  // }

  // async invreceipt() {
  //   let result = await this.ser.listInvReceipt({ invid: this.data['invdata'] });
  //   this.receiptlist = result[0];
  //   // console.log("invreceipts",result);

  // }

  async view() {
    if (this.data) {
      let result = await this.ser.listInvReceipt({ invrecid: this.data['recid'] })
      if (result) {
        this.receiptdata = result[0][0];
        this.bus_address = this.receiptdata['bus_address'].replace(/<br>/g, '');
      }
    }
    if (this.item) {
      console.log('Item',this.item)
      let result = await this.ser.listInvReceipt({ invrecid: this.item })
      if (result) {
        this.receiptdata = result[0][0];
        this.bus_address = this.receiptdata['bus_address'].replace(/<br>/g, '');
        
      }
    }
    // this.balancecal();
  }

}
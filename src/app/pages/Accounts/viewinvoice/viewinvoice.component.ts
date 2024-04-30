import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import { Router } from '@angular/router';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder, } from '@angular/forms';
import { AccountService, ResellerService } from '../../_service/indexService';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import pdfmake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfmake.vfs = pdfFonts.pdfMake.vfs;
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// import htmltoPdfmake  from 'html-to-pdfmake'
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'viewinvoice',
  templateUrl: './viewinvoice.component.html',
  styleUrls: ['./viewinvoice.component.css']
})

export class ViewInvoiceComponent implements OnInit {
  modalHeader: string; invdata; views; bus_address;
  submit: boolean; cuser: any = []; data; receiptdata; rcptvalue; paystatus; username; invperiod;
  show_inv = 1; logo;

  @ViewChild('pdfTable') pdfTable: ElementRef;
  @ViewChild('content') content: ElementRef;

  public downloadAsPDF() {
    console.log('Download PDF')
    // const pdfTable = document.getElementById('pdfTable');
    // html2canvas(pdfTable).then((canvas) => {
    //   console.log('CANVAS', canvas)
    //   var imgData = canvas.toDataURL('image/png')
    //   var doc = new jsPDF();
    //   var imgHeight = canvas.height * 200 / canvas.width

    //   doc.addImage(imgData, 5, 15, 200, imgHeight)
    //   doc.save("image1.pdf")
    // });

    const pdfTable = document.getElementById('pdfTable');
    // html2canvas(pdfTable).then((canvas) => {

    //     var imgData = canvas.toDataURL('image/png')
    //     // var doc = new jsPDF();
    //     // var imgHeight = canvas.height * 200 / canvas.width
    //     var pdf = new jsPDF("p", "mm", "a4");
    //     var imgData = canvas.toDataURL('image/png', 1.0);
    //     // due to lack of documentation; try setting w/h based on unit
    //     pdf.addImage(imgData,17, 15, 170, 270);   // 180x150 mm @ (10,10)mm
    //     // doc.addImage(imgData, 0, 0, 200, imgHeight)
    //     pdf.save("Invoice.pdf")
    // });
    let nowdate = + new Date();
    let media = window.matchMedia('(max-width:600px)');

    console.log('Media', media.matches)
    if (media.matches && this.show_inv == 2) {
      let opt = {
        margin: [-0.05, 0.5, 0, 0.5],
        html2canvas: {
          scale: 2,
          // dpi: 192,
          letterRendering: true
        },
        filename: `${nowdate.toString().slice(0, 10)}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        // html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        // pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };

      // New Promise-based usage:
      html2pdf().set(opt).from(pdfTable).save();
      // html2pdf().from(pdfTable).set(opt).toPdf().get('pdf').then(function (pdf) {
      //   $("p").css("font-size", "26px");
      //   }).save();

    } else {
      let opt = {
        margin: [0.25, 0.25, 0.25, 0.25],
        filename: `${nowdate.toString().slice(0, 10)}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },

        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      // New Promise-based usage:
      html2pdf().set(opt).from(pdfTable).save();

      // Old monolithic-style usage:
      // html2pdf(pdfTable, opt);
    }

  }

  constructor(
    private router: Router,
    private ser: AccountService,
    public activeModal: NgbActiveModal,
    private reser: ResellerService
  ) { }

  async ngOnInit() {
    // console.log(this.invdata)
    if (this.invdata) {
      await this.view();
    }
  }

  closeModal() {
    this.activeModal.close();
  }
  // generatePdf() {
  //   var dd = {
  //     content:
  //       document.getElementById('main_cont').innerHTML
  //   }

  //   const documentDefinition = { content: 'This is an sample PDF printed with pdfMake' };
  //   pdfmake.createPdf(dd).download();
  // }
  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('main_cont').innerHTML;
    popupWin = window.open();
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Tax Invoice</title>
          <link rel="stylesheet" type="text/css" href="viewinvoice.component.css" />
          <style>
          @media print {
            @page { margin: 0; }
            body { margin: 1cm; }
 
            
           #hidedesktop {
            display: none !important;
        }
      }
          }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  async view() {
     if (this.views == 2 || this.views == 4) {      // GST
      let result = await this.ser.showGSTInvoiceReceipt({ invid: this.invdata, ref_flag: 1 })
      // console.log("gstinv",result);
      if (result) {
        this.data = result[0][0];
        this.receiptdata = result[1];
        this.paystatus = this.data['pay_status'];
        this.bus_address = this.data['bus_address'].replace(/<br>/g, '');
        // console.log('Bus address', this.bus_address)
      }
    }
    if (this.views == 1 || this.views == 3) {   // Non-GST
      let result = await this.ser.showInvoiceReceipt({ invid: this.invdata, ref_flag: 1 })
      // console.log("invres",result);
      if (result) {
        this.data = result[0][0];
        // console.log('Logo data', this.data['resel_logo'])
        if (this.data['resel_logo']) {
          await this.getresellerlogo(this.data['reseller_id'])
        }
        this.receiptdata = result[1];
        this.paystatus = this.data['pay_status']
        this.bus_address = this.data['bus_address'].replace(/<br>/g, '');
        // console.log('Bus address', this.bus_address)
      }
    }
  }

  async getresellerlogo(id) {
    let result = await this.reser.getResellerLogo({ id: id });
    console.log('Result', result);
    this.logo = result;
    if (this.logo) {
      for (const key in result) {
        if (Object.prototype.hasOwnProperty.call(result, key)) {
          const element = result[key];
          this.logo[key] = 'data:image/png;base64,' + element
        };
      }
    }
  };

}
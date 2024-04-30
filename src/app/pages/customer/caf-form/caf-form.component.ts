import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustService, BusinessService } from '../../_service/indexService';
// import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { DomSanitizer } from '@angular/platform-browser';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';

@Component({
  selector: 'caf-form',
  templateUrl: './caf-form.component.html',
  styleUrls: ['./caf-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class CafFormComponent implements OnInit {
  modalHeader; data; id; pro_pic; custproid; caftc; isp_id; bus_address; status;
  flip: boolean = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(
    private router: Router,
    public activeModal: NgbActiveModal,
    private alert: ToasterService,
    private custser: CustService,
    private sanitizer: DomSanitizer,
    private business: BusinessService,

  ) {
    this.id = JSON.parse(localStorage.getItem('custid'));
    this.isp_id = JSON.parse(localStorage.getItem('isp_id'));
  }

  closeModal() {
    this.activeModal.close();
  }


  rotate(event) {
    event.style.transitionDuration = '1s'
    let rotate = parseInt((event.style.transform.match(/(\d+)/) || [])[0] || '0') + 90
    event.style.transform = `rotate(${rotate}deg)`
  }

  async ngOnInit() {
    console.log('Caf Status', this.status);
    if (this.status == 0 || this.status == 3) {
      await this.cafdetails();
      await this.getprofilepic();
      await this.getcaftc();
    }
    if (this.status == 1 || this.status == 2) await this.getprofilepic()

  }

  async getcaftc() {
    let resp = await this.business.getbusinessedit({ id: this.isp_id });
    console.log('Response', resp)
    this.caftc = resp['tcs']
  }

  async cafdetails() {
    this.loading = true;
    let result = await this.custser.ViewSubscriber({ id: this.id });
    // console.log("view",result)
    if (result) {
      this.data = result;
      this.bus_address = this.data['bus_address'].replace(/<br>/g, '');
      this.loading = false
    }
  }

  async getprofilepic() {
    console.log("hit")
    var subsusername = this.id


    if (this.status == 0 || this.status == 3) {
      let result = await this.custser.getProfilePhoto({ custid: subsusername });
      this.pro_pic = result;
      if (this.pro_pic) {
        for (const key in result) {
          if (Object.prototype.hasOwnProperty.call(result, key)) {
            const element = result[key];
            this.pro_pic[key] = 'data:image/png;base64,' + element
          }
        }
      }
    }
    if (this.status == 1 || this.status == 2) {
      let result = await this.custser.getProfilePhoto({ custid: subsusername, caf_flag: 1 });
      this.pro_pic = result;
      for (const key in result) {
        if (Object.prototype.hasOwnProperty.call(result, key)) {
          const element = result[key];
          this.pro_pic[key] = 'data:image/png;base64,' + element
        }
      }
    }
  }

  printfront(): void {
    let printContents, popupWin;
    printContents = document.getElementById('main_cont').innerHTML;
    popupWin = window.open();
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title></title>
          
          <style>
          @media print {
            @page { margin: 0; }
            body { margin: 1cm; }
          }
          .text_size{
            font-size: 9px;padding: 6px;
            white-space: normal;
            text-align:justify;
        }
         
        .text_sizes{
            font-size: 9px;padding: 6px;
            white-space: normal;
            text-align:justify;
        }
       
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }


  printcaf(): void {
    let printContents, popupWin;
    printContents = document.getElementById('main_cont').innerHTML;
    popupWin = window.open();
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title></title>
          
          <style>
          @media print {
            @page { margin: 0; }
            body {
               margin: 1cm;
               height:495mm
              }
          
          }

        .page-break {
          break-after: page;
        }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

}
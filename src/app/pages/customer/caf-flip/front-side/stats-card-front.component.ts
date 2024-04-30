import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustService } from '../../../_service/indexService';
// import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { DomSanitizer } from '@angular/platform-browser';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';


@Component({
  selector: 'ngx-stats-card-front',
  styleUrls: ['./stats-card-front.component.scss'],
  templateUrl: './stats-card-front.component.html',
})

export class StatsCardFrontComponent implements OnInit {
  modalHeader; data; id; pro_pic; custproid;


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

  ) {
    this.id = JSON.parse(localStorage.getItem('custid'));

  }

  closeModal() {
    this.activeModal.close();
  }

  async ngOnInit() {
    await this.cafdetails();
    await this.getprofilepic();
  }

  async cafdetails() {
    this.loading = true;
    let result = await this.custser.ViewSubscriber({ id: this.id });
    // console.log("view",result)
    if (result) {
      this.data = result;
      this.loading = false
    }
  }

  async getprofilepic() {
    // console.log("hit")
    var subsusername = this.id
    // profileid = this.data.cust_profile_id
    // console.log(subsusername)
    let result = await this.custser.getProfilePhoto({ custid: subsusername, caf_flag: 1 });
    this.pro_pic = result;
    // console.log("image",this.pro_pic)
    if (this.pro_pic) {
      for (const key in result) {
        if (Object.prototype.hasOwnProperty.call(result, key)) {
          const element = result[key];
          this.pro_pic[key] = 'data:image/png;base64,' + element
          // console.log("image", this.pro_pic)

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
          <title>CAF Form</title>
          
          <style>
        
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

}
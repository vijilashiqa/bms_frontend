import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustService } from '../../_service/indexService';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';

@Component({
  selector: 'graphpop',
  templateUrl: './graphpop.component.html',
  styleUrls: ['./graphstyle.scss'],


})

export class GraphpopComponent implements OnInit {
  modalHeader; data; item; disconnect: any = []; img_result;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes; servtype; custname; gph; image: any = [];
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(
    private router: Router,
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private cust: CustService

  ) { }

  closeModal() {
    this.activeModal.close();

  }

  async ngOnInit() {
    await this.graphpopup()
    //  console.log("username",this.item.username)
    // console.log("proid",this.item.profileid)

  }
  async graphpopup() {
    var subsusername = this.item.username,
      profileid = this.item.custid
    // console.log(subsusername)
    this.loading = true;
    let result = await this.cust.getImage({ username: subsusername, profileid: profileid })
    this.img_result = result;
    if (this.img_result) {
      this.loading = false;
      for (const key in result) {
        if (Object.prototype.hasOwnProperty.call(result, key)) {
          const element = result[key];
          this.img_result[key] = 'data:image/png;base64,' + element
          // console.log("image", this.img_result)
        }
      }
    }
  }
}
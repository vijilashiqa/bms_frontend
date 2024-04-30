import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../_service/indexService';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';

@Component({
  selector: 'depositproof',
  templateUrl: './depositproof.component.html',
  styleUrls: ['./depositproof.component.scss'],


})

export class DepositProofComponent implements OnInit {
  modalHeader; data; item; disconnect: any = []; img_result;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes; servtype; custname; gph; image: any = [];
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(
    private router: Router,
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private acntser: AccountService

  ) { }

  closeModal() {
    this.activeModal.close();

  }

  async ngOnInit() {
    await this.getproof()
  }
  async getproof() {
    this.loading = true;
    let result = await this.acntser.getPaymentProof({ id: this.item['depid'] })
    this.img_result = result;
    if (this.img_result) {
      this.loading = false;
      for (const key in result) {
        if (Object.prototype.hasOwnProperty.call(result, key)) {
          const element = result[key];
          this.img_result[key] = 'data:image/png;base64,' + element
        }
      }
    }
  }
}
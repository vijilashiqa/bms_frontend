import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustService } from '../../_service/indexService';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';

@Component({
  selector: 'Logoff',
  templateUrl: './logoff.component.html',

})

export class LogOffComponent implements OnInit {
  modalHeader; data; item; disconnect: any = []; result: any;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes; servtype; custname;
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

  ngOnInit() {

  }

  async logoff() {
    this.loading = true;
    // console.log('Log off', this.item)
    if (this.item['log_off'] == 1) {
      let logitem = this.item;
      this.result = await this.cust.getlogoff({ session: 1, resel_id: logitem.resel_id, isp_id: logitem.isp_id })
    } else {
      let cust_id = this.item, session = 1;
      this.result = await this.cust.custdisconnect({ disconnect: [{ cust_id: cust_id, session: session }] })
    }
    // console.log('res', this.result)
    if (this.result) {
      setTimeout(() => {
        const toast: Toast = {
          type: this.result[0]['error_msg'] == 0 ? 'success' : 'warning',
          title: this.result[0]['error_msg'] == 0 ? 'Success' : 'Failure',
          body: this.result[0]['error_msg'] == 0 ? 'Successfully Logged Off' : 'Log Off Failed',
          timeout: 3000,
          showCloseButton: true,
          bodyOutputType: BodyOutputType.TrustedHtml,
        };
        this.alert.popAsync(toast);
        this.activeModal.close();
        this.loading = false;
      }, 3000)
    } else { this.loading = false; }
  };

  
}
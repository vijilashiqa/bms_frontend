import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustService } from '../../_service/indexService';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';


@Component({
  selector: 'Closesession',
  templateUrl: './close.component.html',

})

export class CloseComponent implements OnInit {
  modalHeader; data; item; disconnect: any = []; result: any;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes; servtype; custname;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private cust: CustService


  ) { }
  closeModal() {
    this.activeModal.close();
  }
  ngOnInit() {

  }
  async closesession() {
    this.loading = true;
    if (this.item['close_session'] == 1) {
      let close_item = this.item;
      this.result = await this.cust.getlogoff({ session: 2, resel_id: close_item.resel_id, isp_id: close_item.isp_id })
    } else {
      let cust_id = this.item, session = 2
      console.log('closeid', cust_id)
      this.result = await this.cust.custdisconnect({ disconnect: [{ cust_id: cust_id, session: session }] })
    }
    // this.data = result;
    console.log("close_Session Result----:", this.result)
    if (this.result != []) {
      setTimeout(() => {
        const toast: Toast = {
          type: this.result[0]['error_msg'] == 0 ? 'success' : 'warning',
          title: this.result[0]['error_msg'] == 0 ? 'Success' : 'Failure',
          body: this.result[0]['error_msg'] == 0 ? 'Successfully Closed Session' : 'Session closing Failed',
          timeout: 3000,
          showCloseButton: true,
          bodyOutputType: BodyOutputType.TrustedHtml,
        };
        this.alert.popAsync(toast);
        this.activeModal.close();
        this.loading = false;
      }, 3000)
    } else {
      this.loading = false;
      this.activeModal.close();
    }
  }

}
import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustService } from '../../_service/indexService';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';

@Component({
  selector: 'ngx-refresh-schedule',
  templateUrl: './refresh-schedule.component.html',
  styleUrls: ['./refresh-schedule.component.scss']
})
export class RefreshScheduleComponent implements OnInit {
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
  async refreshSchedule() {
    this.loading = true;
   
      this.result = await this.cust.refreshSchedule({ rsid:this.item })
    console.log("refresh Schedule Result----:", this.result)
    if (this.result != []) {
      setTimeout(() => {
        const toast: Toast = {
          type: this.result['error_msg'] == 0 ? 'success' : 'warning',
          title: this.result['error_msg'] == 0 ? 'Success' : 'Failure',
          body: this.result['msg'] ,
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
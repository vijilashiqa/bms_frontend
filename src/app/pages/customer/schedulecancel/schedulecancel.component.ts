import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustService, BusinessService, GroupService,OperationService ,RoleService, ResellerService } from '../../_service/indexService';
import { Router } from '@angular/router';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';

@Component({
  selector: 'schedulecancel',
  templateUrl: './schedulecancel.component.html',
  // styleUrls: ['./macstyle.scss'],

})

export class CancelScheduleCustComponent implements OnInit {
  submit: boolean = false; CancelScheduleForm; hr = []; minsec = [];
  ratio = []; pack; modalHeader; item; data; busdata; groupdata; pro; reseldata;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes; servtype; custname;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(

    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private custser: CustService,
    public role: RoleService,
    private busser: BusinessService,
    private grupser: GroupService,
    private resser: ResellerService,
    private router: Router,
    private opser : OperationService

  ) { }
  closeModal() {
    this.activeModal.close();
    // this.router.navigate(['/pages/Accounts/listreceipt']);
  }

  async ngOnInit() {
    this.createForm();
    // console.log("scheduleID",this.item)
  }

  async cancelsubmit() {
    // this.loading = true;
    // console.log("entry")
    if (this.CancelScheduleForm.invalid) {
      this.submit = true;
      return;
    }
    this.CancelScheduleForm.value['rsid'] = this.item;
    // console.log("inside")
    // console.log(this.CancelScheduleForm.value)
    let schedulecanceldata = [this.CancelScheduleForm.value];
    let result = await this.opser.cancel_schedule({cschedule:schedulecanceldata});
    // console.log(result)
    // this.loading = false;
    const toast: Toast = {
      type: result[0]['error_msg'] == 0 ? 'success' : 'warning',
      title: result[0]['error_msg'] == 0 ? 'Success' : 'Failure',
      body: result[0]['msg'],
      timeout: 3000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
    if (result[0]['error_msg'] == 0) {
      this.closeModal();
    }

  }

  createForm() {
    this.CancelScheduleForm = new FormGroup({
      cancel_reason: new FormControl('', Validators.required),

    });
  }
}
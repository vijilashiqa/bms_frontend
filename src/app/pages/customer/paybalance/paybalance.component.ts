import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleService, OperationService, ResellerService } from '../../_service/indexService';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'paybalance',
  templateUrl: './paybalance.component.html',
})

export class BalancePayComponent implements OnInit {
  modalHeader: string; item; busname; grup; resell; pro;
  PayBalanceForm; id; resel;
  submit: boolean = false;
  Make;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;
  constructor(
    public activeModal: NgbActiveModal,
    private alert: ToasterService,
    public role: RoleService,
    private opser: OperationService,
    private reselser: ResellerService,
  ) { }




  closeModal() {
    this.activeModal.close();
  }

  async ngOnInit() {
    console.log('Item', this.item)
    await this.createForm();
    // console.log(this.role.getroleid())
    // this.PayBalanceForm.get('pay_amt').setValue(this.item['payamt'])
    await this.showReseller();

  };

  async showReseller($event = '') {
    this.resel = await this.reselser.showResellerName({ service_role: 1 })
  }

  async payment() {
    // console.log(this.PayBalanceForm.value)
    this.submit = true;
    if (this.PayBalanceForm.invalid) {
      window.alert('Please fill all mandatory fields')
      return;
    }
    this.loading = true;
    console.log('Loading---', this.loading);

    // console.log('inside',this.PayBalanceForm.value)
    this.PayBalanceForm.value['invid'] = this.item['invid'];
    this.PayBalanceForm.value['cust_id'] = this.item['uid'];
    let paymentdata = [this.PayBalanceForm.value];

    let result = await this.opser.invoiceBalanceReceipt({ balance: paymentdata });
    console.log("payresult", result);

    if (result) {
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
        this.activeModal.close(true);
      }
    }
  };

  createForm() {
    let nowdate = new Date();
    this.PayBalanceForm = new FormGroup({
      pay_amt: new FormControl(this.item['payamt'] || '', Validators.required),
      receipt_date: new FormControl(nowdate.toISOString().slice(0, 10)),
      rnote: new FormControl(''),
      collect_by: new FormControl(''),
      paytype:new FormControl('',Validators.required)
    });
  }
}

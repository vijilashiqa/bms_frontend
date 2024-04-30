import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService, BusinessService, GroupService, ResellerService, RoleService } from '../../_service/indexService';
import { DomSanitizer } from '@angular/platform-browser';
import { AddSuccessComponent } from './../success/add-success.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'Adddeposit',
  templateUrl: './adddeposit.component.html',
  // styleUrls:['./custstyle.scss'],
})

export class AddDepositComponent implements OnInit {
  submit: boolean = false; AddDepositForm; busdata; groupdata; reseldata; pro; balamt;
  selectedfile: File = null;
  fileupload; imageURL: any; file: any[]; files; reasondata; id;
  constructor(
    private alert: ToasterService,
    private router: Router,
    private busser: BusinessService,
    private groupser: GroupService,
    private resser: ResellerService,
    private ser: AccountService,
    public role: RoleService,
    private sanitizer: DomSanitizer,
    public activeModal: NgbModal,

    // private acct: acctService,

  ) { }

  async business($event = '') {
    this.busdata = await this.busser.showBusName({ like: $event })

  }

  async groupname($event = '') {
    this.groupdata = await this.groupser.showGroupName({ like: $event })

  }

  async showreason() {
    this.reasondata = await this.ser.showDepReason()
  }

  depmodevalid() {
    (this.AddDepositForm.value['dep_mode'] == '1' || this.AddDepositForm.value['dep_mode'] == '3' || this.AddDepositForm.value['dep_mode'] == '6') ?
      this.AddDepositForm.get('dep_amount').setValidators([Validators.required]) : this.AddDepositForm.get('dep_amount').clearValidators()
    this.AddDepositForm.get('dep_amount').updateValueAndValidity();

    (this.AddDepositForm.value['dep_mode'] == '2' || this.AddDepositForm.value['dep_mode'] == '3') ? this.AddDepositForm.get('paid_amnt').setValidators([Validators.required]) : this.AddDepositForm.get('paid_amnt').clearValidators()
    this.AddDepositForm.get('paid_amnt').updateValueAndValidity();

    (this.AddDepositForm.value['dep_mode'] == '2' || this.AddDepositForm.value['dep_mode'] == '3') ? this.AddDepositForm.get('dep_type').setValidators([Validators.required]) : this.AddDepositForm.get('dep_type').clearValidators()
    this.AddDepositForm.get('dep_type').updateValueAndValidity();
  }

  depvalid() {
    this.AddDepositForm.value['dep_type'] == '2' ? this.AddDepositForm.get('paid_proof').setValidators([Validators.required]) : this.AddDepositForm.get('paid_proof').clearValidators()
    this.AddDepositForm.get('paid_proof').updateValueAndValidity();

    this.AddDepositForm.value['dep_type'] == '3' ? this.AddDepositForm.get('utr_no').setValidators([Validators.required]) : this.AddDepositForm.get('utr_no').clearValidators()
    this.AddDepositForm.get('utr_no').updateValueAndValidity();

    this.AddDepositForm.value['dep_type'] == '4' ? this.AddDepositForm.get('utr_no').setValidators([Validators.required]) : this.AddDepositForm.get('utr_no').clearValidators()
    this.AddDepositForm.get('utr_no').updateValueAndValidity();
  }

  async profile() {
    this.pro = await this.resser.showProfileReseller({ dep_role: 1, bus_id: this.AddDepositForm.value['bus_id'] })

  }

  async resellername($event = '') {
    this.reseldata = await this.resser.showResellerName({ role: this.AddDepositForm.value['Role'], like: $event })
  }

  async resbalance() {
    let reslid = this.AddDepositForm.value['res_name'];
    let balance = await this.reseldata.filter(item => item.id == reslid).map(item => item.balance_amt);
    this.balamt = balance;
    if (this.balamt) {
      this.AddDepositForm.controls.res_balance.setValue(this.balamt)
    }
  }

  async ngOnInit() {
    this.createForm();
    await this.business();
    await this.showreason();
    if (this.role.getroleid() <= 777) {
      this.AddDepositForm.get('bus_id').setValue(this.role.getispid())
      await this.groupname();
      await this.profile();
    }
  }

  async addDeposit() {
    if (this.AddDepositForm.invalid) {
      this.submit = true;
      return;
    }
    let result = await this.ser.addDeposit(this.AddDepositForm.value)
    if (result[0]['error_msg'] == 0) {
      if (this.AddDepositForm.value['paid_proof']) {
        const file = new FormData();
        let id = result[0]['txnid'],
          name = id + '-' + this.AddDepositForm.value['res_name'];
        file.append('file', this.selectedfile, name);
        file.append('id', result[0]['id']);
        file.append('res_id', this.AddDepositForm.value['res_name']);
        let proofresult = await this.ser.uploadPaymentProof(file);
        if (proofresult[0]['error_msg'] == 0) {
          this.result_pop(proofresult);
        } else {
          this.result_pop(result);
        }
      } else {
        this.result_pop(result);
      }
    } else {
      this.result_pop(result);
    }

  }

  toastalert(msg, status = 0) {
    const toast: Toast = {
      type: status == 1 ? 'success' : 'warning',
      title: status == 1 ? 'Success' : 'Failure',
      body: msg,
      timeout: 3000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
  }

  result_pop(item) {
    const activeModal = this.activeModal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.result.then((data) => {

    });
  }

  upload(files: FileList) {
    this.selectedfile = files.item(0);
    if (this.selectedfile) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageURL = this.sanitizer.bypassSecurityTrustUrl(event.target.result)
      }
      reader.readAsDataURL(this.selectedfile);
    } else {
      this.imageURL = '';
    }
  }

  createForm() {
    this.AddDepositForm = new FormGroup({
      bus_id: new FormControl('', Validators.required),
      groupid: new FormControl(''),
      Role: new FormControl('', Validators.required),
      res_balance: new FormControl(''),
      res_name: new FormControl('', Validators.required),
      dep_mode: new FormControl('', Validators.required),
      credit_date: new FormControl(''),
      ctc: new FormControl(''),
      dep_type: new FormControl(''),
      utr_no: new FormControl(''),
      paid_proof: new FormControl(''),
      paid_amnt: new FormControl(''),
      dep_amount: new FormControl(''),
      ot_reason: new FormControl(''),
      reason: new FormControl('', Validators.required),
      note: new FormControl(''),
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService, BusinessService, GroupService, ResellerService, RoleService } from '../../_service/indexService';
import { AddSuccessComponent } from './../success/add-success.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ngxLoadingAnimationTypes } from 'ngx-loading';


@Component({
  selector: 'ngx-wallet-share',
  templateUrl: './wallet-share.component.html',
  styleUrls: ['./wallet-share.component.scss']
})
export class WalletShareComponent implements OnInit {
  submit: boolean = false; AddDepositForm; busdata; groupdata; reseldata; pro; balamt; to_balamt;
  selectedfile: File = null;
  fileupload; imageURL: any; file: any[]; files; reasondata; id; to_pro; to_reseldata;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading = false;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  constructor(
    private alert: ToasterService,
    private router: Router,
    private busser: BusinessService,
    private groupser: GroupService,
    private resser: ResellerService,
    private ser: AccountService,
    public role: RoleService,
    public activeModal: NgbModal,
  ) { }

  
  async ngOnInit() {
    this.createForm();
    await this.business();
    await this.showreason();
    if (this.role.getroleid() <= 777) {
      this.AddDepositForm.get('bus_id').setValue(this.role.getispid())
      await this.groupname();
      await this.profile();
    }
    if(this.role.getroleid() == 555){
      this.AddDepositForm.get('bus_id').setValue(this.role.getispid())
      this.AddDepositForm.get('groupid').setValue(this.role.getgrupid())
      this.AddDepositForm.get('frole').setValue(this.role.getroleid())
      this.AddDepositForm.get('fresel_id').setValue(this.role.getresellerid())
      await this.resellername();
      await this.resbalance();
      await this.toprofile();
    }
  }

  async business($event = '') {
    this.busdata = await this.busser.showBusName({ like: $event })
  }

  async groupname($event = '') {
    this.groupdata = await this.groupser.showGroupName({ like: $event })
  }

  async showreason() {
    this.reasondata = await this.ser.showDepReason()
  }

  async profile() {
    this.pro = await this.resser.showProfileReseller({ sub_role: 1, bus_id: this.form('bus_id') })
  }
  async toprofile() {
    this.to_pro = await this.resser.showProfileReseller({ wallet: 1, wallet_role: this.form('frole'), bus_id: this.form('bus_id') })
  }

  async resellername($event = '') {
    if(this.role.getroleid() == 555){
      // Wrole to exclude condition of sub_isp_id 's in query for respective login
      this.reseldata = await this.resser.showResellerName({ bus_id: this.form('bus_id'), groupid: this.form('groupid'), role: this.form('frole'), like: $event,wrole:1 })
    }else{
      this.reseldata = await this.resser.showResellerName({ bus_id: this.form('bus_id'), groupid: this.form('groupid'), role: this.form('frole'), like: $event })
    }
  }
  async toreseller($event = '') {
    if (this.form('frole') && this.form('fresel_id')) {
      this.to_reseldata = await this.resser.showResellerName({
        bus_id: this.form('bus_id'), groupid: this.form('groupid'), role: this.form('trole'),
        under_role: this.form('frole'), under_man: this.form('fresel_id'), like: $event
      })
    } else window.alert('Please Select From Reseller Type and Name')
  }


  async resbalance() {
  console.log(this.AddDepositForm.value);
  
    let reslid = this.form('fresel_id');
    console.log('Reseller Balance', reslid,'/n',this.reseldata)
    let balance = await this.reseldata.filter(item => item.id == reslid).map(item => item.balance_amt);
    this.balamt = balance;
    console.log('balnce',this.balamt);
    
    if (this.balamt) {
      this.getf('res_balance').setValue(this.balamt)
    }
  }

  async toresbalance() {
    let balance = await this.to_reseldata.filter(x => x.id == this.form('tresel_id')).map(x => x.balance_amt);
    console.log('To reseller Balance', balance, 'ID', this.form('tresel_id'));
    this.to_balamt = balance;
    if (this.to_balamt) this.AddDepositForm.controls.to_res_balance.setValue(this.to_balamt);
  }


  async addDeposit() {
    this.submit = true;
    if (this.AddDepositForm.invalid) {
      window.alert('Please fill all manadatory fields');
      return;
    }
    this.loading = true;
    let result = await this.ser.walletSharing(this.AddDepositForm.value)
    console.log('Wallet Result', result);

    if (result[0]['error_msg'] == 0) {
      this.loading = false;
      this.result_pop(result);
      this.router.navigate(['/pages/Accounts/depositlist']);
    } else {
      this.loading = false
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

  form(item) {
    return this.AddDepositForm.value[item];
  }

  getf(item) {
    return this.AddDepositForm.controls[item];
  }


  createForm() {
    this.AddDepositForm = new FormGroup({
      bus_id: new FormControl('', Validators.required),
      groupid: new FormControl('', Validators.required),
      frole: new FormControl('', Validators.required),
      fresel_id: new FormControl('', Validators.required),
      trole: new FormControl('', Validators.required),
      tresel_id: new FormControl('', Validators.required),
      res_balance: new FormControl(''),
      to_res_balance: new FormControl(''),
      paid_amnt: new FormControl(''),
      ot_reason: new FormControl(''),
      reason: new FormControl('', Validators.required),
      note: new FormControl(''),
    });
  }
}
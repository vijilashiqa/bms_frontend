import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { PaymentReceived } from '../PaymentReceived/payment_received.component';
import { AccountService, BusinessService, GroupService, ResellerService, RoleService, PagerService } from '../../_service/indexService';
// import { CancelPayment } from './CancelPayment/cancel_payment.component';
// import { ViewDeposit } from './ViewDeposit/view_deposit.component';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { DatePipe } from '@angular/common';
import { DepositCancelComponent } from '../depositcancel/dep-cancel.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepositProofComponent } from '../depositproof/depositproof.component';

@Component({
  selector: 'Depositpaylist',
  templateUrl: './depositpayList.component.html',
  styleUrls: ['./depositpaylist.component.scss'],
})

export class DepositpaylistComponent implements OnInit {
  submit: boolean = false; addNas; data; search; bus_name; bus; group1; group_name; profile; resel_type;
  res1; res_name; count; dep_by; depositer; dep_amt; totalDepositAmount;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25; start_date: any; end_date: any;
  depReason = 0; reasondata; dd: any; mm: any; showtype = 0;dep_type;
  deposit_type=[
    {
      id:1,
      label:'Cash'
    },
    {
      id:2,
      label:'Bank Deposit'
    },
    {
      id:3,
      label:'Net Banking'
    },
    {
      id:4,
      label:'UPI'
    },
    {
      id:5,
      label:'Customer Renewal'
    },
    {
      id:6,
      label:'Wallet Sharing'
    }
  ]


  constructor(
    private alert: ToasterService,
    private router: Router,
    private ser: AccountService,
    public role: RoleService,
    private busser: BusinessService,
    private groupser: GroupService,
    private reselser: ResellerService,
    private datePipe: DatePipe,
    public pageservice: PagerService,
    private nasmodel: NgbModal,


  ) {
    let nowdate = new Date().toJSON().slice(0, 10);
    // this.dd = nowdate.getDate();
    // this.mm = nowdate.getMonth();
    // let yyyy = nowdate.getFullYear();
    // if (this.dd < 10) { this.dd = '0' + this.dd } if (this.mm < 10) { this.mm = '0' + this.mm }
    // let today = yyyy + '-' + this.mm + '-' + this.dd;
    // // this.start_date = this.end_date = nowdate.toISOString().slice(0,10);
    this.start_date = this.end_date = nowdate;

  }
  async ngOnInit() {
    localStorage.removeItem('array');
    await this.initiallist();
    await this.showBusName();
    await this.showreason();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.showGroupName();
      await this.showProfileReseller();
      await this.showResellerName();
    }
    if (this.role.getroleid() < 775) {
      this.group_name = this.role.getgrupid();
    }
  }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event });
  }

  async showGroupName($event = '') {
    this.group1 = await this.groupser.showGroupName({ bus_id: this.bus_name, like: $event });
  }

  async showProfileReseller($event = '') {
    this.profile = await this.reselser.showProfileReseller({ dep_role: 1, bus_id: this.bus_name, like: $event });
  }

  async showResellerName($event = '') {
    if (this.resel_type)
      this.res1 = await this.reselser.showResellerName({ bus_id: this.bus_name, groupid: this.group_name, role: this.resel_type, like: $event });
  }

  async deposited($event = '') {
    this.depositer = await this.reselser.showResellerName({ bus_id: this.bus_name, name_like: $event });
  }

  async showreason() {
    this.reasondata = await this.ser.showDepReason()
  }

  changeclear(item) {
    if (item == 1) {
      this.group_name = '';
      this.resel_type = '';
      this.res_name = '';
      this.dep_by = '';
      this.dep_amt = '';
      this.start_date = '';
      this.end_date = '';
      this.dep_type='';
    }
    if (item == 2) {
      this.resel_type = '';
      this.res_name = '';
      this.dep_by = '';
      this.dep_amt = '';
      this.start_date = '';
      this.end_date = '';
      this.dep_type='';
    }
    if (item == 3) {
      this.res_name = '';
      this.dep_by = '';
      this.dep_amt = '';
      this.start_date = '';
      this.end_date = '';
      this.dep_type='';
    }

  }

  async refresh() {
    this.bus_name = '';
    this.group_name = '';
    this.resel_type = '';
    this.res_name = '';
    this.dep_by = '';
    this.dep_amt = '';
    this.group1 = '';
    this.profile = '';
    this.res1 = '';
    this.depositer = '';
    this.start_date = '';
    this.end_date = '';
    this.depReason = 0;
    this.showtype = 0;
    this.dep_type='';

    await this.initiallist();
    await this.showBusName();
    await this.showGroupName();
    await this.showProfileReseller();
    if (this.role.getroleid() == 666 || this.role.getroleid() == 555) {
      await this.showProfileReseller();
      await this.showResellerName();
    }
  }

  async initiallist() {
    let result = await this.ser.listDeposit(
      {
        index: (this.page - 1) * this.limit,
        limit: this.limit,
        bus_id: this.bus_name,
        groupid: this.group_name,
        role: this.resel_type,
        resel_id: this.res_name,
        dep_id: this.dep_by,
        dep_amount: this.dep_amt,
        start_date: this.start_date,
        end_date: this.end_date,
        dep_reason: this.depReason,
        showtype: this.showtype,
        dep_type:this.dep_type
        // res_id:this.reseller_under,
      })
    this.data = result[0];
    this.count = result[1]['tot'];
    this.totalDepositAmount = result[1]['deposit'];
    this.setPage();
  }

  getlist(page) {
    var total = Math.ceil(this.count / this.limit);
    let result = this.pageservice.pageValidator(this.page, page, total);
    this.page = result['value'];
    if (result['result']) {
      this.initiallist();
    }
  }
  setPage() {
    this.pager = this.pageservice.getPager(this.count, this.page, this.limit);
    this.pagedItems = this.data;
  }

  async download() {
    let res = await this.ser.listDeposit({
      bus_id: this.bus_name,
      groupid: this.group_name,
      role: this.resel_type,
      resel_id: this.res_name,
      dep_id: this.dep_by,
      dep_amount: this.dep_amt,
      start_date: this.start_date,
      end_date: this.end_date,
      dep_reason: this.depReason,
      showtype: this.showtype,
      dep_type:this.dep_type

    })
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        if (this.role.getroleid() > 777) {
          param['ISP NAME'] = temp[i]['busname'];
        }
        if (this.role.getroleid() >= 775 || this.role.getroleid() > 444) {
          param['GROUP NAME'] = temp[i]['groupname'];
          param['RESELLER TYPE'] = temp[i]['role'] == 333 ? 'Deposit Reseller' : temp[i]['role'] == 555 ? 'Sub ISP Deposit' : 'Sub Distributor Deposit';
          param['RESELLER BUSINESS NAME'] = temp[i]['company']
        }
        param['DEPOSIT MODE'] = temp[i]['dflag'] == 1 ? 'Depost' : temp[i]['dflag'] == 2 ? 'Received' : temp[i]['dflag'] == 3 ?
          'Deposit Against Payment' : temp[i]['dflag'] == 4 ? 'Commission' : temp[i]['dflag'] == 5 ? 'Debit' : temp[i]['dflag'] == 6 ? 'Credit' : '--';
        param['DEPOSIT TYPE'] = temp[i]['deposit_type'] == 1 ? 'Cash' : temp[i]['deposit_type'] == 2 ? 'Bank Payment' :
          temp[i]['deposit_type'] == 3 ? 'Net Banking' : temp[i]['deposit_type'] == 4 ? 'UPI' : temp[i]['deposit_type'] == 6 ? 'Wallet' : 'Deposit';
        param['ORDER ID'] = temp[i]['txnid'];
        param['UTR'] = temp[i]['utr'] == null ? '--' : temp[i]['utr'];
        param['DEPOSIT AMOUNT'] = temp[i]['deposit_amount'];
        param['RECEIVED AMOUNT'] = temp[i]['received_amount'];
        param['Status'] = temp[i]['status'] == 1 ? 'Cancel' : 'Active';
        param['REASON'] = temp[i]['dep_reason'];
        param['NOTE'] = temp[i]['note'] == null ? '--' : temp[i]['note'];
        param['CANCEL REASON'] = temp[i]['cancel_reason'] == null ? '--' : temp[i]['cancel_reason'];
        temp[i]['cdate'] = this.datePipe.transform(temp[i]['c_date'], 'd MMM y h:mm:ss a');
        param['DEPOSITED BY'] = temp[i]['deposited_by'];
        param['DEPOSIT DATE'] = temp[i]['cdate'];

        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Deposit List' + EXCEL_EXTENSION);
    }
  }

  editdeposit(item) {
    localStorage.setItem('array', JSON.stringify(item));
    this.router.navigate(['/pages/Accounts/adddeposit']);
  }

  Canceldeposit(item) {
    const activeModal = this.nasmodel.open(DepositCancelComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Cancel Deposit';
    activeModal.componentInstance.item = item;
    activeModal.result.then((data) => {
      this.initiallist();
    });
  }

  viewproof(depid) {
    const activeModal = this.nasmodel.open(DepositProofComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'View Proof';
    activeModal.componentInstance.item = { depid: depid };
    activeModal.result.then((data) => {
    });
  }

  toastalert(msg, status = 0) {
    const toast: Toast = {
      type: status == 1 ? 'success' : 'warning',
      title: status == 1 ? 'Success' : 'Failure',
      body: msg,
      timeout: 5000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
  }


}
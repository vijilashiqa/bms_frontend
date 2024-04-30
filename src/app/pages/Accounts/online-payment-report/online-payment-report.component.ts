import { Component, OnInit } from '@angular/core';
import 'style-loader!angular2-toaster/toaster.css';
import {
  AccountService, BusinessService, PaymentService,
  GroupService, ResellerService, RoleService, PagerService,
  CustService
} from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { AddSuccessComponent } from '../success/add-success.component';

@Component({
  selector: 'ngx-online-payment-report',
  templateUrl: './online-payment-report.component.html',
  styleUrls: ['./online-payment-report.component.scss']
})
export class OnlinePaymentReportComponent implements OnInit {
  submit: boolean = false; addNas; data; search; bus_name; bus; group1; group_name; profile; resel_type;
  res1; res_name; count; order_id; txnid; cdate: any; paydata; end_date: any;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25; totalOnlinePay; order; trans; opstatus;
  dd: any; mm: any;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false; usertype; custname; cust_name;

  constructor(
    private ser: AccountService,
    private payser: PaymentService,
    public role: RoleService,
    private busser: BusinessService,
    private groupser: GroupService,
    private reselser: ResellerService,
    private datePipe: DatePipe,
    public pageservice: PagerService,
    private activeModal: NgbModal,
    private custser: CustService,

  ) {
    let nowdate = new Date().toJSON().slice(0, 10);
    // this.cdate = this.end_date = nowdate;
  }

  async ngOnInit() {
    await this.initiallist();
    await this.showBusName();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.showProfileReseller();
      await this.showResellerName();
    }
    if (this.role.getroleid() < 775) {
      this.group_name = this.role.getgrupid();
    }
    await this.showOrderId();
    await this.showTransId();
  }


  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event });
  }

  async showProfileReseller($event = '') {
    this.profile = await this.reselser.showProfileReseller({ topup_role: 1, bus_id: this.bus_name, like: $event });
   }

  async showResellerName($event = '') {
    if (this.resel_type)
      this.res1 = await this.reselser.showResellerName({ bus_id: this.bus_name, role: this.resel_type, like: $event });
  }

  async showUser($event = '') {
    this.custname = await this.custser.showUser({ bus_id: this.bus_name, role: this.resel_type, role_flag: 1, resel_id: this.res_name, like: $event })
  }


  async showOrderId($event = '') {
    this.order = await this.ser.showOrdertransactionId({ bus_id: this.bus_name, like: $event })
  }

  async showTransId($event = '') {
    this.trans = await this.ser.showOrdertransactionId({ bus_id: this.bus_name, trn_like: $event })
  }

  changeclear(item) {
    if (item == 1) {
      this.usertype = ''
      this.resel_type = '';
      this.res_name = '';
      this.cust_name = ''
      this.order_id = '';
      this.txnid = '';
      this.cdate = '';
      this.end_date = '';
      this.opstatus = '';
     }
    if (item == 5) {
      this.resel_type = '';
      this.res_name = '';
      this.cust_name = ''
      this.order_id = '';
      this.txnid = '';
      this.cdate = '';
      this.end_date = '';
      this.opstatus = '';
     }

    if (item == 2) {
      this.res_name = '';
      this.cust_name = ''
      this.order_id = '';
      this.txnid = '';
      this.cdate = '';
      this.end_date = '';
      this.opstatus = '';
    }
    if (item == 3) {
      this.cust_name = '';
      this.order_id = '';
      this.txnid = '';
      this.cdate = '';
      this.end_date = '';
      this.opstatus = '';
    }
    if (item == 4) {
      this.txnid = '';
    }
  }


  async refresh() {
    this.bus_name = '';
    this.usertype = ''
    this.resel_type = '';
    this.res_name = '';
    this.order_id = '';
    this.txnid = '';
    this.cdate = '';
    this.end_date = '';
    this.profile = '';
    this.res1 = '';
    this.opstatus = '';
    await this.initiallist();
    await this.showBusName();
    await this.showProfileReseller();
    await this.showOrderId();
    await this.showTransId();
  }

  async initiallist() {
    this.loading = true;
    let result = await this.ser.listOnlinePaymentReport(
      {
        index: (this.page - 1) * this.limit,
        limit: this.limit,
        bus_id: this.bus_name,
        usertype:this.usertype,
        role: this.resel_type,
        user_id: this.res_name,
        order_id: this.order_id,
        txnid: this.txnid,
        cdate: this.cdate,
        end_date: this.end_date,
        uid: this.cust_name,
        opstatus: this.opstatus
      })
    this.data = result[0];
    this.count = result[1]['count'];
    // this.totalOnlinePay = result[1]['total'];
    this.setPage();
    if (result) {
      this.loading = false;
    }
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

  async checkPay() {
    this.loading = true
    const result = await this.payser.checkAggregatorStatus({ checkall: 1 });
    this.loading = false
    if (result) {
      this.result_pop(result, true);
    }

  }

  result_pop(item, add_res) {
    const activeModal = this.activeModal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.componentInstance.online_res = add_res;
    activeModal.result.then((data) => {
      this.initiallist()
    });
  }

  async download() {
    this.loading = true
    let res = await this.ser.listOnlinePaymentReport({
      bus_id: this.bus_name,
      usertype:this.usertype,
      role: this.resel_type,
      user_id: this.res_name,
      order_id: this.order_id,
      txnid: this.txnid,
      cdate: this.cdate,
      end_date: this.end_date,
      uid: this.cust_name,
      opstatus: this.opstatus
    })
    this.loading = false
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        if (this.role.getroleid() > 777) {
          param['ISP NAME'] = temp[i]['busname'];
        }
        if (this.role.getroleid() >= 775 || this.role.getroleid() > 444) {
          param['RESELLER TYPE'] = temp[i]['role'] == 333 ? 'Deposit Reseller' : temp[i]['role'] == 555 ? 'Sub ISP Deposit' : 'Sub Distributor Deposit';
          param['RESELLER BUSINESS NAME'] = temp[i]['company']
        }
        param['PAY MODE'] = temp[i]['pay_mode'];
        param['ORDER ID'] = temp[i]['order_id'];
        param['TRANSACTION ID'] = temp[i]['txnid'];
        param['BEFORE BALANCE AMOUNT'] = temp[i]['before_balance'];
        param['DEPOSITED AMOUNT'] = temp[i]['dep_amt'];
        param['INITIATED AMOUNT'] = temp[i]['amt'];
        temp[i]['payfor'] = temp[i]['pay_for'] == 1 ? 'Reseller Topup' : temp[i]['pay_for'] == 2 ? 'Subscriber Renewal' : temp[i]['pay_for'] == 3 ? 'Subscriber Topup'
          : temp[i]['pay_for'] == 4 ? 'ResellerIP Amount' : 'Subscriber Schedule';
        param['Payment For'] = temp[i]['payfor'];
        param['Status'] = temp[i]['opstatus'] == 0 ? 'Success' : temp[i]['opstatus'] == 1 ? 'In Process' : 'Cancel';
        param['DONE BY'] = temp[i]['doneby'];
        temp[i]['cdate'] = this.datePipe.transform(temp[i]['cdate'], 'd MMM y h:mm:ss a');
        param['CREATED DATE'] = temp[i]['cdate'];
        temp[i]['mdate'] = this.datePipe.transform(temp[i]['mdate'], 'd MMM y h:mm:ss a');
        param['MODIFIED DATE'] = temp[i]['mdate'];
        param['RESPONSE'] = temp[i]['agg_response']
        param['Aggregate Status'] = temp[i]['agg_pay_status'] == 0 ? 'Success' : temp[i]['agg_pay_status'] == -1 ? 'Cancel/Failed' : '--';
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Online Payment Report' + EXCEL_EXTENSION);
    }
  }

}

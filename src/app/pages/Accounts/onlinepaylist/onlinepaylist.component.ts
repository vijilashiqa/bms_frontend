import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
// import { PaymentReceived } from '../PaymentReceived/payment_received.component';
import {
  AccountService, BusinessService, PaymentService,
  GroupService, ResellerService, RoleService, PagerService
} from '../../_service/indexService';
// import { CancelPayment } from './CancelPayment/cancel_payment.component';
// import { ViewDeposit } from './ViewDeposit/view_deposit.component';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { DatePipe } from '@angular/common';
import { PaystatusCheckComponent } from '../paystatus/paystatus.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'onlinepaylist',
  templateUrl: './onlinepaylist.component.html',
  styleUrls: ['./onlinepaylist.component.scss'],
})

export class OnlinePaylistComponent implements OnInit {
  submit: boolean = false; addNas; data; search; bus_name; bus; group1; group_name; profile; resel_type;
  res1; res_name; count; order_id; txnid; cdate: any; paydata; end_date: any;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25; totalOnlinePay; order; trans; opstatus;
  dd: any; mm: any;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(
    private alert: ToasterService,
    private router: Router,
    private ser: AccountService,
    private payser: PaymentService,
    public role: RoleService,
    private busser: BusinessService,
    private groupser: GroupService,
    private reselser: ResellerService,
    private datePipe: DatePipe,
    public pageservice: PagerService,
    private nasmodel: NgbModal,


  ) {
    let nowdate = new Date().toJSON().slice(0, 10);
    //  this.dd = nowdate.getDate();
    //  this.mm = nowdate.getMonth();
    // let yyyy = nowdate.getFullYear();
    // if(this.dd <10){this.dd ='0'+this.dd } if(this.mm<10) {this.mm='0'+this.mm}
    // let today = yyyy+'-'+this.mm+'-'+this.dd;
    // console.log('Today',today)

    // console.log('Nowdate', nowdate,'ISo string',nowdate.toISOString());

    // this.cdate = this.end_date = nowdate.toISOString().slice(0, 10);
    this.cdate = this.end_date = nowdate;
  }
  async ngOnInit() {
    localStorage.removeItem('array');
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

    // console.log(result)
  }

  async showProfileReseller($event = '') {
    this.profile = await this.reselser.showProfileReseller({ topup_role: 1, bus_id: this.bus_name, like: $event });

    // console.log("prof:", result)
  }

  async showResellerName($event = '') {
    // console.log('inside', this.resel_type)
    if (this.resel_type)
      this.res1 = await this.reselser.showResellerName({ bus_id: this.bus_name, role: this.resel_type, like: $event });

    // console.log("resellername",result)
  }

  async showOrderId($event = '') {
    this.order = await this.ser.showOrdertransactionId({ bus_id: this.bus_name, like: $event })
  }

  async showTransId($event = '') {
    this.trans = await this.ser.showOrdertransactionId({ bus_id: this.bus_name, trn_like: $event })

  }


  changeclear(item) {
    if (item == 1) {
      this.resel_type = '';
      this.res_name = '';
      this.order_id = '';
      this.txnid = '';
      this.cdate = '';
      this.end_date = '';
      this.opstatus = '';
    }
    if (item == 2) {
      this.res_name = '';
      this.order_id = '';
      this.txnid = '';
      this.cdate = '';
      this.end_date = '';
      this.opstatus = '';
    }
    if (item == 3) {
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
    // await this.showResellerName();

    await this.showOrderId();
    await this.showTransId();
  }

  async initiallist() {
    this.loading = true;
    let result = await this.ser.listOnlinePayment(
      {
        index: (this.page - 1) * this.limit,
        limit: this.limit,
        bus_id: this.bus_name,
        role: this.resel_type,
        resel_id: this.res_name,
        order_id: this.order_id,
        txnid: this.txnid,
        cdate: this.cdate,
        end_date: this.end_date,
        opstatus: this.opstatus

        // res_id:this.reseller_under,
      })
    // console.log(result)
    this.data = result[0];
    this.count = result[1]['count'];
    this.totalOnlinePay = result[1]['total'];
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
    // console.log(this.data);
    this.pager = this.pageservice.getPager(this.count, this.page, this.limit);
    this.pagedItems = this.data;
  }

  async download() {
    let res = await this.ser.listOnlinePayment({
      bus_id: this.bus_name,
      role: this.resel_type,
      resel_id: this.res_name,
      order_id: this.order_id,
      txnid: this.txnid,
      cdate: this.cdate,
      end_date: this.end_date,
      opstatus: this.opstatus
    })
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
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Online Payment List' + EXCEL_EXTENSION);
    }
  }


  async statuscheck(item, gwid) {
    this.loading = true;
    let result;
    if (gwid == 1) result = await this.payser.paystatus({ opid: item })   // Federal
    else if (gwid == 2) {
      result = await this.payser.pumstatus({ opid: item })  // payUMoney
    } else if (gwid == 3) {
      result = await this.payser.paytmStatus({ opid: item })
    }else if (gwid == 5) {
      result = await this.payser.easyBuzzTrnStaus({ opid: item })
    }else{
      result = await this.payser.payStarStatus({ opid: item })
    }
    if (result) {
      console.log('Result', result)
      this.paydata = result[0];
      this.loading = false
      const activeModal = this.nasmodel.open(PaystatusCheckComponent, { size: 'lg', container: 'nb-layout' });
      activeModal.componentInstance.modalHeader = 'Payment Status';
      activeModal.componentInstance.item = this.paydata;
      activeModal.result.then((data) => {
        this.initiallist();
      });
    } else {
      this.loading = false
    }
    // setTimeout(() => {

    // }, 5000);

  }

}
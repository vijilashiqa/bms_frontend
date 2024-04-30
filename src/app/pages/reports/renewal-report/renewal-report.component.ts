import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import {
  AccountService, BusinessService, CustService, GroupService,
  ResellerService, RoleService, S_Service, PagerService
} from '../../_service/indexService';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { ViewInvoiceComponent } from '../../Accounts/viewinvoice/viewinvoice.component';
import { InvoiceReceiptComponent } from '../../Accounts/invreceipt/invreceipt.component';
import { InvTransactionComponent } from '../../Accounts/transaction/transaction.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'ngx-renewal-report',
  templateUrl: './renewal-report.component.html',
  styleUrls: ['./renewal-report.component.scss']
})
export class RenewalReportComponent implements OnInit {
  submit: boolean = false; addNas; data; search; bus_name = ''; bus; group1; sername = ''; sub_plan = '';
  profile; resel_type = ''; res1; res_name = ''; invoice_num = ''; paymentForm; tot; Download; inv_type = 1; pack; count; cust_name = '';
  group_name = ''; subplandata; custname; dtype = ''; inv_status = ''; from_date = ''; to_date = ''; from_edate = ''; to_edate = '';
  pay_status = ''; start_date :any = ''; end_date = ''; invnum;
  minDate = '';maxDate='';
  invamnt; totinvamnt; taxamount; sbranch; s_branch;
  index = -1; invdetails; share; servtype; serv_type;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit = 25;
  myDateValue: Date;
  // bsConfig: Partial<BsDatepickerConfig>;
  constructor(
    private alert: ToasterService,
    private router: Router,
    private ser: AccountService,
    private packser: S_Service,
    public role: RoleService,
    private busser: BusinessService,
    private custser: CustService,
    private groupser: GroupService,
    private reselser: ResellerService,
    public pageservice: PagerService,
    public activeModal: NgbModal,
    public nasmodel: NgbModal,
    private datePipe: DatePipe
  ) { }

  async ngOnInit() {
    this.myDateValue = new Date();
    let year=2022
//     console.log('startdatee',this.start_date);
//     this.start_date.setYear(year)
// this.start_date=this.start_date.toISOString().slice(0,10);
   
    // this.start_date.setYear(2012).toISOString().slice(0,10);
    console.log('startdatee',this.start_date);
    this.minDate=`${year}-01-01`;
    this.maxDate=`${year}-12-31`

    localStorage.removeItem('array');
    await this.showBusName();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.showGroupName();
      await this.showinvoicenum();
      await this.showProfileReseller();
      await this.showResellerName();
      await this.showUser();
      await this.showService();
      await this.showUser();
      await this.showResellerBranch();
    }
    if (this.role.getroleid() < 775) {
      await this.initiallist();
    }
  }

  async subplanshow($event = '') {
    this.subplandata = await this.packser.showSubPlan({ srvid: this.sername, like: $event })
    // console.log(res);
  }

  async showService($event = '') {
    this.pack = await this.packser.showService({ bus_id: this.bus_name, groupid: this.group_name, resel_id: this.res_name, res_flag: 1, like: $event })
  }

  async showGroupName($event = '') {
    this.group1 = await this.groupser.showGroupName({ bus_id: this.bus_name, srvid: this.sername, like: $event })
    // console.log("group:", result)
  }

  async showinvoicenum($event = '') {
    this.invnum = await this.ser.showInvoiceNo({ bus_id: this.bus_name, like: $event });
    // console.log(this.invnum);
  }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event })
    // console.log(result)
  }

  async showProfileReseller($event = '') {
    this.profile = await this.reselser.showProfileReseller({ bus_id: this.bus_name, like: $event })
    // console.log("prof:", result)
  }
  // alertmsg() {
  //   if (!this.resel_type) {
  //     this.toastalert('Please Select Reseller Type');
  //   }
  // }
  async showResellerName($event = '') {
    // console.log('inside', this.resel_type)
    if (this.resel_type || this.role.getroleid() == 666) {
      this.res1 = await this.reselser.showResellerName({ bus_id: this.bus_name, groupid: this.group_name, role: this.resel_type, like: $event })
    }
    // console.log(result)
  }
  async servicetype($event = '') {
    this.servtype = await this.busser.showServiceType({ sertype: 1, bus_id: this.bus_name, like: $event })
    // console.log("sertype",result);
  }

  async showUser($event = '') {
    this.custname = await this.custser.showUser({ bus_id: this.bus_name, groupid: this.group_name, resel_id: this.res_name, srvid: this.sername, like: $event })
    // console.log("customer", result)
  }

  async showResellerBranch($event = '') {
    if (this.bus_name || this.group_name || this.res_name) {
      this.sbranch = await this.reselser.showResellerBranch({ bus_id: this.bus_name, groupid: this.group_name, resel_id: this.res_name, like: $event })
    }
  }

  changeclear(item) {
    if (item == 1) {
      this.group_name = ''; this.resel_type = ''; this.res_name = ''; this.invoice_num = ''; this.sername = ''; this.sub_plan = '';
      this.cust_name = ''; this.inv_type = 1; this.inv_status = ''; this.pay_status = ''; this.start_date = ''; this.end_date = ''; this.serv_type = ''; this.s_branch = '';
    }
    if (item == 2) {
      this.resel_type = ''; this.res_name = ''; this.invoice_num = ''; this.sername = ''; this.sub_plan = '';
      this.cust_name = ''; this.inv_type = 1; this.inv_status = ''; this.pay_status = ''; this.start_date = ''; this.end_date = ''; this.serv_type = ''; this.s_branch = '';
    }
    if (item == 3) {
      this.res_name = ''; this.invoice_num = ''; this.sername = ''; this.sub_plan = '';
      this.cust_name = ''; this.inv_type = 1; this.inv_status = ''; this.pay_status = ''; this.start_date = ''; this.end_date = ''; this.serv_type = ''; this.s_branch = '';
    }
    if (item == 4) {
      this.invoice_num = ''; this.sername = ''; this.sub_plan = '';
      this.cust_name = ''; this.inv_type = 1; this.inv_status = ''; this.pay_status = ''; this.start_date = ''; this.end_date = ''; this.serv_type = ''; this.s_branch = '';
    }
    if (item == 5) {
      this.sername = ''; this.sub_plan = '';
      this.cust_name = ''; this.inv_type = 1; this.inv_status = ''; this.pay_status = ''; this.start_date = ''; this.end_date = ''; this.serv_type = ''; this.s_branch = '';
    }
    if (item == 6) {
      this.sub_plan = '';
      this.cust_name = ''; this.inv_type = 1; this.inv_status = ''; this.pay_status = ''; this.start_date = ''; this.end_date = ''; this.serv_type = ''; this.s_branch = '';
    }
    if (item == 7) {
      this.cust_name = ''; this.inv_type = 1; this.inv_status = ''; this.pay_status = ''; this.start_date = ''; this.end_date = ''; this.serv_type = ''; this.s_branch = '';
    }

  };

  async refresh() {
    this.bus_name = ''; this.group_name = ''; this.res_name = ''; this.invoice_num = ''; this.cust_name = ''; this.resel_type = '';
    this.sername = ''; this.sub_plan = ''; this.inv_type = 1;
    this.inv_status = ''; this.pay_status = ''; this.start_date = ''; this.end_date = '';
    this.serv_type = ''; this.group1 = ''; this.profile = ''; this.res1 = '';
    this.invnum = ''; this.pack = ''; this.subplandata = ''; this.custname = ''; this.servtype = ''; this.s_branch = '';
    await this.initiallist();
    if (this.role.getroleid() == 666 || this.role.getroleid() == 555) {
      await this.showProfileReseller();
      await this.showResellerName();
    }
  }

  async initiallist() {
    this.loading = true;
    let result;
    console.log('Invtype', this.inv_type);

    if (this.inv_type == 2) {
      result = await this.ser.listGSTInvoice(
        {
          index: (this.page - 1) * this.limit,
          limit: this.limit,
          bus_id: this.bus_name,
          groupid: this.group_name,
          resel_id: this.res_name,
          inv_no: this.invoice_num,
          uid: this.cust_name,
          srvid: this.sername,
          subplan: this.sub_plan,
          invtype: this.inv_type,
          invstatus: this.inv_status,
          paystatus: this.pay_status,
          start_date: this.start_date,
          end_date: this.end_date,
          srv_type: this.serv_type,
          role: this.resel_type,
          location: this.s_branch
          // res_id:this.reseller_under,
        })
    } else {
      result = await this.ser.listInvoice(
        {
          index: (this.page - 1) * this.limit,
          limit: this.limit,
          bus_id: this.bus_name,
          groupid: this.group_name,
          resel_id: this.res_name,
          inv_no: this.invoice_num,
          uid: this.cust_name,
          srvid: this.sername,
          subplan: this.sub_plan,
          invtype: this.inv_type ? this.inv_type : '',
          invstatus: this.inv_status,
          paystatus: this.pay_status,
          start_date: this.start_date,
          end_date: this.end_date,
          srv_type: this.serv_type,
          role: this.resel_type,
          location: this.s_branch
          // res_id:this.reseller_under,
        })
    }
    if (result) {
      this.data = result[0];
      this.count = result[1]['tot'];
      this.invamnt = result[1]['inv_amount'];
      this.taxamount = result[1]['tax_amount'];
      this.totinvamnt = result[1]['totamt'];
      this.loading = false;
      this.setPage();
    } else this.loading = false;





    // console.log("Invlist",result)
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
    this.loading = true;
    let res;
    if (this.inv_type == 1) {
      res = await this.ser.listInvoice({
        limit: this.limit,
        bus_id: this.bus_name,
        groupid: this.group_name,
        resel_id: this.res_name,
        uid: this.cust_name,
        srvid: this.sername,
        inv_no: this.invoice_num,
        subplan: this.sub_plan,
        invtype: this.inv_type,
        invstatus: this.inv_status,
        paystatus: this.pay_status,
        start_date: this.start_date,
        end_date: this.end_date,
        srv_type: this.serv_type,
        role: this.resel_type,
        location: this.s_branch

      })
    } else {
      res = await this.ser.listGSTInvoice({
        limit: this.limit,
        bus_id: this.bus_name,
        groupid: this.group_name,
        resel_id: this.res_name,
        uid: this.cust_name,
        srvid: this.sername,
        inv_no: this.invoice_num,
        subplan: this.sub_plan,
        invtype: this.inv_type,
        invstatus: this.inv_status,
        paystatus: this.pay_status,
        start_date: this.start_date,
        end_date: this.end_date,
        srv_type: this.serv_type,
        role: this.resel_type,
        location: this.s_branch

      })
    }

    this.loading = false;
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        if (this.role.getroleid() > 777) {
          param['ISP Name'] = temp[i]['busname'];
        }
        if (this.role.getroleid() >= 775) {
          param['INVOICE ID'] = temp[i]['invid']
        }
        if (this.role.getroleid() >= 775 || this.role.getroleid() > 444) {
          param['RESELLER TYPE'] = temp[i]['role'] == 444 ? 'Bulk Reseller' : temp[i]['role'] == 333 ? 'Deposit Reseller' : temp[i]['role'] == 666 ? 'Sub ISP Bulk' :
            temp[i]['role'] == 555 ? 'Sub ISP Deposit' : temp[i]['role'] == 551 ? 'Sub Distributor Deposit' : temp[i]['role'] == 661 ? 'Sun Distributor Bulk' : 'Hotel';
          param['RESELLER NAME'] = temp[i]['company'];
        }
        param['INVOICE NO'] = temp[i]['rollid'];
        param['RENEWAL TYPE'] = temp[i]['pay_through'] == 1 ? 'Manual' : temp[i]['pay_through'] == 2 ? 'Scheduled' : temp[i]['pay_through'] == 3 ?
          'Through Gateway By Subscriber' : 'Scheduled By Subscriber'
        param['SUBSCRIBER NAME'] = temp[i]['user_name'];
        param['PROFILE ID'] = temp[i]['userid'];
        param['MOBILE'] = temp[i]['mobile'];
        param['IP TYPE'] = temp[i]['ipmodecpe'] == 0 ? 'NAS Pool or DHCP' : temp[i]['ipmodecpe'] == 1 ? 'Ippool' : temp[i]['ipmodecpe'] == 2 ? 'Static' : '--';
        param['BRANCH'] = temp[i]['branch'] || '--';
        param['SERVICE TYPE'] = temp[i]['service_name'];
        param['SERVICE NAME'] = temp[i]['srvname'];
        param['SUB PLAN'] = temp[i]['sub_plan'];
        param['PACK PRICE'] = temp[i]['invoice_amount'];
        param['TAX AMOUNT PRICE'] = temp[i]['tax_amount'];
        param['TOTAL PRICE'] = temp[i]['total_amount'];
        param['GST'] = temp[i]['recipient_gst_number'];
        param['INVOICE TYPE'] = temp[i]['inv_type'] == 1 ? 'Invoice' : 'GST Invoice';
        param['INVOICE STATUS'] = temp[i]['inv_status'] == 1 ? 'Active' : temp[i]['inv_status'] == 2 ? 'Proforma Invoice' : 'Cancelled';
        temp[i]['inv_date'] = this.datePipe.transform(temp[i]['inv_date'], 'd MMM y hh:mm:ss a')
        param['RENEWAL DATE'] = temp[i]['inv_date'];
        temp[i]['expiry_date'] = this.datePipe.transform(temp[i]['expiry_date'], 'd MMM y hh:mm:ss a')
        param['SERVICE EXPIRY'] = temp[i]['expiry_date'];
        param['PAY STATUS'] = temp[i]['pay_status'] == 2 ? 'Paid' : 'Unpaid';
        temp[i]['paydate'] = temp[i]['paydate'] == "0000-00-00 00:00:00" ? '' : this.datePipe.transform(temp[i]['paydate'], 'd MMM y hh:mm:ss a')
        param['PAY DATE'] = temp[i]['pay_status'] == 2 ? temp[i]['paydate'] : '--';
        param['COLLECTED'] = temp[i]['sub_payed_amt'];
        param['RENEWAL BY'] = temp[i]['renewalby_name'];
        param['RENEWAL NOTE'] = temp[i]['comment1'] ? temp[i]['comment1'] : '';
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Renewal Report' + EXCEL_EXTENSION);
    }
  }

  View(invdata, view) {
    if (this.inv_type == 2) view = 2
    else view = 1
    const activeModal = this.nasmodel.open(ViewInvoiceComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'View Invoice';
    activeModal.componentInstance.invdata = invdata;
    activeModal.componentInstance.views = view;
    activeModal.result.then((data) => {
    })
  }

  inv_receipt(invdata) {
    const activeModal = this.nasmodel.open(InvoiceReceiptComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Receipt';
    activeModal.componentInstance.data = { invdata: invdata };
    activeModal.result.then((data) => {
    })
  }

  inv_trans(invdata) {
    const activeModal = this.nasmodel.open(InvTransactionComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Transaction';
    activeModal.componentInstance.data = { invdata: invdata };
    activeModal.result.then((data) => {
    })
  }



  view_user(item) {
    localStorage.setItem('details', JSON.stringify(item));
    this.router.navigate(['/pages/cust/viewcust']);
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
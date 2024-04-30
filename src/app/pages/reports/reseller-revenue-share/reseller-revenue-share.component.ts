import { Component, OnInit } from '@angular/core';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import {
  AccountService, BusinessService, CustService, GroupService,
  ResellerService, RoleService, S_Service, PagerService, ReportService
} from '../../_service/indexService';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'ngx-reseller-revenue-share',
  templateUrl: './reseller-revenue-share.component.html',
  styleUrls: ['./reseller-revenue-share.component.scss']
})
export class ResellerRevenueShareComponent implements OnInit {
  submit: boolean = false; addNas; data; search; bus_name = ''; bus; group1;
  profile; resel_type = ''; res1; res_name = ''; invoice_num = ''; paymentForm; tot; Download; inv_type = ''; count; cust_name = '';
  group_name = ''; custname; inv_status = '';
  start_date = ''; end_date = ''; invnum;
  invamnt; totinvamnt; taxamount;
  isp_amt; subisp_amt; subdist_amt; resel_amt;
  pay_through;
  index; invdetails;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit = 25;
  constructor(
    private router: Router,
    private ser: AccountService,
    public role: RoleService,
    private busser: BusinessService,
    private custser: CustService,
    private groupser: GroupService,
    private reselser: ResellerService,
    public pageservice: PagerService,
    public activeModal: NgbModal,
    public nasmodel: NgbModal,
    private datePipe: DatePipe,
    private reportser: ReportService,

  ) { }

  async ngOnInit() {
    await this.initiallist()
    await this.showBusName();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.showGroupName();
      await this.showinvoicenum();
      await this.showProfileReseller();
      await this.showResellerName();
      await this.showUser();
    }
    if (this.role.getroleid() < 775) {
      await this.initiallist();
    }
  }

  async showGroupName($event = '') {
    this.group1 = await this.groupser.showGroupName({ bus_id: this.bus_name, like: $event })
  }

  async showinvoicenum($event = '') {
    this.invnum = await this.ser.showInvoiceNo({ bus_id: this.bus_name, like: $event });
  }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event })
  }

  async showProfileReseller($event = '') {
    this.profile = await this.reselser.showProfileReseller({ bus_id: this.bus_name, like: $event })
  }

  async showResellerName($event = '') {
    if (this.resel_type) {
      this.res1 = await this.reselser.showResellerName({ bus_id: this.bus_name, groupid: this.group_name, role: this.resel_type, like: $event })
    }
  }

  async showUser($event = '') {
    this.custname = await this.custser.showUser({ bus_id: this.bus_name, groupid: this.group_name, resel_id: this.res_name, like: $event })
  }


  changeclear(item) {
    if (item == 1) {
      this.group_name = ''; this.resel_type = ''; this.res_name = ''; this.invoice_num = ''; this.cust_name = '';
      this.inv_type = ''; this.start_date = ''; this.end_date = '';
    }
    if (item == 2) {
      this.resel_type = ''; this.res_name = ''; this.invoice_num = ''; this.cust_name = '';
      this.inv_type = ''; this.start_date = ''; this.end_date = '';
    }
    if (item == 3) {
      this.res_name = ''; this.invoice_num = ''; this.cust_name = '';
      this.inv_type = ''; this.start_date = ''; this.end_date = '';
    }
    if (item == 4) {
      this.invoice_num = ''; this.cust_name = '';
      this.inv_type = ''; this.start_date = ''; this.end_date = '';
    }
    if (item == 5) {
      this.cust_name = '';
      this.inv_type = ''; this.start_date = ''; this.end_date = '';
    }
  }


  async refresh() {
    this.bus_name = ''; this.group_name = ''; this.resel_type = ''; this.res_name = ''; this.cust_name = ''; this.invoice_num = '';
    this.inv_type = ''; this.inv_status = ''; this.start_date = ''; this.end_date = '';
    this.group1 = ''; this.profile = ''; this.res1 = ''; this.invnum = ''; this.custname = '';
    await this.initiallist();
    if (this.role.getroleid() == 666 || this.role.getroleid() == 555) {
      await this.showProfileReseller();
      await this.showResellerName();
    }
  }

  async initiallist() {
    this.loading = true;
    let result = await this.reportser.resellerRevenueShare(
      {
        index: (this.page - 1) * this.limit,
        limit: this.limit,
        bus_id: this.bus_name,
        pay_through: this.pay_through,
        groupid: this.group_name,
        resel_id: this.res_name,
        uid: this.cust_name,
        inv_no: this.invoice_num,
        invtype: this.inv_type,
        start_date: this.start_date,
        end_date: this.end_date,
        role: this.resel_type
      })
    // console.log('result', result)
    if (result) {
      this.loading = false;
      this.data = result[0];
      this.count = result[1]['tot'];
      this.invamnt = result[1]['totamt'];
      this.taxamount = result[1]['tax_amount'];
      this.isp_amt = result[1]['isp_amount'];
      this.subisp_amt = result[1]['sub_isp_amount'];
      this.subdist_amt = result[1]['sub_dist_amount'];
      this.resel_amt = result[1]['reseller_amount'];

      this.setPage();
    } else this.loading = false;

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
    let res = await this.reportser.resellerRevenueShare({
      bus_id: this.bus_name,
      pay_through: this.pay_through,
      groupid: this.group_name,
      resel_id: this.res_name,
      uid: this.cust_name,
      inv_no: this.invoice_num,
      invtype: this.inv_type,
      start_date: this.start_date,
      end_date: this.end_date,
      role: this.resel_type
    })
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        param['INVOICE NO'] = temp[i]['billno']
        if (this.role.getroleid() > 777) {
          param['ISP Name'] = temp[i]['busname'];
        }

        param['RESELLER NAME'] = temp[i]['company'];
        param['USER ID'] = temp[i]['cust_profile_id']
        param['RENEWED SERVICE'] = temp[i]['srvname'];
        param['INVOICE DATE'] = this.datePipe.transform(temp[i]['c_date'], 'd MMM y hh:mm:ss a')

        param['INTERNET ISP %'] = Number(temp[i]['isp_per']).toFixed(2) + " " + '%';
        param['INTERNET SUBISP %'] = Number(temp[i]['sub_isp_per']).toFixed(2) + " " + '%';
        param['INTERNET SUBDIST %'] = Number(temp[i]['sub_dist_per']).toFixed(2) + " " + '%';
        param['INTERNET RESELLER %'] = Number(temp[i]['reseller_per']).toFixed(2) + " " + '%';
        param['INTERNET ISP ₹'] = temp[i]['isp_amt'];
        param['INTERNET SUBISP ₹'] = temp[i]['sub_isp_amt'];
        param['INTERNET SUBDIST ₹'] = temp[i]['sub_dist_amt'];
        param['INTERNET RESELLER ₹'] = temp[i]['resel_amt'];

        param['VOICE ISP %'] = Number(temp[i]['Visp_share']).toFixed(2) + " " + '%';
        param['VOICE SUBISP %'] = Number(temp[i]['Vsub_isp_share']).toFixed(2) + " " + '%';
        param['VOICE SUBDIST %'] = Number(temp[i]['Vsub_dist_share']).toFixed(2) + " " + '%';
        param['VOICE RESELLER %'] = Number(temp[i]['Vreseller_share']).toFixed(2) + " " + '%';
        param['VOICE ISP ₹'] = temp[i]['Visp_amt'];
        param['VOICE SUBISP ₹'] = temp[i]['Vsub_isp_amt'];
        param['VOICE SUBDIST ₹'] = temp[i]['Vsub_dist_amt'];
        param['VOICE RESELLER ₹'] = temp[i]['Vreseller_amt'];

        param['OTT ISP %'] = Number(temp[i]['Oisp_share']).toFixed(2) + " " + '%';
        param['OTT SUBISP %'] = Number(temp[i]['Osub_isp_share']).toFixed(2) + " " + '%';
        param['OTT SUBDIST %'] = Number(temp[i]['Osub_dist_share']).toFixed(2) + " " + '%';
        param['OTT RESELLER %'] = Number(temp[i]['Oreseller_share']).toFixed(2) + " " + '%';
        param['OTT ISP ₹'] = temp[i]['Oisp_amt'];
        param['OTT SUBISP ₹'] = temp[i]['Osub_isp_amt'];
        param['OTT SUBDIST ₹'] = temp[i]['Osub_dist_amt'];
        param['OTT RESELLER ₹'] = temp[i]['Oreseller_amt'];

        param['ADDON ISP %'] = Number(temp[i]['AONisp_share']).toFixed(2) + " " + '%';
        param['ADDON SUBISP %'] = Number(temp[i]['AONsub_isp_share']).toFixed(2) + " " + '%';
        param['ADDON SUBDIST %'] = Number(temp[i]['AONsub_dist_share']).toFixed(2) + " " + '%';
        param['ADDON RESELLER %'] = Number(temp[i]['AONreseller_share']).toFixed(2) + " " + '%';
        param['ADDON ISP ₹'] = temp[i]['AONisp_amt'];
        param['ADDON SUBISP ₹'] = temp[i]['AONsub_isp_amt'];
        param['ADDON SUBDIST ₹'] = temp[i]['AONsub_dist_amt'];
        param['ADDON RESELLER ₹'] = temp[i]['AONreseller_amt'];

        param['RENEWAL TYPE'] = temp[i]['pay_through'] == 1 ? 'Manual' : temp[i]['pay_through'] == 2 ? 'Scheduled' : temp[i]['pay_through'] == 3 ? 'Through Gateway By Subscriber' : 'Scheduled By Subscriber';
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Reseller Revenue Share Report' + EXCEL_EXTENSION);
    }
  }



}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BusinessService, RoleService, PagerService, ResellerService, CustService, ReportService } from '../../_service/indexService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-topupreport',
  templateUrl: './topupreport.component.html',
  styleUrls: ['./topupreport.component.scss']
})
export class TopupreportComponent implements OnInit {
  submit: boolean = false; invdata; total; bus; bus_name; config;
  res1; res_name; custname; cust_name; search;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(
    private route: Router,
    private ser: BusinessService,
    public role: RoleService,
    public pageservice: PagerService,
    private nasmodel: NgbModal,
    private reselser: ResellerService,
    private custser: CustService,
    private datePipe: DatePipe,
    private reportser: ReportService
  ) { }

  async ngOnInit() {
    await this.initiallist();
    await this.showBusName();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      this.showResellerName()
      if(this.role.getroleid() <= 444) this.showUser();
    }
  }

  async showBusName($event = '') {
    this.bus = await this.ser.showBusName({ like: $event });
  }


  async showResellerName($event = '') {
    this.res1 = await this.reselser.showResellerName({ bus_id: this.bus_name, except: 1, like: $event })
  }
  async showUser($event = '') {
    this.custname = await this.custser.showUser({ bus_id: this.bus_name, resel_id: this.res_name, like: $event })
  }

  viewCust(userid) {
    localStorage.setItem('details', JSON.stringify(userid));
    this.route.navigate(['/pages/cust/viewcust']);
  }


  async initiallist() {
    this.loading = true;
    let result = await this.reportser.topupReport(
      {
        index: (this.page - 1) * this.limit,
        limit: this.limit,
        bus_id: this.bus_name,
        resel_id: this.res_name,
        uid: this.cust_name,
      })
    // console.log("result")
    this.loading = false;
    if (result) {
      this.invdata = result[0];
      this.total = result[1]["count"];
      this.setPage()
    }
  }

  async refresh() {
    this.bus_name = ''; this.res_name = ''; this.cust_name = '';
    await this.initiallist();
  }

  async download() {
    this.loading = true;
    let res = await this.reportser.topupReport(
      {
        bus_id: this.bus_name,
        resel_id: this.res_name,
        uid: this.cust_name,
      })
    this.loading = false;
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        param['ID'] = temp[i]['id'];
        if (this.role.getroleid() > 777) param['BUSINESS NAME'] = temp[i]['busname'];

        param['RESELLER TYPE'] = temp[i]['role'] == 444 ? 'Bulk Reseller' : temp[i]['role'] == 333 ? 'DepositReseller' : '--';
        param['RESELLER COMPANY'] = temp[i]['company'];
        param['PROFILE ID'] = temp[i]['cust_profile_id'];
        param['TOPUP NAME'] = temp[i]['top_name'];
        param['LIMIT'] = temp[i].limit + " " + (temp[i].limit_size == 1 ? 'MB' : temp[i].limit_size == 2 ? 'GB' : temp[i].limit_size == 3 ? 'TB' :
          'PB');
        param['TAX TYPE'] = temp[i]['tax_type'] == 0 ? 'Inclusive' : 'Exclusive';
        param['PRICE'] = temp[i]['top_amt'];

        param['PAY STATUS'] = temp[i]['pay_status'] == 1 ? 'Not Paid' : 'Paid';
        param['PAY DATE'] = !temp[i]['paydate'] ? '--' : (this.datePipe.transform(temp[i]['paydate'], 'dd-MM-yyyy hh:mm:ss a'));
        param['ISP AMOUNT'] = temp[i]['isp_share'];
        param['RESELLER AMOUNT'] = temp[i]['reseller_share'];
        param['TOPUP BY'] = temp[i]['managername'];
        param['TOPUP DATE'] = !temp[i]['cdate'] ? '--' : (this.datePipe.transform(temp[i]['cdate'], 'dd-MM-yyyy hh:mm:ss a'));


        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'TopupReport' + EXCEL_EXTENSION);
    }
  }



  getlist(page) {
    var total = Math.ceil(this.total / this.limit);
    let result = this.pageservice.pageValidator(this.page, page, total);
    this.page = result['value'];
    if (result['result']) {
      this.initiallist();
    }
  }

  setPage() {
    // console.log(this.data);
    this.pager = this.pageservice.getPager(this.total, this.page, this.limit);
    this.pagedItems = this.invdata;
  }

  changeclear(item) {
    if (item == 1) {
      this.res_name = ''; this.cust_name = '';
    }
    if (item == 2) {
      this.cust_name = '';
    }

  }



}






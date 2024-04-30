import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RoleService, BusinessService, PagerService, ReportService, ResellerService,AccountService } from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { DatePipe } from '@angular/common';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';


@Component({
  selector: 'listbalancelog',
  templateUrl: './listbalancelog.component.html',
  styleUrls: ['./listbalancelog.component.scss']
})

export class ListBalanceLogComponent implements OnInit {
  tot; proid; custlog; search; bus_name = ''; resel_type = ''; res_name = '';
  bus; pro; res1;start_date;end_date;reasondata;deposit_reason = '';

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  pager: any = {}; page: number = 1; pagedItems: any = []; limit = 25;
  constructor(
    private router: Router,
    private repser: ReportService,
    private busser: BusinessService,
    private resser: ResellerService,
    public role: RoleService,
    public pageservice: PagerService,
    private datePipe: DatePipe,
    private ser: AccountService,

  ) { }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event });
  }

  async profile($event = '') {
    this.pro = await this.resser.showProfileReseller({ dep_role: 1,dep:1, bus_id: this.bus_name, like: $event })
    // console.log(res)
  }

  async showResellerName($event = '') {
    // console.log('inside', this.resel_type)
    this.res1 = await this.resser.showResellerName({ bus_id: this.bus_name, role: this.resel_type, like: $event });
    // console.log("resellername",result)
  }
  async showreason() {
    this.reasondata = await this.ser.showDepReason()
  }
  changeclear(item) {
    if (item == 1) {
      this.resel_type = ''; this.res_name = '';
    }
    if (item == 2) { this.res_name = ''; }
  }
  async refresh() {
    this.bus_name = '';
    this.resel_type = '';
    this.res_name = ''; this.pro = ''; this.res1 = '';this.start_date='';this.end_date='';
    this.deposit_reason = '';
    await this.initiallist();
    if (this.role.getroleid() == 666 || this.role.getroleid() == 555) {
      await this.profile();
      await this.showResellerName();
    }
  }

  async ngOnInit() {
    localStorage.removeItem('array');
    await this.initiallist();
    await this.showBusName();
    await this.showreason();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.profile();
      await this.showResellerName();
    }
  }

  async initiallist() {
    console.log('start',this.start_date,this.end_date,this.deposit_reason)
    this.loading = true;
    let result = await this.repser.listBalanceLog(
      {
        index: (this.page - 1) * this.limit,
        limit: this.limit,
        bus_id: this.bus_name,
        role: this.resel_type,
        resel_id: this.res_name,
        start_date: this.start_date,
        end_date:this.end_date,
        deposit_reason:this.deposit_reason,
      });
    // console.log("balancelog",result)
    if (result) {
      this.custlog = result[0];
      this.tot = result[1]['count']
    }
    this.loading = false;
    this.setPage();
  }

  getlist(page) {
    var total = Math.ceil(this.tot / this.limit);
    let result = this.pageservice.pageValidator(this.page, page, total);
    this.page = result['value'];
    if (result['result']) {
      this.initiallist();
    }
  }

  setPage() {
    // console.log(this.data);
    this.pager = this.pageservice.getPager(this.tot, this.page, this.limit);
    this.pagedItems = this.custlog;
    // console.log('asdfg',this.pagedItems)
  }

  async download() {
    this.loading = true;
    let res = await this.repser.listBalanceLog({
      bus_id: this.bus_name,
      role: this.resel_type,
      resel_id: this.res_name,
      start_date: this.start_date,
      end_date:this.end_date,
      deposit_reason:this.deposit_reason,
    })
    if (res) {
      this.loading = false;
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        if (this.role.getroleid() > 777) {
          param['ISP NAME'] = temp[i]['busname'];

        }
        if (this.role.getroleid() >= 775 || this.role.getroleid() > 444) {
          param['RESELLER TYPE'] = temp[i]['role'] ==333? 'Deposit Reseller': temp[i]['role'] ==332? 'Deposit Employee':temp[i]['role']==555? 'Sub ISP Deposit':
          temp[i]['role']==554?'Sub ISP Deposit Employee': temp[i]['role']==551? 'Sub Distributor Deposit': temp[i]['role'] ==550? 'Sub  Distributor Deposit Employee': '--';
          param['RESELLER BUSINESS NAME'] = temp[i]['company'];
        }
        param['BEFORE AMOUNT'] = temp[i]['before_balance_amt'];
        param['AMOUNT'] = temp[i]['amt'];
        param['REASON'] = temp[i]['reason'];
        param['BALANCE'] = Number(temp[i]['before_balance_amt']) + Number(temp[i]['amt']);
        param['NOTES'] = temp[i]['rnote'] == null ? '--' : temp[i]['rnote'];
        param['DATE'] = this.datePipe.transform(temp[i]['c_date'], 'd MMM y hh:mm:ss a');
        param['PERFORMED BY'] = temp[i]['cname'];
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Deposit Report' + EXCEL_EXTENSION);
    }else{
      this.loading = false;
    }
  }
 
}
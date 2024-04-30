import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RoleService, AdminuserService, CustService, BusinessService, SelectService, PagerService, UserLogService, ResellerService } from '../../_service/indexService';
import { DatePipe } from '@angular/common';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'listresellersharelog',
  templateUrl: './listresellersharelog.component.html',
  styleUrls: ['./listresellersharelog.component.scss']
})

export class ListResellerShareLogComponent implements OnInit {
  tot; proid; custlog; search; bus_name = ''; resel_type = ''; res_name = '';
  bus; pro; res1;

  pager: any = {}; page: number = 1; pagedItems: any = []; limit = 25;
  constructor(
    private router: Router,
    private select: SelectService,
    private repser: UserLogService,
    private custser: CustService,
    private busser: BusinessService,
    private resser: ResellerService,
    public role: RoleService,
    public pageservice: PagerService,
    private datePipe: DatePipe

  ) { }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event });
  }

  async profile($event = '') {
    this.pro = await this.resser.showProfileReseller({ dep_role: 1, bus_id: this.bus_name, like: $event })
    // console.log(res)
  }

  async showResellerName($event = '') {
    // console.log('inside', this.resel_type)
    this.res1 = await this.resser.showResellerName({ role: this.resel_type, like: $event });
    // console.log("resellername",result)
  }

  async refresh() {
    this.bus_name = '';
    this.resel_type = '';
    this.res_name = '';
    await this.initiallist();
  }

  async ngOnInit() {
    localStorage.removeItem('array');
    await this.initiallist();
    await this.showBusName();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.profile();
      await this.showResellerName();
    }
  }

  async initiallist() {
    let result = await this.repser.listResellerShareLog(
      {
        index: (this.page - 1) * this.limit,
        limit: this.limit,
        bus_id: this.bus_name,
        role: this.resel_type,
        resel_id: this.res_name
      });
    // console.log(result)
    if (result) {
      this.custlog = result[0];
      this.tot = result[1]['count']
    }
    this.setPage()
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
    let res = await this.repser.listResellerShareLog({})
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        param['ISP NAME'] = temp[i]['busname'];
        param['ISP SHARE'] = temp[i]['isp_share']+" "+'%';
        param['SUB ISP NAME'] = temp[i]['subisp_name'];
        param['SUB ISP SHARE'] = temp[i]['sub_isp_share']+" "+'%';
        param['SUB DIST NAME'] = temp[i]['subdist_name'];
        param['SUB DIST SHARE'] = temp[i]['sub_dist_share']+" "+'%';
        param['RESELLER NAME'] = temp[i]['res_company'];
        param['RESELLER SHARE'] = temp[i]['res_share']+" "+'%';
        temp[i]['date'] = this.datePipe.transform(temp[i]['cdate'], 'd MMM y h:mm:ss a')
        param['DATE'] = temp[i]['date'];
        param['LOGIN BY'] = temp[i]['cby_name'];

        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Reseller Share Log' + EXCEL_EXTENSION);
    }
  }

  // Edit_User(item) {
  //   localStorage.setItem('array', JSON.stringify(item));
  //   this.router.navigate(['/pages/business/edit-business']);
  // }
}
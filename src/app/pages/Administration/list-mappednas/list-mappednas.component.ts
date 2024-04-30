import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RoleService, NasService, CustService, BusinessService, PagerService, GroupService, ResellerService, } from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';


@Component({
  selector: 'list-mappednas',
  templateUrl: './list-mappednas.component.html',
  styleUrls: ['./list-mappednas.component.scss']
})

export class ListNASmappingComponent implements OnInit {
  tot; proid; custlog; search; res1; bus; group1; group_name;
  bus_name = ''; res_name = ''; resel_flag = '';

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;
  constructor(
    private router: Router,
    private nasser: NasService,
    private custser: CustService,
    public role: RoleService,
    public pageservice: PagerService,
    private busser: BusinessService,
    private grupser: GroupService,
    private reselser: ResellerService,

  ) { }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event });
  }

  async showGroupName($event = '') {
    this.group1 = await this.grupser.showGroupName({ bus_id: this.bus_name, like: $event })
    // console.log("group:", result)
  }


  async showResellerName($event = '') {
    this.res1 = await this.reselser.getResellerName({ bus_id: this.bus_name, groupid: this.group_name, nameflag: this.resel_flag, man_role: 1, like: $event })
    // console.log("resname",this.resell)
    // console.log("resname",this.resell)
  }

  async ngOnInit() {
    localStorage.removeItem('array');
    await this.initiallist();
    await this.showBusName();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.showGroupName();
      await this.showResellerName();
    }
  }
  changeclear(item) {
    if (item == 1) {
      this.group_name = ''; this.resel_flag = ''; this.res_name = '';
    }
    if (item == 2) {
      this.resel_flag = ''; this.res_name = '';
    }
  }

  async refresh() {
    this.bus_name = '';
    this.group_name = '';
    this.resel_flag = '';
    this.res_name = ''; this.group1 = ''; this.res1 = '';
    await this.initiallist();
  }

  async initiallist() {
    this.loading = true;
    let result = await this.nasser.listresellernas(
      {
        index: (this.page - 1) * this.limit,
        limit: this.limit,
        bus_id: this.bus_name,
        groupid: this.group_name,
        resel_id: this.res_name,
      });
    // console.log(result)
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
    let res = await this.nasser.listresellernas({
      bus_id: this.bus_name,
      groupid: this.group_name,
      resel_id: this.res_name,
    })
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        if (this.role.getroleid() > 777) {
          param['ISP NAME'] = temp[i]['busname'];
        }
        if (this.role.getroleid() >= 775) {
          param['CIRCLE'] = temp[i]['groupname'];
          param['RESELLER BUSINESS NAME'] = temp[i]['company'];
          param['RESELLER NAME'] = temp[i]['rname'];
        }
        param['PRIMARY NAS'] = temp[i]['pnasname'];
        param['PRIMARY NASIP'] = temp[i]['pnasip'];
        param['SECONDARY NAS'] = temp[i]['snasname'] == null ? '--' : temp[i]['snasname'];
        param['SECONDARY NASIP'] = temp[i]['snasip'] == null ? '--' : temp[i]['snasip'];
        param['RESELL ADDRESS'] = temp[i]['address'];
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Nas MappingReport' + EXCEL_EXTENSION);
    }
  }

  // Edit_User(item) {
  //   localStorage.setItem('array', JSON.stringify(item));
  //   this.router.navigate(['/pages/business/edit-business']);
  // }
}
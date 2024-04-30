import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import { ResellerService, GroupService, BusinessService, RoleService, PagerService } from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'list-branch',
  templateUrl: './list-branch.component.html',
  styleUrls: ['./list-branch.component.scss']
})

export class ListBranchComponent implements OnInit {
  submit: boolean = false; groups; count; search; bus_name = ''; bus_loc; reseller_name;
  bus; group1; resell; group_name; res_name; branches; branch_name = '';

  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;
  constructor(
    private route: Router,
    private ser: ResellerService,
    private groupser: GroupService,
    private busser: BusinessService,
    public role: RoleService,
    public pageservice: PagerService,

  ) { }

  async ngOnInit() {
    localStorage.removeItem('Array');
    await this.showBusName();
    await this.initiallist();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.showGroupName();
      await this.showReseller();
      await this.showbranch();
    }
    if (this.role.getroleid() < 775) {
      this.group_name = this.role.getgrupid();
     
    }
  }

  async showbranch($event = '') {
    this.branches = await this.ser.showResellerBranch({ resel_id: this.res_name, like: $event });
    // console.log('branch',this.branches)
  }

  async showBusName($event = '') {

    this.bus = await this.busser.showBusName({ like: $event });
  }

  async showGroupName($event = '') {
    this.group1 = await this.groupser.showGroupName({ bus_id: this.bus_name, like: $event });
  }

  async showReseller($event = '') {
    this.resell = await this.ser.showResellerName({ res_Search:1,bus_id: this.bus_name, groupid: this.group_name, like: $event });
    // console.log("resell",res)
  }

  changeclear(item){
    if(item == 1){
      this.group_name='';
      this.res_name='';
      this.branch_name='';
    }
    if(item == 2){
      this.res_name='';
      this.branch_name='';
    }
  }

  async refresh() {
    this.bus_name='';
    this.group_name='';
    this.res_name='';
    this.branch_name='';
    this.group1='';
    this.resell='';
    this.branches='';
    if(this.role.getroleid()<=777){
      await this.showGroupName();
      await this.showReseller();
      await this.showbranch();
    }
    await this.initiallist();
  }

  async initiallist() {
    let result = await this.ser.listResBranch({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      bus_id: this.bus_name,
      groupid: this.group_name,
      resel_id: this.res_name,
      res_branch: this.branch_name,
    });
    if (result) {
      this.groups = result[0];
      this.count = result[1]['count'];
      this.setPage();
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
    this.pagedItems = this.groups;
  }

  async download() {
    let res = await this.ser.listResBranch({
      bus_id: this.bus_name,
      groupid: this.group_name,
      resel_id: this.res_name,
      res_branch: this.branch_name,
    });
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        if (this.role.getroleid() > 777) {
          param['ISP NAME'] = temp[i]['busname'];
        }
        if (this.role.getroleid() >= 775) {
          param['CIRCLE'] = temp[i]['groupname'];
        }
        param['RESELLER BUSINESS NAME'] = temp[i]['company'];
        param['BRANCH NAME'] = temp[i]['branch'];
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Reseller Branch List' + EXCEL_EXTENSION);
    }
  }

}
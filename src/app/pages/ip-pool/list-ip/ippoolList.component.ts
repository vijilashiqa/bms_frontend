import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  SelectService, IppoolService, BusinessService,
  GroupService, NasService, RoleService, PagerService
} from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'list-ip',
  templateUrl: './ippoolList.component.html',
  styleUrls: ['./ippoolList.component.scss']
})

export class ListIpPoolComponent implements OnInit {
  data; totalpage = 10; pages = [1, 2, 3, 4, 5]; count;
  bus; bus_name = ''; group1;
  group_name = ''; nas1; nasname = ''; ippool1; ippool_name = ''; search;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;

  constructor(
    private router: Router,
    private pool: IppoolService,
    private select: SelectService,
    private busser: BusinessService,
    private groupser: GroupService,
    private nasser: NasService,
    public role: RoleService,
    public pageservice: PagerService,

  ) { }

  async ngOnInit() {
    // localStorage.removeItem('array');
    await this.initiallist();
    await this.showBusName();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.showGroupName();
      await this.showGroupNas();
      await this.showIppoolName();
    }
    if (this.role.getroleid() < 775) {
      this.group_name = this.role.getgrupid();
      await this.showGroupNas();
      await this.showIppoolName();
    }
  }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event });
    // console.log(result)
  }

  async showGroupName($event = '') {
    this.group1 = await this.groupser.showGroupName({ bus_id: this.bus_name, like: $event });
    // console.log("group:", result)
  }

  async showGroupNas($event = '') {
    this.nas1 = await this.nasser.showGroupNas({ bus_id: this.bus_name, groupid: this.group_name, like: $event });
    // console.log("nas:", result)
  }

  async showIppoolName($event = '') {
    this.ippool1 = await this.pool.showPoolName({ bus_id: this.bus_name, groupid: this.group_name, nas_id: this.nasname, like: $event, ipflag: 1 });
    // console.log("ippoll:", result)
  }

  changeclear(item) {
    if (item == 1) {
      this.group_name = '';
      this.nasname = '';
      this.ippool_name = '';
    }
    if (item == 2) {
      this.nasname = '';
      this.ippool_name = '';
    }

  }


  async refresh() {
    this.bus_name = '';
    this.group_name = '';
    this.nasname = '';
    this.ippool_name = '';
    this.group1 = '';
    this.nas1 = '';
    this.ippool1 = '';
    await this.initiallist();
  }

  async initiallist() {
    let result = await this.pool.listIppool(
      {
        index: (this.page - 1) * this.limit,
        limit: this.limit,
        bus_id: this.bus_name,
        groupid: this.group_name,
        nasid: this.nasname,
        poolid: this.ippool_name,
      });
    // console.log("result")
    if (result) {
      this.data = result[0];
      this.count = result[1]["count"];
      // console.log("naslist : ", result)
      this.setPage();
    }
  }

  async download() {
    let res = await this.pool.listIppool({
    });
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        if (this.role.getroleid() > 777) {
          param['ISP NAME'] = temp[i]['busname'];
        }
        if (this.role.getroleid() >= 775) {
          param['CIRCLE'] = temp[i]['groupname']
        }
        param['NAS NAME'] = temp[i]['shortname'];
        param['POOL NAME'] = temp[i]['name'];
        param['FIRST IP'] = temp[i]['fromip'];
        param['LAST IP'] = temp[i]['toip'];
        param['NEXT POOL'] = temp[i]['nextoolid'];
        param['DESCRIPTION'] = temp[i]['descr'];

        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'IPPool List' + EXCEL_EXTENSION);
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
    // console.log('asdfg',this.pagedItems)
  }

}
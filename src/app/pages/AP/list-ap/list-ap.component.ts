import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APService, SelectService, BusinessService, GroupService, RoleService } from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'list-ap',
  templateUrl: './list-ap.component.html',
  styleUrls:['./list-ap.component.scss']
})
export class ListAPComponent implements OnInit {
  submit: boolean = false; groups; total; bus;
  group1; bus_name; group_name; groupids;
  datas; count; ip1; ap1; ap_name; ip_add; apid; ipaddids; search; bus_id; groupid;
  constructor(
    private router: Router,
    private ap: APService,
    private select: SelectService,
    private busser: BusinessService,
    private groupser: GroupService,
    public role: RoleService
  ) { }

  async ngOnInit() {
    localStorage.removeItem('array');
    await this.initiallist();
    await this.showBusName();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.showGroupName();
      await this.showApName();
      await this.showip();
    }
    if (this.role.getroleid() < 775) {
      this.group_name = this.role.getgrupid();
      await this.showApName();
      await this.showip();
    }
  }
  changeclear(item){
    if(item==1){
      this.group_name='';
      this.ap_name='';
      this.ip_add='';
    }
    if(item==2){
      this.ap_name='';
      this.ip_add='';
     }
     

  }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event })
  }

  async showGroupName($event = '') {
    this.group1 = await this.groupser.showGroupName({ bus_id: this.bus_name, like: $event })
  }

  async showApName($event = '') {
    this.ap1 = await this.ap.showApName({ bus_id:this.bus_name,groupid: this.group_name, like: $event })
    // console.log("AP",result)
  }

  async showip($event = '') {
    this.ip1 = await this.ap.showip({ bus_id:this.bus_id, groupid:this.group_name,apid: this.ap_name, like: $event })
    // console.log("IP",result)
  }

  async refresh() {
    this.bus_name='';
    this.group_name='';
    this.ap_name='';
    this.ip_add='';
    this.group1='';
    this.ap1='';
    this.ip1='';
    await this.initiallist();
  }

  async initiallist() {
    let result = await this.ap.listap(
      {
        bus_id: this.bus_name,
        groupid: this.group_name,
        apid: this.ap_name,
        ip: this.ip_add,
      })
    if (result) {
      this.datas = result[0];
      this.total = result[1]["count"];
    }
  }

  async download(){
    let res = await this.ap.listap({
    });
    if (res) {
       let tempdata = [], temp: any = res[0];
       for (var i = 0; i < temp.length; i++) {
          let param = {};
          param['NAME'] = temp[i]['name'];
          param['IP ADDRESS'] = temp[i]['ip'];
          temp[i]['mode'] = temp[i]['accessmode']==0 ? 'SNMP':'Mikrotik API';
          param['ACCESS MODE'] = temp[i]['mode'];
          param['SNMP COMMUNITY'] = temp[i]['community'];
          param['API USERNAME'] = temp[i]['apiusername'];
          param['DESCRIPTION'] = temp[i]['description'];

          tempdata[i] = param
       }
       const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
       const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
       JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
       JSXLSX.writeFile(wb, 'Access Point List' + EXCEL_EXTENSION);
    }
  }

}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import { ResellerService, GroupService, BusinessService, RoleService, PagerService, DashboardService } from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'listagrement',
  templateUrl: './listagrement.component.html',
  styleUrls: ['./listagrement.component.scss']
})

export class ListAgreementExpomponent implements OnInit {
  submit: boolean = false; datas; count; search; bus_name = ''; bus_loc; reseller_name;
  bus; group1; resell; group_name; res_name; branches; branch_name = '';start_date='';end_date='';

  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;
  constructor(
    private route: Router,
    private ser: ResellerService,
    private groupser: GroupService,
    private busser: BusinessService,
    public role: RoleService,
    public pageservice: PagerService,
    private dashser : DashboardService,
    private datePipe : DatePipe

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
  }

  async showBusName($event = '') {

    this.bus = await this.busser.showBusName({ like: $event });
  }

  async showGroupName($event = '') {
    this.group1 = await this.groupser.showGroupName({ bus_id: this.bus_name, like: $event });
  }

  async showReseller($event = '') {
    if(this.role.getroleid()>=775){
      this.resell = await this.ser.showResellerName({ res_Search:1,bus_id: this.bus_name, groupid: this.group_name, like: $event });
      // console.log("resell",res)
    }else{
      this.resell = await this.ser.showResellerName({ like: $event });
      // console.log("resell",res)
    }
    
  }

  changeclear(item){
    if(item == 1){
      this.group_name='';
      this.res_name='';
      this.start_date='';
      this.end_date='';
    }
    if(item == 2){
      this.res_name='';
      this.start_date='';
      this.end_date='';
    }
    if(item == 3){
      this.start_date='';
      this.end_date='';
    }
  }

  async refresh() {
    this.bus_name='';
    this.group_name='';
    this.res_name='';
    this.start_date='';
    this.end_date='';
    this.group1='';
    this.branches='';
    this.resell='';
    if(this.role.getroleid()<=777){
      await this.showGroupName();
    }
    await this.initiallist();
  }

  async initiallist() {
    let result = await this.ser.listAggExp({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      bus_id: this.bus_name,
      groupid: this.group_name,
      resel_id: this.res_name,
      start_date: this.start_date,
      end_date: this.end_date,
    });
    if (result) {
      // console.log(result)
      this.datas = result[0];
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
    this.pagedItems = this.datas;
    // console.log("agre",this.pagedItems);
    
  }

  async download() {
    let res = await this.ser.listAggExp({
      bus_id: this.bus_name,
      groupid: this.group_name,
      resel_id: this.res_name,
      start_date: this.start_date,
      end_date: this.end_date,
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
        param['RESELLER TYPE'] = temp[i]['role'] == 444 ? 'Bulk Resellre' : temp[i]['role'] == 333 ? 'Deposit Reseller' : temp[i]['role'] == 666 ? 'Sub ISP Bulk' :
        temp[i]['role'] == 555 ? 'Sub ISP Deposit' : temp[i]['role'] == 551 ? 'Sub Distributor Deposit' : temp[i]['role'] == 661 ? 'Sun Distributor Bulk' : 'Hotel';
        param['RESELLER NAME'] = temp[i]['reseller_name'];
        param['BUSINESS NAME'] = temp[i]['company']
        param['ADDRESS'] = temp[i]['address'];
        param['MOBILE'] = temp[i]['mobile'];
        temp[i]['st_date'] = this.datePipe.transform(temp[i]['start_date'],'d MMM y hh:mm:ss a')
        param['START DATE'] = temp[i]['st_date'];
        temp[i]['en_date'] = this.datePipe.transform(temp[i]['end_date'],'d MMM y hh:mm:ss a')
        param['END DATE'] = temp[i]['en_date'];

        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Reseller Agrement ExpiryList' + EXCEL_EXTENSION);
    }
  }

}
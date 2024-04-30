import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import { GroupService, SelectService, BusinessService, RoleService ,PagerService, AdminuserService} from '../../_service/indexService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { AddOTTComponent } from '../add-ott/add-ott.component';

@Component({
  selector: 'list-ottauth',
  templateUrl: './list-ottauth.component.html',
  styleUrls:['./list-ottauth.component.scss']

})

export class ListOTTAuthComponent implements OnInit {
  submit: boolean = false; groups; total; bus;ott_name='';
  group1; bus_name=''; group_name=''; groupid; search; config;ottdata;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;
  constructor(
    private route: Router,
    private group: GroupService,
    private ser: BusinessService,
    private adminser : AdminuserService,
    public role: RoleService,
    public pageservice: PagerService,
    private nasmodel: NgbModal,


  ) { }

  async ngOnInit() {
    localStorage.removeItem('Array');
    await this.initiallist();
    await this.showBusName();
    if (this.role.getroleid() == 777) {
      this.bus_name = this.role.getispid();
      await this.showGroupName();
    }
  }

  async showBusName($event = '') {
    this.bus = await this.ser.showBusName({ like: $event });
    // console.log(result)
  }

  async showGroupName($event = '') {
    this.group1 = await this.group.showGroupName({ bus_id: this.bus_name, like: $event });
    // console.log("group:", result)
  }

  async showott($event='') {
    this.ottdata = await this.adminser.showOTTPlatforms({ like:$event,bus_id:this.bus_name,groupid:this.group_name })
  }

  changeclear(item){
    if(item == 1){
      this.group_name = '';
      this.ott_name = '';
    }
  }

  async refresh(){
    this.bus_name='';
    this.group_name='';
    this.ott_name='';
    this.group1='';
    this.ottdata='';
    await this.initiallist();
  }

  async initiallist() {
    let result = await this.adminser.listOTTService(
      {
        index: (this.page - 1) * this.limit,
        limit: this.limit,
        bus_id: this.bus_name,
        groupid: this.group_name,
        ott_platform:this.ott_name,
      })
    // console.log("result")
    if (result) {
      this.groups = result[0];
      this.total = result[1]["count"];
      this.setPage()
      // console.log("grouplist : ", result)
      // console.log("length:", this.groups.length)
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
    this.pagedItems = this.groups;
  }

  Add_OTT() {
    const activeModal = this.nasmodel.open(AddOTTComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Add OTT';
    activeModal.result.then((data) => {
      this.initiallist();
    });
  }


  async download() {
    let res = await this.group.listgroup({
      bus_id: this.bus_name,
      groupid: this.group_name,
      ott_platform:this.ott_name,
    })
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        param['BUSINESS NAME'] = temp[i]['busname'];
        param['GROUP NAME'] = temp[i]['groupname'];
        param['DESCRIPTION'] = temp[i]['descr'];
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Group List' + EXCEL_EXTENSION);
    }
  }

}

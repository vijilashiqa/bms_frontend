import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RoleService, BusinessService, ResellerService, PagerService, S_Service, GroupService } from '../../_service/indexService';
import { TopupReselcountComponent } from '../topupresount/resel-count.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'list-topup',
  templateUrl: './list-topup.component.html',
  styleUrls: ['./list-topup.component.scss']
})

export class ListTopupComponent implements OnInit {
  count; bus; busid; bus_loc; state_id; state; search; pro; res1; topupdata;
  datas; group1;
  bus_name = ''; res_name = ''; group_name = ''; toup_name = '';
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;
  constructor(
    private router: Router,
    private ser: BusinessService,
    private groupser: GroupService,
    private resser: ResellerService,
    private packser: S_Service,
    public role: RoleService,
    public pageservice: PagerService,
    private nasmodel: NgbModal,

  ) { }

  async showBusName($event = '') {
    this.bus = await this.ser.showBusName({ like: $event });

  }

  async showGroupName($event = '') {
    this.group1 = await this.groupser.showGroupName({ bus_id: this.bus_name, like: $event })
    // console.log("group:", result)
  }

  async profile($event = '') {
    if (this.role.getroleid() > 777) {
      this.pro = await this.resser.showProfileReseller({ bus_id: this.bus_name, like: $event });
      // console.log(res)
    }
    if (this.role.getroleid() <= 777) {
      this.pro = await this.resser.showProfileReseller({ like: $event });
      // console.log(result)
    }
  }

  async showResellerName($event = '') {
    // console.log('inside', this.resel_type)
    this.res1 = await this.resser.showResellerName({ bus_id: this.bus_name, group_id: this.group_name, like: $event });
    // console.log("resellername",result)
  }

  async showtopup($event = '') {
    this.topupdata = await this.packser.showTopup({ bus_id: this.bus_name, groupid: this.group_name, like: $event })
  }

  async ngOnInit() {
    localStorage.removeItem('topid');
    await this.showBusName();
    if (this.role.getroleid() <= 777) {
      await this.showGroupName();
      await this.showResellerName();
    }
    if (this.role.getroleid() < 775) {
      this.group_name = this.role.getgrupid();
    }
    await this.initiallist();
  }

  changeclear(item) {
    if (item == 1) {
      this.group_name = '';
      this.res_name = '';
      this.toup_name = '';
    }
    if (item == 2) {
      this.res_name = '';
      this.toup_name = '';
    }
  }

  async refresh() {
    this.bus_name = '';
    this.group_name = '';
    this.res_name = '';
    this.toup_name = '';
    this.group1 = '';
    this.res1 = '';
    this.topupdata = '';
    if (this.role.getroleid() <= 777) {
      await this.showGroupName();
      await this.showResellerName();
    }
    await this.initiallist();
  }

  async initiallist() {
    let result = await this.packser.listTopup({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      bus_id: this.bus_name,
      group_id: this.group_name,
      resel_id: this.res_name,
      top_id: this.toup_name,
    });
    this.datas = result[0];
    this.count = result[1]['count']
    if (result) {
      this.setPage()
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
    // console.log('asdfg',this.pagedItems)
  }

  Edit_topup(item) {
    localStorage.setItem('topid', JSON.stringify(item));
    this.router.navigate(['/pages/service/edit-topup']);
  }
  async reselcount(item) {
    let result = await this.resser.showResellerName({ top_id: item });
    await this.reselcountshow(result)
  }

  reselcountshow(data) {
    const activeModal = this.nasmodel.open(TopupReselcountComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Reseller Count';
    activeModal.componentInstance.item = data;
    activeModal.result.then((data) => {
      // this.initiallist();
    });
  }

  async download() {
    let res = await this.ser.listbusiness({
      bus_id: this.bus_name,
      groupid: this.group_name,
      resel_id: this.res_name,
      top_id: this.toup_name
    })
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        param['BUSINESS NAME'] = temp[i]['busname'];
        param['SERVICE TYPE'] = temp[i]['service_name'];
        param['FIRST NAME'] = temp[i]['firstname'];
        param['LAST NAME'] = temp[i]['lastname'];
        param['STATE'] = temp[i]['state'];
        param['CITY'] = temp[i]['city'];
        param['MOBILE NUMBER'] = temp[i]['mobile'];
        param['LANDLINE NUMBER'] = temp[i]['phone'];
        param['GST NUMBER'] = temp[i]['gst'];
        param['IGST'] = temp[i]['igst'];
        param['CGST'] = temp[i]['cgst'];
        param['SGST'] = temp[i]['sgst'];
        param['HOT BUCKET'] = temp[i]['hot_bucket'];
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Business List' + EXCEL_EXTENSION);
    }
  }

  Edit_User(item) {
    localStorage.setItem('array', JSON.stringify(item));
    this.router.navigate(['/pages/business/edit-business']);
  }
}
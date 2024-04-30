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
  selector: 'list-ott',
  templateUrl: './list-ott.component.html',
  styleUrls:['./list-ott.component.scss']

})

export class ListOTTComponent implements OnInit {
  submit: boolean = false; groups; total; bus;
  group1; bus_name; group_name; groupid; search; config;
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
  }

  async refresh(){
    await this.initiallist();
  }

  async initiallist() {
    let result = await this.adminser.listOTTPlatforms(
      {
        index: (this.page - 1) * this.limit,
        limit: this.limit,
       
      })
    // console.log("result")
    if (result) {
      this.groups = result[0];
      this.total = result[1]["count"];
      this.setPage()
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
    const activeModal = this.nasmodel.open(AddOTTComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Add OTT';
    activeModal.result.then((data) => {
      this.initiallist();
    });
  }

  Edit_OTT(item){
    const activeModal = this.nasmodel.open(AddOTTComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Edit OTT';
    activeModal.componentInstance.item = item;
    activeModal.result.then((data) => {
      this.initiallist();
    });
  }


  async download() {
    let res = await this.adminser.listOTTPlatforms({
    })
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        param['ID'] = temp[i]['ott_id'];
        param['OTT NAME'] = temp[i]['ott_platform'];
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'OTT List' + EXCEL_EXTENSION);
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import { BusinessService, RoleService, PagerService, AdminuserService, GroupService } from '../../_service/indexService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { OTTPlanComponent } from '../ott-plan/ott-plan.component';
import { OttcountComponent } from '../ottcount/ottcount.component';
import { ngxLoadingAnimationTypes } from 'ngx-loading';


@Component({
  selector: 'list-ottplan',
  templateUrl: './list-ottplan.component.html',
  styleUrls: ['./list-ottplan.component.scss']

})

export class ListOTTPlanComponent implements OnInit {
  submit: boolean = false; ottdata; total; bus; bus_name; config; search; group1; group_name;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25; ottplan_code; ottplandata; ottplan_name; ottplanname;
  status='';days='';ott_vendor='';
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;
  constructor(
    private route: Router,
    private ser: BusinessService,
    private adminser: AdminuserService,
    public role: RoleService,
    public pageservice: PagerService,
    private nasmodel: NgbModal,
    private groupser: GroupService,


  ) { }

  async ngOnInit() {
    localStorage.removeItem('Array');
    await this.initiallist();
    await this.showBusName();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
    }
  }

  async showBusName($event = '') {
    this.bus = await this.ser.showBusName({ like: $event });
    // console.log(result)
  }

  async showGroupName($event = '') {
    this.group1 = await this.groupser.showGroupName({ bus_id: this.bus_name, like: $event });
    // console.log("group",result)
  }

  async showOTTPlanCode($event = '') {
    if (this.bus_name) this.ottplandata = await this.adminser.showOTTPlanCode({ bus_id: this.bus_name, like: $event });
  }

  async showOTTPlanName($event = '') {
    if (this.bus_name) this.ottplanname = await this.adminser.showOTTPlanCode({ bus_id: this.bus_name, olike: $event });
  }

  async refresh() {
    this.bus_name = '';
    this.group_name = '';
    this.ottplan_code = '';
    this.ottplan_name = '';
    this.status='';
    this.days='';
    this.ott_vendor ='';
    await this.initiallist();
  }

  async initiallist() {
    this.loading = true;
    let result = await this.adminser.listOTTPlan(
      {
        index: (this.page - 1) * this.limit,
        limit: this.limit,
        bus_id: this.bus_name,
        ottplan_code: this.ottplan_code,
        ottplan_name: this.ottplan_name,
        status:this.status,
        days:this.days,
        ott_vendor:this.ott_vendor
      })
    // console.log("result")
    this.loading = false
    if (result) {
      this.ottdata = result[0];
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
    this.pagedItems = this.ottdata;
  }

  Add_OTT() {
    const activeModal = this.nasmodel.open(OTTPlanComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Add OTT Plan';
    activeModal.result.then((data) => {
      this.initiallist();
    });
  }

  async ottcount(item) {
    let result = await this.adminser.showOTTPlan({ ottid: item });
    await this.ottcountshow(result)
  }

  ottcountshow(data) {
    const activeModal = this.nasmodel.open(OttcountComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'OTT PLATFORM';
    activeModal.componentInstance.item = data;
    activeModal.result.then((data) => {
      // this.initiallist();
    });
  }


  async download() {
    this.loading = true
    let res = await this.adminser.listOTTPlan({
      bus_id: this.bus_name,
      ottplan_code: this.ottplan_code,
      ottplan_name: this.ottplan_name,
      status:this.status,
      days:this.days,
      ott_vendor:this.ott_vendor
    });
    this.loading = false
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        if (this.role.getroleid() > 777) param['BUSINESS NAME'] = temp[i]['busname'];

        param['OTTPLANNAME'] = temp[i]['ottplan_name'];
        param['OTTPLANCODE'] = temp[i]['ottplancode'];
        param['GLTVCODE'] = temp[i]['gltvplanid'];
        param['VENDOR'] = temp[i]['ott_vendor'] == 1 ? 'M2MIT' : 'PLAYBOX';
        param['TAXTYPE'] = temp[i]['otttaxtype'] == 0 ? 'Inclusive' : 'Exclusive';
        param['TIMEUNIT'] = temp[i]['dayormonth'] == 1 ? temp[i]['days'] + "Days" : temp[i]['days'] + "Months";
        param['AMOUNT'] = temp[i]['ottamount'];
        param['STATUS'] = temp[i]['status'] == 1 ? 'Enable' : 'Disable';

        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Ott_Plan_List' + EXCEL_EXTENSION);
    }
  }

}

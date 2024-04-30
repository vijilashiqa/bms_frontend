import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AccountService, BusinessService,
  ResellerService, RoleService, PagerService
} from '../../_service/indexService';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'openclose-balancelist',
  templateUrl: './openclose-balancelist.component.html',
  styleUrls: ['./openclose-balancelist.component.scss'],
})

export class OpenClosebalanceListComponent implements OnInit {
  submit: boolean = false; data; search; bus_name = ''; bus; res1; res_name = '';
  tot; Download; count; profile; resel_type = '';start_date:any;end_date:any;

  dateformat: string[] = [
    'd MMM y h:mm:ss a',
  ];
  date: Date = new Date();

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;
  constructor(
    private alert: ToasterService,
    private router: Router,
    private ser: AccountService,
    public role: RoleService,
    private busser: BusinessService,
    private reselser: ResellerService,
    public pageservice: PagerService,
    private datePipe: DatePipe
  ) { }

  async ngOnInit() {
    localStorage.removeItem('array');
    await this.showBusName();
    await this.initiallist();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.showProfileReseller();
      await this.showResellerName();
    }
  }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event });
    // console.log(result)
  }

  async showProfileReseller($event = '') {
    this.profile = await this.reselser.showProfileReseller({ bus_id: this.bus_name, dep_role: 1, like: $event });
  }

  async showResellerName($event = '') {
    // console.log('inside', this.resel_type)
    this.res1 = await this.reselser.showResellerName({ bus_id: this.bus_name, role: this.resel_type, like: $event });
  }

  async refresh() {
    this.bus_name='';
    this.resel_type='';
    this.res_name='';
    this.start_date = '';this.end_date ='';
    await this.initiallist();
  }

  async initiallist() {
    this.loading = true;
    let result = await this.ser.listOCBalance(
      {
        index: (this.page - 1) * this.limit,
        limit: this.limit,
        bus_id: this.bus_name,
        role: this.resel_type,
        resel_id: this.res_name,
        start_date: this.start_date,
        end_date: this.end_date
      });
    if (result) {
      this.data = result[0];
      this.count = result[1]['count'];
      this.loading = false;
      this.setPage();
      // console.log("OC Balance",result)
    }
  }

  async download() {
    let res = await this.ser.listOCBalance({
      limit: this.limit,
      bus_id: this.bus_name,
      role: this.resel_type,
      resel_id: this.res_name,
      start_date: this.start_date,
      end_date: this.end_date
    });
    if (res) {

      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        if(this.role.getroleid()>777){
          param['ISP NAME'] = temp[i]['busname'];
        }
        if(this.role.getroleid()>=775){
          param['RESELLER BUSINESS NAME'] = temp[i]['company'];
          param['RESELLER NAME'] = temp[i]['resellername'];
        }
        temp[i]['o_date'] = this.datePipe.transform(temp[i]['o_date'], 'd MMM y h:mm:ss a');
        temp[i]['c_date'] = this.datePipe.transform(temp[i]['c_date'], 'd MMM y h:mm:ss a');
        param['OPEN DATE&TIME'] = temp[i]['o_date']
        param['OPENING (INR)'] = temp[i]['obalance'];
        param['CLOSE DATE&TIME'] = temp[i]['c_date'];
        param['CLOSING (INR)'] = temp[i]['cbalance'];
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Opening&Closing Balance List' + EXCEL_EXTENSION);
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
  }

}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {PagerService, ResellerService, CustService, ReportService } from '../../_service/indexService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-traffic-report',
  templateUrl: './traffic-report.component.html',
  styleUrls: ['./traffic-report.component.scss']
})
export class TrafficReportComponent implements OnInit {
  submit: boolean = false; trafficdata; total; start_date='';end_date='';
  res1; res_name; custname; cust_name; search;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(
    private route: Router,
    public pageservice: PagerService,
    private nasmodel: NgbModal,
    private reselser: ResellerService,
    private custser: CustService,
    private datePipe: DatePipe,
    private reportser: ReportService
  ) { }

  async ngOnInit() {
    await this.list();
    this.showResellerName()
  }
  async showResellerName($event = '') {
    this.res1 = await this.reselser.showResellerName({ except: 1, like: $event })
  }
  async showUser($event = '') {
    this.custname = await this.custser.showUser({ resel_id: this.res_name, like: $event })
  }


  async list() {
    this.loading = true;
    let result = await this.reportser.trafficReport(
      {
        index: (this.page - 1) * this.limit,
        limit: this.limit,
        resel_id: this.res_name,
        uid: this.cust_name,
        start_date:this.start_date,
        end_date:this.end_date
      })
    // console.log("result")
    this.loading = false;
    if (result) {
      this.trafficdata = result[0];
      for (let i = 0; i < this.trafficdata.length; i++) {
        this.trafficdata[i]['upload'] = this.trafficdata[i]['ul'] == 0 ? 0 : this.bytefunc(this.trafficdata[i]['ul']);
        this.trafficdata[i]['download'] = this.trafficdata[i]['dl'] == 0 ? 0 : this.bytefunc(this.trafficdata[i]['dl']);
        this.trafficdata[i]['total'] = this.trafficdata[i]['tot'] == 0 ? 0 : this.bytefunc(this.trafficdata[i]['tot']);
        // console.log( "speed",this.trafficdata[i]['total'])
      }
      this.total = result[1]["count"];
      this.setPage()
    }
  }

  async refresh() {
    this.res_name = ''; this.cust_name = '';
    this.start_date='';this.end_date = '';
    await this.list();
  }

  async download() {
    this.loading = true;
    let res = await this.reportser.trafficReport(
      {
        resel_id: this.res_name,
        uid: this.cust_name,
        start_date:this.start_date,
        end_date:this.end_date
      })
    this.loading = false;
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
      
        param['RESELLER COMPANY'] = temp[i]['company'];
        param['PROFILE ID'] = temp[i]['profileid'];
        param['USERNAME'] = temp[i]['username'];
        param['DL LIMIT'] = temp[i]['dl'] == 0 ? '0 Bytes' : this.bytefunc(temp[i]['dl']);
        param['UL LIMIT'] = temp[i]['ul'] == 0 ? '0 Bytes' : this.bytefunc(temp[i]['ul']);
        param['TOTAL LIMIT'] = temp[i]['tot'] == 0 ? '0 Bytes' : this.bytefunc(temp[i]['tot']);
        param['MOBILE'] = temp[i]['mobile'];
        param['EMAIL'] = temp[i]['email'];
        param['ADDRESS'] = temp[i]['address'];

        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Traffic Report' + EXCEL_EXTENSION);
    }
  }

  
  bytefunc(datam) {
    // console.log(datam)
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(datam) / Math.log(k));
    return (parseFloat((datam / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i])
  }



  getlist(page) {
    var total = Math.ceil(this.total / this.limit);
    let result = this.pageservice.pageValidator(this.page, page, total);
    this.page = result['value'];
    if (result['result']) {
      this.list();
    }
  }

  setPage() {
    // console.log(this.data);
    this.pager = this.pageservice.getPager(this.total, this.page, this.limit);
    this.pagedItems = this.trafficdata;
  }

  changeclear(item) {
    if (item == 1) {
      this.cust_name = '';this.start_date='';this.end_date='';
    }
  }



}






import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RoleService, NasService, CustService, BusinessService, PagerService, GroupService, ResellerService, ReportService, } from '../../_service/indexService';
import { DatePipe } from '@angular/common';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';


@Component({
  selector: 'dailysubs-count',
  templateUrl: './dailysubs-count.component.html',
  styleUrls: ['./dailysubs-count.component.scss']
})

export class DailySubsCountComponent implements OnInit {
  tot; proid; custlog; search; res1; bus; group1; group_name;
  bus_name = ''; res_name = ''; resel_flag = '';

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;
  constructor(
    private router: Router,
    private reportser: ReportService,
    public role: RoleService,
    public pageservice: PagerService,
    private busser: BusinessService,
    private grupser: GroupService,
    private reselser: ResellerService,
    private datePipe : DatePipe,

  ) { }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event });
  }

  
  async ngOnInit() {
    localStorage.removeItem('array');
    await this.initiallist();
    await this.showBusName();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
    }
  }

  async refresh() {
    this.bus_name = '';
    await this.initiallist();
  }

  async initiallist() {
    this.loading = true;
    let result = await this.reportser.checkSubscriberCount(
      {
        index: (this.page - 1) * this.limit,
        limit: this.limit,
        bus_id: this.bus_name,
      });
    // console.log(result)
    if (result) {
      this.custlog = result[0];
      this.tot = result[1]['count']
    }
    this.loading = false;
    this.setPage();
  }

  getlist(page) {
    var total = Math.ceil(this.tot / this.limit);
    let result = this.pageservice.pageValidator(this.page, page, total);
    this.page = result['value'];
    if (result['result']) {
      this.initiallist();
    }
  }

  setPage() {
    // console.log(this.data);
    this.pager = this.pageservice.getPager(this.tot, this.page, this.limit);
    this.pagedItems = this.custlog;
    // console.log('asdfg',this.pagedItems)
  }

  async download() {
    let res = await this.reportser.checkSubscriberCount({ 
      bus_id: this.bus_name,
      groupid: this.group_name,
      resel_id: this.res_name,
    })
      if (res) {
        let tempdata = [], temp: any = res[0];
        for (var i = 0; i < temp.length; i++) {
          let param = {};
          if(this.role.getroleid()<=777){
            param['ISP NAME'] = temp[i]['busname'];
          }
          param['ACTIVE COUNT'] = temp[i]['active_count'];
          param['ONLINE COUNT'] = temp[i]['online_count'];
          param['NEW COUNT'] = temp[i]['new_count'];
          param['EXPITY COUNT'] = temp[i]['expiry_count'];
          param['TOTAL COUNT'] = temp[i]['total_sub'];
          temp[i]['cdate'] = this.datePipe.transform(temp[i]['c_date'],'d MMM y h:mm:ss a');
          param['DATE'] = temp[i]['cdate'];
          tempdata[i] = param
        }
        const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
        const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
        JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
        JSXLSX.writeFile(wb, 'Subscriber Count' + EXCEL_EXTENSION);
      }
  }

  // Edit_User(item) {
  //   localStorage.setItem('array', JSON.stringify(item));
  //   this.router.navigate(['/pages/business/edit-business']);
  // }
}
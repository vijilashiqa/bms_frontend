import { Component, OnInit } from '@angular/core';
import { BusinessService, CustService, ResellerService, RoleService, UserLogService, PagerService } from '../../_service/indexService';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { DatePipe } from '@angular/common';
import * as JSXLSX from 'xlsx';
const EXCEL_EXTENSION = '.xlsx';


@Component({
  selector: 'ngx-mail-log',
  templateUrl: './mail-log.component.html',
  styleUrls: ['./mail-log.component.scss']
})
export class MailLogComponent implements OnInit {
  submit: boolean = false;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25; total;
  bus; resel; bus_name; cust; resel_name; user_name; data; count; search; resel_type; profile;
  start_date; end_date;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;
  constructor(
    public role: RoleService,
    private busSrv: BusinessService,
    private userSrv: CustService,
    private reselSrv: ResellerService,
    private log: UserLogService,
    private pageservice: PagerService,
    private datepipe: DatePipe,
  ) { }

  async ngOnInit() {
    await this.list();
    await this.showBusiness();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid()
      await this.showProfileReseller();
    }
  }

  async showBusiness($event = '') {
    this.bus = await this.busSrv.showBusName({ like: $event });
  }
  async showProfileReseller($event = '') {
    this.profile = await this.reselSrv.showProfileReseller({ bus_id: this.bus_name, rec_role: 1, like: $event })
  }

  async showReseller($event = '') {
    this.resel = await this.reselSrv.showResellerName({ bus_id: this.bus_name, role: this.resel_type, like: $event })
  }

  async showUser($event = '') {
    this.cust = await this.userSrv.showUser({ bus_id: this.bus_name, resel_id: this.resel_name })
  }

  async list() {
    this.loading = true;
    let result = await this.log.userMailLog({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      bus_id: this.bus_name,
      resel_id: this.resel_name,
      uid: this.user_name,
      start_date: this.start_date,
      end_date: this.end_date
    })
    if (result) {
      this.loading = false
      this.data = result[0];
      this.count = result[1]['count'];
      this.setPage();
    } else this.loading = false;
  }

  async refresh() {
    this.bus_name = ''; this.resel_name = ''; this.user_name = ''; this.start_date = ''; this.end_date = '';
    this.list();
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
    this.pagedItems = this.data;
  }

  async download() {
    this.loading = true;
    let res = await this.log.userMailLog({
      bus_id: this.bus_name,
      resel_id: this.resel_name,
      uid: this.user_name,
      start_date: this.start_date,
      end_date: this.end_date
    })
    if (res) {
      this.loading = false;
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        param['LOGID'] = temp[i]['logid']
        if (this.role.getroleid() > 777) param['BUSINESS NAME'] = temp[i]['busname'];

        param['RESELLER'] = temp[i]['company'];
        param['USER PROFILEID'] = temp[i]['cust_profile_id'];
        param['EMAIL'] = temp[i]['emailto'];
        param['SUBJECT'] = temp[i]['sub'];
        param['SENT DATE'] = this.datepipe.transform(temp[i]['c_date'], 'dd-MM-yyyy hh:mm:ss a', 'es-ES');;

        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'User Mail Log' + EXCEL_EXTENSION);
    } else this.loading = false;
  }

}

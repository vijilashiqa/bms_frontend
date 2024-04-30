import { Component, OnInit } from '@angular/core';
import { ResellerService, RoleService, PagerService, CustService, UserLogService, BusinessService } from '../../_service/indexService';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { DatePipe } from '@angular/common';
import * as JSXLSX from 'xlsx';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'ngx-data-usage',
  templateUrl: './data-usage.component.html',
  styleUrls: ['./data-usage.component.scss']
})
export class DataUsageComponent implements OnInit {
  submit: boolean = false; count; search; config; data;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;
  resel; user; resel_name; user_name; table_data; tname; profile; role_id; oldnew = 1;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;
  bus; bus_name; start_date; end_date;
  constructor(
    private ressrv: ResellerService,
    public role: RoleService,
    public pageservice: PagerService,
    private custsrv: CustService,
    private logsrv: UserLogService,
    private bussrv: BusinessService,
    private datePipe: DatePipe
  ) { }

  async ngOnInit() {
    await this.list();
    this.showBusiness();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      this.showProfileReseller();
    }
  }

  async showBusiness($event = '') {
    this.bus = await this.bussrv.showBusName({ like: $event })
  }

  async showProfileReseller($event = '') {
    this.profile = await this.ressrv.showProfileReseller({ like: $event, bus_id: this.bus_name,rec_role:1 })
  }

  async showReseller($event = '') {
    this.resel = await this.ressrv.showResellerName({ like: $event,role: this.role_id, bus_id: this.bus_name })
  }

  async showUser($event = '') {
    this.user = await this.custsrv.showUser({ like: $event, resel_id: this.resel_name, role: this.role_id, bus_id: this.bus_name })
  }
  async showTableName($event = '') {
    this.table_data = await this.custsrv.showRadacctName({ like: $event });
  }
  async list() {
    this.loading = true;
    let result = await this.logsrv.userDatausage({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      resel_id: this.resel_name,
      uid: this.user_name,
      table_name: this.tname,
      oldnew: this.oldnew,
      start_date: this.start_date,
      end_date: this.end_date
    })
    if (result) {
      this.loading = false;
      this.data = result[0];
      for (let i = 0; i < this.data.length; i++) {
        this.data[i]['dlbytes'] = this.data[i]['dlbytes'] == 0 ? 0 : this.bytefunc(this.data[i]['dlbytes']);
        this.data[i]['ulbytes'] = this.data[i]['ulbytes'] == 0 ? 0 : this.bytefunc(this.data[i]['ulbytes']);
        this.data[i]['acctsessiontime'] = this.secondconvert(this.data[i]['acctsessiontime'])
      }
      this.count = result[1]["count"];
      this.setPage();
    }
  }

  async refresh() {
    this.resel_name = ''; this.user_name = ''; this.role_id = ''; this.tname = ''; this.bus_name = '';
    this.start_date = ''; this.end_date = '';
    await this.list();
  }

  async download() {
    this.loading = true;
    let res = await this.logsrv.userDatausage({
      resel_id: this.resel_name,
      uid: this.user_name,
      table_name: this.tname,
      oldnew: this.oldnew,
      start_date: this.start_date,
      end_date: this.end_date
    });
    if (res) {
      this.loading = false;
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        param['ID'] = temp[i]['radacctid'];
        param['USER NAME'] = temp[i]['username'];
        param['DOWNLOAD'] = temp[i]['dlbytes'] == 0 ? 0 : this.bytefunc(temp[i]['dlbytes']);
        param['UPLOAD'] = temp[i]['ulbytes'] == 0 ? 0 : this.bytefunc(temp[i]['ulbytes']);
        param['START TIME'] = !temp[i]['acctstarttime'] ? '' : this.datePipe.transform(temp[i]['acctstarttime'], 'dd/MM/yyyy hh:mm:ss a', 'es-ES');
        param['END TIME'] = !temp[i]['acctstoptime'] ? '' : this.datePipe.transform(temp[i]['acctstoptime'], 'dd/MM/yyyy hh:mm:ss a', 'es-ES');
        param['DURATION'] = this.secondconvert(temp[i]['acctsessiontime']);


        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Data Usage List' + EXCEL_EXTENSION);
    } else this.loading = false;
  }


  bytefunc(datam) {
    // console.log(datam)
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(datam) / Math.log(k));
    return (parseFloat((datam / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i])
  }

  secondconvert(data) {
    var seconds = data;
    var days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;
    var hrs = Math.floor(seconds / 3600);
    seconds -= hrs * 3600;
    var mnts = Math.floor(seconds / 60);
    seconds -= mnts * 60;
    // console.log(days+" days, "+hrs+" Hrs, "+mnts+" Minutes, "+seconds+" Seconds");
    return (days + " days, " + hrs + " Hrs, " + mnts + " Minutes, " + seconds + " Seconds")
  }

  getlist(page) {
    var total = Math.ceil(this.count / this.limit);
    let result = this.pageservice.pageValidator(this.page, page, total);
    this.page = result['value'];
    if (result['result']) {
      this.list();
    }
  }

  setPage() {
    this.pager = this.pageservice.getPager(this.count, this.page, this.limit);
    this.pagedItems = this.data;
  }

}

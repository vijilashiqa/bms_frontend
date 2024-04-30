import { Component, OnInit } from '@angular/core';
import { BusinessService, CustService, ResellerService, RoleService, PagerService } from '../../_service/indexService';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import * as JSXLSX from 'xlsx';
const EXCEL_EXTENSION = '.xlsx';


@Component({
  selector: 'ngx-register-card-user',
  templateUrl: './register-card-user.component.html',
  styleUrls: ['./register-card-user.component.scss']
})
export class RegisterCardUserComponent implements OnInit {
  submit: boolean = false;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25; total;
  bus; resel; bus_name; resel_name; data; count; search;
  mobile; email; otp_status=''; acct_status='';

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(
    public role: RoleService,
    private busService: BusinessService,
    private resellerService: ResellerService,
    private custService: CustService,
    private pageservice: PagerService,
  ) { }

  async ngOnInit() {
    await this.list();
    await this.showBusiness();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid()
      await this.showReseller();
    }
  }
  async showBusiness($event = '') {
    this.bus = await this.busService.showBusName({ like: $event });
  }
  async showReseller($event = '') {
    this.resel = await this.resellerService.showResellerName({ bus_id: this.bus_name, role: 331, like: $event })
  }

  async list() {
    this.loading = true;
    let result = await this.custService.registerCardUser({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      bus_id: this.bus_name,
      resel_id: this.resel_name,
      mobile: this.mobile,
      email: this.email,
      otp_status: this.otp_status,
      acct_status: this.acct_status
    });

    if (result) {
      this.loading = false
      this.data = result[0];
      this.count = result[1]['count'];
      this.setPage();
    } else this.loading = false;
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


  async refresh() {
    this.bus_name = ''; this.resel_name = ''; this.mobile = ''; this.email = '';
    this.otp_status = ''; this.acct_status = '';
    this.list();
  }

  async download() {
    this.loading = true;
    let res = await this.custService.registerCardUser({
      bus_id: this.bus_name,
      resel_id: this.resel_name,
      mobile: this.mobile,
      email: this.email,
      otp_status: this.otp_status,
      acct_status: this.acct_status
    })
    if (res) {
      this.loading = false;
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        param['ID'] = temp[i]['id']
        // if (this.role.getroleid() > 777) param['BUSINESS'] = temp[i]['busname'];

        param['RESELLER'] = temp[i]['company'];
        param['UID'] = temp[i]['uid'] || '--';
        param['PROFILEID'] = temp[i]['profileid'] || '--';
        param['NAME'] = temp[i]['user_fname'] || '--';
        param['EMAIL'] = temp[i]['emailid'] || '--';
        param['MOBILE'] = temp[i]['mobileno'] || '--';
        param['OTP'] = temp[i]['otp'] || '--';
        param['OTP STATUS'] = temp[i]['otpstatus'] == 0 ? 'Initiated' : temp[i]['otpstatus'] == 1 ? 'Sent' : '--';
        param['ACCOUNT STATUS'] = temp[i]['acctstatus'] == 0 ? 'Processing' : temp[i]['acctstatus'] == 1 ? 'Activated' : '--';

        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Registerd Card User' + EXCEL_EXTENSION);
    } else this.loading = false;
  }

  changeclear(item) {
    if (item == 1) this.resel_name = '';
  }

}

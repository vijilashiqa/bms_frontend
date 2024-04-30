import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { S_Service, BusinessService, GroupService, ResellerService, RoleService, PagerService } from '../../_service/indexService';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'list-price',
  templateUrl: './list-price.component.html',
  styleUrls: ['./list-price.component.scss']
})
export class ListPriceComponent implements OnInit {
  datas; count; search; reseler; branch; bus; bus_id; group1; groupid; nas1; nas_name;
  nam1; name; rescount; res_name; nascount; subcount; res1; group_name = ''; bus_name = ''; subname;
  subpaln = ''; pro;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit = 25;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;
  constructor(
    private router: Router,
    private ser: S_Service,
    public role: RoleService,
    private groupser: GroupService,
    private busser: BusinessService,
    private resser: ResellerService,
    public pageservice: PagerService,

  ) { }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event });
    // console.log(result)
  }

  async showGroupName($event = '') {
    this.group1 = await this.groupser.showGroupName({ bus_id: this.bus_name, like: $event });
    // console.log("group:",result)
  }

  async showResellerName($event = '') {
    this.res1 = await this.resser.showResellerName({ except: 1, bus_id: this.bus_name, groupid: this.group_name, like: $event });
    //  console.log("resel",result)
  }

  async showService($event = '') {
    if (this.role.getroleid() >= 775) {
      this.nam1 = await this.ser.showService({ resel_id: this.res_name, res_flag: 1, bus_id: this.bus_name, groupid: this.group_name, like: $event });
      // console.log("service",result)
    } else {
      this.nam1 = await this.ser.showService({ res_flag: 1, bus_id: this.bus_name, groupid: this.group_name, like: $event });
      // console.log("service",result)
    }

  }

  async showsubplan($event = '') {
    this.subname = await this.ser.showSubPlan({ srvid: this.name, resel_id: this.res_name, like: $event });
    // console.log("subplan",res)
  }

  async ngOnInit() {
    localStorage.removeItem('array');
    await this.initiallist();
    await this.showBusName();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.showGroupName();
      await this.showResellerName();
      await this.showService();
    }
    if (this.role.getroleid() < 775) {
      this.group_name = this.role.getgrupid();
      await this.showResellerName();
      await this.showService();
    }
  }

  changeclear(item) {
    if (item == 1) {
      this.group_name = '';
      this.res_name = '';
      this.name = '';
      this.subpaln = '';
    }
    if (item == 2) {
      this.res_name = '';
      this.name = '';
      this.subpaln = '';
    }
    if (item == 3) {
      this.name = '';
      this.subpaln = '';
    }
  }

  async refresh() {
    this.bus_name = '';
    this.group_name = '';
    this.res_name = '';
    this.name = '';
    this.subpaln = '';
    this.subname = '';
    this.res1 = '';
    this.nam1 = '';
    this.group1 = '';
    if (this.role.getroleid() <= 777) {
      await this.showGroupName();
      await this.showResellerName();
      await this.showService();
    }
    await this.initiallist();
  }

  async initiallist() {
    this.loading = true;
    let result = await this.ser.listprice({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      bus_id: this.bus_name,
      groupid: this.group_name,
      resel_id: this.res_name,
      srvid: this.name,
      sub_plan: this.subpaln,
    })
    this.datas = result[0];
    this.count = result[1]["COUNT"];
    this.loading = false;
    // console.log(result);
    if (result) {
      this.setPage()
    }
  }

  async download() {
    this.loading = true;
    let res = await this.ser.listprice({
      bus_id: this.bus_name,
      groupid: this.group_name,
      resel_id: this.res_name,
      srvid: this.name,
      sub_plan: this.subpaln
    })
    if (res) {
      this.loading = false;
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        if (this.role.getroleid() > 777) {
          param['ISP NAME'] = temp[i]['busname'];
        }
        if (this.role.getroleid() >= 775 || this.role.getroleid() > 444) {
          param['RESELLER NAME'] = temp[i]['managername'];
        }
        param['SERVICE NAME'] = temp[i]['srvname'];
        param['SERVICE TYPE'] = temp[i]['service_name'];
        param['SUB PLAN NAME'] = temp[i]['sub_plan'];
        param['TAX TYPE'] = temp[i]['tax_type'] == 1 ? 'Inclusive' : 'Exclusive';
        param['PRICE'] = temp[i]['amount'];
        param['TIME UNIT TYPE'] = temp[i]['type'] == 1 ? temp[i]['time_unit'] == 1 ? temp[i]['time_unit'] + " " + 'Month' : temp[i]['time_unit'] + " " + 'Months' :
          temp[i]['time_unit'] == 1 ? temp[i]['time_unit'] + " " + 'Day' : temp[i]['time_unit'] + " " + 'Days';
        param['ADDITIONAL DAYS'] = temp[i]['additional_days'];
        param['STATUS'] = temp[i]['status'] == 1 ? 'Active' : 'Inactive';
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Service Price List' + EXCEL_EXTENSION);
    }
  }

  async updateShare() {
    this.loading = true;
    let res = await this.ser.listprice({
      bus_id: this.bus_name,
      groupid: this.group_name,
      resel_id: this.res_name,
      srvid: this.name,
      sub_plan: this.subpaln
    });
    if (res) {
      this.loading = false;
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        if (this.role.getroleid() > 777) {
          param['ISP NAME'] = temp[i]['busname'];
        }
        if (this.role.getroleid() >= 775 || this.role.getroleid() > 444) {
          param['RESELLER NAME'] = temp[i]['managername'];
        }
        param['SERVICE NAME'] = temp[i]['srvname'];
        param['SERVICE TYPE'] = temp[i]['service_name'];
        param['SUB PLAN NAME'] = temp[i]['sub_plan'];
        param['ISP SHARE'] = temp[i]['isp_share'];
        param['SUBISP SHARE'] = temp[i]['sub_isp_share'];
        param['SUBDIST SHARE'] = temp[i]['sub_dist_share'];
        param['RESELLER SHARE'] = temp[i]['reseller_share'];
        param['STATUS'] = temp[i]['status'] == 1 ? 'Active' : 'Inactive';
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Update PlanShare' + EXCEL_EXTENSION);
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

  Edit_User(item) {
    localStorage.setItem('array', JSON.stringify(item));
    this.router.navigate(['/pages/service/edit-price']);
  }
}

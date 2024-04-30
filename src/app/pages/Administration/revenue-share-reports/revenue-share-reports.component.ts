import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoleService, BusinessService, S_Service, ResellerService } from '../../_service/indexService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { ngxLoadingAnimationTypes } from 'ngx-loading';


@Component({
  selector: 'ngx-revenue-share-reports',
  templateUrl: './revenue-share-reports.component.html',
  styleUrls: ['./revenue-share-reports.component.scss']
})
export class RevenueShareReportsComponent implements OnInit {
  bus_name; bus; res1; res_name; share_type; srv_details;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;
  constructor(
    private router: Router,
    private busser: BusinessService,
    public role: RoleService,
    private ser: S_Service,
    private nasmodel: NgbModal,
    private resel: ResellerService,

  ) { }

  async ngOnInit() {
    await this.showBusiness();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.showResellerName();
    }
  }

  async changebusiness() {
    this.res_name = ''; this.srv_details = [];
  }

  async showBusiness($event = '') {
    this.bus = await this.busser.showBusName({ like: $event })
  }

  async showResellerName($event = '') {
    this.res1 = await this.resel.showResellerName({ bus_id: this.bus_name, like: $event, except: 1 })
  }

  async showRevenueShare() {
    this.loading = true;
    let result = await this.ser.sharingReports({ bus_id: this.bus_name, resel_id: this.res_name });
    console.log('Revenue Result', result)
    if (result) {
      this.loading = false;
      this.srv_details = result
    }
  }

  async showShareType() {
    let resp = this.res1.filter(x => x.id === this.res_name).map(x => x.sharing_type);
    if (resp) this.share_type = resp[0];
  }

  async download() {
    this.loading = true;
    let result = await this.ser.sharingReports({ bus_id: this.bus_name, resel_id: this.res_name, export: 1 });
    console.log('Export Sharig', result);
    if (result) {
      this.loading = false;
      let tempdata = [], temp: any = result;
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        param['RESELLER'] = temp[i]['company'];
        param['SERVICE NAME'] = temp[i]['srvname'];
        param['PLAN PRICE'] = temp[i]['amount'];
        param['TIMEUNIT'] = temp[i]['type'] == 0 ? temp[i]['time_unit'] + "Days" : temp[i]['time_unit'] + "Months";
        param['TAX'] = temp[i]['tax_type'] == 0 ? 'Exclusive' : 'Inclusive';
        param['STATUS'] = temp[i]['status'] == 1 ? 'Active' : 'InActive';
        param['SHARING TYPE'] = temp[i]['sharing_type'] == 1 ? 'Common Sharing' : 'Package-wise Sharing';
        param['ISP SHARE'] = temp[i]['isp_share'];
        param['SUBISP SHARE'] = temp[i]['sub_isp_share'];
        param['SUBDIST SHARE'] = temp[i]['sub_dist_share'];
        param['RESELLER SHARE'] = temp[i]['reseller_share'];
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'REVENUESHARE' + EXCEL_EXTENSION);
    }

  }

}

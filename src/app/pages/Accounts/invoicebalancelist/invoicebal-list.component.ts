import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AccountService, BusinessService, CustService, GroupService,
  ResellerService, RoleService, S_Service, PagerService
} from '../../_service/indexService';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { ViewInvoiceComponent } from '../viewinvoice/viewinvoice.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'invoicebalancelist',
  templateUrl: './invoicebal-list.component.html',
  styleUrls: ['./invoicebal-list.component.scss'],
})

export class InvoicebalanceListComponent implements OnInit {
  submit: boolean = false; addNas; data; search; bus_name = ''; bus; group1; resel_type = '';
  res1; res_name = ''; paymentForm; tot; Download; count; group_name = ''; pro; start_date; end_date;

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
    private groupser: GroupService,
    private reselser: ResellerService,
    public pageservice: PagerService,
    public activeModal: NgbModal,
    private datepipe: DatePipe

  ) { }

  async ngOnInit() {
    await this.showBusName();
    await this.initiallist();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.profile();
      await this.showResellerName();
    }
  }

  // async showGroupName($event = '') {
  //   await this.groupser.showGroupName({ bus_id: this.bus_name, like: $event })
  //     this.group1 = result;
  //     // console.log("group:", result)
  //   });
  // }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event });
    // console.log(result)
  }

  async profile($event = '') {
    this.pro = await this.reselser.showProfileReseller({ dep_role: 1, bus_id: this.bus_name, like: $event });
    // console.log(res)
  }

  async showResellerName($event = '') {
    // console.log('inside', this.resel_type)
    this.res1 = await this.reselser.showResellerName({ bus_id: this.bus_name, role: this.resel_type, like: $event });
    // console.log(result)
  }

  changeclear(item) {
    if (item == 1) {
      this.resel_type = ''; this.res_name = '';
    }
    if (item == 2) { this.res_name = ''; }
  }

  async refresh() {
    this.bus_name = '';
    this.resel_type = '';
    this.res_name = ''; this.pro = ''; this.res1 = '';
    await this.initiallist();
    if (this.role.getroleid() == 666 || this.role.getroleid() == 555) {
      await this.profile();
      await this.showResellerName();
    }
  }

  async initiallist() {
    this.loading = true;
    let result = await this.ser.listInvoiceBalancelog(
      {
        index: (this.page - 1) * this.limit,
        limit: this.limit,
        bus_id: this.bus_name,
        role: this.resel_type,
        resel_id: this.res_name,
        start_date: this.start_date,
        end_date: this.end_date
        // res_id:this.reseller_under,
      });
    this.data = result[0];
    this.count = result[1]['count'];
    this.loading = false;
    this.setPage();
    // console.log("invbalance",result)
  }

  async download() {
    let res = await this.ser.listInvoiceBalancelog({
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
        if (this.role.getroleid() > 777) {
          param['ISP NAME'] = temp[i]['busname'];
        }
        if (this.role.getroleid() >= 775 || this.role.getroleid() == 666 || this.role.getroleid() == 555) {
          param['COMPANY'] = temp[i]['company'];
          param['RESELLER NAME'] = temp[i]['resellername'];
        }
        param['INVOICE ID'] = temp[i]['invid'];
        param['TRANSACTION'] = temp[i]['rflag'] == 1 ? 'Deduction' : 'Deposit';
        param['BEFORE BALANCE'] = temp[i]['before_balance_amt'];
        param['AMOUNT (INR)'] = temp[i]['amt'];
        param['DATE'] = this.datepipe.transform(temp[i]['c_date'], 'dd-MM-yyyy hh:mm:ss a', 'es-ES');;
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Reseller Renewalshare' + EXCEL_EXTENSION);
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
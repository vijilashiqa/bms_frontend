import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BusinessService, RoleService, PagerService, AdminuserService, GroupService, AccountService, ResellerService, CustService } from '../../_service/indexService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { DatePipe } from '@angular/common';
 


@Component({
  selector: 'ngx-gstinvoice-mail-log',
  templateUrl: './gstinvoice-mail-log.component.html',
  styleUrls: ['./gstinvoice-mail-log.component.scss']
})
export class GstinvoiceMailLogComponent implements OnInit {
  submit: boolean = false; invdata; total; bus; bus_name; config; group1; group_name;
  res1; res_name; custname; cust_name; invnum; invoice_num; search;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;start_date;end_date;
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
    private account: AccountService,
    private reselser: ResellerService,
    private custser: CustService,
    private datePipe: DatePipe,
   ) { }

   async ngOnInit() {
    await this.initiallist();
    await this.showBusName();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.showGroupName();
    }
  }

  async showBusName($event = '') {
    this.bus = await this.ser.showBusName({ like: $event });
    // console.log(result)
  }
  async showGroupName($event = '') {
    this.group1 = await this.groupser.showGroupName({ bus_id: this.bus_name, like: $event })
    // console.log("group:", result)
  }

  async showinvoicenum($event = '') {
    this.invnum = await this.account.showInvoiceNo({ bus_id: this.bus_name, like: $event });
    // console.log(this.invnum);
  }

  async showResellerName($event = '') {
    this.res1 = await this.reselser.showResellerName({ bus_id: this.bus_name, groupid: this.group_name, except: 1, like: $event })
    // console.log(result)
  }
  async showUser($event = '') {
    this.custname = await this.custser.showUser({ bus_id: this.bus_name, groupid: this.group_name, resel_id: this.res_name, like: $event })
    // console.log("customer", result)
  }



  async initiallist() {
    this.loading = true;
    let result = await this.account.listGSTInvoice(
      {
        index: (this.page - 1) * this.limit,
        limit: this.limit,
        bus_id: this.bus_name,
        resel_id: this.res_name,
        uid: this.cust_name,
        invid: this.invoice_num,
        mail_start_date:this.start_date,
        mail_end_date:this.end_date
      })
    // console.log("result")
    this.loading = false;
    if (result) {
      this.invdata = result[0];
      this.total = result[1]["tot"];
      this.setPage()
    }
  }

  async refresh() {
    this.bus_name = ''; this.group_name = ''; this.res_name = ''; this.invoice_num = ''; this.cust_name = '';this.start_date='';this.end_date='';
    await this.initiallist();
  }

  async download() {
    this.loading = true;
    let res = await this.account.listGSTInvoice(
      {
        bus_id: this.bus_name,
        resel_id: this.res_name,
        uid: this.cust_name,
        invid: this.invoice_num,
        mail_start_date:this.start_date,
        mail_end_date:this.end_date
      })
      this.loading = false;
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        if (this.role.getroleid() >= 775) param['ID'] = temp[i]['invid'];
        if (this.role.getroleid() > 777) param['BUSINESS NAME'] = temp[i]['busname'];
        param['INVOICE NO'] = temp[i]['rollid'];
        param['RENEWAL TYPE'] = temp[i]['pay_through'] == 1 ? 'Manual' : temp[i]['pay_through'] == 2 ? 'Scheduled' : temp[i]['pay_through'] == 3 ? 'Through Gateway By Subscriber' : 'Scheduled By Subscriber';
       if(this.role.getroleid()>444){
        param['RESELLER TYPE'] = temp[i]['role'] == 444 ? 'Bulk Reseller' : temp[i]['role'] == 333 ? 'DepositReseller' : temp[i]['role'] == 666 ? 'Sub ISP Bulk'
        : temp[i]['role'] == 555 ? 'Sub ISP Deposit' : temp[i]['role'] == 551 ? 'Sub Distributor Deposit' : temp[i]['role'] == 661
          ? 'SubDistributor Bulk' : 'Hotel';
          param['RESELLER COMPANY'] = temp[i]['company'];
       }
        param['SUBSCRIBER NAME'] = temp[i]['user_name'];
        param['SUNSCRIBER PROFILEID'] = temp[i]['userid'];
        param['EMAIL STATUS'] = temp[i]['sendemail'] == 1 ? 'Not Send' : 'Sent';
        param['EMAIL DATE'] = !temp[i]['sendmaildate'] ? '--' :  (this.datePipe.transform(temp[i]['sendmaildate'], 'dd-MM-yyyy hh:mm:ss a'));
        param['INVOICE TYPE'] = temp[i]['inv_type']==1?'Invoice':'GST Invoice';
        param['INVOICE STATUS'] = temp[i]['inv_status'] == 1 ? 'Active' : temp[i]['inv_status'] == 2 ? 'Proforma Invoice' :'Cancelled';
        param['INVOICE DATE'] = !temp[i]['inv_date'] ? '--' :  (this.datePipe.transform(temp[i]['inv_date'], 'dd-MM-yyyy hh:mm:ss a'));


        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'InvoiceMailLog' + EXCEL_EXTENSION);
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
    this.pagedItems = this.invdata;
  }

  changeclear(item) {
    if (item == 1) {
      this.group_name = ''; this.res_name = ''; this.cust_name = ''; this.invoice_num = '';
    }
    if (item == 2) {
      this.res_name = ''; this.cust_name = ''; this.invoice_num = '';
    }
    if (item == 3) {
      this.cust_name = ''; this.invoice_num = '';
    }
    if (item == 4) {
      this.invoice_num = '';
    }
  }

  viewCust(userid){
    localStorage.setItem('details',JSON.stringify(userid));
    this.route.navigate(['/pages/cust/viewcust']);
  }

}





 
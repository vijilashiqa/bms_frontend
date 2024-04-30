import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BusinessService, RoleService, PagerService, AdminuserService, GroupService, AccountService, ResellerService, CustService } from '../../_service/indexService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { OTTPlanComponent } from '../ott-plan/ott-plan.component';
import { OttcountComponent } from '../ottcount/ottcount.component';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'ngx-ott-log',
  templateUrl: './ott-log.component.html',
  styleUrls: ['./ott-log.component.scss']
})
export class OttLogComponent implements OnInit {
  submit: boolean = false; ottdata; total; bus; bus_name; config; search; group1; group_name;
  ottplandata; ottplan_code; ottplanname; ottplan_name;
  res1; res_name; custname; cust_name; invnum; invoice_num;changeclear;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;
  ottstatus='';start_date='';end_date='';


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
    private datePipe: DatePipe

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
  async showOTTPlanCode($event = '') {
    if (this.bus_name) this.ottplandata = await this.adminser.showOTTPlanCode({ bus_id: this.bus_name, like: $event });
  }

  async showOTTPlanName($event = '') {
    if (this.bus_name) this.ottplanname = await this.adminser.showOTTPlanCode({ bus_id: this.bus_name, olike: $event });
  }


  async initiallist() {
    this.loading = true;
    let result = await this.account.ottInvoice(
      {
        index: (this.page - 1) * this.limit,
        limit: this.limit,
        bus_id: this.bus_name,
        resel_id: this.res_name,
        uid: this.cust_name,
        invid: this.invoice_num,
        ottplan_code: this.ottplan_code,
        ottplan_name: this.ottplan_name,
        ottstatus:this.ottstatus,
        start_date:this.start_date,
        end_date: this.end_date
      })
    // console.log("result")
    this.loading = false;
    if (result) {
      this.ottdata = result[0];
      this.total = result[1]["count"];
      this.setPage()
    }
  }

  async refresh() {
    this.bus_name = ''; this.group_name = ''; this.res_name = ''; this.invoice_num = ''; this.cust_name = '';
    this.ottplan_code = ''; this.ottplan_name = '';this.ottstatus = '';this.start_date='';this.end_date='';
    await this.initiallist();
  }

  async download() {
    let res = await this.account.ottInvoice(
      {
         bus_id: this.bus_name,
        resel_id: this.res_name,
        uid: this.cust_name,
        invid: this.invoice_num,
        ottplan_code: this.ottplan_code,
        ottplan_name: this.ottplan_name,
        ottstatus:this.ottstatus,
        start_date:this.start_date,
        end_date: this.end_date
      })
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        if (this.role.getroleid() > 777) param['BUSINESS NAME'] = temp[i]['busname'];
        param['BILLNO'] = temp[i]['billno'];
        param['RESELLER BUSINESSNAME']=temp[i]['company'];
        param['SUBSCRIBER PROFILEID'] = temp[i]['cust_profile_id'];
        param['OTTPLANNAME'] = temp[i]['ottplan_name'];
        param['OTTPLANCODE'] = temp[i]['ottplancode'];
         param['TAXTYPE'] = temp[i]['otttaxtype'] == 0 ? 'Inclusive' : 'Exclusive';
        param['TIMEUNIT'] = temp[i]['dayormonth'] == 1 ? temp[i]['ottdays'] + "Days" : temp[i]['days'] + "Months";
        param['AMOUNT'] = temp[i]['ottamount'];
        param['STATUS'] = temp[i]['ottstatus'] == 1 ? 'Processing' : temp[i]['ottstatus'] == 2? 'Activated': temp[i]['ottstatus'] == 3? 'Cancelled' : 'Need To check';
        temp[i]['cdate'] = this.datePipe.transform(temp[i]['cdate'], 'd MMM y hh:mm:ss a')
        param['GENERATED DATE'] = temp[i]['cdate'];


        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'OttInvoice' + EXCEL_EXTENSION);
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
    this.pagedItems = this.ottdata;
  }

  async ottcount(item) {
    let result = await this.adminser.showOTTPlan({ ottid: item });
    await this.ottcountshow(result)
  }

  ottcountshow(data) {
    const activeModal = this.nasmodel.open(OttcountComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'OTT PLATFORM';
    activeModal.componentInstance.item = data;
    activeModal.result.then((data) => {
      // this.initiallist();
    });
  }


}

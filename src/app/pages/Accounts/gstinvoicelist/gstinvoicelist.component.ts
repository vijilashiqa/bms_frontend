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
import { ViewReceiptComponent } from '../viewreceipt/viewreceipt.component';
import { InvoiceReceiptComponent } from '../invreceipt/invreceipt.component';
import { InvTransactionComponent } from '../transaction/transaction.component';
import { ServiceShareComponent } from '../serviceshare/service-share.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'gstinvoicelist',
  templateUrl: './gstinvoicelist.component.html',
  styleUrls: ['./gstinvoicelist.component.scss'],
})

export class GstInvoicelistComponent implements OnInit {
  submit: boolean = false; addNas; data; search; bus_name = ''; bus; group1; sername = ''; sub_plan = '';
  profile; resel_type = ''; res1; res_name = ''; invoice_num = ''; paymentForm; tot; Download; inv_type = ''; pack; count; cust_name = '';
  group_name = ''; subplandata; custname; dtype = ''; inv_status = ''; from_date = ''; to_date = ''; from_edate = ''; to_edate = '';
  pay_status = ''; start_date = ''; end_date = ''; invnum;
  invamnt; totinvamnt; invpaid; invunpaid; taxamount;
  intispshare; Vispshare; Oispshare; AONispshare; totispshare;
  subispshare; Osubispshare; Vsubispshare; AONsubispshare; totsubispshare;
  subdistshare; Osubdistshare; Vsubdistshare; AONsubdistshare; totsubdistshare;
  reselshare; Vreselshare; Oreselshare; AONreselshare; totreselshare;
  intamnt; intaxamt; Vamt; Vtaxamt; Oamt; Otaxamt; AONamt; AONtaxamt;
  index; invdetails; share; servtype; serv_type;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit = 25;
  constructor(
    private alert: ToasterService,
    private router: Router,
    private ser: AccountService,
    private packser: S_Service,
    public role: RoleService,
    private busser: BusinessService,
    private custser: CustService,
    private groupser: GroupService,
    private reselser: ResellerService,
    public pageservice: PagerService,
    public activeModal: NgbModal,
    public nasmodel: NgbModal,
    private datePipe: DatePipe
  ) { }

  async ngOnInit() {
    localStorage.removeItem('array');
    await this.showBusName();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.showGroupName();
      await this.showinvoicenum();
      await this.showProfileReseller();
      await this.showResellerName();
      await this.showUser();
      await this.showService();
      await this.showUser();
    }
    if (this.role.getroleid() < 775) {
      await this.initiallist();
    }
  }

  async subplanshow($event = '') {
    this.subplandata = await this.packser.showSubPlan({ srvid: this.sername, like: $event })
  }

  async showService($event = '') {
    this.pack = await this.packser.showService({ bus_id: this.bus_name, groupid: this.group_name, resel_id: this.res_name, res_flag: 1, like: $event })
  }

  async showGroupName($event = '') {
    this.group1 = await this.groupser.showGroupName({ bus_id: this.bus_name, srvid: this.sername, like: $event })
  }

  async showinvoicenum($event = '') {
    this.invnum = await this.ser.showInvoiceNo({ bus_id: this.bus_name, like: $event, gst: 1 });
  }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event })
  }

  async showProfileReseller($event = '') {
    this.profile = await this.reselser.showProfileReseller({ bus_id: this.bus_name, like: $event })
  }
  alertmsg() {
    if (!this.resel_type) {
      this.toastalert('Please Select Reseller Type');
    }
  }
  async showResellerName($event = '') {
    if (this.resel_type) {
      this.res1 = await this.reselser.showResellerName({ bus_id: this.bus_name, groupid: this.group_name, role: this.resel_type, like: $event })
    }
  }

  async showUser($event = '') {
    this.custname = await this.custser.showUser({ bus_id: this.bus_name, groupid: this.group_name, resel_id: this.res_name, srvid: this.sername, like: $event })
  }
  async servicetype($event = '') {
    this.servtype = await this.busser.showServiceType({ sertype: 1, bus_id: this.bus_name, like: $event })
  }

  changeclear(item) {
    if (item == 1) {
      this.group_name = ''; this.resel_type = ''; this.res_name = ''; this.invoice_num = ''; this.sername = '';
      this.sub_plan = ''; this.cust_name = ''; this.inv_type = ''; this.inv_status = ''; this.pay_status = ''; this.start_date = ''; this.end_date = ''; this.serv_type = '';
    }
    if (item == 2) {
      this.resel_type = ''; this.res_name = ''; this.invoice_num = ''; this.sername = '';
      this.sub_plan = ''; this.cust_name = ''; this.inv_type = ''; this.inv_status = ''; this.pay_status = ''; this.start_date = ''; this.end_date = ''; this.serv_type = '';
    }
    if (item == 3) {
      this.res_name = ''; this.invoice_num = ''; this.sername = '';
      this.sub_plan = ''; this.cust_name = ''; this.inv_type = ''; this.inv_status = ''; this.pay_status = ''; this.start_date = ''; this.end_date = ''; this.serv_type = '';
    }
    if (item == 4) {
      this.invoice_num = ''; this.sername = '';
      this.sub_plan = ''; this.cust_name = ''; this.inv_type = ''; this.inv_status = ''; this.pay_status = ''; this.start_date = ''; this.end_date = ''; this.serv_type = '';
    }
    if (item == 5) {
      this.sername = '';
      this.sub_plan = ''; this.cust_name = ''; this.inv_type = ''; this.inv_status = ''; this.pay_status = ''; this.start_date = ''; this.end_date = ''; this.serv_type = '';
    }
    if (item == 6) {
      this.sub_plan = ''; this.cust_name = ''; this.inv_type = ''; this.inv_status = ''; this.pay_status = ''; this.start_date = ''; this.end_date = ''; this.serv_type = '';
    }
    if (item == 7) {
      this.cust_name = ''; this.inv_type = ''; this.inv_status = ''; this.pay_status = ''; this.start_date = ''; this.end_date = ''; this.serv_type = '';
    }
  }

  async refresh() {
    this.bus_name = ''; this.group_name = ''; this.resel_type = ''; this.res_name = ''; this.cust_name = ''; this.sername = ''; this.invoice_num = '';
    this.sub_plan = ''; this.inv_type = ''; this.inv_status = '';
    this.pay_status = ''; this.start_date = ''; this.end_date = ''; this.serv_type = ''; this.group1 = '';
    this.profile = ''; this.res1 = ''; this.invnum = ''; this.pack = ''; this.subplandata = ''; this.custname = ''; this.servtype = '';
    await this.initiallist();
    if (this.role.getroleid() == 666 || this.role.getroleid() == 555) {
      await this.showProfileReseller();
      await this.showResellerName();
    }
  }

  async initiallist() {
    this.loading = true;
    let result = await this.ser.listGSTInvoice(
      {
        index: (this.page - 1) * this.limit,
        limit: this.limit,
        bus_id: this.bus_name,
        groupid: this.group_name,
        resel_id: this.res_name,
        uid: this.cust_name,
        srvid: this.sername,
        inv_no: this.invoice_num,
        subplan: this.sub_plan,
        invtype: this.inv_type,
        invstatus: this.inv_status,
        paystatus: this.pay_status,
        start_date: this.start_date,
        end_date: this.end_date,
        srv_type: this.serv_type,
        role: this.resel_type,
        // res_id:this.reseller_under,
      })
    this.data = result[0];
    this.count = result[1]['tot'];
    this.invamnt = result[1]['inv_amount'];
    this.taxamount = result[1]['tax_amount'];
    this.invpaid = result[1]['paid_amount'];
    this.invunpaid = result[1]['unpaid_amount'];
    this.totinvamnt = result[1]['totamt'];

    this.intamnt = result[1]['iamt'];
    this.intaxamt = result[1]['itaxamt'];
    this.Vamt = result[1]['Vamt'];
    this.Vtaxamt = result[1]['Vtaxamt'];
    this.Oamt = result[1]['Oamt'];
    this.Otaxamt = result[1]['Otaxamt'];
    this.AONamt = result[1]['AONamt'];
    this.AONtaxamt = result[1]['AONtaxamt'];

    this.intispshare = result[1]['isp_share'];
    this.Vispshare = result[1]['Visp_amt'];
    this.Oispshare = result[1]['Oisp_amt'];
    this.AONispshare = result[1]['AONisp_amt'];
    this.totispshare = result[1]['isp_amount'];

    this.subispshare = result[1]['sub_isp_share'];
    this.Vsubispshare = result[1]['Vsub_isp_amt'];
    this.Osubispshare = result[1]['Osub_isp_amt'];
    this.AONsubispshare = result[1]['AONsub_isp_amt'];
    this.totsubispshare = result[1]['sub_isp_amount'];

    this.subdistshare = result[1]['sub_dist_share'];
    this.Vsubdistshare = result[1]['Vsub_dist_amt'];
    this.Osubdistshare = result[1]['Osub_dist_amt'];
    this.AONsubdistshare = result[1]['AONsub_dist_amt'];
    this.totsubdistshare = result[1]['sub_dist_amount'];

    this.reselshare = result[1]['reseller_share'];
    this.Vreselshare = result[1]['Vreseller_amt'];
    this.Oreselshare = result[1]['Oreseller_amt'];
    this.AONreselshare = result[1]['AONreseller_amt'];
    this.totreselshare = result[1]['reseller_amount'];
    this.loading = false;
    this.setPage();
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
    this.pager = this.pageservice.getPager(this.count, this.page, this.limit);
    this.pagedItems = this.data;
  }

  async download() {
    let res = await this.ser.listGSTInvoice({
      bus_id: this.bus_name,
      groupid: this.group_name,
      resel_id: this.res_name,
      uid: this.cust_name,
      srvid: this.sername,
      inv_no: this.invoice_num,
      subplan: this.sub_plan,
      invtype: this.inv_type,
      invstatus: this.inv_status,
      paystatus: this.pay_status,
      srv_type: this.serv_type,
      role: this.resel_type
    })
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        if (this.role.getroleid() > 777) {
          param['ISP Name'] = temp[i]['busname'];
        }
        if (this.role.getroleid() >= 775) param['INVOICE ID'] = temp[i]['invid']
        if (this.role.getroleid() >= 775 || this.role.getroleid() > 444) {
          param['RESELLER TYPE'] = temp[i]['role'] == 444 ? 'Bulk Reseller' : temp[i]['role'] == 333 ? 'Deposit Reseller' : temp[i]['role'] == 666 ? 'Sub ISP Bulk' :
            temp[i]['role'] == 555 ? 'Sub ISP Deposit' : temp[i]['role'] == 551 ? 'Sub Distributor Deposit' : temp[i]['role'] == 661 ? 'Sun Distributor Bulk' : 'Hotel';
          param['RESELLER NAME'] = temp[i]['company'];
        }
        param['INVOICE NO'] = temp[i]['rollid'];
        param['SUBSCRIBER NAME'] = temp[i]['user_name'];
        param['PROFILE ID'] = temp[i]['userid']
        param['SERVICE TYPE'] = temp[i]['service_name'];
        param['SERVICE NAME'] = temp[i]['srvname'];
        param['SUB PLAN'] = temp[i]['sub_plan'];
        param['TIME UNIT'] = temp[i]['unit_type'] == 0 ? temp[i]['time_unit'] + ' Days' : temp[i]['time_unit'] + ' Months';
        param['ADDITIONAL DAYS'] = temp[i]['additional_days'];
        param['SUPPLIER GST'] = temp[i]['supplier_gst_number'];
        param['GST_No'] = temp[i]['recipient_gst_number'];
        param['State Code'] = temp[i]['state_code'];
        param['State'] = temp[i]['state'];
        param['PACK PRICE'] = temp[i]['invoice_amount'];
        param['TAX AMOUNT PRICE'] = temp[i]['tax_amount'];
        param['TOTAL PRICE'] = temp[i]['total_amount'];
        if (temp[i]['state_code'] == 33) {
          param['sgst_amount'] = temp[i]['sgst_amount'];
          param['cgst_amount'] = temp[i]['cgst_amount'];
          param['igst_amount'] = temp[i]['igst_amount'];
        } else {
          param['igst_amount'] = temp[i]['igst_amount'];
        }
        // param['final_invoice_amount'] = temp[i]['total_amount'];
        // temp[i]['cum_ispper'] = Number(temp[i]['cum_ispper']).toFixed(2)
        // temp[i]['cum_subispper'] = Number(temp[i]['cum_subispper']).toFixed(2)
        // temp[i]['cum_subdistper'] = Number(temp[i]['cum_subdistper']).toFixed(2)
        // temp[i]['cum_resellerper'] = Number(temp[i]['cum_resellerper']).toFixed(2)
        // param['CUMULATIVE ISPSHARE %'] = temp[i]['cum_ispper'] + " " + '%';
        // param['CUMULATIVE SUBISP SHARE %'] = temp[i]['cum_subispper'] + " " + '%';
        // param['CUMULATIVE SUBDIST SHARE %'] = temp[i]['cum_subdistper'] + " " + '%';
        // param['CUMULATIVE RESELLER SHARE %'] = temp[i]['cum_resellerper'] + " " + '%';
        param['INVOICE TYPE'] = temp[i]['inv_type'] == 1 ? 'Invoice' : 'GST Invoice';
        param['INVOICE STATUS'] = temp[i]['inv_status'] == 1 ? 'Active' : temp[i]['inv_status'] == 2 ? 'Proforma Invoice' : 'Cancelled';
        temp[i]['inv_date'] = this.datePipe.transform(temp[i]['inv_date'], 'd MMM y hh:mm:ss a')
        param['invoice_date'] = temp[i]['inv_date'];
        temp[i]['expiry_date'] = this.datePipe.transform(temp[i]['expiry_date'], 'd MMM y hh:mm:ss a')
        param['expiry_date'] = temp[i]['expiry_date'];

        param['INTERNET ISP %'] = Number(temp[i]['isp_per']).toFixed(2) + " " + '%';
        param['INTERNET SUBISP %'] = Number(temp[i]['sub_isp_per']).toFixed(2) + " " + '%';
        param['INTERNET SUBDIST %'] = Number(temp[i]['sub_dist_per']).toFixed(2) + " " + '%';
        param['INTERNET RESELLER %'] = Number(temp[i]['reseller_per']).toFixed(2) + " " + '%';
        param['INTERNET ISP ₹'] = temp[i]['isp_amt'];
        param['INTERNET SUBISP ₹'] = temp[i]['sub_isp_amt'];
        param['INTERNET SUBDIST ₹'] = temp[i]['sub_dist_amt'];
        param['INTERNET RESELLER ₹'] = temp[i]['resel_amt'];


        param['VOICE ISP %'] = Number(temp[i]['Visp_share']).toFixed(2) + " " + '%';
        param['VOICE SUBISP %'] = Number(temp[i]['Vsub_isp_share']).toFixed(2) + " " + '%';
        param['VOICE SUBDIST %'] = Number(temp[i]['Vsub_dist_share']).toFixed(2) + " " + '%';
        param['VOICE RESELLER %'] = Number(temp[i]['Vreseller_share']).toFixed(2) + " " + '%';
        param['VOICE ISP ₹'] = temp[i]['Visp_amt'];
        param['VOICE SUBISP ₹'] = temp[i]['Vsub_isp_amt'];
        param['VOICE SUBDIST ₹'] = temp[i]['Vsub_dist_amt'];
        param['VOICE RESELLER ₹'] = temp[i]['Vreseller_amt'];

        param['OTT ISP %'] = Number(temp[i]['Oisp_share']).toFixed(2) + " " + '%';
        param['OTT SUBISP %'] = Number(temp[i]['Osub_isp_share']).toFixed(2) + " " + '%';
        param['OTT SUBDIST %'] = Number(temp[i]['Osub_dist_share']).toFixed(2) + " " + '%';
        param['OTT RESELLER %'] = Number(temp[i]['Oreseller_share']).toFixed(2) + " " + '%';
        param['OTT ISP ₹'] = temp[i]['Oisp_amt'];
        param['OTT SUBISP ₹'] = temp[i]['Osub_isp_amt'];
        param['OTT SUBDIST ₹'] = temp[i]['Osub_dist_amt'];
        param['OTT RESELLER ₹'] = temp[i]['Oreseller_amt'];

        param['ADDON ISP %'] = Number(temp[i]['AONisp_share']).toFixed(2) + " " + '%';
        param['ADDON SUBISP %'] = Number(temp[i]['AONsub_isp_share']).toFixed(2) + " " + '%';
        param['ADDON SUBDIST %'] = Number(temp[i]['AONsub_dist_share']).toFixed(2) + " " + '%';
        param['ADDON RESELLER %'] = Number(temp[i]['AONreseller_share']).toFixed(2) + " " + '%';
        param['ADDON ISP ₹'] = temp[i]['AONisp_amt'];
        param['ADDON SUBISP ₹'] = temp[i]['AONsub_isp_amt'];
        param['ADDON SUBDIST ₹'] = temp[i]['AONsub_dist_amt'];
        param['ADDON RESELLER ₹'] = temp[i]['AONreseller_amt'];


        param['PAY STATUS'] = temp[i]['pay_status'] == 2 ? 'Paid' : 'Unpaid';
        temp[i]['paydate'] = temp[i]['paydate'] == '0000-00-00 00:00:00' ? '--' : this.datePipe.transform(temp[i]['paydate'], 'd MMM y hh:mm:ss a');
        param['PAY DATE'] = temp[i]['pay_status'] == 2 ? temp[i]['paydate'] : '--';
        param['COLLECTED'] = temp[i]['sub_payed_amt'];
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'GST-Invoice List' + EXCEL_EXTENSION);
    }
  }

  async einvoicingdl() {
    let res = await this.ser.listGSTInvoice({
      bus_id: this.bus_name,
      groupid: this.group_name,
      resel_id: this.res_name,
      uid: this.cust_name,
      srvid: this.sername,
      subplan: this.sub_plan,
      invtype: this.inv_type,
      invstatus: this.inv_status,
      paystatus: this.pay_status,
    })
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        param['Subscriber Name'] = temp[i]['user_name'];
        param['Profile ID'] = temp[i]['userid']
        param['GST_No'] = temp[i]['recipient_gst_number'];
        param['State Code'] = temp[i]['state_code'];
        param['State'] = temp[i]['state'];
        param['invoice_no'] = temp[i]['rollid'];
        temp[i]['inv_date'] = this.datePipe.transform(temp[i]['inv_date'], 'd MMM y hh:mm:ss a')
        param['invoice_date'] = temp[i]['inv_date'];
        temp[i]['expiry_date'] = this.datePipe.transform(temp[i]['expiry_date'], 'd MMM y hh:mm:ss a')
        param['expiry_date'] = temp[i]['expiry_date'];
        param['package_amount'] = temp[i]['invoice_amount'];
        if (temp[i]['state_code'] == 33) {
          param['sgst_amount'] = temp[i]['sgst_amount'];
          param['cgst_amount'] = temp[i]['cgst_amount'];
          param['igst_amount'] = temp[i]['igst_amount'];
        } else {
          param['igst_amount'] = temp[i]['igst_amount'];
        }
        param['final_invoice_amount'] = temp[i]['total_amount'];
        param['Invoice Status'] = temp[i]['inv_status'] == 1 ? 'Active' : temp[i]['inv_status'] == 2 ? 'Proforma Invoice' : 'Cancelled';

        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'E-Invoicing GST List' + EXCEL_EXTENSION);
    }
  }

  View(invdata, view) {
    const activeModal = this.nasmodel.open(ViewInvoiceComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'View Invoice';
    activeModal.componentInstance.invdata = invdata;
    activeModal.componentInstance.views = view;
    activeModal.result.then((data) => {

    })
  }

  inv_receipt(invdata) {
    const activeModal = this.nasmodel.open(InvoiceReceiptComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Receipt';
    activeModal.componentInstance.data = { invdata: invdata };
    activeModal.result.then((data) => {
    })
  }

  inv_trans(invdata) {
    const activeModal = this.nasmodel.open(InvTransactionComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Transaction';
    activeModal.componentInstance.data = { invdata: invdata };
    activeModal.result.then((data) => {
    })
  }

  shareshow(id, ser_type) {
    const activeModal = this.nasmodel.open(ServiceShareComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Share Details';
    activeModal.componentInstance.data = { invid: id, sertype: ser_type };
    activeModal.result.then((data) => {
    })
  }

  editdeposit(item) {
    localStorage.setItem('array', JSON.stringify(item));
    this.router.navigate(['/pages/Accounts/adddeposit']);
  };

  toastalert(msg, status = 0) {
    const toast: Toast = {
      type: status == 1 ? 'success' : 'warning',
      title: status == 1 ? 'Success' : 'Failure',
      body: msg,
      timeout: 5000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
  }
}
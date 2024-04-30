import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MacComponent } from '../MacManagment/mac.component';
import { AuthpassComponent } from '../ChangeauthPassword/authpass.component';
import { ProfilePasswordComponent } from '../ProfilePassword/profilepass.component';
import { UpdateUsernameComponent } from '../UpdateUsername/updateusername.component';
import { LogOffComponent } from '../Logoff/logoff.component';
import { CloseComponent } from '../Closesession/close.component';
import { RenewCustComponent } from '../RenewCustomer/renewCust.component';
import { ShowAuthpassComponent } from '../showauthpassword/showauthpass.component';
import {
  AccountService, CustService, RoleService, PagerService,
  ComplaintService, S_Service, OperationService, AdminuserService, ReportService
} from '../../_service/indexService';
import { ViewInvoiceComponent } from '../../Accounts/viewinvoice/viewinvoice.component';
import { ViewReceiptComponent } from '../../Accounts/viewreceipt/viewreceipt.component';
import { MacBindingComponent } from '../macbinding/macbinding.component';
import { ChangeServiceComponent } from '../changeservice/changeservice.component';
import { ChangeValidityComponent } from '../changevalidity/changevalidity.component';
import { DocpopComponent } from '../add-documents/add-documents.component';
import { CafFormComponent } from '../caf-form/caf-form.component';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import { StatsCardFrontComponent } from '../caf-flip/front-side/stats-card-front.component';
import { FlipCardComponent } from '../caf-flip/flip-card.component'
import { StatsCardBackComponent } from '../caf-flip/back-side/stats-card-back.component';
import { FlipModule } from 'ngx-flip';
import { trigger, state, style, animate, transition } from '@angular/animations';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationDialogService } from '../../../confirmation-dialog/confrimation-dialog.service'
import { CompliantHistoryComponent } from '../../complaint/comphistory/comp-history.component';
import { CancelInvoiceComponent } from '../cancelinvoice/cancelinvoice.component';
import { CustComplaintAddComponent } from '../addcomplaint/addcomplaint.component';
import { BalancePayComponent } from '../paybalance/paybalance.component';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { GraphpopComponent } from '../graphpop/graphpop.component';
import { LiveGraphComponent } from '../livegraph/livegraph.component';
import { ReasonComponent } from '../reason/reason.component';
import { LimitUpdateComponent } from '../updatelimit/updatelimit.component';
// import { SubsServiceAssignComponent } from './../subs-packmapping/subs-packmapping.component';
import { OTPComponent } from '../../dashboard/otp/add-otp.component';
import { JsonPipe, DatePipe } from '@angular/common';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { OttcountComponent } from '../../Administration/ottcount/ottcount.component';
import { ITreeOptions } from 'angular-tree-component';
import { toJS } from "mobx";
import { AddSuccessComponent } from '../success/add-success.component';
import { TopuprenewalComponent } from '../topuprenewal/topuprenewal.component';
import * as FileSaver from 'file-saver';
import { MessageComponent } from '../message/message.component';
@Component({
  selector: 'viewCust',
  templateUrl: './viewcust.component.html',
  styleUrls: ['./viewcust.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class ViewCustComponent implements OnInit{
  data: any = []; totalpage = 10; pages = [1, 2, 3, 4, 5]; id; editdata; subedit; schlist_flag;
  trafficdata: any = []; from_date = ''; to_date = ''; serid; datasplitinfo; invoicedata; imgdata; gstinvoice;
  img_result; receiptdata; img_doc; pro_pic; addr: any = 1; trafcount; totdl; totul; overaltot; name = 'angular'; complist;
  flip: boolean = false; flip1: boolean = false; flip2: boolean = false; state: string = 'default';
  verify: boolean = false; notverify: boolean = false; verifyid: boolean = false; notverifyid: boolean = false;
  verifyaddr: boolean = false; notverifyaddr: boolean = false; verifypic: boolean = false; notverifypic: boolean = false;
  cafverify: boolean = false; cafnotverify: boolean = false; renew_history; oldnew = 1; radact_tname; table_data; ottInvoiceData;
  topup_data;

  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25; srvidData: any[] = [];
  invpage:number =1;invcount;gstinvcount;gstinvpage:number=1;
  renewalpage:number=1;renewalcount;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes; servtype; custname; selectdata;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  @ViewChild('tree') public tree; selectedNodes = []; service = []; price = []; getSelected;
  nodes: any[] = []; pack: any;

  constructor(
    public router: Router,
    public nasmodel: NgbModal,
    private ser: CustService,
    private packser: S_Service,
    private accser: AccountService,
    public role: RoleService,
    public pageservice: PagerService,
    private compser: ComplaintService,
    private alert: ToasterService,
    private opser: OperationService,
    private confirmservice: ConfirmationDialogService,
    private datePipe: DatePipe,
    private adminser: AdminuserService,
    private reportser: ReportService
  ) {
    this.id = JSON.parse(localStorage.getItem('details'));
    this.schlist_flag = JSON.parse(localStorage.getItem('schedflag'))
  }
  // ngOnDestroy(): void {
  //    localStorage.removeItem('details')
  // }

  async ngOnInit() {
    // localStorage.removeItem('array');
    // console.log('ID', this.id)
    await this.view();

  }

  refresh() {
    this.view();
  }

  rotate(event) {
    event.style.transitionDuration = '1s'
    let rotate = parseInt((event.style.transform.match(/(\d+)/) || [])[0] || '0') + 90
    event.style.transform = `rotate(${rotate}deg)`
  }
  cancel() {
    if (this.schlist_flag == 11) {
      this.router.navigate(['/pages/cust/listscheduled']);
    } else {
      this.router.navigate(['/pages/cust/custList']);
    }
  }

  downloadFile(id, username) {
     this.ser.downloadFile({ uid: id, username: username }).subscribe((resp: any) => {
      console.log('resp', resp);
      this.downloadFiles(resp, id)
    }, (error: any) => {
      console.log('error', error);
    })

  }

  downloadFiles(data: any, uid) {
     var blob, fileName;
    if (data.type == 'image/png') {
      blob = new Blob([data], { type: 'application/png' });
      fileName = `${uid}.PNG`;

    }
    else {
      blob = new Blob([data], { type: 'application/zip' });
      fileName = `${uid}.ZIP`;

    }
    FileSaver.saveAs(blob, fileName);
  }

  async view() {
    this.loading = true;
    let result = await this.ser.ViewSubscriber({ id: this.id })
    if (result) {
      this.loading = false;
    }
    this.data = result || [];
    console.log('data', this.data)
    this.data['addr'] = 1;
    this.serid = result['srvid'];
    // console.log("Hold", this.data.lastlogoff, 'length', this.data.length)
    this.data.lcdllimit = this.data.lcdllimit == 0 ? 0 : this.bytefunc(this.data.lcdllimit);
    this.data.lcuplimit = this.data.lcuplimit == 0 ? 0 : this.bytefunc(this.data.lcuplimit);
    this.data.lclimitcomb = this.data.lclimitcomb == 0 ? 0 : this.bytefunc(this.data.lclimitcomb);
    if (this.data['status'] == 3) {
      let ontime = this.data['hold_in_second']
      this.data['hold_in_second'] = this.secondconvert(ontime);
    }
  }

  async mobverify(flag) {
    // console.log('Moile Verify In', flag);
    if (window.confirm('Are you sure want to continue')) {
      if (this.role.getroleid() != 111) {
        // console.log('Moile Verify', flag);
        this.loading = true;
        let res = await this.ser.mobileverify({ flag: flag, uid: this.id });
        if (res[0]['error_msg'] == 0 && flag == 1) {
          this.loading = false;
          const activeModal = this.nasmodel.open(OTPComponent, { size: 'sm', container: 'nb-layout' });
          activeModal.componentInstance.item = { mobflag: 1, custid: this.id };
          activeModal.componentInstance.modalHeader = 'Mobile OTP';
          activeModal.result.then((data) => {
            this.view();
          });
        } else {
          // console.log('response', res)
          this.loading = false;
          if (res[0]['error_msg'] == 0) this.view();
          this.toastalert(res[0]['msg'], res[0]['error_msg']);
        }
      } else {
        this.loading = true;
        let res = await this.ser.mobileverify({ flag: flag });
        this.loading = false;
        if (res[0]['error_msg'] == 0) {
          const activeModal = this.nasmodel.open(OTPComponent, { size: 'sm', container: 'nb-layout' });
          activeModal.componentInstance.item = { mobflag: 1 };
          activeModal.componentInstance.modalHeader = 'Mobile OTP';
          activeModal.result.then((data) => {
            this.view();
          });
        } else {
          this.toastalert(res[0]['msg'], res[0]['error_msg']);
        }
      }
    }
  }

  async mailverify(flag) {
    if (window.confirm('Are you sure want to continue')) {
      if (this.role.getroleid() != 111) {
        this.loading = true;
        let res = await this.ser.emailverify({ flag: flag, uid: this.id });
        this.loading = false;
        if (res[0]['error_msg'] == 0 && flag == 1) {
          const activeModal = this.nasmodel.open(OTPComponent, { size: 'sm', container: 'nb-layout' });
          activeModal.componentInstance.item = { mailflag: 2, custid: this.id };
          activeModal.componentInstance.modalHeader = 'Email OTP';
          activeModal.result.then((data) => {
            this.view();
          });
        } else {
          this.loading = false;
          if (res[0]['error_msg'] == 0) this.view();
          this.toastalert(res[0]['msg'], res[0]['error_msg']);
        }
      } else {
        this.loading = true;
        let res = await this.ser.emailverify({ flag: flag });
        if (res[0]['error_msg'] == 0) {
          this.loading = false;
          const activeModal = this.nasmodel.open(OTPComponent, { size: 'sm', container: 'nb-layout' });
          activeModal.componentInstance.item = { mailflag: 2 };
          activeModal.componentInstance.modalHeader = 'Email OTP';
          activeModal.result.then((data) => {
            this.view();
          });
        } else {
          this.loading = false;
          if (res[0]['error_msg'] == 0) this.view();
          this.toastalert(res[0]['msg'], res[0]['error_msg']);
        }
      }
    }
  }

  async getImage() {
    // console.log("hit")
    var subsusername = this.data.username,
      profileid = this.data.cust_profile_id
    // console.log(subsusername)
    this.loading = true;
    let result = await this.ser.getImage({ username: subsusername, profileid: profileid })
    this.img_result = result;
    if (this.img_result) {
      this.loading = false;
      for (const key in result) {
        if (Object.prototype.hasOwnProperty.call(result, key)) {
          const element = result[key];
          this.img_result[key] = 'data:image/png;base64,' + element
          // console.log("image",this.img_result)

        }
      }
    }
  }

  toastalert(msg, status = 1) {
    const toast: Toast = {
      type: status == 0 ? 'success' : 'warning',
      title: status == 0 ? 'Success' : 'Failure',
      body: msg,
      timeout: 3000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
  }

  async getlivegraph(proid) {
    // console.log("nas",result);
    const activeModal = this.nasmodel.open(LiveGraphComponent, { size: 'lg', container: 'nb-layout' });
    // backdrop: 'static'
    activeModal.componentInstance.modalHeader = 'Live Graph';
    activeModal.componentInstance.item = { id: this.id, proid: proid }
    activeModal.result.then((data) => {
      this.view();
    })

  }

  async getDocument() {
    console.log('notverfiy', this.notverify);

    this.loading = true;
    // console.log("hit")
    var subsusername = this.data.cust_profile_id
    // profileid = this.data.cust_profile_id
    // console.log(subsusername)
    let result = await this.ser.getDocument({ username: subsusername })
    this.img_doc = result;
    // console.log("image",this.img_doc)
    if (this.img_doc) {
      this.loading = false;
      for (const key in result) {
        if (Object.prototype.hasOwnProperty.call(result, key)) {
          const element = result[key];
          this.img_doc[key] = 'data:image/png;base64,' + element
          // console.log("image",this.img_result)

        }
      }
    }
  }

  async getprofilepic() {
    // console.log("hit")
    this.loading = true;
    var subsusername = this.data.cust_profile_id
    // profileid = this.data.cust_profile_id
    // console.log(subsusername)
    let result = await this.ser.getProfilePhoto({ username: subsusername })
    this.pro_pic = result;
    // console.log("image",this.pro_pic)
    if (this.pro_pic) {
      this.loading = false;
      for (const key in result) {
        if (Object.prototype.hasOwnProperty.call(result, key)) {
          const element = result[key];
          this.pro_pic[key] = 'data:image/png;base64,' + element
          // console.log("image",this.pro_pic)

        }
      }
    }
  }

  async docverify(ver_flag) {
    // console.log("verifyflag", ver_flag);
    this.confirmservice.confirm('Confirm Box', 'Please confirm Your Request').then(async (confrimed) => {
      if (confrimed == true) {
        if (ver_flag == 5) {
          this.cafverify = true;
          let result = await this.ser.verifyDocument({ uid: this.id, caf_status: 2 })
          // console.log(result);
          const toast: Toast = {
            type: result['error_msg'] == 0 ? 'success' : 'warning',
            title: result['error_msg'] == 0 ? 'Success' : 'Failure',
            body: result['msg'],
            timeout: 3000,
            showCloseButton: true,
            bodyOutputType: BodyOutputType.TrustedHtml,
          };
          this.alert.popAsync(toast);
          if (result['error_msg'] == 0) {
            await this.view();
          }
        }
        if (ver_flag == 10) {
          this.cafnotverify = true;
          let result = await this.ser.verifyDocument({ uid: this.id, caf_status: 3 })
          // console.log(result);
          const toast: Toast = {
            type: result['error_msg'] == 0 ? 'success' : 'warning',
            title: result['error_msg'] == 0 ? 'Success' : 'Failure',
            body: result['msg'],
            timeout: 3000,
            showCloseButton: true,
            bodyOutputType: BodyOutputType.TrustedHtml,
          };
          this.alert.popAsync(toast);
          if (result['error_msg'] == 0) {
            await this.view();
          }
        }
        if (ver_flag == 11) {
          this.verify = true;
          let result = await this.ser.verifyDocument({ uid: this.id, addr_status: 2, sameproof: this.data['proof_same'] })
          // console.log(result);
          const toast: Toast = {
            type: result['error_msg'] == 0 ? 'success' : 'warning',
            title: result['error_msg'] == 0 ? 'Success' : 'Failure',
            body: result['msg'],
            timeout: 3000,
            showCloseButton: true,
            bodyOutputType: BodyOutputType.TrustedHtml,
          };
          this.alert.popAsync(toast);
          if (result['error_msg'] == 0) {
            await this.view();
          }
        }

        if (ver_flag == 15) {
          this.notverify = true;
          let result = await this.ser.verifyDocument({ uid: this.id, addr_status: 3, sameproof: this.data['proof_same'] })
          const toast: Toast = {
            type: result['error_msg'] == 0 ? 'success' : 'warning',
            title: result['error_msg'] == 0 ? 'Success' : 'Failure',
            body: result['msg'],
            timeout: 3000,
            showCloseButton: true,
            bodyOutputType: BodyOutputType.TrustedHtml,
          };
          this.alert.popAsync(toast);
          if (result['error_msg'] == 0) {
            await this.view()
          }
        }

        if (ver_flag == 21) {
          this.verifyid = true;
          let result = await this.ser.verifyDocument({ uid: this.id, id_status: 2, sameproof: this.data['proof_same'] })
          const toast: Toast = {
            type: result['error_msg'] == 0 ? 'success' : 'warning',
            title: result['error_msg'] == 0 ? 'Success' : 'Failure',
            body: result['msg'],
            timeout: 3000,
            showCloseButton: true,
            bodyOutputType: BodyOutputType.TrustedHtml,
          };
          this.alert.popAsync(toast);
          if (result['error_msg'] == 0) {
            await this.view()
          }
        }

        if (ver_flag == 25) {
          this.notverifyid = true;
          let result = await this.ser.verifyDocument({ uid: this.id, id_status: 3, sameproof: this.data['proof_same'] })
          const toast: Toast = {
            type: result['error_msg'] == 0 ? 'success' : 'warning',
            title: result['error_msg'] == 0 ? 'Success' : 'Failure',
            body: result['msg'],
            timeout: 3000,
            showCloseButton: true,
            bodyOutputType: BodyOutputType.TrustedHtml,
          };
          this.alert.popAsync(toast);
          if (result['error_msg'] == 0) {
            await this.view()
          }
        }

        if (ver_flag == 31) {
          this.verifyaddr = true;
          let result = await this.ser.verifyDocument({ uid: this.id, id_status: 2, addr_status: 2, sameproof: this.data['proof_same'] })
          const toast: Toast = {
            type: result['error_msg'] == 0 ? 'success' : 'warning',
            title: result['error_msg'] == 0 ? 'Success' : 'Failure',
            body: result['msg'],
            timeout: 3000,
            showCloseButton: true,
            bodyOutputType: BodyOutputType.TrustedHtml,
          };
          this.alert.popAsync(toast);
          if (result['error_msg'] == 0) {
            await this.view()
          }
        }

        if (ver_flag == 35) {
          this.notverifyaddr = true;
          let result = await this.ser.verifyDocument({ uid: this.id, id_status: 3, addr_status: 3, sameproof: this.data['proof_same'] })
          const toast: Toast = {
            type: result['error_msg'] == 0 ? 'success' : 'warning',
            title: result['error_msg'] == 0 ? 'Success' : 'Failure',
            body: result['msg'],
            timeout: 3000,
            showCloseButton: true,
            bodyOutputType: BodyOutputType.TrustedHtml,
          };
          this.alert.popAsync(toast);
          if (result['error_msg'] == 0) {
            await this.view()
          }
        }

        if (ver_flag == 51) {
          this.verifypic = true;
          let result = await this.ser.verifyDocument({ uid: this.id, user_photo_status: 2 })
          const toast: Toast = {
            type: result['error_msg'] == 0 ? 'success' : 'warning',
            title: result['error_msg'] == 0 ? 'Success' : 'Failure',
            body: result['msg'],
            timeout: 3000,
            showCloseButton: true,
            bodyOutputType: BodyOutputType.TrustedHtml,
          };
          this.alert.popAsync(toast);
          if (result['error_msg'] == 0) {
            await this.view()
          }
        }

        if (ver_flag == 55) {
          this.notverifypic = true;
          let result = await this.ser.verifyDocument({ uid: this.id, user_photo_status: 3 })
          const toast: Toast = {
            type: result['error_msg'] == 0 ? 'success' : 'warning',
            title: result['error_msg'] == 0 ? 'Success' : 'Failure',
            body: result['msg'],
            timeout: 3000,
            showCloseButton: true,
            bodyOutputType: BodyOutputType.TrustedHtml,
          };
          this.alert.popAsync(toast);
          if (result['error_msg'] == 0) {
            await this.view()
          }
        }
      }
    }).catch(() => {
      return;
    })
  }

  async invoicelist() {
    this.loading = true
    let res = await this.accser.listInvoice({ uid: this.id, invtype: 1, index: (this.invpage-1) * this.limit, limit: this.limit })  // Non-GST Invoice
    this.loading = false;
    console.log('Response',res);
    this.invoicedata = res[0];
    this.invcount = res[1]['tot']
    this.setInvoicePage()
  }

  getInvoiceList(page) {
    var total = Math.ceil(this.invcount / this.limit);
    let result = this.pageservice.pageValidator(this.invpage, page, total);
    this.invpage = result['value'];
    if (result['result']) {
      this.invoicelist();
    }
  }

  setInvoicePage() {
    this.pager = this.pageservice.getPager(this.invcount, this.invpage, this.limit);
    this.pagedItems = this.invoicedata;
  }

  async downloadInvoice() {
    this.loading = true
    let res = await this.accser.listInvoice({ uid: this.id, invtype: 1 })  // Non-GST Invoice
    this.loading = false;
    this.invoicedata = res[0];
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        param['INVOICE ID'] = temp[i]['invid'];
        param['SERVICE TYPE'] = temp[i]['service_name'];
        param['SERVICE NAME'] = temp[i]['srvname'];
        param['SUB PLAN'] = temp[i]['sub_plan'];
        param['PACK PRICE'] = temp[i]['invoice_amount'];
        param['TAX AMOUNT'] = temp[i]['tax_amount'];
        param['BILL NO'] = temp[i]['rollid'];
        param['GST NUMBER'] = temp[i]['supplier_gst_number'];
        param['IGST'] = Number(temp[i]['igst']).toFixed(2) + " " + '%';
        param['CGST'] = Number(temp[i]['cgst']).toFixed(2) + " " + '%';
        param['SGST'] = Number(temp[i]['sgst']).toFixed(2) + " " + '%';
        param['INVOICE TYPE'] = temp[i]['inv_type'] == 1 ? 'Invoice' : 'GST Invoice';
        param['INVOICE STATUS'] = temp[i]['inv_status'] == 1 ? 'Active' : temp[i]['inv_status'] == 2 ? 'Proforma Invoice' : 'Cancelled';
        param['RENEWAL DATE	'] = this.datePipe.transform(temp[i]['inv_date'], 'd MMM y hh:mm:ss a');
        param['EXPIRE DATE'] = this.datePipe.transform(temp[i]['expiry_date'], 'd MMM y hh:mm:ss a');
        param['PAY STATUS'] = temp[i]['pay_status'] == 2 ? 'Paid' : 'Unpaid';
        temp[i]['pay_status'] = temp[i]['pay_status'] == 2 ? this.datePipe.transform(temp[i]['paydate'], 'd MMM y hh:mm:ss a') : '--';
        param['PAY DATE'] = temp[i]['pay_status']
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Invoice List' + EXCEL_EXTENSION);
    }
  }

  async gstInvoice() {
    this.loading = true;
    let resp = await this.accser.listInvoice({ uid: this.id, invtype: 2, index: (this.gstinvpage-1) * this.limit, limit: this.limit })  // GST Invoice
    this.loading = false;
    this.gstinvoice = resp[0];
    this.gstinvcount = resp[1]['tot']
    this.setGSTInvoicePage()
    // console.log(res);
  }

  getGSTInvoiceList(page) {
    var total = Math.ceil(this.gstinvcount / this.limit);
    let result = this.pageservice.pageValidator(this.gstinvpage, page, total);
    this.gstinvpage = result['value'];
    if (result['result']) {
      this.gstInvoice();
    }
  }

  setGSTInvoicePage() {
    this.pager = this.pageservice.getPager(this.gstinvcount, this.gstinvpage, this.limit);
    this.pagedItems = this.gstinvoice;
  }

  async ottInvoice() {
    this.loading = true
    let res = await this.accser.ottInvoice({ uid: this.id, index: 0, limit: 10 })  // Non-GST Invoice
    this.loading = false;
    this.ottInvoiceData = res[0];
  }


  async renewal_history() {
    this.loading = true;
    let resp = await this.accser.renewalHistory({ uid: this.id, index: (this.renewalpage-1) * this.limit, limit: this.limit });
    // console.log('Renewal History Result', resp);
    this.loading = false;
    this.renew_history = resp[0];
    for (let i = 0; i < this.renew_history.length; i++) {
      this.renew_history[i]['upload'] = this.renew_history[i]['trafficunitul'] == 0 ? 0 : this.bytefunct(this.renew_history[i]['trafficunitul']);
      this.renew_history[i]['download'] = this.renew_history[i]['trafficunitdl'] == 0 ? 0 : this.bytefunct(this.renew_history[i]['trafficunitdl']);
      this.renew_history[i]['total'] = this.renew_history[i]['trafficunitcomb'] == 0 ? 0 : this.bytefunct(this.renew_history[i]['trafficunitcomb']);
      // console.log( "speed",this.trafficdata[i]['total'])
    }
    this.renewalcount = resp[1]['count'];
    this.setRenewalPage()

  }

  getRenewalList(page) {
    var total = Math.ceil(this.renewalcount / this.limit);
    let result = this.pageservice.pageValidator(this.renewalpage, page, total);
    this.renewalpage = result['value'];
    if (result['result']) {
      this.renewal_history();
    }
  }

  setRenewalPage() {
    this.pager = this.pageservice.getPager(this.renewalcount, this.renewalpage, this.limit);
    this.pagedItems = this.gstinvoice;
  }

  async topupReport() {
    this.loading = true;
    const resp = await this.reportser.topupReport({ uid: this.id, index: 0, limit: 10 });
    this.loading = false;
    this.topup_data = resp[0];
  }
  async listcomplaint() {
    let result = await this.compser.listComplaint({ uid: this.id });
    this.complist = result[0]
    // console.log('complist',this.complist);

  }

  history(compid) {
    const activeModal = this.nasmodel.open(CompliantHistoryComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Complaint History';
    activeModal.componentInstance.item = { id: compid };
    activeModal.result.then((data) => {
      this.listcomplaint();
      this.view();
    })
  }

  pay(invid, uid, amnt,type) {
    const activeModal = this.nasmodel.open(BalancePayComponent, { size: 'sm', container: 'nb-layout' })
    activeModal.componentInstance.modalHeader = 'Balance Payment';
    activeModal.componentInstance.item = { invid: invid, uid: uid, payamt: amnt };
    activeModal.result.then((data) => {
      console.log('Result', data);
     if(type == 1) this.invoicelist();
     else this.gstInvoice();
      // this.view();
    })

  }

  changePayStatus(invid,uid,type){
    const activeModal = this.nasmodel.open(MessageComponent, { size: 'lg', container: 'nb-layout' })
    activeModal.componentInstance.modalHeader = 'Change Payment Status';
    activeModal.componentInstance.item = { invid: invid, uid: uid,inv_type:type };
    activeModal.result.then((data) => {
      console.log('Result', data);
      if(type == 1) this.invoicelist();
      else this.gstInvoice();
      // this.view();
    })  }

  async receiptlist() {
    this.loading = true;
    let res = await this.accser.listInvReceipt({ uid: this.id })
    this.loading = false;
    this.receiptdata = res[0];
    // console.log(res);
  }

  async splitdata() {
    let res = await this.ser.showDatasplit({
      index: (this.page - 1) * this.limit,
      limit: this.limit, uid: this.id, srvid: this.serid
    })
    this.datasplitinfo = res;
    // console.log(res)
    for (let i = 0; i < this.datasplitinfo.length; i++) {
      this.datasplitinfo[i]['upload'] = this.datasplitinfo[i]['trafficunitul'] == 0 ? 0 : this.bytefunct(this.datasplitinfo[i]['trafficunitul']);
      this.datasplitinfo[i]['download'] = this.datasplitinfo[i]['trafficunitdl'] == 0 ? 0 : this.bytefunct(this.datasplitinfo[i]['trafficunitdl']);
      this.datasplitinfo[i]['total'] = this.datasplitinfo[i]['trafficunitcomb'] == 0 ? 0 : this.bytefunct(this.datasplitinfo[i]['trafficunitcomb']);
      // console.log( "speed",this.trafficdata[i]['total'])
    }
  }

  async splitupdate(item) {
    let res = await this.packser.datasplitupdate({ dsid: item });
    const toast: Toast = {
      type: res[0]['error_msg'] == 0 ? 'success' : 'warning',
      title: res[0]['error_msg'] == 0 ? 'Success' : 'Failure',
      body: res[0]['msg'],
      timeout: 3000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
    if (res[0]['error_msg'] == 0) {
      await this.splitdata();
      await this.view();
    }
  }

  bytefunc(datam) {
    // console.log(datam)
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(datam) / Math.log(k));
    return (parseFloat((datam / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i])
  }

  bytefunct(datam) {
    // console.log(datam)
    const k = 1024;
    const sizes = ['MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(datam) / Math.log(k));
    return (parseFloat((datam / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i])
  }

  async showTableName() {
    this.table_data = await this.ser.showRadacctName({});
  }

  async trafficreport() {
    // console.log('Oldnew', this.oldnew, 'Table data', this.radact_tname)
    if (this.oldnew == 2 && !this.radact_tname) {
      window.alert('Please select table name');
      return;
    }
    let result = await this.ser.showdatatrafic({
      index: (this.page - 1) * this.limit,
      limit: this.limit, uid: this.id, stime: this.from_date, etime: this.to_date,
      oldnew: this.oldnew, tname: this.radact_tname
    })
    this.trafficdata = result[0];
    this.trafcount = result[1]['count']
    var dltot = result[1]['totoutput'],
      ultot = result[1]['totinput'],
      totlimit = result[1]['total'];
    this.totdl = dltot == 0 ? '0 Bytes' : this.bytefunc(dltot);
    this.totul = ultot == 0 ? 'o Bytes' : this.bytefunc(ultot);
    this.overaltot = totlimit == 0 ? '0 Bytes' : this.bytefunc(totlimit);
    // console.log("traffic:", result)
    for (let i = 0; i < this.trafficdata.length; i++) {
      this.trafficdata[i]['time'] = this.secondconvert(this.trafficdata[i]['dhms']);
      this.trafficdata[i]['upload'] = this.trafficdata[i]['acctinputoctets'] == 0 ? '0 Bytes' : this.bytefunc(this.trafficdata[i]['acctinputoctets']);
      this.trafficdata[i]['download'] = this.trafficdata[i]['acctoutputoctets'] == 0 ? '0 Bytes' : this.bytefunc(this.trafficdata[i]['acctoutputoctets']);
      this.trafficdata[i]['total'] = this.trafficdata[i]['tot'] == 0 ? '0 Bytes' : this.bytefunc(this.trafficdata[i]['tot']);

      // console.log( "speed",this.trafficdata[i]['total'])
    }
    this.setPage();
  }

  async downloadtraffic() {
    let result = await this.ser.showdatatrafic({
      uid: this.id, stime: this.from_date, etime: this.to_date,
      oldnew: this.oldnew, tname: this.radact_tname
    })
    if (result) {

      let tempdata = [], temp: any = result[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        param['USERNAME'] = temp[i]['username'];
        temp[i]['acctstarttime'] = this.datePipe.transform(temp[i]['acctstarttime'], 'd MMM y h:mm:ss a');
        temp[i]['acctstoptime'] = this.datePipe.transform(temp[i]['acctstoptime'], 'd MMM y h:mm:ss a');
        param['START TIME'] = temp[i]['acctstarttime'];
        param['STOP TIME'] = temp[i]['acctstoptime'];
        temp[i]['dhms'] = this.secondconvert(temp[i]['dhms'])
        param['TIME'] = temp[i]['dhms'];
        param['PROTOCOL TYPE'] = temp[i]['protocoltype'];
        param['FRAMED IP'] = temp[i]['framedipaddress'];
        param['NAS IP'] = temp[i]['nasipaddress'];
        param['UL LIMIT'] = temp[i]['acctinputoctets'] == 0 ? '0 Bytes' : this.bytefunc(temp[i]['acctinputoctets']);
        param['DL LIMIT'] = temp[i]['acctoutputoctets'] == 0 ? '0 Bytes' : this.bytefunc(temp[i]['acctoutputoctets']);
        param['TOTAL LIMIT'] = temp[i]['tot'] == 0 ? '0 Bytes' : this.bytefunc(temp[i]['tot']);
        param['TERMINATE CAUSE'] = temp[i]['acctterminatecause'] == '' ? '--' : temp[i]['acctterminatecause'];
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Traffic Report' + EXCEL_EXTENSION);
    }
  }


  getlist(page) {
    var total = Math.ceil(this.trafcount / this.limit);
    let result = this.pageservice.pageValidator(this.page, page, total);
    this.page = result['value'];
    if (result['result']) {
      this.trafficreport();
    }
  }

  setPage() {
    // console.log(this.data);
    this.pager = this.pageservice.getPager(this.trafcount, this.page, this.limit);
    this.pagedItems = this.trafficdata;

    // console.log('asdfg',this.pagedItems)
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
  cafclickpic(item, picflag) {
    localStorage.setItem('array', JSON.stringify(item));
    localStorage.setItem('flag', JSON.stringify(picflag));
    this.router.navigate(['/pages/cust/add-custpic']);
  }

  addpic(uid, item, picflag) {
    localStorage.setItem('array', JSON.stringify(item));
    localStorage.setItem('flag', JSON.stringify(picflag));
    localStorage.setItem('subid', JSON.stringify(uid));
    this.router.navigate(['/pages/cust/add-custpic']);
  }

  snapaddrproof(uid, item, picflag) {
    localStorage.setItem('array', JSON.stringify(item));
    localStorage.setItem('flag', JSON.stringify(picflag));
    localStorage.setItem('subid', JSON.stringify(uid));

    this.router.navigate(['/pages/cust/add-custpic']);
  }

  snapidproof(uid, item, picflag) {
    localStorage.setItem('array', JSON.stringify(item));
    localStorage.setItem('flag', JSON.stringify(picflag));
    localStorage.setItem('subid', JSON.stringify(uid));

    this.router.navigate(['/pages/cust/add-custpic']);
  }

  async subshold(uid, flag) {
    this.confirmservice.confirm('Please Confirm', 'Are you Sure Want to complete the action').then(async (confirmed) => {
      if (confirmed) {
        const activeModal = this.nasmodel.open(ReasonComponent, { size: 'sm', container: 'nb-layout' });
        activeModal.componentInstance.modalHeader = 'Reason';
        activeModal.componentInstance.item = { custid: uid, flag: flag };
        activeModal.result.then((data) => {
          this.view();
        })
      }
    }).catch();

  }

  renew_user(cust_id, role, cdate, edate,acc_type,expmode,exptime) {
    const activeModal = this.nasmodel.open(RenewCustComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Renew Customer';
    activeModal.componentInstance.item = { cust_id: cust_id, role: role, cdate: cdate, edate: edate,acc_type:acc_type,expmode:expmode,exptime:exptime }
    activeModal.result.then((data) => {
      this.view();
    })
  }

  topup(cust_id, resel_id) {
    const activeModal = this.nasmodel.open(TopuprenewalComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'TopUp';
    activeModal.componentInstance.item = { cust_id: cust_id, resel_id: resel_id }
    activeModal.result.then((data) => {
      this.view();
    })
  }

  change_serv(cust_id) {
    const activeModal = this.nasmodel.open(ChangeServiceComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.componentInstance.modalHeader = 'Change Service';
    activeModal.componentInstance.item = { cust_id: cust_id }
    activeModal.result.then((data) => {
      this.view();
    })
  }

  updateLimit() {
    const activeModal = this.nasmodel.open(LimitUpdateComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.componentInstance.modalHeader = 'Update Limit';
    activeModal.componentInstance.item = { cust_id: this.id, dl_limit: this.data.limitdl, ul_limit: this.data.limitul, tot_limit: this.data.limitcomb }
    activeModal.result.then((data) => {
      this.view();
    })
  }

  change_validity(cust_id) {
    const activeModal = this.nasmodel.open(ChangeValidityComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Change Validity';
    activeModal.componentInstance.item = { cust_id: cust_id }
    activeModal.result.then((data) => {
      this.view();
    })
  }


  Add_mac() {
    const activeModal = this.nasmodel.open(MacComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'MAC Management';
    activeModal.componentInstance.item = this.id
    activeModal.result.then((data) => {
      this.view();
    })
  }

  // servicemap() {
  //   const activeModal = this.nasmodel.open(SubsServiceAssignComponent, { size: 'lg', container: 'nb-layout' });
  //   activeModal.componentInstance.modalHeader = 'Service Mapping';
  //   activeModal.componentInstance.item = this.id
  //   activeModal.result.then((data) => {
  //     this.view();
  //   })
  // }

  mac_bind() {
    const activeModal = this.nasmodel.open(MacBindingComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'MAC Binding';
    activeModal.componentInstance.item = this.id
    activeModal.result.then((data) => {
      this.view();
    })
  }

  show_auth() {
    const activeModal = this.nasmodel.open(ShowAuthpassComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Auth Password';
    activeModal.componentInstance.item = this.id
    activeModal.result.then((data) => {
      this.view();
    })
  }

  show_propass() {
    const activeModal = this.nasmodel.open(ShowAuthpassComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Profile Password';
    activeModal.componentInstance.item = { id: this.id, password: 1 }
    activeModal.result.then((data) => {
      this.view();
    })
  }

  cafuploadproof(uid, proid, cafaddr) {
    const activeModal = this.nasmodel.open(DocpopComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'CAF Upload';
    activeModal.componentInstance.item = { uid: uid, proid: proid, cafaddr: cafaddr };
    activeModal.result.then((data) => {
      this.view();
    })
  }

  addrsproof(uid, proid, addr) {
    const activeModal = this.nasmodel.open(DocpopComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Address Proof';
    activeModal.componentInstance.item = { uid: uid, proid: proid, addr: addr };
    activeModal.result.then((data) => {
      this.view();
    })
  }

  idproof(uid, proid, idproof) {
    const activeModal = this.nasmodel.open(DocpopComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Identity Proof';
    activeModal.componentInstance.item = { uid: uid, proid: proid, idproof: idproof };
    activeModal.result.then((data) => {
      this.view();
    })
  }

  custpicupload(uid, proid, subpicflag) {
    const activeModal = this.nasmodel.open(DocpopComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Subscriber Picture';
    activeModal.componentInstance.item = { uid: uid, proid: proid, subpicflag: subpicflag };
    activeModal.result.then((data) => {
      this.view();
    })
  }

  complaintadd(busid, resid, uid) {
    const activeModal = this.nasmodel.open(CustComplaintAddComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.item = { busid: busid, resid: resid, uid: uid };
    activeModal.componentInstance.modalHeader = 'Add Complaint';
    activeModal.result.then((data) => {
      this.listcomplaint();
      this.view();
    })
  }

  cancelinv(invid, invflag) {
    const activeModal = this.nasmodel.open(CancelInvoiceComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.item = { invid: invid, flag: invflag };
    activeModal.componentInstance.modalHeader = 'Cancel Invoice';
    activeModal.result.then((data) => {
      this.view();
    })
  }

  Add_profile() {
    const activeModal = this.nasmodel.open(ProfilePasswordComponent, { size: 'sm', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Change Profile Password';
  }

  Add_auth() {
    const activeModal = this.nasmodel.open(AuthpassComponent, { size: 'sm', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Change Auth Password';
  }

  Add_update() {
    const activeModal = this.nasmodel.open(UpdateUsernameComponent, { size: 'sm', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Update UserName';
    activeModal.result.then((data) => {
      this.view();
    })
  }

  logoff() {
    const activeModal = this.nasmodel.open(LogOffComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });

    activeModal.componentInstance.modalHeader = 'Log Off';

    activeModal.componentInstance.item = this.id;

    activeModal.result.then((data) => {
      this.view();
    })
  }

  close() {
    const activeModal = this.nasmodel.open(CloseComponent, { size: 'sm', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Close Session';

    activeModal.componentInstance.item = this.id;

    activeModal.result.then((data) => {
      this.view();
    })
  }

  view_invoice(invdata, view) {
    const activeModal = this.nasmodel.open(ViewInvoiceComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'View Invoice';
    activeModal.componentInstance.invdata = invdata;
    activeModal.componentInstance.views = view;
    activeModal.result.then((data) => {

    })
  }


  view_receipt(recid) {
    console.log('Invoice Receipt ID:', recid)
    const activeModal = this.nasmodel.open(ViewReceiptComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.item = recid;
    activeModal.componentInstance.modalHeader = 'View Receipt';
    activeModal.result.then((data) => {

    })
  }

  async cancel_receipt(invrecid, recflag) {
    const activeModal = this.nasmodel.open(CancelInvoiceComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.item = { invrecid: invrecid, flag: recflag };
    activeModal.componentInstance.modalHeader = 'Cancel Receipt';
    activeModal.result.then((data) => {
      this.receiptlist();
      this.view();
    })
  }

  cafform() {
    localStorage.setItem('custid', JSON.stringify(this.id))
    localStorage.setItem('isp_id', JSON.stringify(this.data['isp_id']))
    const activeModal = this.nasmodel.open(CafFormComponent, { size: 'lg', container: 'nb-layout', windowClass: 'custom-class', backdrop: 'static' });
    activeModal.componentInstance.modalHeader = 'View CAF Form';
    activeModal.componentInstance.status = this.data.caf_photo_status
    activeModal.result.then((data) => {

    })
  }

  getDocument1(item) {
    localStorage.setItem('custid', JSON.stringify(this.id))
    const activeModal = this.nasmodel.open(FlipCardComponent, { size: 'lg', container: 'nb-layout', windowClass: 'custom-class', backdrop: 'static' });
    activeModal.componentInstance.modalHeader = 'View CAF Form';
    activeModal.result.then((data) => {

    })
  }

  graphpopup(username, custid, flag) {
    const activeModal = this.nasmodel.open(GraphpopComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'View Graph';
    activeModal.componentInstance.item = { username: username, custid: custid, flag: flag };
    activeModal.result.then((data) => {
      this.view();
    })
  }

  Edit_subs(item) {
    let view_flag = 1;
    localStorage.setItem('array', JSON.stringify(item));
    localStorage.setItem('view_flag', JSON.stringify(view_flag))
    // localStorage.setItem('view',JSON.stringify(view_id));
    this.router.navigate(['/pages/cust/edit-cust']);
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

  options: ITreeOptions = {
    useCheckbox: true,
    // getChildren: this.getChildren.bind(this),
    useVirtualScroll: true,
    nodeHeight: 22
  };

  async getPlanData() {
    this.loading = true
    this.nodes = [];
    let plandata: any;
    plandata = await this.packser.sharingReports({ resel_id: this.data['reseller_id'], bus_id: this.data['isp_id'], tree_flag: 1, uid: this.data['uid'] });
    console.log('Get Plan Result', plandata);
    for (var val of plandata) {
      val.hasChildren = true;
      this.nodes.push(val);
    }
    this.tree.treeModel.update();
    for (var i = 0; i < this.nodes.length; i++) {
      await this.getChildren(this.nodes[i])
      this.tree.treeModel.update();
    }
    this.loading = false;
    let planDetails = await this.packser.showCustPlanMap({ bus_id: this.data['isp_id'], reseller_id: this.data['reseller_id'], uid: this.data['uid'] })
    // console.log('Select',planDetails,planDetails[0]['subplanid']);
    if (planDetails[0]['subplanid']) {
      this.selectdata = planDetails[0]['subplanid']
      this.getSelected = this.selectdata.split(',')
      // console.log('Select',this.getSelected,typeof(this.getSelected));

      this.selectnodes(this.getSelected)
    }



  }

  async getChildren(node: any) {
    // console.log('Node child', node)
    this.pack = node.subplan
    // console.log('Node child', this.pack, 'length', this.pack.length)

    this.tree.treeModel.setFocus(true);
    if (this.pack.length != 0 && node['id']) {
      let id = this.nodes.find(e => e.id === node['id']);
      if (!this.nodes.find(e => e.id === node['id']).children) {
        this.nodes.find(e => e.id === node['id']).children = new Array();
      }

      for (let val of this.pack) {
        val.hasChildren = false;
        this.nodes.find(e => e.id === node['id']).children.push(val);
        this.tree.treeModel.update();
      }
    }
    else {
      this.nodes.find(e => e.id === node['id']).hasChildren = false;
    }
    return this.pack;
  }
  selectednodes() {
    const selectedNodes = [];
    Object.entries(toJS(this.tree.treeModel.selectedLeafNodeIds)).forEach(([key, value]) => {
      if (value === true) {
        selectedNodes.push(parseInt(key));
      }
    });
    this.tree.treeModel.update();
    return (selectedNodes);
  }

  selectnodes(item) {
    let index: number = item.indexOf(404);
    if (index !== -1) {
      item.splice(index, 1);
    }
    let nodedata = this.tree.treeModel.nodes;
    for (var i = 0; i < item.length; ++i) {
      let leaf = this.tree.treeModel.getNodeById(JSON.parse(item[i]))
      if (leaf)
        leaf.setIsSelected(true);
    }
  }

  getParentNodeId(item) {
    let parentNodeid = []
    for (let val of this.nodes) {
      for (let ids of item) {
        let pids = val['subplan'].filter(x => x.id == ids);
        if (pids.length) {
          parentNodeid.push(val.id);
        }
      }
    }
    // To remove Duplicates in Array
    parentNodeid = parentNodeid.filter((v, i, x) =>
      x.indexOf(v) == i);
    return parentNodeid;
  }

  async planMapping() {
    let planid = this.selectednodes();
    this.srvidData = this.getParentNodeId(planid)
    let result = await this.packser.subscriberPlanMap({
      isp_id: this.data['isp_id'], reseller: this.data['reseller_id'], uid: this.data['uid'], service_id: this.srvidData, plan_id: planid
    });
    if (result) {
      this.result_pop(result);
    }
  }

  result_pop(item) {
    const activemodal = this.nasmodel.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activemodal.componentInstance.modalHeader = 'Result';
    activemodal.componentInstance.item = item;
    activemodal.result.then((data) => {
      this.view();
    });
  }


}
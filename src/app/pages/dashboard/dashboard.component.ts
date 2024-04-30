import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { SolarData } from '../../@core/data/solar';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { DashboardService, RoleService, PagerService, CustService, AccountService, S_Service } from '../_service/indexService'
import { RenewCustComponent } from '../customer/RenewCustomer/renewCust.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { DatePipe } from '@angular/common';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
// import { TopupComponent } from './topup/topup.component'
import { OTPComponent } from './otp/add-otp.component';
import { DocpopComponent } from './../customer/add-documents/add-documents.component';
import { CafFormComponent } from './../customer/caf-form/caf-form.component';
import { saveAs } from 'file-saver';



interface CardSettings {
   title: string;
   iconClass: string;
   type: string;
   value: any;
   status: any;
   color: any;
}

@Component({
   selector: 'ngx-dashboard',
   styleUrls: ['./dashboard.component.scss'],
   templateUrl: './dashboard.component.html',
})

export class DashboardComponent implements OnDestroy {
   alive = true; snapidproof; flip; snapaddrproof; flip1; flip2;
   lival: any;
   // live=null;
   value1 = 100;
   now: any = new Date();
   tmr: string;
   yesterday: string;
   dayafter: string;
   tot1; tot2; tot3; tot4;
   //   limit=10;
   page: number = 1;
   yester: any = []; yest; pageryest: any = []; pagedItemsyest: any = []; pageyest: number = 1;
   today: any = []; tod; pagertod: any = []; pagedItemtoday: any = []; pagetom: number = 1;
   tmrw: any = []; tom; pagertom: any = []; pagedItemtom: any = []; pageytmr: number = 1;
   dateaftertomr: any = []; dat; pagerdayafttmr: any = []; pagedItemdft: any = []; pagedataftertmr: number = 1;
   pager: any = {}; pagedItems: any = []; cu_dep; pre_dep;
   payment: any[]; payamt: any[]; cafpending; ocbaldata; ocbalcount; pagedocbalItems: any = []; cafcount; acctype;
   expiry_status; online_status; ipmodecpe; sub_status; pro_pic; img_doc;
   aggrdetails: any;
   pagednasItems: any[]; nascount;
   data; serid; datasplitinfo; nasstatus;
   _someService: any;
   valueObj: any;
   pagedcafItems: any = [];
   limit: number = 10; Opage: number = 1; Opager: any = {};
   Climit: number = 10; Cpage: number = 1; Cpager: any = {}; daytype: any; ottPlatformDetails;

   public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes; servtype; custname;
   public primaryColour = '#dd0031';
   public secondaryColour = '#006ddd';
   public loading = false;

   constructor(
      private themeService: NbThemeService,
      private solarService: SolarData,
      public role: RoleService,
      public dash: DashboardService,
      private custser: CustService,
      private acntser: AccountService,
      public activeModal: NgbModal,
      private router: Router,
      private nasmodel: NgbModal,
      private pageservice: PagerService,
      private datePipe: DatePipe,
      private srv: S_Service,
   ) {
      // console.log('Router URL', router.url)
      this.themeService.getJsTheme()
         .pipe(takeWhile(() => this.alive))
         .subscribe(theme => {
            this.statusCards = this.statusCardsByThemes[theme.name];
         });

      this.solarService.getSolarData()
         .pipe(takeWhile(() => this.alive))
         .subscribe((data) => {
            this.solarValue = data;
         });
      // console.log(this.solarValue);
      // this.totalcount =  this.dash.getcount({});
      // console.log(result)
      // console.log(this.totalcount);

      // console.log("hiii", this.totalcount)
      // this.statusCards[0].value = this.totalcount.total;
      // this.statusCards[1].value = this.totalcount.online_status;
      // this.statusCards[2].value = this.totalcount.active_status;
      // this.statusCards[3].value = this.totalcount.expiry_status;
      // this.statusCards[4].value = this.totalcount.postpaid_act_user;
      // this.statusCards[5].value = this.totalcount.disabled_user;
      // console.log(this.statusCards)

      //  this.dash.getcount({}).subscribe ( result =>{
      //     // console.log(result)
      //     this.totalcount = result  ;
      //      // this.getlist();

      // });
      this.tmr = formatDate(this.now.getTime() + 24 * 60 * 60 * 1000, 'dd-MM-yyyy', 'en-US', '+0530');
      this.yesterday = formatDate(this.now.getTime() - 24 * 60 * 60 * 1000, 'dd-MM-yyyy', 'en-US', '+0530');
      //  this.daybefore = formatDate(this.now.getTime() - 48 * 60 * 60 * 1000, 'dd-MM-yyyy', 'en-US', '+0530');
      this.dayafter = formatDate(this.now.getTime() + 48 * 60 * 60 * 1000, 'dd-MM', 'en-US', '+0530');
      this.now = formatDate(this.now.getTime(), 'dd-MM-yyyy', 'en-US', '+0530');
   }


   async ngOnInit() {
      await this.dashInitial()
   }

   async refresh() {
      await this.dashInitial()
   }

   async dashInitial() {
      // this.yesDetails();
      if (this.role.getroleid() > 111) {
         // this.loading = true;
         this.totalcount = await this.dash.getcount({});
         if (this.totalcount) {
            this.statusCards[0].value = this.totalcount.total;
            this.statusCards[1].value = this.totalcount.online_status;
            this.statusCards[2].value = this.totalcount.active_status;
            this.statusCards[3].value = this.totalcount.expiry_status;
            this.statusCards[4].value = this.totalcount.hold;
            this.statusCards[5].value = this.totalcount.suspend;
            this.statusCards[6].value = this.totalcount.disconnect_status;
            this.statusCards[7].value = this.totalcount.exp_online;
            this.statusCards[8].value = this.totalcount.ofline_status;

         }
         // await this.getdeposit();
         await this.getExpiryDetails(0, 1, true);
         await this.getExpiryDetails(1, 1, true);
         await this.getExpiryDetails(2, 1, true);
         await this.getExpiryDetails(3, 1, true);
         // await this.getPayment();
         await this.getAggExpDet();
         await this.getcount();
         // this.loading = false;
         // await this.getAmount();
         await this.getcafpending();
         await this.getocbalance();
         await this.getnasstatus();


      }

      if (this.role.getroleid() == 111) {
         await this.view();
         // await this.splitdata();
      }
   }

   rotate(event) {
      event.style.transitionDuration = '1s'
      let rotate = parseInt((event.style.transform.match(/(\d+)/) || [])[0] || '0') + 90
      event.style.transform = `rotate(${rotate}deg)`
   }

   cafform() {
      localStorage.setItem('custid', JSON.stringify(this.role.getsubid()))
      const activeModal = this.nasmodel.open(CafFormComponent, { size: 'lg', container: 'nb-layout', windowClass: 'custom-class', backdrop: 'static' });
      activeModal.componentInstance.modalHeader = 'View CAF Form';
      activeModal.result.then((data) => {

      })
   }

   addpic(item, picflag) {
      localStorage.setItem('array', JSON.stringify(item));
      localStorage.setItem('flag', JSON.stringify(picflag));
      this.router.navigate(['/pages/cust/add-custpic']);
   }

   cafuploadproof(proid, cafaddr) {
      const activeModal = this.nasmodel.open(DocpopComponent, { size: 'lg', container: 'nb-layout' });
      activeModal.componentInstance.modalHeader = 'CAF Upload';
      activeModal.componentInstance.item = { proid: proid, cafaddr: cafaddr };
      activeModal.result.then((data) => {
         this.view();
      })
   }

   addrsproof(proid, addr) {
      const activeModal = this.nasmodel.open(DocpopComponent, { size: 'lg', container: 'nb-layout' });
      activeModal.componentInstance.modalHeader = 'Address Proof';
      activeModal.componentInstance.item = { proid: proid, addr: addr };
      activeModal.result.then((data) => {
         this.view();
      })
   }

   idproof(proid, idproof) {
      const activeModal = this.nasmodel.open(DocpopComponent, { size: 'lg', container: 'nb-layout' });
      activeModal.componentInstance.modalHeader = 'Identity Proof';
      activeModal.componentInstance.item = { proid: proid, idproof: idproof };
      activeModal.result.then((data) => {
         this.view();
      })
   }

   custpicupload(proid, subpicflag) {
      const activeModal = this.nasmodel.open(DocpopComponent, { size: 'lg', container: 'nb-layout' });
      activeModal.componentInstance.modalHeader = 'Subscriber Picture';
      activeModal.componentInstance.item = { proid: proid, subpicflag: subpicflag };
      activeModal.result.then((data) => {
         this.view();
      })
   }

   async mobverify(flag) {
      let res = await this.custser.mobileverify({ flag: flag });
      if (res[0]['error_msg'] == 0) {
         const activeModal = this.activeModal.open(OTPComponent, { size: 'sm', container: 'nb-layout' });
         activeModal.componentInstance.item = { mobflag: 1 };
         activeModal.componentInstance.modalHeader = 'Mobile OTP';
         activeModal.result.then((data) => {
            this.view();
         });
      }
   }

   async getDocument() {
      this.loading = true;
      // console.log("hit")
      var subsusername = this.data.cust_profile_id
      // profileid = this.data.cust_profile_id
      // console.log(subsusername)
      let result = await this.custser.getDocument({ username: subsusername })
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
      let result = await this.custser.getProfilePhoto({ username: subsusername })
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

   async mailverify(flag) {
      let res = await this.custser.emailverify({ flag: flag });
      if (res[0]['error_msg'] == 0) {
         const activeModal = this.activeModal.open(OTPComponent, { size: 'sm', container: 'nb-layout' });
         activeModal.componentInstance.item = { mailflag: 2 };
         activeModal.componentInstance.modalHeader = 'Email OTP';
         activeModal.result.then((data) => {
            this.view();
         });
      }
   }

   // recharge(item) {
   //    const activeModal = this.activeModal.open(TopupComponent, { size: 'sm', container: 'nb-layout' });
   //    activeModal.componentInstance.modalHeader = 'Top UP';
   //    activeModal.componentInstance.item = { subs_flag: item };
   //    activeModal.result.then((data) => {
   //    });
   // }

   async view() {
      this.loading = true;
      let result = await this.custser.ViewSubscriber({ id: this.role.getsubid() });
      this.data = result || [];
      this.data['addr'] = 1;
      this.data['sub_id'] = this.role.getsubid();
      this.serid = result['srvid'];
      // console.log("username",this.data.username)
      // console.log("view",this.data)
      this.acctype = this.data['acctype'];
      this.expiry_status = this.data['expiry_status'];
      this.online_status = this.data['online_status'];
      this.sub_status = this.data['status'];
      this.ipmodecpe = this.data['ipmodecpe'];
      this.data.lcdllimit = this.data.lcdllimit == 0 ? 0 : this.bytefunc(this.data.lcdllimit);
      this.data.lcuplimit = this.data.lcuplimit == 0 ? 0 : this.bytefunc(this.data.lcuplimit);
      this.data.lclimitcomb = this.data.lclimitcomb == 0 ? 0 : this.bytefunc(this.data.lclimitcomb);
      if (result) {
         this.loading = false;
         if ([3, 5, 7, 8].includes(this.data['service_type'])) {
            await this.getOttPlatforms();
         }
      }
   }

   async getOttPlatforms() {
      let resp = await this.srv.getottplanname({ invid: this.data['inv_id'] })
      console.log('Response', resp)
      // if(resp) this.ottPlatformDetails = resp['ottname'].split(',');
      // console.log('OTT',this.ottPlatformDetails)
      if (resp) this.ottPlatformDetails = resp['ottname']
   }

   async splitdata() {
      this.loading = true;
      let res = await this.custser.showDatasplit({
         index: (this.page - 1) * this.limit,
         limit: this.limit, uid: this.role.getsubid(), srvid: this.serid
      })
      // console.log(res)
      this.datasplitinfo = res;
      for (let i = 0; i < this.datasplitinfo.length; i++) {
         this.datasplitinfo[i]['upload'] = this.datasplitinfo[i]['trafficunitul'] == 0 ? 0 : this.bytefunct(this.datasplitinfo[i]['trafficunitul']);
         this.datasplitinfo[i]['download'] = this.datasplitinfo[i]['trafficunitdl'] == 0 ? 0 : this.bytefunct(this.datasplitinfo[i]['trafficunitdl']);
         this.datasplitinfo[i]['total'] = this.datasplitinfo[i]['trafficunitcomb'] == 0 ? 0 : this.bytefunct(this.datasplitinfo[i]['trafficunitcomb']);
         //   console.log( "speed",this.datasplitinfo[i]['total'])
      }
      if (res) {
         this.loading = false
      }
   }

   bytefunc(datam) {
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(datam) / Math.log(k));
      return (parseFloat((datam / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i])
   }

   bytefunct(datam) {
      const k = 1024;
      const sizes = ['MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(datam) / Math.log(k));
      return (parseFloat((datam / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i])
   }


   async getocbalance() {
      let result = await this.acntser.listOCBalance({
         dash_flag: 1, index: (this.Opage - 1) * this.limit,
         limit: this.limit,
      });

      if (result) {
         this.ocbaldata = result[0];
         this.ocbalcount = result[1]['count'];
         this.setPage();
      }
   }

   async ocbalexport() {
      let res = await this.acntser.listOCBalance({
      });
      if (res) {
         let tempdata = [], temp: any = res[0];
         for (var i = 0; i < temp.length; i++) {
            let param = {};
            param['RESELLER TYPE'] = temp[i]['role'] == 444 ? 'Bulk Resellre' : temp[i]['role'] == 333 ? 'Deposit Reseller' : temp[i]['role'] == 666 ? 'Sub ISP Bulk' :
               temp[i]['role'] == 555 ? 'Sub ISP Deposit' : temp[i]['role'] == 551 ? 'Sub Distributor Deposit' : temp[i]['role'] == 661 ? 'Sun Distributor Bulk' : 'Hotel';
            param['RESELLER NAME'] = temp[i]['resellername'];
            param['BUSINESS NAME'] = temp[i]['company']
            temp[i]['op_date'] = this.datePipe.transform(temp[i]['o_date'], 'd MMM y hh:mm:ss a')
            param['OPENING DATE'] = temp[i]['op_date'];
            param['BALANCE'] = 'RS' + ". " + temp[i]['obalance'];
            tempdata[i] = param
         }
         const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
         const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
         JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
         JSXLSX.writeFile(wb, 'OC Balance List' + EXCEL_EXTENSION);
      }
   }

   getoclist(page) {
      var total = Math.ceil(this.ocbalcount / this.limit);
      let result = this.pageservice.pageValidator(this.Opage, page, total);
      this.Opage = result['value'];
      if (result['result']) {
         this.getocbalance();
      }
   }

   setPage() {
      // console.log(this.data);
      this.Opager = this.pageservice.getPager(this.ocbalcount, this.Opage, this.limit);
      this.pagedocbalItems = this.ocbaldata;
   }

   async getcafpending() {
      let result = await this.dash.getCAFPending({
         index: (this.Cpage - 1) * this.Climit,
         limit: this.Climit,
      });
      if (result) {
         this.cafpending = result;
         this.cafcount = this.cafpending.length;
         this.setcafPage();
      }

   }

   async cafexport() {
      let res = await this.dash.getCAFPending({
      });
      if (res) {
         let tempdata = [], temp: any = res;
         for (var i = 0; i < temp.length; i++) {
            let param = {};
            param['RESELLER TYPE'] = temp[i]['role'] == 444 ? 'Bulk Resellre' : temp[i]['role'] == 333 ? 'Deposit Reseller' : temp[i]['role'] == 666 ? 'Sub ISP Bulk' :
               temp[i]['role'] == 555 ? 'Sub ISP Deposit' : temp[i]['role'] == 551 ? 'Sub Distributor Deposit' : temp[i]['role'] == 661 ? 'Sun Distributor Bulk' : 'Hotel';
            param['RESELLER NAME'] = temp[i]['reseller_name'];
            param['BUSINESS NAME'] = temp[i]['company']
            param['MOBILE'] = temp[i]['mobile'];
            param['COUNT'] = temp[i]['caf_count'];
            tempdata[i] = param
         }
         const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
         const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
         JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
         JSXLSX.writeFile(wb, 'CAF Pending List' + EXCEL_EXTENSION);
      }
   }

   async getdeposit() {
      let result = await this.dash.getDeposit({});
      this.cu_dep = result[0];
      this.pre_dep = result[1];
      // console.log("depositres",result);

   }

   getcaflist(page) {
      var total = Math.ceil(this.cafcount / this.Climit);
      let result = this.pageservice.pageValidator(this.Cpage, page, total);
      this.Cpage = result['value'];
      if (result['result']) {
         this.getocbalance();
      }
   }

   setcafPage() {
      // console.log(this.data);
      this.Cpager = this.pageservice.getPager(this.cafcount, this.Cpage, this.Climit);
      this.pagedcafItems = this.cafpending;
   }

   async getAmount() {
      let result = await this.dash.payment({})
      // console.log("pay",result)
      this.payamt = result[0]
      // console.log("payamt",this.payamt.cmamt)
   }

   async getPayment() {
      let result = await this.dash.getBalance({})
      // console.log(result['balance']);
      this.payment = result['balance']
   }

   async getAggExpDet() {
      let result = await this.dash.getAggExp({ index: (this.page - 1) * 10, limit: 10 })
      // console.log(result)
      this.aggrdetails = result[0];

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
      return (days + " D, " + hrs + " H, " + mnts + " M, " + seconds + " S")
   }

   async getnasstatus() {
      let result = await this.dash.getNasStatus({ index: (this.page - 1) * 10, limit: 10 })
      this.nasstatus = result[0];
      this.nascount = result[1]['count'];
      for (let l = 0; l < this.nasstatus.length; l++) {
         if (this.nasstatus[l]['diff_time'] !== null && this.nasstatus[l]['ping'] == 1) {
            let difftime = this.nasstatus[l]['diff_time'];
            this.nasstatus[l]['diff_time'] = this.secondconvert(difftime);
         }
      }
      if (result) {
         this.setnasPage();
      }
   }

   getnaslist(page) {
      var total = Math.ceil(this.nascount / this.limit);
      let result = this.pageservice.pageValidator(this.page, page, total);
      this.page = result['value'];
      if (result['result']) {
         this.getnasstatus();
      }
   }

   setnasPage() {
      // console.log(this.data);
      this.pager = this.pageservice.getPager(this.nascount, this.page, this.limit);
      this.pagednasItems = this.nasstatus;
      // console.log('asdfg',this.pagedItems)
   }

   async agrmntexport() {
      let res = await this.dash.getAggExp({
      });
      if (res) {
         let tempdata = [], temp: any = res[0];
         for (var i = 0; i < temp.length; i++) {
            let param = {};
            if (this.role.getroleid() > 777) {
               param['ISP NAME'] = temp[i]['busname'];
            }
            if (this.role.getroleid() >= 775) {
               param['CIRCLE'] = temp[i]['groupname'];
            }
            param['RESELLER TYPE'] = temp[i]['role'] == 444 ? 'Bulk Resellre' : temp[i]['role'] == 333 ? 'Deposit Reseller' : temp[i]['role'] == 666 ? 'Sub ISP Bulk' :
               temp[i]['role'] == 555 ? 'Sub ISP Deposit' : temp[i]['role'] == 551 ? 'Sub Distributor Deposit' : temp[i]['role'] == 661 ? 'Sun Distributor Bulk' : 'Hotel';
            param['RESELLER NAME'] = temp[i]['reseller_name'];
            param['BUSINESS NAME'] = temp[i]['company']
            param['ADDRESS'] = temp[i]['address'];
            param['MOBILE'] = temp[i]['mobile'];
            temp[i]['st_date'] = this.datePipe.transform(temp[i]['start_date'], 'd MMM y hh:mm:ss a')
            param['START DATE'] = temp[i]['st_date'];
            temp[i]['en_date'] = this.datePipe.transform(temp[i]['end_date'], 'd MMM y hh:mm:ss a')
            param['END DATE'] = temp[i]['en_date'];
            tempdata[i] = param
         }
         const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
         const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
         JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
         JSXLSX.writeFile(wb, 'Aggrement Expiry List' + EXCEL_EXTENSION);
      }
   }


   async getcount() {
      let result = await this.dash.getcount({})
      // console.log(result)
      this.totalcount = result;
      await this.getlist();
      // console.log("hiii", this.totalcount)
   }

   async getlist() {
      // console.log(this.totalcount)
      this.lival = this.totalcount
      // console.log(this.lival)
      return this.lival
   }

   view_user(item) {
      localStorage.setItem('details', JSON.stringify(item));
      this.router.navigate(['/pages/cust/viewcust']);
   }

   renew_user(cust_id, role, cdate, edate) {
      const activeModal = this.nasmodel.open(RenewCustComponent, { size: 'lg', container: 'nb-layout' });
      activeModal.componentInstance.modalHeader = 'Renew Customer';
      activeModal.componentInstance.item = { cust_id: cust_id, role: role, cdate: cdate, edate: edate }
      activeModal.result.then((data) => {
         this.getExpiryDetails(0, 1, true);
         this.getExpiryDetails(1, 1, true);
         this.getExpiryDetails(2, 1, true);
         this.getExpiryDetails(3, 1, true);
      })
   }

   getExpiryDetails(type, page = 1, dir = false) {
      let res = '', day = '', pager = '', pagedItems = '', pages = '', limit = '', method = '', count = '';
      switch (type) {
         case 0:
            day = 'yester';
            res = 'yest';
            pager = 'pageryest';
            pagedItems = 'pagedItemsyest';
            pages = 'pageyest';
            method = 'getYexp';
            count = 'tot1';

            // code...
            break;
         case 1:
            day = 'today';
            res = 'tod';
            pager = 'pagertod';
            pagedItems = 'pagedItemtoday';
            pages = 'pagetom';
            method = 'getTodayexp';
            count = 'tot2';
            // code...
            break;
         case 2:
            day = 'tmrw';
            res = 'tom';
            pager = 'pagertom';
            pagedItems = 'pagedItemtom';
            pages = 'pageytmr';
            method = 'getTomorrowExp';
            count = 'tot3';
            // code...
            break;
         case 3:
            day = 'dateaftertomr';
            res = 'dat';
            pager = 'pagerdayafttmr';
            pagedItems = 'pagedItemdft';
            pages = 'pagedataftertmr';
            method = 'getDFT';
            count = 'tot4';
            // code...
            break;
         default:
            // code...
            break;
      }
      dir ? this.initiallist({ day: day, res: res, pager: pager, pagedItems: pagedItems, page: pages, method: method, count: count }) :
         this.list(page, { day: day, res: res, pager: pager, pagedItems: pagedItems, page: pages, method: method });
   }

   async list(page, dayKey) {
      // console.log("list");
      var total = Math.ceil(this[dayKey.res][1]['count'] / 10);
      let result = this.pageservice.pageValidator(this[dayKey.page], page, total);
      this[dayKey.page] = result['value'];
      if (result['result']) {
         await this.initiallist(dayKey);
      }
   }

   async initiallist(dayKey) {
      // console.log("initial list")
      let result = await this.dash[dayKey.method]({ index: (this[dayKey.page] - 1) * 10, limit: 10 })
      if (result) {
         // console.log("result:", result)
         this[dayKey.res] = result;
         this[dayKey.count] = result[1]['count']
      }
      this[dayKey.pager] = this.pageservice.getPager(this[dayKey.res][1]['count'], this[dayKey.page], 10);
      // console.log(dayKey.pager,this[dayKey.pager])
      this[dayKey.pagedItems] = this[dayKey.res][0];
   }


   solarValue: number;
   totalcount: any;
   lightCard: CardSettings = {
      title: 'Total',
      iconClass: 'fas fa-users',
      type: 'primary',
      value: 0,
      status: 1,
      color: '',
   };
   rollerShadesCard: CardSettings = {
      title: 'Online',
      iconClass: 'fas fa-user',
      type: 'success',
      value: 0,
      status: 2,
      color: '',
   };
   wirelessAudioCard: CardSettings = {
      title: ' Active',
      iconClass: 'fas fa-user-check',
      type: 'info',
      value: 0,
      status: 3,
      color: '',
   };
   coffeeMakerCard: CardSettings = {
      title: ' Expired',
      iconClass: 'fas fa-user-times',
      type: 'danger',
      value: 0,
      status: 4,
      color: '',
   };

   coffeeMakerCard1: CardSettings = {
      title: 'Hold',
      iconClass: 'fas fa-user-clock',
      type: 'warning',
      value: 0,
      status: 5,
      color: '',
   };
   coffeeMakerCard2: CardSettings = {
      title: 'Suspend',
      iconClass: 'fas fa-user-slash',
      type: 'secondary',
      value: 0,
      status: 6,
      color: '',
   };

   coffeeMakerCard3: CardSettings = {
      title: 'Disconnect',
      iconClass: 'fas fa-user-minus',
      type: 'disconnect',
      value: 0,
      status: 8,
      color: '',
   };

   coffeeMakerCard4: CardSettings = {
      title: 'Quarantine',
      iconClass: ' fas fa-user-lock',
      type: 'tag',
      value: 0,
      status: 7,
      color: '',
   };

   coffeeMakerCard5: CardSettings = {
      title: 'Offline',
      iconClass: 'fas fa-user-circle',
      type: 'offline',
      value: 0,
      status: 9,
      color: '',
   };

   statusCards: any;

   commonStatusCardsSet: CardSettings[] = [
      this.lightCard,
      this.rollerShadesCard,
      this.wirelessAudioCard,
      this.coffeeMakerCard,
      this.coffeeMakerCard1,
      this.coffeeMakerCard2,
      this.coffeeMakerCard3,
      this.coffeeMakerCard4,
      this.coffeeMakerCard5,
   ];

   statusCardsByThemes: {
      default: CardSettings[];
      cosmic: CardSettings[];
      corporate: CardSettings[];
      value1: CardSettings[];
   } = {
         default: this.commonStatusCardsSet,
         cosmic: this.commonStatusCardsSet,
         corporate: this.commonStatusCardsSet,
         // {
         //     ...this.lightCard,
         //     type: 'warning',

         // },
         // {
         //     ...this.rollerShadesCard,
         //     type: 'primary',
         // },
         // {
         //     ...this.wirelessAudioCard,
         //     type: 'danger',
         // },
         // {
         //     ...this.coffeeMakerCard,
         //     type: 'secondary',
         // },
         // {
         //     ...this.coffeeMakerCard1,
         //     type: 'secondary',
         // },
         // {
         //     ...this.coffeeMakerCard2,
         //     type: 'secondary',
         // },


         value1: this.commonStatusCardsSet,
      };

   listsubs(event) {
      if(this.role.getroleid() != 331 && this.role.getroleid() != 330){
         localStorage.setItem('dash_status', JSON.stringify(event));
         this.router.navigate(['/pages/cust/custList'])
      }
      
   }


   listExpiryCust(event) {
      // console.log('status', event)
      localStorage.setItem('expstatus', JSON.stringify(event));
      this.router.navigate(['/pages/cust/custList'])
   }

   async apkDownload() {
      console.log('Inside Apk Download');
      // let resp = await this.custser.getApkFile({})
      // console.log('Result',resp)
   }

   async expiryDetails() {
      console.log('Download Day Type', this.daytype);
      let resp;
      if (this.daytype == 0) {
         resp = await this.dash.getYexp({})
      } else if (this.daytype == 1) {
         resp = await this.dash.getTodayexp({})
      } else if (this.daytype == 2) {
         resp = await this.dash.getTomorrowExp({})
      } else {
         resp = await this.dash.getDFT({})
      }
      console.log('Result', resp)
      if (resp) {
         let tempdata = [], temp: any = resp[0];
         for (var i = 0; i < temp.length; i++) {
            let param = {};
            if (this.role.getroleid() > 444) {
               param['RESELLER PROFILEID'] = temp[i]['managername'];
               param['BUSINESS NAME'] = temp[i]['company']
               param['RESELLER TYPE'] = temp[i]['mrole'] == 444 ? 'Bulk Resellre' : temp[i]['mrole'] == 333 ? 'Deposit Reseller' : temp[i]['mrole'] == 666 ? 'Sub ISP Bulk' :
                  temp[i]['mrole'] == 555 ? 'Sub ISP Deposit' : temp[i]['mrole'] == 551 ? 'Sub Distributor Deposit' : temp[i]['mrole'] == 661 ? 'Sun Distributor Bulk' : 'Hotel';
            }
            param['SUBSCRIBER NAME'] = temp[i]['firstname'];
            param['SUBSCRIBER PROFILEID'] = temp[i]['cust_profile_id'];
            param['MOBILE'] = temp[i]['mobile'];
            param['ADDRESS'] = temp[i]['address'];
            param['SERVICE NAME'] = temp[i]['srvname'];
            temp[i]['expiration'] = this.datePipe.transform(temp[i]['expiration'], 'd MMM y hh:mm:ss a')
            param['EXPIRATION DATE'] = temp[i]['expiration'];
            tempdata[i] = param
         }
         const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
         const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
         JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
         JSXLSX.writeFile(wb, 'SubscriberExpiry List' + EXCEL_EXTENSION);
      }


   }
   dayexpiryDetails($event) {
      switch ($event.tabTitle) {
         case 'Yesterday':
            this.daytype = 0;
            break;
         case 'Today':
            this.daytype = 1;
            break;
         case 'Tomorrow':
            this.daytype = 2;
            break;
         default:
            this.daytype = 3;
            break;
      }
   }

   ngOnDestroy() {
      this.alive = false;
   }

}
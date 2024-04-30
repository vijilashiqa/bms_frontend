import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import { Router } from '@angular/router';
import { RenewCustComponent } from '../RenewCustomer/renewCust.component';
import { ProfilePasswordComponent } from '../ProfilePassword/profilepass.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  RoleService, CustService, BusinessService, GroupService, S_Service, ResellerService, NasService,
  PagerService, SelectService, IppoolService
} from '../../_service/indexService';
import { unescapeIdentifier } from '@angular/compiler';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { JsonPipe, DatePipe } from '@angular/common';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { CloseComponent } from '../Closesession/close.component';
import { LogOffComponent } from '../Logoff/logoff.component';

@Component({
  selector: 'custList',
  templateUrl: './custList.component.html',
  styleUrls: ['./custlist.component.scss']
})

export class CustListComponent implements OnInit, OnDestroy {
  data; totalpage = 10; pages = [1, 2, 3, 4, 5]; details: any[]; id; tot; dashstatus;
  bus; group1; serdata; resdata; branchdata; profile; name; nam1; count; serv_type; uid; cust_name = '';
  resel_type = ''; nas_name; res_name; resel_branch; subs_id; nas1; search; showreseller; res1; ser_name; bus_name; group_name;
  regular_user; mac_user; expiry_status; online_status; active_status; ofline_status; limit = 25;
  subs_type = ''; subs_status = ''; conn_type = ''; subs_gst = ''; subs_profileid = ''; subs_accno = ''; act_status: any;
  date_type = ''; st_date = ''; en_date = ''; cstart_date = ''; cend_date = ''; start_date = ''; end_date = ''; acc_type = ''; on_status: any;
  servtype; custname; gst; suspend; hold; exp_track = ''; acnt_type = ''; on_expiry: any; logoff_flag = false; state_id; state; ip_mode;
  public_ip; publicIp; static_ip;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes; on_exp; disconnected;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;
  pager: any = {}; page: number = 1; pagedItems: any = []; start_exp = ''; end_exp = ''; sbranch; s_branch;
  today_date; yes_date; tom_date; dft_date; exp_status;
  show_icon =false;
  reverse =false;online_sort =0;
  constructor(
    private alert: ToasterService,
    private router: Router,
    private custser: CustService,
    private busser: BusinessService,
    private groupser: GroupService,
    private ser: S_Service,
    private reselser: ResellerService,
    private nasmodel: NgbModal,
    public role: RoleService,
    public pageservice: PagerService,
    private datePipe: DatePipe,
    private select: SelectService,
    public ipservice: IppoolService
  ) {
    this.dashstatus = JSON.parse(localStorage.getItem('dash_status'));
    this.exp_status = JSON.parse(localStorage.getItem('expstatus'));
    // console.log('Exp status',this.exp_status)
    let today = new Date();
    let yesterday = new Date();
    let tom = new Date();
    let dft = new Date();
    yesterday.setDate(today.getDate() - 1);
    tom.setDate(today.getDate() + 1);
    dft.setDate(today.getDate() + 2);
    this.today_date = today.toISOString().slice(0, 10); this.yes_date = yesterday.toISOString().slice(0, 10); this.tom_date = tom.toISOString().slice(0, 10);
    this.dft_date = dft.toISOString().slice(0, 10);

    // console.log('Date',this.today_date)
    // console.log('yes Date',this.yes_date)

    // console.log('tom Date',this.tom_date)
    // console.log('dft date',this.dft_date)
    this.start_exp = this.end_exp = this.exp_status == 1 ? this.yes_date : this.exp_status == 2 ? this.today_date : this.exp_status == 3 ? this.tom_date :
      this.exp_status == 4 ? this.dft_date : ''

  }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event })
    // console.log(result)
  }

  async showGroupName($event = '') {
    this.group1 = await this.groupser.showGroupName({ bus_id: this.bus_name, like: $event })
    // console.log("group:", result)
  }

  async servicetype($event = '') {
    this.servtype = await this.busser.showServiceType({ sertype: 1, bus_id: this.bus_name, like: $event })
    // console.log("sertype",result);
  }

  async showProfileReseller($event = '') {
    this.profile = await this.reselser.showProfileReseller({ bus_id: this.bus_name, like: $event })
    // console.log("prof:", result)
  }

  async showResellerName($event = '') {
    if (this.role.getroleid() >= 775) {
      this.res1 = await this.reselser.showResellerName({ res_Search: 1, role: this.resel_type, bus_id: this.bus_name, groupid: this.group_name, like: $event })
      // console.log("resname",result)
    } else {
      this.res1 = await this.reselser.showResellerName({ role: this.resel_type, bus_id: this.bus_name, groupid: this.group_name, like: $event })
      // console.log("resname",result)
    }

  }
  async showResellerBranch($event = '') {
    if (this.bus_name || this.group_name || this.res_name) {
      this.sbranch = await this.reselser.showResellerBranch({ bus_id: this.bus_name, groupid: this.group_name, resel_id: this.res_name, like: $event })
    }
  }


  async showgst($event = '') {
    this.gst = await this.custser.showUser({ bus_id: this.bus_name, groupid: this.group_name, uid: this.cust_name, gst_like: $event, gst_flag: 1 })
    // console.log("gst",result)
  }

  async showService($event = '') {
    this.nam1 = await this.ser.showService({ resel_id: this.res_name, bus_id: this.bus_name, groupid: this.group_name, res_flag: 1, like: $event, cust_search: 1 })
    // console.log("servname",result)
  }
  async showUser($event = '') {
    this.custname = await this.custser.showUser({ bus_id: this.bus_name, groupid: this.group_name, role: this.resel_type, role_flag: 1, resel_id: this.res_name, srvid: this.name, like: $event })
    // console.log("customer", this.custname)
  }
  async showState($event = '') {
    this.state = await this.select.showState({ like: $event })
  }

  async showPublicIp($event = '') {
    if (this.ip_mode == 3) {
      this.publicIp = await this.ipservice.showPublicIp({ bus_id: this.bus_name, resel_id: this.res_name, uid: this.cust_name, like: $event })
      console.log('Public Ip', this.publicIp);

    }
  }

  async ngOnInit() {
    localStorage.removeItem('array');
    localStorage.removeItem('details');
    localStorage.removeItem('datas');
    await this.showBusName();
    await this.initiallist();
    await this.showState();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.showGroupName();
      await this.showProfileReseller();
      await this.showResellerName();
      await this.showService();
      await this.servicetype();
      await this.showUser();
    }
    if (this.role.getroleid() < 775) {
      this.group_name = this.role.getgrupid();
      await this.showUser();
      await this.showResellerBranch();
    }
  }

  changeclear(item) {
    if (item == 1) {
      this.group_name = '';
      this.resel_type = '';
      this.res_name = '';
      this.serv_type = '';
      this.name = '';
      this.cust_name = '';
      this.subs_gst = '';
      this.state_id = '';
    }
    if (item == 2) {
      this.resel_type = '';
      this.res_name = '';
      this.serv_type = '';
      this.name = '';
      this.cust_name = '';
      this.subs_gst = '';
      this.state_id = '';
    }
    if (item == 3) {
      this.res_name = '';
      this.serv_type = '';
      this.name = '';
      this.cust_name = '';
      this.subs_gst = '';
      this.state_id = '';
    }
    if (item == 4) {
      this.serv_type = '';
      this.name = '';
      this.cust_name = '';
      this.subs_gst = '';
      this.state_id = '';
    }
    if (item == 5) {
      this.name = '';
      this.cust_name = '';
      this.subs_gst = '';
      this.state_id = '';
    }
    if (item == 6) {
      this.cust_name = '';
      this.subs_gst = '';
    }
    if (item == 7) {
      this.st_date = '';
      this.en_date = '';
      this.exp_track = '';
      this.on_status = '';
    }
  }

  async refresh() {
    this.bus_name = '';
    this.group_name = '';
    this.resel_type = '';
    this.res_name = '';
    this.serv_type = '';
    this.name = '';
    this.cust_name = '';
    this.subs_type = '';
    this.subs_gst = '';
    this.acc_type = '';
    this.acnt_type = '';
    this.act_status = '';
    this.conn_type = '';
    this.on_status = '';
    this.st_date = '';
    this.en_date = '';
    this.start_date = '';
    this.end_date = '';
    this.cstart_date = '';
    this.cend_date = '';
    this.dashstatus = '';
    this.exp_track = '';
    this.group1 = ''; this.profile = ''; this.res1 = ''; this.servtype = ''; this.nam1 = ''; this.custname = ''; this.gst = '';
    this.start_exp = ''; this.end_exp = ''; this.s_branch = ''; this.state_id = ''; this.ip_mode = ''; this.static_ip = ''; this.public_ip = '';

    await this.initiallist();
    if (this.role.getroleid() == 666 || this.role.getroleid() == 555) {
      await this.showProfileReseller();
      await this.showResellerName();
    }
  }

  async initiallist() {
    this.loading = true;
    this.logoff_flag = this.on_status == 1 ? true : false;
    let result = await this.custser.listSubscriber({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      bus_id: this.bus_name,
      groupid: this.group_name,
      role: this.resel_type,
      resel_id: this.res_name,
      srv_id: this.serv_type,
      srvid: this.name,
      uid: this.cust_name,
      subs_type: this.subs_type,
      gst: this.subs_gst,
      acctype: this.acc_type,
      acc_type: this.acnt_type,
      conntype: this.conn_type,
      active: (this.dashstatus == 3 || this.dashstatus == 9) ? this.act_status = 1 : this.dashstatus == 4 ? this.act_status = 2 :
        this.dashstatus == 5 ? this.act_status = 4 : this.dashstatus == 6 ? this.act_status = 3 : this.dashstatus == 8 ? this.act_status = 0 : this.act_status,
      online: this.dashstatus == 2 ? this.on_status = 1 : this.dashstatus == 7 ? this.on_status = 3 : this.dashstatus == 9 ? this.on_status = 2 : this.on_status,
      exptrackflag: this.exp_track,
      sdate: this.st_date,
      edate: this.en_date,
      rsdate: this.start_date,
      redate: this.end_date,
      csdate: this.cstart_date,
      cedate: this.cend_date,
      // expsdate: this.exp_status == 1? this.yes_date:this.exp_status ==2? this.today_date:this.exp_status ==3?this.tom_date:
      //   this.exp_status==4?this.dft_date: this.start_exp,
      //   expedate: this.exp_status == 1? this.yes_date:this.exp_status ==2? this.today_date:this.exp_status ==3?this.tom_date:
      //   this.exp_status==4?this.dft_date: this.end_exp,
      expsdate: this.start_exp,
      expedate: this.end_exp,
      branch: this.s_branch,
      sort_exp: (this.start_exp && this.end_exp) || this.dashstatus == 4 ? 1 : 0,
      state_id: this.state_id,
      ip_mode: this.ip_mode,
      static_ip: this.static_ip,
      public_ip: this.public_ip,
      online_sort: this.online_sort
    })
    // console.log("cuslist------------", result);
    if (result) {
      this.loading = false;
      localStorage.removeItem('dash_status')
      this.data = result[0];
      for (let l = 0; l < this.data.length; l++) {
        if (this.data[l]['online_time'] != null) {
          let ontime = this.data[l]['online_time']
          let a = ontime.split(':')
          let sec = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])
          this.data[l]['online_time'] = this.secondconvert(sec);
        }
      }
      this.tot = result[1]['count'];
      this.regular_user = result[1]['regular_user'];
      this.mac_user = result[1]['mac_user'];
      this.active_status = result[1]['active_status'];
      this.online_status = result[1]['online_status'];
      this.disconnected = result[1]['disconnected'];
      this.expiry_status = result[1]['expiry_status'];
      this.suspend = result[1]['suspend'];
      this.hold = result[1]['hold'];
      this.on_exp = result[1]['expired_online'];
      // console.log(this.data)
      for (var l = 0; l < this.data.length; l++) {
        this.data[l].lcdllimit = this.data[l].lcdllimit == 0 ? 0 : this.bytefunc(this.data[l].lcdllimit);
        this.data[l].lcuplimit = this.data[l].lcuplimit == 0 ? 0 : this.bytefunc(this.data[l].lcuplimit);
        this.data[l].lclimitcomb = this.data[l].lclimitcomb == 0 ? 0 : this.bytefunc(this.data[l].lclimitcomb);

        this.data[l]['upload'] = this.data[l]['acctinputoctets'] == 0 ? '0 Bytes' : this.bytefunc(this.data[l]['acctinputoctets']);
        this.data[l]['download'] = this.data[l]['acctoutputoctets'] == 0 ? '0 Bytes' : this.bytefunc(this.data[l]['acctoutputoctets']);
        this.data[l]['total'] = this.data[l]['totoctets'] == 0 ? '0 Bytes' : this.bytefunc(this.data[l]['totoctets']);
      }
      this.setPage();
    }


  }

  async download() {
    this.loading = true;
    let res = await this.custser.listSubscriber({
      bus_id: this.bus_name,
      groupid: this.group_name,
      role: this.resel_type,
      resel_id: this.res_name,
      srv_id: this.serv_type,
      srvid: this.name,
      uid: this.cust_name,
      subs_type: this.subs_type,
      gst: this.subs_gst,
      acctype: this.acc_type,
      acc_type: this.acnt_type,
      conntype: this.conn_type,
      active: (this.dashstatus == 3 || this.dashstatus == 9) ? this.act_status = 1 : this.dashstatus == 4 ? this.act_status = 2 :
        this.dashstatus == 5 ? this.act_status = 4 : this.dashstatus == 6 ? this.act_status = 3 : this.dashstatus == 8 ? this.act_status = 0 : this.act_status,
      online: this.dashstatus == 2 ? this.on_status = 1 : this.dashstatus == 7 ? this.on_status = 3 : this.dashstatus == 9 ? this.on_status = 2 : this.on_status,
      exptrackflag: this.exp_track,
      sdate: this.st_date,
      edate: this.en_date,
      rsdate: this.start_date,
      redate: this.end_date,
      csdate: this.cstart_date,
      cedate: this.cend_date,
      // expsdate: this.exp_status == 1? this.yes_date:this.exp_status ==2? this.today_date:this.exp_status ==3?this.tom_date:
      //   this.exp_status==4?this.dft_date: this.start_exp,
      //   expedate: this.exp_status == 1? this.yes_date:this.exp_status ==2? this.today_date:this.exp_status ==3?this.tom_date:
      //   this.exp_status==4?this.dft_date: this.end_exp,
      expsdate: this.start_exp,
      expedate: this.end_exp,
      branch: this.s_branch,
      state_id: this.state_id,
      sort_exp: (this.start_exp && this.end_exp) || this.dashstatus == 4 ? 1 : 0,
      ip_mode: this.ip_mode,
      static_ip: this.static_ip,
      public_ip: this.public_ip
    })
    if (res) {
      this.loading = false;
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        if (this.role.getroleid() >= 775) {
          param['ID'] = temp[i]['uid'];
        }

        if (this.role.getroleid() > 777) {
          param['ISP NAME'] = temp[i]['busname'];
        }
        if (this.role.getroleid() >= 775) {
          param['CIRCLE'] = temp[i]['groupname']
        }
        param['STATUS'] = temp[i]['expiry_status'] == 0 ? 'Expired' : temp[i]['online_status'] == 0 && temp[i]['expiry_status'] == 1 ? 'Active' :
          temp[i]['online_status'] == 1 && temp[i]['expiry_status'] == 1 ? 'Online' : '';
        if (this.role.getroleid() > 549) {
          param['RESELLER BUSINESS NAME'] = temp[i]['company'];
        }
        param['USER ID'] = temp[i]['cust_profile_id'];
        param['SUBSCRIBER NAME'] = temp[i]['cust_name'];
        param['SERVICE TYPE'] = temp[i]['srvdatatype'] == 1 ? 'Unlimited' : 'FUP';
        param['USER SERVICE'] = temp[i]['srvname'] || 'N/A';
        param['RUNNING SERVICE'] = temp[i]['online_status'] == 1 ? temp[i]['rsrvname'] : '--';

        if (this.dashstatus != 2 && this.on_status != 1) {
          param['SUBPLAN'] = temp[i]['sub_plan'] || 'N/A';
          param['DL LIMIT'] = temp[i]['srvdatatype'] == 2 ? temp[i]['limitdl'] == 0 ? '--' : temp[i]['lcdllimit'] == 0 ? 'Data Limit Over' : this.bytefunc(temp[i]['lcdllimit']) : '--';
          param['UL LIMIT'] = temp[i]['srvdatatype'] == 2 ? temp[i]['limitul'] == 0 ? '--' : temp[i]['lcuplimit'] == 0 ? 'Data Limit Over' : this.bytefunc(temp[i]['lcuplimit']) : '--';
          param['TOTAL LIMIT'] = temp[i]['srvdatatype'] == 2 ? temp[i]['limitcomb'] == 0 ? '--' : temp[i]['lclimitcomb'] == 0 ? 'Data Limit Over' : this.bytefunc(temp[i]['lclimitcomb']) : 'Unlimited';
          temp[i]['registered'] = temp[i]['registered'] != null ? this.datePipe.transform(temp[i]['registered'], 'dd-MM-yyyy', 'es-ES') : '-';
          param['REGISTERED DATE'] = temp[i]['registered'];
          temp[i]['createdon'] = this.datePipe.transform(temp[i]['createdon'], 'dd-MM-yyyy');
          param['CREATION DATE'] = temp[i]['createdon'];
          temp[i]['expiration'] = temp[i]['expiration'] == '0000-00-00 00:00:00' ? '' : this.datePipe.transform(temp[i]['expiration'], 'dd-MM-yyyy hh:mm:ss a', 'es-ES');
          param['EXPIRY DATE'] = temp[i]['expiration'];
          param['MOBILE'] = temp[i]['mobile'];
          param['EMAIL'] = temp[i]['email'].toLowerCase();
          param['ADDRESS'] = temp[i]['address'];
          param['PINCODE'] = temp[i]['zip'] ? temp[i]['zip'] : '';
          param['BRANCH'] = temp[i]['branch'];
          param['LOCALITY'] = temp[i]['area'] == 0 ? 'Rural' : temp[i]['area'] == 1 ? 'Urban' : '--';
          param['CONNECTION TYPE'] = temp[i]['subs_type'] == 0 ? 'SME' : temp[i]['subs_type'] == 1 ? 'Home User' : temp[i]['subs_type'] == 2 ? 'Corporate' : 'EDU/INST';
          param['IP MODE'] = temp[i]['ipmodecpe'] == 0 ? 'Dynamic' : temp[i]['ipmodecpe'] == 1 ? 'Ippool' : (temp[i]['ipmodecpe'] == 2 && temp[i]['staticip_flag'] == 0) ? 'Static IP' :
            (temp[i]['ipmodecpe'] == 2 && temp[i]['staticip_flag'] == 1) ? 'PublicIP' : '';
          param['IP'] = temp[i]['staticipcpe'] || '--';
        } else {
          param['MAC'] = temp[i]['callingstationid'];
          param['IP ADDRESS'] = temp[i]['framedipaddress'];
          temp[i]['acctstarttime'] = this.datePipe.transform(temp[i]['acctstarttime'], 'dd-MM-yyyy hh:mm:ss a', 'es-ES');
          param['START TIME'] = temp[i]['acctstarttime'];
          param['ONLINE TIME'] = temp[i]['online_time'];
          param['DOWNLOAD'] = temp[i]['acctoutputoctets'] == 0 ? '0 Bytes' : this.bytefunc(temp[i]['acctoutputoctets']);
          param['UPLOAD'] = temp[i]['acctinputoctets'] == 0 ? '0 Bytes' : this.bytefunc(temp[i]['acctinputoctets']);
          param['TOTAL'] = temp[i]['totoctets'] == 0 ? '0 Bytes' : this.bytefunc(temp[i]['totoctets']);
          param['NAS IP'] = temp[i]['nasipaddress'];

        }

        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Subscribers List' + EXCEL_EXTENSION);
    } else this.loading = false;
  }

  getlist(page) {
    var total = Math.ceil(this.tot / this.limit);
    let result = this.pageservice.pageValidator(this.page, page, total);
    this.page = result['value'];
    if (result['result']) {
      this.initiallist();
    }
  }

  setPage() {
    // console.log(this.data);
    this.pager = this.pageservice.getPager(this.tot, this.page, this.limit);
    this.pagedItems = this.data;
    // console.log('asdfg',this.pagedItems)
  }

  bytefunc(datam) {
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
    return (days + " D, " + hrs + " H, " + mnts + " M, " + seconds + " S")
  }

  Edit_nas(item) {
    localStorage.setItem('array', JSON.stringify(item));
    this.router.navigate(['/pages/cust/edit-cust']);
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
      this.initiallist();
    })
  }

  propassword(item) {
    const activeModal = this.nasmodel.open(ProfilePasswordComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Change Profile Password';
    activeModal.componentInstance.item = { id: item }
    activeModal.result.then((data) => {
      this.initiallist();
    })
  }

  logoff(item) {
    const activeModal = this.nasmodel.open(LogOffComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });

    activeModal.componentInstance.modalHeader = 'Log Off';

    activeModal.componentInstance.item = item;

    activeModal.result.then((data) => {
      this.initiallist();
    })
  }
  logoffAll(item) {
    const activeModal = this.nasmodel.open(LogOffComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });

    activeModal.componentInstance.modalHeader = 'Log Off All';

    activeModal.componentInstance.item = { session: 1, resel_id: this.res_name, on_status: this.on_status, log_off: 1, isp_id: this.bus_name };

    activeModal.result.then((data) => {
      this.initiallist();
    })
  }

  close(item) {
    const activeModal = this.nasmodel.open(CloseComponent, { size: 'sm', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Close Session';

    activeModal.componentInstance.item = item;

    activeModal.result.then((data) => {
      this.initiallist();
    })
  };

  closeAll() {
    const activeModal = this.nasmodel.open(CloseComponent, { size: 'sm', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Close All Session';

    activeModal.componentInstance.item = { session: 2, close_session: 1, resel_id: this.res_name, on_status: this.on_status, isp_id: this.bus_name };

    activeModal.result.then((data) => {
      this.initiallist();
    })
  };

  onlineTimeSort(){
    console.log('Online Time Sort')
    this.show_icon = true;
    this.reverse = !this.reverse
    console.log('reverse',this.reverse);
    if(this.reverse) this.online_sort = 1
    else this.online_sort = 2
    this.initiallist()
    
  }

  ngOnDestroy(): void {
    localStorage.removeItem('dash_status');
    localStorage.removeItem('expstatus');
  }


}
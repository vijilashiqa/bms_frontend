import { Component, OnInit } from '@angular/core';
import {
  BusinessService, CustService, ResellerService, RoleService,
  PagerService, GroupService, S_Service
} from '../../_service/indexService';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { DatePipe } from '@angular/common';
import * as JSXLSX from 'xlsx';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfilePasswordComponent } from '../ProfilePassword/profilepass.component';
import {AuthpassComponent} from '../ChangeauthPassword/authpass.component';
import { ChangeValidityComponent } from '../changevalidity/changevalidity.component';
import { ChangeSimUseComponent } from '../change-sim-use/change-sim-use.component';
const EXCEL_EXTENSION = '.xlsx';


@Component({
  selector: 'ngx-list-card-user',
  templateUrl: './list-card-user.component.html',
  styleUrls: ['./list-card-user.component.scss']
})
export class ListCardUserComponent implements OnInit {
  submit: boolean = false;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25; total;
  bus; resel; bus_name; resel_name; data; count; search; group1; group_name; servtype; srv;
  serv_type; cust_name; custname;active_status;expiry_status;online_status;disconnected;
  suspend;hold

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
    private datePipe: DatePipe,
    private groupService: GroupService,
    private service: S_Service,
    private nasmodel: NgbModal,

  ) { }
  async ngOnInit() {
    await this.list();
    await this.showBusiness();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid()
      await this.showGroupName()
      await this.showReseller();
      // await this.servicetype();

    }
  }
  async showBusiness($event = '') {
    this.bus = await this.busService.showBusName({ like: $event });
  }
  async showGroupName($event = '') {
    this.group1 = await this.groupService.showGroupName({ bus_id: this.bus_name, like: $event })
  }
  async showReseller($event = '') {
    this.resel = await this.resellerService.showResellerName({ bus_id: this.bus_name, groupid: this.group_name, role: 331, like: $event })
  }
  async showUser($event = '') {
    this.custname = await this.custService.showUser({
      bus_id: this.bus_name, groupid: this.group_name,
      role: 331, role_flag: 1, resel_id: this.resel_name, like: $event
    })
  }
  // async servicetype($event = '') {
  //   this.servtype = await this.busService.showServiceType({ sertype: 1, bus_id: this.bus_name, like: $event })
  //  }

  //  async showService($event = '') {
  //   this.srv = await this.service.showService({ resel_id: this.resel_name, bus_id: this.bus_name, groupid: this.group_name, res_flag: 1, like: $event, cust_search: 1 })
  // }

  async list() {
    this.loading = true;
    let result = await this.custService.listCardUser({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      bus_id: this.bus_name,
      resel_id: this.resel_name,
      group_id: this.group_name,
      uid: this.cust_name
    });
    if (result) {
      this.loading = false
      console.log('Result card user',result);
      
      this.data = result[0];
      this.count = result[1]['count'];
      this.active_status = result[1]['active_status'];
      this.expiry_status = result[1]['expiry_status'];
      this.suspend = result[1]['suspend'];
      this.disconnected = result[1]['disconnected'];
      this.hold = result[1]['hold'];
      this.online_status = result[1]['online_status'];
      this.setPage();
    } else this.loading = false;
  }

  propassword(item) {
    const activeModal = this.nasmodel.open(ProfilePasswordComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Change Profile Password';
    activeModal.componentInstance.item = { id: item, card_flag: true }
    activeModal.result.then((data) => {
      this.list();
    })
  }

  authpassword(item) {
    const activeModal = this.nasmodel.open(AuthpassComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Change Authentication Password';
    activeModal.componentInstance.item = { id: item, card_flag: true }
    activeModal.result.then((data) => {
      this.list();
    })
  }

  changeValidity(item) {
    const activeModal = this.nasmodel.open(ChangeValidityComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Change Validity';
    activeModal.componentInstance.item = { cust_id: item, card_flag: true }
    activeModal.result.then((data) => {
      this.list();
    })
  }

  
  changeSimUse(item) {
    const activeModal = this.nasmodel.open(ChangeSimUseComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Change Simultaneous Use';
    activeModal.componentInstance.item = { cust_id: item, card_flag: true }
    activeModal.result.then((data) => {
      this.list();
    })
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
    this.bus_name = ''; this.resel_name = ''; this.group_name = '';
    this.cust_name = ''
    this.list();
  }

  changeclear(item) {
    if (item == 1) {
      this.group_name = ''; this.resel_name = ''; this.cust_name = ''
    }
    if (item == 2) {
      this.resel_name = ''; this.cust_name = ''
    }
    if (item == 3) {
      this.cust_name = ''
    }
  }

  async download() {
    this.loading = true;
    let res = await this.custService.listCardUser({
      bus_id: this.bus_name,
      resel_id: this.resel_name,
      group_id: this.group_name,
      uid: this.cust_name
    })
    if (res) {
      this.loading = false;
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        param['ID'] = temp[i]['uid']
        if (this.role.getroleid() > 777) param['BUSINESS'] = temp[i]['busname'];
        param['GROUP'] = temp[i]['groupname'];
        param['RESELLER'] = temp[i]['company'];
        param['PROFILEID'] = temp[i]['cust_profile_id'] || '--';
        param['PROFILE PASSWORD'] = temp[i]['cust_pwd'] || '--';
        param['AUTH PASSWORD'] = temp[i]['auth_pwd'] || '--';
        param['NAME'] = temp[i]['cust_name'] || '--';
        param['EMAIL'] = temp[i]['email'] || '--';
        param['MOBILE'] = temp[i]['mobile'] || '--';
        param['ADDRESS'] = temp[i]['address'] || '--';
        param['BRANCH'] = temp[i]['branch'] || '--';
        param['ACCOUNT TYPE'] = temp[i]['acctype'] == 2 ? 'Card-User' : '--';
        param['OTP STATUS'] = temp[i]['otpstatus'] == 0 ? 'Initiated' : temp[i]['otpstatus'] == 1 ? 'Sent' : '--';
        param['ACCOUNT STATUS'] = temp[i]['acctstatus'] == 0 ? 'Processing' : temp[i]['acctstatus'] == 1 ? 'Activated' : '--';
        temp[i]['expiration'] = temp[i]['expiration'] == '0000-00-00 00:00:00' ? '' : this.datePipe.transform(temp[i]['expiration'], 'dd-MM-yyyy hh:mm:ss a', 'es-ES');
        param['EXPIRY DATE'] = temp[i]['expiration'];

        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'List Card User' + EXCEL_EXTENSION);
    } else this.loading = false;
  }




}

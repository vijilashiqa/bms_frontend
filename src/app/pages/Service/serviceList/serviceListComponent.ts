import { Component, OnInit } from '@angular/core';
import { AddServiceComponent } from '../addService/addService.component';
import { Router } from '@angular/router';
import { NasService, SelectService, RoleService, CustService, S_Service, GroupService, BusinessService, ResellerService, PagerService } from '../../_service/indexService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResellercountComponent } from '../resellercount/resell-count.component';
import { NascountComponent } from '../nascount/nas-count.component';
import { CustomercountComponent } from '../customercount/cust-count.component';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

// declare function bytesToSize(bytes):any;
@Component({
  selector: 'serviceList',
  templateUrl: './serviceListComponent.html',
  styleUrls: ['./serviceListComponent.scss'],

})

export class ServiceListComponent implements OnInit {
  srvList; data; totalpage = 10; pages = [1, 2, 3, 4, 5]; count; pro;
  groupname = '';
  bus; bus_id; group1; groupid; nas1; nas_name; nam1; name; rescount; nascount; subcount; search;
  bus_name = ''; group_name = ''; res1; res_name = ''; srvmode = ""; Service = ""; Data = ""; profile_name = '';
  pager: any = {}; page: number = 1; pagedItems: any = []; limit = 25; srvtype = '';
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;
  constructor(
    private ser: S_Service,
    private route: Router,
    private nasser: NasService,
    public role: RoleService,
    private select: SelectService,
    private groupser: GroupService,
    private busser: BusinessService,
    private resser: ResellerService,
    private custser: CustService,
    private nasmodel: NgbModal,
    public pageservice: PagerService,


  ) { }

  async ngOnInit() {
    localStorage.removeItem('array');
    await this.showBusName();
    await this.initiallist();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.showGroupName();
      await this.showResellerName();
      await this.showService()
      await this.profile();
    }
    if (this.role.getroleid() < 775) {
      // Group option for reseller service Mapping
      // this.group_name = this.role.getgrupid();
      this.res_name = this.role.getresellerid();
      await this.showService()
    }
  }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event });
  }

  async showGroupName($event = '') {
    this.group1 = await this.groupser.showGroupName({ bus_id: this.bus_name, like: $event });
  }

  async profile($event = '') {
    if (this.role.getroleid() > 777) {
      this.pro = await this.resser.showProfileReseller({ bus_id: this.bus_name, like: $event });
      // console.log(res)
    }
    if (this.role.getroleid() <= 777) {
      this.pro = await this.resser.showProfileReseller({ like: $event });
      // console.log(result)
    }
  }

  async showResellerName($event = '') {
    // console.log('inside', this.reseller_under)
    this.res1 = await this.resser.showResellerName({ role: this.profile_name, service_role: 1, bus_id: this.bus_name, groupid: this.group_name, like: $event });
  }

  async showService($event = '') {
    if (this.role.getroleid() >= 775) {
      this.nam1 = await this.ser.showService({ role: this.profile_name, groupid: this.group_name, bus_id: this.bus_name, res_flag: 1, Resel_id: this.res_name, srv_mode: this.srvmode, srv_type: this.Service, srv_datatype: this.Data, like: $event });
    } else {
      this.nam1 = await this.ser.showService({ res_flag: 1, srv_mode: this.srvmode, srv_type: this.Service, srv_datatype: this.Data, like: $event });
    }

  }

  async reselcount(item) {
    let res = await this.resser.showCountResel({ srvid: item })
    this.rescount = res;
    this.reselcountshow(res, item);

  }

  async nascountshow(item) {
    let result = await this.nasser.showCountNas({ srvid: item });
    this.nascount = result;
    this.nascountpop(result, item);
  }

  async subcountshow(item) {
    let res = await this.custser.showSelectUser({ srvid: item });
    this.subcount = res;
    this.custcountshow(res, item);
  }

  nascountpop(data, serid) {
    const activeModal = this.nasmodel.open(NascountComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Nas Count';
    activeModal.componentInstance.item = { data: data, srvid: serid };
    activeModal.result.then((data) => {
      // this.initiallist();
    });
  }

  custcountshow(data, serid) {
    const activeModal = this.nasmodel.open(CustomercountComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Subscriber Count';
    activeModal.componentInstance.item = { data: data, srvid: serid };
    activeModal.result.then((data) => {
      // this.initiallist();
    });
  }


  reselcountshow(data, serid) {
    const activeModal = this.nasmodel.open(ResellercountComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Reseller Count';
    activeModal.componentInstance.item = { data: data, srvid: serid };
    activeModal.result.then((data) => {
      // this.initiallist();
    });
  }

  changeclear(item) {
    if (item == 1) {
      this.group_name = '';
      this.srvmode = '';
      this.Service = '';
      this.Data = '';
      this.profile_name = '';
      this.res_name = '';
      this.name = '';
    }
    if (item == 2) {
      this.srvmode = '';
      this.Service = '';
      this.Data = '';
      this.profile_name = '';
      this.res_name = '';
      this.name = '';
    }
    if (item == 3) {
      this.Service = '';
      this.Data = '';
      this.profile_name = '';
      this.res_name = '';
      this.name = '';
    }
    if (item == 4) {
      this.Data = '';
      this.profile_name = '';
      this.res_name = '';
      this.name = '';
    }
    if (item == 5) {
      this.profile_name = '';
      this.res_name = '';
      this.name = '';
    }
    if (item == 6) {
      this.res_name = '';
      this.name = '';
    }
    if (item == 7) {
      this.Service = '0';
      this.Data = '';
      this.profile_name = '';
      this.res_name = '';
      this.name = '';
    }
  }

  async refresh() {
    this.bus_name = '';
    this.group_name = '';
    this.res_name = '';
    this.srvmode = '';
    this.Service = '';
    this.Data = '';
    this.name = '';
    this.res_name = '';
    this.res1 = '';
    this.group1 = '';
    this.nam1 = '';
    this.pro = '';
    this.profile_name = '';
    this.srvtype = '';
    if (this.role.getroleid() <= 777) {
      await this.showGroupName();
      await this.profile();
      await this.showResellerName();
      await this.showService();
    }
    await this.initiallist();
  }

  async initiallist() {
    // console.log(this.bus_name)
    this.loading = true;
    let result = await this.ser.listService({
      index: (this.page - 1) * this.limit,
      bus_id: this.bus_name,
      limit: this.limit,
      groupid: this.group_name,
      mid: this.res_name,
      srv_mode: this.srvmode,
      srv_type: this.Service,
      srv_datatype: this.Data,
      srvid: this.name,
      Resel_id: this.res_name,
      role: this.profile_name,
      srvtype: this.srvtype
    });
    this.loading = false;
    if (result) {
      // console.log(result)
      this.srvList = result[0];
      this.count = result[1]["count"];
      for (var l = 0; l < this.srvList.length; l++) {
        //   console.log(this.srvList[l].downrate)
        this.srvList[l].down = this.srvList[l].policy == 1 ? this.srvList[l].policymapdl : this.srvList[l].downrate == 0 ? 0 : this.bytefunc(this.srvList[l].downrate)
        this.srvList[l].up = this.srvList[l].policy == 1 ? this.srvList[l].policymapul : this.srvList[l].uprate == 0 ? 0 : this.bytefunc(this.srvList[l].uprate)
        this.srvList[l].trafficunitdl = this.srvList[l].limitdl == 1 ? this.bytefunct(this.srvList[l].trafficunitdl) : 0;
        this.srvList[l].trafficunitul = this.srvList[l].limitul == 1 ? this.bytefunct(this.srvList[l].trafficunitul) : 0;
        this.srvList[l].trafficunitcomb = this.srvList[l].limitcomb == 1 ? this.bytefunct(this.srvList[l].trafficunitcomb) : 0;

      }
      // console.log("cal",this.srvList)

    }
    this.setPage();
  }

  async download() {
    let res = await this.ser.listService({
      bus_id: this.bus_name,
      limit: this.limit,
      groupid: this.group_name,
      mid: this.res_name,
      srv_mode: this.srvmode,
      srv_type: this.Service,
      srv_datatype: this.Data,
      srvid: this.name,
      Resel_id: this.res_name,
      role: this.profile_name,
      srvtype: this.srvtype
    })
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        temp[i]['down'] = temp[i]['policy'] == 1 ? temp[i]['policymapdl'] : temp[i]['downrate'] == 0 ? 0 : this.bytefunc(temp[i]['downrate']);
        temp[i]['up'] = temp[i]['policy'] == 1 ? temp[i]['policymapul'] : temp[i]['uprate'] == 0 ? 0 : this.bytefunc(temp[i]['uprate']);
        temp[i]['trafficunitdl'] = temp[i]['limitdl'] == 1 ? this.bytefunct(temp[i]['trafficunitdl']) : 0;
        temp[i]['trafficunitul'] = temp[i]['limitul'] == 1 ? this.bytefunct(temp[i]['trafficunitul']) : 0;
        temp[i]['trafficunitcomb'] = temp[i]['limitcomb'] == 1 ? this.bytefunct(temp[i]['trafficunitcomb']) : 0;
        if (this.role.getroleid() > 777) {
          param['ID'] = temp[i]['srvid']
          param['ISP NAME'] = temp[i]['busname'];
        }
        if (this.role.getroleid() >= 775) {
          param['CIRCLE'] = temp[i]['groupname'];
        }
        param['SERVICE NAME'] = temp[i]['srvname'];
        param['SERVICE'] = temp[i]['srv_type'] == 0 ? 'Broadband' : 'Card';
        param['SERVICE MODE'] = temp[i]['srvmode'] == 0 ? 'Regular' : temp[i]['srvmode'] == 1 ? 'Fallback' : temp[i]['srvmode'] == 2 ? 'Expiry' : 'Disable';
        param['SERVICE TYPE'] = temp[i]['srvtype'] == 0 ? 'Prepaid' : temp[i]['srvtype'] == 2 ? 'PostPaid' : temp[i]['srvtype'] == 3 ? 'Email' :
          temp[i]['srvtype'] == 1 ? 'Prepaid Card or IAS' : 'Radius AccessList';
        param['SERVICE DATA TYPE'] = temp[i]['srvdatatype'] == 1 ? 'Unlimited' : 'FUP';
        // param['RESELLER TYPE'] = temp[i]['menu_name'];
        param['POLICY'] = temp[i]['policy'] == 1 ? 'Cisco' : 'Rate';
        param['DOWNRATE'] = temp[i]['policy'] == 1 ? temp[i]['policymapdl'] : temp[i]['down'] == 0 ? 'Unlimited' : temp[i]['down'];
        param['UP RATE'] = temp[i]['policy'] == 1 ? temp[i]['policymapul'] : temp[i]['up'] == 0 ? 'Unlimited' : temp[i]['up'];
        param['DL LIMIT'] = temp[i]['limitdl'] == 0 ? '--' : temp[i]['trafficunitdl'];
        param['UL LIMIT'] = temp[i]['limitul'] == 0 ? '--' : temp[i]['trafficunitul'];
        param['TOTAL LIMIT'] = temp[i]['limitcomb'] == 0 ? '--' : temp[i]['trafficunitcomb'];
        param['FALLBACK SERVICE'] = temp[i]['nservname'] == null ? '--' : temp[i]['nservname'];
        if (this.role.getroleid() >= 775) {
          param['ASSIGNED RESELLER'] = temp[i]['rcount'] == null ? '--' : temp[i]['rcount'];
          param['ASSIGNED NAS'] = temp[i]['ncount'] == null ? '--' : temp[i]['ncount'];
        }
        param['SUBSCRIBER COUNT'] = temp[i]['ucount'];
        param['BURST MODE'] = temp[i]['enableburst'] == 1 ? 'Enable' : 'Disable';
        param['DATA SPLIT'] = temp[i]['datasplit'] == 1 ? 'Enable' : 'Disable';
        param['STATUS'] = temp[i]['enableservice'] == 1 ? 'Active' : 'Inactive';
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Service List' + EXCEL_EXTENSION);
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
    this.pagedItems = this.srvList;
    // console.log('asdfg',this.pagedItems)
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

  Edit_Service(item) {
    localStorage.setItem('array', JSON.stringify(item));
    this.route.navigate(['/pages/service/edit-service']);
  }
  view_service(item) {
    localStorage.setItem('details', JSON.stringify(item))
    this.route.navigate(['/pages/service/viewservice'])
  }

}
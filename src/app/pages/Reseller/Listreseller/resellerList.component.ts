import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PasswordComponent } from '../Password/profilepass.component';
import { ResellLogoUpdateComponent } from '../resellerlogo/resel-logo.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NasService, ResellerService, SelectService, GroupService, BusinessService, RoleService, PagerService } from '../../_service/indexService';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { EditNasComponent } from '../editnas/editnas.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'Listreseller',
  templateUrl: './resellerList.component.html',
  styleUrls: ['./resellerList.component.scss']
})
export class ResellerListComponent implements OnInit {
  data; totalpage = 10; pages = [1, 2, 3, 4, 5]; count;
  bus; bus_name = ''; group1; bulk; deposit; hotel; subdisbulk; subdisdep; subispbulk; subispdep; nasip;
  group_name = ''; nas1; nas_name; res1; res_name = ''; search; profile; resel_type = ''; under; id; reseller_under; resellerrole;
  resmob; resmail; reslogid; res_mob = ''; res_mail = ''; res_logid = ''; nas_ip = '';
  pager: any = {}; page: number = 1; pagedItems: any = []; limit = 25; state_id; state;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;
  constructor(
    public role: RoleService,
    private router: Router,
    private ser: ResellerService,
    private nasmodel: NgbModal,
    private select: SelectService,
    private nasser: NasService,
    private groupser: GroupService,
    private busser: BusinessService,
    public pageservice: PagerService,
    private datePipe: DatePipe,


  ) { }

  async ngOnInit() {
    localStorage.removeItem('array');
    localStorage.removeItem('resid');
    localStorage.removeItem('lflag');
    await this.showBusName();
    await this.showState();
    await this.initiallist();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.showGroupName();
      await this.showGroupNas();
      await this.showProfileReseller();
      await this.showResellerName();
    }
    if (this.role.getroleid() < 775) {
      this.group_name = this.role.getgrupid();
    }
  }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event });
    // console.log(result)
  }

  async showGroupName($event = '') {
    this.group1 = await this.groupser.showGroupName({ bus_id: this.bus_name, like: $event });
    // console.log("group:", result)
  }

  async showGroupNas($event = '') {
    this.nas1 = await this.nasser.showGroupNas({ bus_id: this.bus_name, groupid: this.group_name, like: $event });
  }

  async nasipaddr($event = '') {
    this.nasip = await this.nasser.showGroupNas({ bus_id: this.bus_name, groupid: this.group_name, ip_like: $event });
  }

  async showProfileReseller($event = '') {
    this.profile = await this.ser.showProfileReseller({ bus_id: this.bus_name, like: $event });
    // console.log("prof:", result)
  }

  async showState($event = '') {
    this.state = await this.select.showState({ like: $event });
  }

  async showResellerName($event = '') {
    if (this.role.getroleid() >= 775) {
      this.res1 = await this.ser.showResellerName({
        res_Search: 1, bus_id: this.bus_name, groupid: this.group_name, role: this.resel_type,
        resel_email: this.res_mail, resel_login: this.res_logid, resel_mob: this.res_mob, like: $event
      });
    } else {
      this.res1 = await this.ser.showResellerName({ role: this.resel_type, resel_email: this.res_mail, resel_login: this.res_logid, resel_mob: this.res_mob, like: $event });
    }

  }

  async resmobile($event = '') {
    this.resmob = await this.ser.showResellerName({
      bus_id: this.bus_name, groupid: this.group_name, role: this.resel_type,
      resel_email: this.res_mail, resel_login: this.res_logid, resel_id: this.res_name, m_like: $event
    });

  }

  async resemail($event = '') {
    this.resmail = await this.ser.showResellerName({
      bus_id: this.bus_name, groupid: this.group_name, role: this.resel_type,
      resel_mob: this.res_mob, resel_login: this.res_logid, resel_id: this.res_name, e_like: $event
    });
  }

  async reslogin($event = '') {
    this.reslogid = await this.ser.showResellerName({
      bus_id: this.bus_name, groupid: this.group_name, role: this.resel_type,
      resel_mob: this.res_mob, resel_email: this.res_mail, resel_id: this.res_name, l_like: $event
    });

  }

  changeclear(item) {
    if (item == 1) {
      this.group_name = '';
      this.resel_type = '';
      this.res_name = '';
      this.res_mob = '';
      this.res_mail = '';
      this.res_logid = '';
      this.nas_name = '';
      this.nas_ip = '';
      this.state_id = '';
    }
    if (item == 2) {
      this.resel_type = '';
      this.res_name = '';
      this.res_mob = '';
      this.res_mail = '';
      this.res_logid = '';
      this.nas_name = '';
      this.nas_ip = '';
      this.state_id = '';
    }
    if (item == 3) {
      this.res_name = '';
      this.res_mob = '';
      this.res_mail = '';
      this.res_logid = '';
      this.nas_name = '';
      this.nas_ip = '';
      this.state_id = '';
    }
    if (item == 4) {
      this.res_mob = '';
      this.res_mail = '';
      this.res_logid = '';
      this.nas_name = '';
      this.nas_ip = '';
      this.state_id = '';
    }
    if (item == 5) {
      this.res_mail = '';
      this.res_logid = '';
      this.nas_name = '';
      this.nas_ip = '';
    }
    if (item == 6) {
      this.res_logid = '';
      this.nas_name = '';
      this.nas_ip = '';
    }
    if (item == 7) {
      this.nas_name = '';
      this.nas_ip = '';
    }
  }

  async refresh() {
    this.bus_name = '';
    this.group_name = '';
    this.nas_name = '';
    this.nas_ip = '';
    this.resel_type = '';
    this.res_name = '';
    this.res_mob = '';
    this.res_mail = '';
    this.res_logid = '';
    this.group1 = '';
    this.nas1 = '';
    this.nasip = '';
    this.res1 = '';
    this.resmob = '';
    this.resmail = '';
    this.reslogid = '';
    this.state_id = '';
    if (this.role.getroleid() <= 777) {
      await this.showGroupName();
      await this.showGroupNas();
      await this.nasipaddr();
      await this.showProfileReseller();
      await this.showProfileReseller();
    }
    await this.initiallist();
  }

  async initiallist() {
    
    this.loading = true;
    let result = await this.ser.listReseller(
      {
        index: (this.page - 1) * this.limit,
        limit: this.limit,
        bus_id: this.bus_name,
        groupid: this.group_name,
        nasid: this.nas_name,
        ip: this.nas_ip,
        role: this.resel_type,
        resel_id: this.res_name,
        resel_mob: this.res_mob,
        resel_email: this.res_mail,
        resel_login: this.res_logid,
        state_id: this.state_id,
        // resel_under:this.reseller_under,
        // res_id:this.reseller_under,
      });
    this.loading = false;
    // console.log(result)
    if (result) {
      this.data = result[0];
      this.count = result[1]["totcount"];
      this.bulk = result[1]["BulkReseller"];
      this.deposit = result[1]["DepositReseller"];
      this.hotel = result[1]["Hotels"];
      this.subdisbulk = result[1]["subDistBulk"];
      this.subdisdep = result[1]["subDistDeposit"];
      this.subispbulk = result[1]["subISPbulk"];
      this.subispdep = result[1]["subISPdeposit"];
      this.setPage();
    }
  }

  async download() {
    let res = await this.ser.listReseller({
      bus_id: this.bus_name,
      groupid: this.group_name,
      nasid: this.nas_name,
      ip: this.nas_ip,
      role: this.resel_type,
      resel_id: this.res_name,
      resel_mob: this.res_mob,
      resel_email: this.res_mail,
      resel_login: this.res_logid,
      state_id: this.state_id
    })
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
        if (this.role.getroleid() > 444) {
          param['NAS NAME'] = temp[i]['nasname'];
        }
        param['STATUS'] = temp[i]['status'];
        param['L0GIN ID'] = temp[i]['managername'];
        param['RESELLER TYPE'] = temp[i]['menu_name'];
        param['RESELLER BUSINESS NAME'] = temp[i]['company'];
        param['PRIMARY NAS'] = temp[i]['nasip'];
        param['SERVICE TYPE'] = temp[i]['service_name'];
        param['MOBILE'] = temp[i]['mobile'];
        param['EMAIL'] = temp[i]['email'].toLowerCase();
        param['ADDRESS']=temp[i]['address'];
        param['BALANCE'] = temp[i]['balance_amt'];
        param['GST No'] = temp[i]['gst_no'];
        param['SUBSCRIBER LIMIT'] = temp[i]['sub_limit'] == 0 ? 'Unlimited' : temp[i]['sub_limit'];
        param['ACTIVE SUBSCRIBERS'] = temp[i]['ucount'];
        param['PREFIX'] = temp[i]['prefix_on'] == 1 ? 'Enable' : 'Disable';
        temp[i]['c_date'] = temp[i]['c_date'] == '0000-00-00 00:00:00' ? '--' : this.datePipe.transform(temp[i]['c_date'], 'd MMM y');
        param['REGISTERED DATE'] = temp[i]['c_date'];
        param['STATE'] = temp[i]['stname'];
        param['CITY'] = temp[i]['diname'];
        param['SHARING TYPE'] = temp[i]['sharing_type'] == 1 ? 'Common Sharing' : 'Package Wise Sharing';
        param['ISP SHARE'] = temp[i]['isp_share'] + "%" || 0 
        param['SUB ISP SHARE'] = temp[i]['sub_isp_share'] + "%" || 0 
        param['SUB DIST SHARE'] = temp[i]['sub_dist_share'] + "%" || 0 
        param['RESELLER SHARE'] = temp[i]['reseller_share'] + "%" || 0 

        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Reseller List' + EXCEL_EXTENSION);
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

  Edit_resel(item) {
    localStorage.setItem('array', JSON.stringify(item));
    this.router.navigate(['/pages/reseller/edit-reseller']);
  }

  View_user(item, lflag) {
    localStorage.setItem('resid', JSON.stringify(item));
    localStorage.setItem('lflag', JSON.stringify(lflag));
    this.router.navigate(['/pages/reseller/viewreseller']);
  }


  view_logo(res_id) {
    const activeModal = this.nasmodel.open(ResellLogoUpdateComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Reseller LOGO';
    activeModal.componentInstance.item = { id: res_id }
    activeModal.result.then((data) => {
      this.initiallist();
    })
  }

  password(item) {
    const activeModal = this.nasmodel.open(PasswordComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.item = { id: item },
      activeModal.componentInstance.modalHeader = 'Change Password';
  }

  nasedit(resid, busid, grupid, nasid) {
    const activeModal = this.nasmodel.open(EditNasComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.item = { id: resid, bus_id: busid, groupid: grupid, nas_id: nasid },
      activeModal.componentInstance.modalHeader = 'Edit Nas';
    activeModal.result.then((data) => {
      this.initiallist();
    });
  }
}
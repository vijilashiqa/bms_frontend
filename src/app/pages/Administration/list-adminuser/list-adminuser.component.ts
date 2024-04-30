import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChangepasswordComponent } from '../changepassword/changepassword.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminuserService, GroupService, BusinessService, RoleService, ResellerService } from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Component({
  selector: 'list-adminuser',
  templateUrl: './list-adminuser.component.html',
  styleUrls: ['./list-adminuser.component.scss']
})
export class ListAdminuserComponent implements OnInit {
  datas; count; search; bus_name = ''; bus_loc; user_name = ''; bus; group1; user; group_name = ''; login_id = '';
  userlogid;
  constructor(
    private router: Router,
    private adminuser: AdminuserService,
    private nasmodel: NgbModal,
    private busser: BusinessService,
    private groupser: GroupService,
    public role: RoleService,
    private reselser: ResellerService,

  ) { }

  async ngOnInit() {
    // this.Listnas();
     await this.initiallist();
    this.showBusName();
    if (this.role.getroleid() <= 777) {
      await this.showGroupName();
      await this.showuser();
      await this.showloginid();
    }

  }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event });
    // console.log("business",result)
  }

  async showGroupName($event = '') {
    this.group1 = await this.groupser.showGroupName({ bus_id: this.bus_name, like: $event });
    // console.log("group",result)
  }

  async showuser($event = '') {
    this.user = await this.adminuser.showProfileAdmin({ emp_role: 1, bus_id: this.bus_name, groupid: this.group_name, like: $event });
    // console.log("user",this.user)
  }

  async showloginid($event = '') {
    if (this.role.getroleid() < 775) {
      this.userlogid = await this.reselser.showResellerName({ manager_id: this.role.getresellerid(), l_like: $event })

    } else {
      this.userlogid = await this.reselser.showResellerName({ role: this.user_name, emp_role: 1, bus_id: this.bus_name, groupid: this.group_name, l_like: $event })

    }

  }

  async changeclear(item) {
    if(item == 1) {
      this.group_name = '';
      this.user_name = '';
      this.login_id = '';
    }
    if (item == 2) {
      this.user_name = '';
      this.login_id = '';
    }
    if(item == 3){
      this.login_id='';
    }
    
  }

  async refresh() {
    this.bus_name = '';
    this.group_name = '';
    this.user_name = '';
    this.login_id = '';
    this.group1 = '';
    this.user = '';
    this.userlogid = '';
    if (this.role.getroleid() <= 777) {
      await this.showGroupName();
      await this.showuser();
      await this.showloginid();
    }
    await this.initiallist();
  }

  async initiallist() {
    debugger;
    let result = await this.adminuser.listAdminuser(
      {
        bus_id: this.bus_name,
        groupid: this.group_name,
        role: this.user_name,
        profile_id: this.login_id,
      });
    this.datas = result[0];
    this.count = result[1]['count'];
  }

  async download() {
    let res = await this.adminuser.listAdminuser({
      bus_id: this.bus_name,
      groupid: this.group_name,
      role: this.user_name,
      profile_id: this.login_id,
    });
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        param['BUSINESS NAME'] = temp[i]['busname'];
        param['GROUP NAME'] = temp[i]['groupname'];
        param['USER NAME'] = temp[i]['username'];
        param['PROFILE'] = temp[i]['menu_name'];
        param['PROFILE ID'] = temp[i]['managername'];
        param['MOBILE NUMBER'] = temp[i]['mobile'];
        param['EMAIL ID'] = temp[i]['email']
        param['ADDRESS'] = temp[i]['address']
        param['STATUS'] = temp[i]['status'] == 1 ? 'Active' : 'Deactive'

        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'AdminUser List' + EXCEL_EXTENSION);
    }
  }

  change_passwrd(adminid) {
    const activeModal = this.nasmodel.open(ChangepasswordComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.item = { id: adminid }
    activeModal.componentInstance.modalHeader = 'Change Password';
    activeModal.result.then((data) => {
      this.initiallist();
    });
  }
}
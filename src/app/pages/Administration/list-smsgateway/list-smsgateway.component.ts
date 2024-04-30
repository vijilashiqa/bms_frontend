import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChangepasswordComponent } from '../changepassword/changepassword.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminuserService, GroupService, BusinessService, RoleService, ResellerService } from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'list-smsgateway',
  templateUrl: './list-smsgateway.component.html',
  styleUrls: ['./list-smsgateway.component.scss']
})
export class ListSMSgatewayComponent implements OnInit {
  datas; count; search; bus_name = ''; bus_loc; login_id = ''; bus; group1; user; res_name = ''; resel_type = '';
  profile; res1; gateway;gateway_type='';
  constructor(
    private router: Router,
    private adminuser: AdminuserService,
    private ser: ResellerService,
    private nasmodel: NgbModal,
    private busser: BusinessService,
    private groupser: GroupService,
    public role: RoleService

  ) { }

  async ngOnInit() {
    // this.Listnas();
    await this.initiallist();
    this.showBusName();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.showResellerName();
      await this.smsgateway();
    }

  }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event });
    // console.log("business",result)
  }

  async showResellerName($event = '') {
    // console.log('inside', this.reseller_under)
    this.res1 = await this.ser.showResellerName({ bus_id:this.bus_name,sms_role: this.gateway_type, like: $event });
    // console.log(result)
  }

  async smsgateway($event = '') {
    this.gateway = await this.adminuser.showSMSGateway({ bus_id: this.bus_name, gateway_type:this.gateway_type,resel_id: this.res_name, like: $event })
  }

  changeclear(item){
    if(item == 1){
      this.gateway_type='';
      this.res_name='';
      this.login_id='';
    }
    if(item == 2){
      this.res_name='';
      this.login_id='';
    }
  }

  async refresh() {
    this.bus_name = '';
    this.gateway_type=''
    this.res_name = '';
    this.login_id = '';
    await this.initiallist();
  }

  async initiallist() {
    let result = await this.adminuser.listSMSGateway(
      {
        bus_id: this.bus_name,
        gateway_type:this.gateway_type,
        resel_id: this.res_name,
        loginid: this.login_id,
      });
    this.datas = result[0];
    this.count = result[1]['count'];
  }

  async download() {
    let res = await this.adminuser.listSMSGateway({
      bus_id: this.bus_name,
      gateway_type:this.gateway_type,
      resel_id: this.res_name,
      loginid: this.login_id,
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
}
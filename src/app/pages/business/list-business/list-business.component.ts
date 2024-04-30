import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RoleService, BusinessService, SelectService } from '../../_service/indexService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ISPLogoUpdateComponent } from './../isplogo/isplogo.component';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'list-business',
  templateUrl: './list-business.component.html',
  styleUrls: ['./list-business.component.scss']
})

export class ListBusinessComponent implements OnInit {
  count; bus; busid; bus_name; bus_loc; state_id; state; cit; stat; mob; city; bus_mob;
  buslist; search;
  constructor(
    private router: Router,
    private ser: BusinessService,
    private select: SelectService,
    public role: RoleService,
    private nasmodel: NgbModal,


  ) { }

  async showBusName($event = '') {
    this.bus = await this.ser.showBusName({ like: $event })
  }

  async showState($event = '') {
    this.stat = await this.select.showState({ like: $event })
  }

  async showDistrict($event = '') {
    this.cit = await this.select.showDistrict({ state_id: this.state, like: $event, index: 0, limit: 15 })
  }

  async showBusMob($event = '') {
    this.mob = await this.ser.showBusMob({ bus_id: this.bus_name, like: $event })
    // console.log("mobnum",res)
  }

  view_logo(id) {
    const activeModal = this.nasmodel.open(ISPLogoUpdateComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'ISP LOGO';
    activeModal.componentInstance.item = { id: id }
    activeModal.result.then((data) => {
      this.initiallist();
    })
  }

  async changeclear(item) {
    if(item == 1){
      this.state = '';
      this.city = '';
      this.bus_mob = '';
    }
  }

  async refresh(){
    this.bus_name='';
    this.state ='';
    this.city = '';
    this.bus_mob='';
    await this.initiallist();
  }

  async ngOnInit() {
    localStorage.removeItem('array');
    await this.showBusName();
    await this.initiallist();
    await this.showState();
    if (this.role.getroleid() == 777) {
      this.bus_name = this.role.getispid();
      await this.showBusMob();

    }
  }

  async initiallist() {
    let result = await this.ser.listbusiness(
      {
        bus_id: this.bus_name,
        stat: this.state,
        cit: this.city,
        mobile: this.bus_mob,
      })
      console.log('Ress',result)
    if (result) {
      this.buslist = result[0];
      this.count = result[1]['count']
    }
  }

  async download() {
    let res = await this.ser.listbusiness({
      bus_id: this.bus_name,
    })
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        param['BUSINESS NAME'] = temp[i]['busname'];
        param['SERVICE TYPE'] = temp[i]['service_name'];
        param['FIRST NAME'] = temp[i]['firstname'];
        param['LAST NAME'] = temp[i]['lastname'];
        param['STATE'] = temp[i]['state'];
        param['CITY'] = temp[i]['city'];
        param['MOBILE NUMBER'] = temp[i]['mobile'];
        param['LANDLINE NUMBER'] = temp[i]['phone'];
        param['GST NUMBER'] = temp[i]['gst'];
        param['IGST'] = temp[i]['igst'];
        param['CGST'] = temp[i]['cgst'];
        param['SGST'] = temp[i]['sgst'];
        param['HOT BUCKET'] = temp[i]['hot_bucket'];
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Business List' + EXCEL_EXTENSION);
    }
  }

  Edit_User(item) {
    localStorage.setItem('array', JSON.stringify(item));
    this.router.navigate(['/pages/business/edit-business']);
  }
}
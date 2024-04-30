import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import { ComplaintService,CustService,PagerService,BusinessService ,ResellerService, RoleService } from '../../_service/indexService';
import { CompliantHistoryComponent } from './../comphistory/comp-history.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'list-comp',
  templateUrl: './list-comp.component.html',
  styleUrls:['./list-comp.component.scss']
})
export class ListCompComponent implements OnInit {
  datas;search;reseller_name;cust;count;config;tot;compdata;custname;busname;profile;resell;
  bus_name='';resel_type='';res_name='';cust_name='';

  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;
  constructor(
    private route : Router,
    private alert: ToasterService,
    private service: ComplaintService,
    private custser : CustService,
    private busser : BusinessService,
    private resser : ResellerService,
    public role : RoleService,
    public nasmodel: NgbModal,
    public pageservice: PagerService,

  ) {}

  async ngOnInit(){
    // localStorage.removeItem('array');
    await this.business();
    await this.initiallist();
    if(this.role.getroleid()<=777){
      this.bus_name = this.role.getispid();
      await this.showProfileReseller();
      await this.showResellerName();
      await this.showUser();
    }
  }

  async business() {
    this.busname = await this.busser.showBusName({})
  }

  async showProfileReseller($event = '') {
    this.profile = await this.resser.showProfileReseller({ bus_id: this.bus_name, like: $event })
    // console.log("prof:", this.profile)
  }

  async showResellerName($event = '') {
    // console.log('inside', this)
    this.resell = await this.resser.showResellerName({ role: this.resel_type, like: $event })
    // console.log("resname",this.resell)
  }

  async showUser($event = '') {
    this.custname = await this.custser.showUser({ bus_id: this.bus_name, role: this.resel_type, role_flag: 1, resel_id: this.res_name,  like: $event })
    // console.log("customer", result)
  }

  async refresh() {
    this.bus_name='';
    this.resel_type='';
    this.res_name='';
    this.cust_name='';
    await this.initiallist();
  }

  async initiallist(){
    let result = await this.service.listComplaint({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      bus_id:this.bus_name,
      role:this.resel_type,
      resel_id:this.res_name,
      uid: this.cust_name,
    });
      this.datas=result[0];
      this.tot = result[1]['count'];
      // console.log(result)
    this.setPage();
  }

  async download() {
    let res = await this.service.listComplType({
      bus_id:this.bus_name,
      role:this.resel_type,
      resel_id:this.res_name,
      uid: this.cust_name,
    })
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        if(this.role.getroleid()>777){
          param['ISP NAME'] = temp[i]['busname'];
        }
        if(this.role.getroleid()>=775){
          param['RESELLER BUSINESS NAME'] = temp[i]['company']
        }
        param['SUBSCRIBER NAME'] = temp[i]['custname'];
        param['SUBSCRIBER MOBILE'] = temp[i]['mobile'];
        param['SUBSCRIBER ADDRESS'] = temp[i]['address'];
        param['COMPLAINT TYPE'] = temp[i]['comp_type'];
        param['SUBJECT'] = temp[i]['subject']==null ? '--' :temp[i]['subject'];
        param['NOTE'] = temp[i]['note']==null ? '--' :temp[i]['note'];
        param['EMPLOYEE'] = temp[i]['empname'];
        param['PRIORITY'] = temp[i]['priority']==0 ? 'Immediate' :temp[i]['priority']==1 ? 'Medium':'Low';
        param['STATUS'] = temp[i]['status']==1 ? 'Open':temp[i]['status']==2 ?'Opend&Assigned':temp[i]['status']==3 ?'Assigend':
        temp[i]['status']==4 ?'Resolved':temp[i]['status']==5 ?'Re-assigned':'Closed';
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Complaint List' + EXCEL_EXTENSION);
    }
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
    this.pagedItems = this.datas;
  }

  history(compid) {
    const activeModal = this.nasmodel.open(CompliantHistoryComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Complaint History';
    activeModal.componentInstance.item = { id:compid };
    activeModal.result.then((data) => {
      this.initiallist();
    })
  }

}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import { ResellerService, GroupService, BusinessService, RoleService, PagerService, DashboardService, CustService } from '../../_service/indexService';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import * as JSXLSX from 'xlsx';
import { DocpopComponent } from '../add-documents/add-documents.component';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
 @Component({
  selector: 'listdocpending',
  templateUrl: './listdocpending.component.html',
  styleUrls: ['./listdocpending.component.scss']
})

export class ListSubsDocPendingomponent implements OnInit {
  submit: boolean = false; datas; count; search; bus_name = ''; bus_loc; reseller_name;custname;res1;profile;
  bus; group1; resell; group_name=''; res_name=''; branches; branch_name = '';resel_type='';cust_name='';

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;
  constructor(
    private router: Router,
    private ser: ResellerService,
    private groupser: GroupService,
    private busser: BusinessService,
    public role: RoleService,
    public pageservice: PagerService,
    private dashser : DashboardService,
    private custser : CustService,
    private modal:NgbModal
  ) { }

  async ngOnInit() {
    localStorage.removeItem('Array');
    await this.showBusName();
    await this.initiallist();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.showGroupName();
      await this.showProfileReseller();
      await this.showReseller();
      await this.showUser();
    }
    if (this.role.getroleid() < 775) {
      this.group_name = this.role.getgrupid();
    }
  }

  async showbranch($event = '') {
    this.branches = await this.ser.showResellerBranch({ resel_id: this.res_name, like: $event });
  }

  async showBusName($event = '') {

    this.bus = await this.busser.showBusName({ like: $event });
  }

  async showGroupName($event = '') {
    this.group1 = await this.groupser.showGroupName({ bus_id: this.bus_name, like: $event });
  }

  async showProfileReseller($event = '') {
    this.profile = await this.ser.showProfileReseller({ bus_id: this.bus_name, like: $event })
    // console.log("prof:", result)
  }

  async showReseller($event = '') {
    this.resell = await this.ser.showResellerName({ res_Search:1,bus_id: this.bus_name, groupid: this.group_name, role: this.resel_type,like: $event });
    // console.log("resell",res)
  }

  async showUser($event = '') {
    this.custname = await this.custser.showUser({ bus_id: this.bus_name, groupid: this.group_name, role: this.resel_type, role_flag: 1, resel_id: this.res_name, like: $event })
    // console.log("customer", result)
  }

  changeclear(item) {
    if(item == 1){
      this.group_name='';
      this.resel_type='';
      this.res_name='';
      this.cust_name='';
    }
    if(item == 2){
      this.resel_type='';
      this.res_name='';
      this.cust_name='';
    }
    if(item == 3){
      this.res_name='';
      this.cust_name='';
    }
  }

  async refresh() {
    this.bus_name='';
    this.group_name='';
    this.resel_type='';
    this.res_name='';
    this.cust_name='';
    this.group1='';
    this.profile='';
    this.resell='';
    this.custname='';
    if(this.role.getroleid()<=777){
      await this.showGroupName();
      await this.showProfileReseller();
      await this.showReseller();
    }
    await this.initiallist();
  }

  async initiallist() {
    this.loading = true;
    let result = await this.custser.listDocument({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      doc_pending:1,
      bus_id: this.bus_name,
      groupid: this.group_name,
      role:this.resel_type,
      resel_id: this.res_name,
      uid:this.cust_name,
      sort_exp:0
    });
    if (result) {
      // console.log(result)
      this.datas = result[0];
      this.count = result[1]['count'];
      this.setPage();
      this.loading = false;
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
    this.pagedItems = this.datas;
    // console.log("agre",this.pagedItems);
    
  }

  async download() {
    this.loading = true;
    let res = await this.custser.listSubscriber({
      bus_id: this.bus_name,
      groupid: this.group_name,
      resel_id: this.res_name,
      res_branch: this.branch_name,
    });
    this.loading = false;
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        if (this.role.getroleid() > 777) {
          param['ISP NAME'] = temp[i]['busname'];
        }
        if (this.role.getroleid() >= 775) {
          param['GROUP NAME'] = temp[i]['groupname'];
        }
        param['RESELLER NAME'] = temp[i]['reseller_name'];
        param['BUSINESS NAME'] = temp[i]['company'];
        param['SUBSCRIBER PROFILEID'] = temp[i]['cust_profile_id'];
        param['SUBSCRIBER NAME'] = temp[i]['cust_name'];
        param['MOBILE'] = temp[i]['mobile'];
        temp[i]['caf_status'] = temp[i]['caf_photo_status']==1 ? 'Collected':temp[i]['caf_photo_status']==2?'Verified':'Pending';
        param['CAF'] = temp[i]['caf_status'];
        temp[i]['addr_status'] = temp[i]['address_photo_status']==1 ? 'Collected':temp[i]['address_photo_status']==2 ? 'Verfied':'Pending';
        param['ADDRESS PROOF'] = temp[i]['addr_status'];
        temp[i]['id_status'] = temp[i]['id_photo_status']==1 ? 'Collected':temp[i]['id_photo_status']==2 ? 'Verified':'Pending';
        param['ID PROOF'] = temp[i]['id_status'];
        temp[i]['pic_status'] = temp[i]['user_photo_status']==1 ? 'Collected':temp[i]['user_photo_status']==2 ? 'Verified':'Pending';
        param['CUSTOMER PIC'] = temp[i]['pic_status'];

        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'CAF Pending List' + EXCEL_EXTENSION);
    }
  }

  view_user(item) {
    localStorage.setItem('details', JSON.stringify(item));
    this.router.navigate(['/pages/cust/viewcust']);
  }

  snapProof(uid, item, picflag) {
    localStorage.setItem('array', JSON.stringify(item));
    localStorage.setItem('flag', JSON.stringify(picflag));
    localStorage.setItem('subid', JSON.stringify(uid));
    localStorage.setItem('doc',JSON.stringify(1))

    this.router.navigate(['/pages/cust/add-custpic']);
  }

  uploadProof(uid, proid, flag,addorid =0) {
    const activeModal = this.modal.open(DocpopComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = addorid == 1 ? 'Address Proof' :  addorid == 2 ?'Identity Proof': 'Subscriber Picture';
    activeModal.componentInstance.item = addorid == 1 ? { uid:uid,proid:proid,addr:flag}: addorid == 2 ? { uid:uid,proid:proid,idproof:flag} :
    { uid: uid, proid: proid, subpicflag: flag } ;
    activeModal.result.then((data) => {
      this.initiallist();
    })
  }
 
 


}
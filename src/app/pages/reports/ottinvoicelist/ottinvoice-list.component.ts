import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AccountService, BusinessService, AdminuserService, GroupService,
  ResellerService, RoleService, S_Service,PagerService} from '../../_service/indexService';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
 import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { OttcountComponent } from '../../Administration/ottcount/ottcount.component';
 
 
 

@Component({
  selector: 'ottinvoicelist',
  templateUrl: './ottinvoice-list.component.html',
  styleUrls:['./ottinvoice-list.component.scss'],
})

export class OttInvoiceListComponent implements OnInit {
  submit: boolean = false; addNas; data; search; bus_name = ''; bus; group1; resel_type='';
   res1; res_name = ''; paymentForm; tot; Download; count;  group_name = ''; pro
 
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;
  constructor(
    private alert: ToasterService,
    private router: Router,
    private ser: AccountService,
    public role: RoleService,
    private busser: BusinessService,
    private groupser: GroupService,
    private reselser: ResellerService,
    public pageservice: PagerService,
    public activeModal: NgbModal,
    public adminser: AdminuserService,


  ) { }

  async ngOnInit() {
    await this.showBusName();
    await this.initiallist();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.profile();
      await this.showResellerName();
    }
  }

  // async showGroupName($event = '') {
  //   await this.groupser.showGroupName({ bus_id: this.bus_name, like: $event })
  //     this.group1 = result;
  //     // console.log("group:", result)
  //   });
  // }

  async showBusName($event = '') {
    this.bus =await this.busser.showBusName({ like: $event });
      // console.log(result)
  }

  async profile($event = '') {
    this.pro =await this.reselser.showProfileReseller({ dep_role: 1, bus_id: this.bus_name, like: $event });
      // console.log(res)
  }

  async showResellerName($event = '') {
    // console.log('inside', this.resel_type)
    this.res1 = await this.reselser.showResellerName({ bus_id:this.bus_name,role:this.resel_type ,like: $event });
      // console.log(result)
  }
  async ottcount(item){
    let result = await this.adminser.showOTTPlan({ottid:item});
    await this.ottcountshow(result)
  }
  ottcountshow(data) {
    const activeModal = this.activeModal.open(OttcountComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'OTT PLATFORM';
    activeModal.componentInstance.item = data;
    activeModal.result.then((data) => {
      // this.initiallist();
    });
  }

  async refresh() {
    this.bus_name='';
    this.resel_type='';
    this.res_name='';
    await this.initiallist();
  }
 
  async initiallist() {
    this.loading = true;
    let result = await this.ser.ottInvoice(
      { index: (this.page - 1) * this.limit,
        limit: this.limit,
        bus_id: this.bus_name,
        role: this.resel_type,
        resel_id: this.res_name,
        // res_id:this.reseller_under,
      });
        this.data = result[0];
        this.count = result[1]['count'];
         this.loading = false;
        this.setPage();
        // console.log("invbalance",result)
  }

  async download() {
    let res = await this.ser.ottInvoice({
      bus_id: this.bus_name,
      role: this.resel_type,
      resel_id: this.res_name,
        });
      if (res) {
        let tempdata = [], temp: any = res[0];
        for (var i = 0; i < temp.length; i++) {
          let param = {};
          if(this.role.getroleid()>777){
            param['ISP NAME'] = temp[i]['busname'];
          }
          if(this.role.getroleid()>=775){
            param['COMPANY'] = temp[i]['company'];
            param['RESELLER NAME'] = temp[i]['resellername'];
          }
          param['INVOICE ID'] = temp[i]['invid'];
          param['TRANSACTION'] = temp[i]['rflag']==1 ? 'Deduction':'Deposit';
          param['BEFORE BALANCE'] = temp[i]['before_balance_amt'];
          param['AMOUNT (INR)'] = temp[i]['amt'];
          tempdata[i] = param
        }
        const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
        const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
        JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
        JSXLSX.writeFile(wb, 'Reseller Renewalshare' + EXCEL_EXTENSION);
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

}
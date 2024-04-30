import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BusinessService, ComplaintService, ResellerService, RoleService, PagerService} from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector : 'listcomptype',
  templateUrl: './list-comptype.component.html',
  styleUrls:['./list-comptype.component.scss']
})

export class ListComplaintTypeComponent implements OnInit{
  submit:boolean=false;groups;search;reseller_name;cust;config;tot;
  bus_id='';resel_type='';reseller = '';comp_type='';comptypdata;
  busname;profile;resell;

  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;
  constructor(
     private route: Router,
     private service: ComplaintService,
     private busser : BusinessService,
     private resser : ResellerService,
     public role : RoleService,
     public pageservice: PagerService,
   
  ) {}

  async ngOnInit(){
    localStorage.removeItem('Array');
    await this.business();
    await this.initiallist();
    if(this.role.getroleid()<=777){
      await this.showProfileReseller();
      await this.showResellerName();
      await this.comptype();
    }
  }

  async business() {
    this.busname = await this.busser.showBusName({})
  }

  async showProfileReseller($event = '') {
    this.profile = await this.resser.showProfileReseller({ bus_id: this.bus_id, like: $event })
    // console.log("prof:", this.profile)
  }

  async showResellerName($event = '') {
    // console.log('inside', this)
    this.resell = await this.resser.showResellerName({ role: this.resel_type, like: $event })
    // console.log("resname",this.resell)
  }

  async comptype($event = '') {
    this.comptypdata = await this.service.showComplaintType({ resel_id: this.reseller, like: $event });
    // console.log("comptype",this.comptypdata);

  }

  async refresh() {
    this.bus_id='';
    this.resel_type='';
    this.reseller='';
    this.comp_type='';
    await this.initiallist();
  }
  
  async initiallist(){
    let result = await this.service.listComplType({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      bus_id:this.bus_id,
      role:this.resel_type,
      resl_id:this.reseller,
      comp_type:this.comp_type
    })
      this.groups=result[0];
      this.tot = result[1]['count'];
      // console.log(result)
      this.setPage();
  }

  async download() {
    let res = await this.service.listComplType({
      bus_id:this.bus_id,
      role:this.resel_type,
      resl_id:this.reseller,
      comp_type:this.comp_type
    })
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        if(this.role.getroleid()>777){
          param['ISP NAME'] = temp[i]['busname'];
        }
        if(this.role.getroleid()>=775){
          param['RESELLER TYPE'] = temp[i]['role'] == 444 ? 'Bulk Resellre' : temp[i]['role'] == 333 ? 'Deposit Reseller' : temp[i]['role'] == 666 ? 'Sub ISP Bulk' :
          temp[i]['role'] == 555 ? 'Sub ISP Deposit' : temp[i]['role'] == 551 ? 'Sub Distributor Deposit' : temp[i]['role'] == 661 ? 'Sun Distributor Bulk' : 'Hotel';
          param['RESELLER BUSINESS NAME'] = temp[i]['company']
        }
        param['COMPLAINT TYPE'] = temp[i]['comp_type'];
        param['STATUS'] = temp[i]['status']==1 ? 'Active':'Deactive';
        param['DESCRIPTION'] = temp[i]['descr'];
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Complaint Types' + EXCEL_EXTENSION);
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
    this.pagedItems = this.groups;
  }


}
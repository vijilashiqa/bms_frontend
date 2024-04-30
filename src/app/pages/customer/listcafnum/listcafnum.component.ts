import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCafNumComponent } from '../addcafnum/addcafnum.component'
// import { editNasComponent } from '../Edit-nas/edit-nas.component'
import { SelectService, ResellerService, BusinessService, GroupService, RoleService, PagerService, CustService } from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'listcafnum',
  styleUrls: ['./listcafnum.component.scss'],
  templateUrl: './listcafnum.component.html',
})
export class ListCafNumComponent implements OnInit {
  data; totalpage = 10; pages = [1, 2, 3, 4, 5]; count; bus; bus_name; search; pro; res_name = '';
  resel_type = ''; res1; start_num = ''; end_num = '';

  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;
  constructor(
    private custser: CustService,
    private nasmodel: NgbModal,
    private select: SelectService,
    private busser: BusinessService,
    private resser: ResellerService,
    public role: RoleService,
    public pageservice: PagerService,

  ) { }

  async ngOnInit() {
    await this.initiallist();
    await this.showBusName();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.profile();
      await this.showResellerName();
    }
  }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event })
  }

  async profile($event = '') {
    this.pro = await this.resser.showProfileReseller({ rec_role: 1, bus_id: this.bus_name, like: $event })
    // console.log(res)
  }

  async showResellerName($event = '') {
    // console.log('inside', this.resel_type)
    this.res1 = await this.resser.showResellerName({ bus_id:this.bus_name,role: this.resel_type, like: $event })
    // console.log("resellername",result)
  }

  changeclear(item){
    if(item == 1){
      this.resel_type='';
      this.res_name='';
      this.start_num='';
      this.end_num='';
    }
    if(item == 2){
      this.res_name='';
      this.start_num='';
      this.end_num='';
    }
    if(item == 3){
      this.start_num='';
      this.end_num='';
    }
  }

  async refresh() {
    this.bus_name='';
    this.resel_type='';
    this.res_name='';
    this.start_num='';
    this.end_num='';
    await this.initiallist();
    if (this.role.getroleid() == 666 || this.role.getroleid() == 555) {
      await this.profile();
      await this.showResellerName();
    }
  }

  async initiallist() {
    let result = await this.custser.listCaf({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      bus_id: this.bus_name,
      Role: this.resel_type,
      resel_id: this.res_name,
      start_number: this.start_num,
      end_number: this.end_num
    })
    // console.log(result)
    if (result) {
      this.data = result[0];
      this.count = result[1]["count"];
      // console.log("naslist : ", result)
      this.setPage();

    }
  }

  async download(){
    let res = await this.custser.listCaf({
      bus_id: this.bus_name,
      Role: this.resel_type,
      resel_id: this.res_name,
      start_number: this.start_num,
      end_number: this.end_num
    });
    if (res) {
       let tempdata = [], temp: any = res[0];
       for (var i = 0; i < temp.length; i++) {
          let param = {};
          if(this.role.getroleid()>777){
            param['ISP NAME'] = temp[i]['busname'];
          }
          param['RESELLER BUSINESSNAME'] = temp[i]['company'];
          param['START NUMBER'] = temp[i]['start_num'];
          param['END NUMBER'] = temp[i]['end_num'];
          param['TOTAL CAF'] = temp[i]['tot_caf'];
          param['USED CAF'] = temp[i]['used'];
          param['AVAILABLE CAF'] = temp[i]['unused'];
          temp[i]['status'] = temp[i]['caf_status']==0 ? 'Disable': temp[i]['caf_status']==1 ? 'Enable':'Cancel';
          // param['STATUS'] = temp[i]['status'];

          tempdata[i] = param
       }
       const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
       const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
       JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
       JSXLSX.writeFile(wb, 'CAF Number List' + EXCEL_EXTENSION);
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
    // console.log('asdfg',this.pagedItems)
  }

  Add_caf() {
    const activeModal = this.nasmodel.open(AddCafNumComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Add CAF Number';

    activeModal.result.then((data) => {
      this.initiallist();
    });
  }

  Edit_caf(item) {
    const activeModal = this.nasmodel.open(AddCafNumComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Edit CAF Number';
    activeModal.componentInstance.item = item
    // console.log(item)
    activeModal.result.then((data) => {
      this.initiallist();
    });
  }
}
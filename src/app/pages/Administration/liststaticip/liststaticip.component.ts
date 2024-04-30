import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddStaticIPComponent } from '../add-staticip/addstaticip.component';
// import { editNasComponent } from '../Edit-nas/edit-nas.component'
import { ResellerService, BusinessService, RoleService, PagerService, IppoolService } from '../../_service/indexService';
@Component({
  selector: 'liststaticip',
  styleUrls: ['./liststaticip.component.scss'],
  templateUrl: './liststaticip.component.html',
})
export class ListStaticIPComponent implements OnInit {
  data; totalpage = 10; pages = [1, 2, 3, 4, 5]; count; bus; bus_name; search; pro; res_name = '';
  resel_type = ''; stat_ip='';res1; start_date = ''; end_date = '';ipdata;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;

  constructor(
    private nasmodel: NgbModal,
    private busser: BusinessService,
    private resser: ResellerService,
    public role: RoleService,
    public pageservice: PagerService,
    private poolser: IppoolService,

  ) { }

  async ngOnInit() {
    await this.initiallist();
    await this.showBusName();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.profile();
      await this.showResellerName();
    }
    if(this.role.getroleid()<775){
      // this.res_name = this.role.getresellerid();
      await this.showip();
    }
  }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event });
  }

  async profile($event = '') {
    this.pro = await this.resser.showProfileReseller({ rec_role: 1, bus_id: this.bus_name, like: $event });
    // console.log(res)
  }

  async showResellerName($event = '') {
    // console.log('inside', this.resel_type)
    this.res1 = await this.resser.showResellerName({ bus_id:this.bus_name,role: this.resel_type, like: $event });
    // console.log("resellername",result)
  }

  async showip($event =''){
    this.ipdata = await this.poolser.showPublicIp({ static:1,bus_id:this.bus_name,resel_id:this.res_name,like:$event})
    // console.log("ipadd",this.ipdata);
    
  }

  changeclear(item){
    if(item == 1){
      this.resel_type = '';
      this.res_name = '';
      this.stat_ip = '';
      this.start_date = '';
      this.end_date = '';
    }
    if(item == 2){
      this.res_name = '';
      this.stat_ip = '';
      this.start_date = '';
      this.end_date = '';
    }
    if(item == 3){
      this.stat_ip = '';
      this.start_date = '';
      this.end_date = '';
    }
    if(item == 4){
      this.start_date = '';
      this.end_date = '';
    }
  }

  async refresh(){
    this.bus_name='';
    this.resel_type='';
    this.res_name='';
    this.stat_ip='';
    this.start_date='';
    this.end_date='';
    this.pro='';
    this.res1='';
    this.ipdata='';
    if(this.role.getroleid()<=777){
      await this.profile();
      await this.showResellerName();
      await this.showip();
    }
    await this.initiallist();
  }

  async initiallist() {
    let result = await this.poolser.listStaticIp({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      bus_id: this.bus_name,
      role: this.resel_type,
      resel_id: this.res_name,
      ip_add:this.stat_ip,
      start_date:this.start_date,
      end_date:this.end_date,
    });
    // console.log(result)
    if (result) {
      this.data = result[0];
      this.count = result[1]["count"];
      // console.log("naslist : ", result)
      this.setPage();

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

  Add_staticip() {
    const activeModal = this.nasmodel.open(AddStaticIPComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Add PublicIP';

    activeModal.result.then((data) => {
      this.initiallist();
    });
  }

  Edit_static(item) {
    const activeModal = this.nasmodel.open(AddStaticIPComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Edit PublicIP';
    activeModal.componentInstance.item = item
    // console.log(item)
    activeModal.result.then((data) => {
      this.initiallist();
    });
  }
}
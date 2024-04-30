import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddNasComponent } from '../Add-nas/add-nas.component'
import { editNasComponent } from '../Edit-nas/edit-nas.component'
import { SelectService, NasService, BusinessService, GroupService, RoleService, PagerService } from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';

@Component({
  selector: 'nasList',
  styleUrls: ['./nasListComponent.scss'],
  templateUrl: './nasListComponent.html',
})
export class NasListComponent implements OnInit {
  data; totalpage = 10; pages = [1, 2, 3, 4, 5]; count; bus; bus_name=''; group1;
  group_name=''; nas1; nas_name=''; search;timeflag;upcount;downcount;nas_ip='';nasip;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(
    private nas: NasService,
    private nasmodel: NgbModal,
    private select: SelectService,
    private busser: BusinessService,
    private groupser: GroupService,
    public role: RoleService,
    public pageservice: PagerService,

  ) { }

  ngOnInit() {
    this.initiallist();
    this.showBusName();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      this.showGroupName();
      this.showGroupNas();
    }
    if (this.role.getroleid() < 775) {
      this.group_name = this.role.getgrupid();
      this.showGroupNas();
    }
  }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event });
  }

  async showGroupName($event = '') {
    this.group1 = await this.groupser.showGroupName({ bus_id: this.bus_name, like: $event });
    // console.log("group:", result)
  }

  async showGroupNas($event = '') {
    this.nas1 = await this.nas.showGroupNas({ bus_id: this.bus_name, groupid: this.group_name, like: $event });
    // console.log("nas:", result)
  }

  async nasipaddr($event='') {
    this.nasip = await this.nas.showGroupNas({ nasid:this.nas_name,bus_id: this.bus_name, groupid: this.group_name, ip_like: $event });
  }

  changeclear(item) {
    if(item == 1){
      this.group_name='';
      this.nas_name='';
      this.nas_ip='';
    }
    if(item == 2){
      this.nas_name='';
      this.nas_ip='';
    }
  }


  async refresh(){
    this.bus_name='';
    this.group_name='';
    this.nas_name='';
    this.nas_ip='';
    this.group1='';
    this.nas1='';
    this.nasip='';
    if(this.role.getroleid()<=777){
      await this.showBusName();
      await this.showGroupNas();
      await this.nasipaddr();
    }
    await this.initiallist()
  }
  async initiallist() {
    this.loading = true;
    let result = await this.nas.listNas({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      bus_id: this.bus_name,
      groupid: this.group_name,
      nasid: this.nas_name,
      ip:this.nas_ip,
    });
    // console.log(result)
    if (result) {
      this.data = result[0];
      this.count = result[1]["count"];
      this.upcount = result[1]["up_count"];
      this.downcount = result[1]["down_count"];

      // console.log("naslist : ", result)
      for(let l=0; l < this.data.length; l++){
        if(this.data[l]['diff_time']!==null && this.data[l]['ping']==1){
          let difftime = this.data[l]['diff_time'];
          this.data[l]['diff_time'] = this.secondconvert(difftime);
        }
      }
      this.setPage();
      this.loading = false;
    }
  }

  secondconvert(data) {
    var seconds = data;
    var days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;
    var hrs = Math.floor(seconds / 3600);
    seconds -= hrs * 3600;
    var mnts = Math.floor(seconds / 60);
    seconds -= mnts * 60;
    // console.log(days+" days, "+hrs+" Hrs, "+mnts+" Minutes, "+seconds+" Seconds");
    return (days + " D, " + hrs + " H, " + mnts + " M, " + seconds + " S")
  }

  async download(){
    let res = await this.nas.listNas({
      bus_id: this.bus_name,
      groupid: this.group_name,
      nasid: this.nas_name,
      ip:this.nas_ip,
    });
    if (res) {
       let tempdata = [], temp: any = res[0];
       for (var i = 0; i < temp.length; i++) {
          let param = {};
          if(this.role.getroleid()>777){
            param['ISP NAME'] = temp[i]['busname'];
          }
          if(this.role.getroleid()>=775){
            param['CIRCLE'] = temp[i]['groupname']
          }
          param['NAS NAME'] = temp[i]['shortname'];
          temp[i]['nas_type'] = temp[i]['type']==0 ? 'Mikrotik':temp[i]['type']==1 ? 'StartOS':temp[i]['type']==2 ? 'ChillSpot':
          temp[i]['type']==3 ? 'Cisco':temp[i]['type']==4 ? 'Pfsense' : 'Other';
          param['TYPE'] = temp[i]['nas_type'];
          param['IP ADDRESS'] = temp[i]['nasname'];
          temp[i]['version'] = temp[i]['type']==0 ? (temp[i]['apiver']==0 ? 'Pre 6.45.1':temp[i]['apiver']==1 ? '6.45.1 or Newer':'N/A'):'N/A';
          param['VERSION'] = temp[i]['version'];
          param['DESCRIPTION'] = temp[i]['description'];

          tempdata[i] = param
       }
       const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
       const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
       JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
       JSXLSX.writeFile(wb, 'Nas List' + EXCEL_EXTENSION);
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

  Add_nas() {
    const activeModal = this.nasmodel.open(AddNasComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Add Nas';

    activeModal.result.then((data) => {
      this.initiallist();
    });
  }

  Edit_nas(item) {
    localStorage.setItem('array', JSON.stringify(item));
    const activeModal = this.nasmodel.open(editNasComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Edit Nas';
    // activeModal.componentInstance.item = item;
    // console.log(item)

    activeModal.result.then((data) => {
      this.initiallist();
    });
  }
}
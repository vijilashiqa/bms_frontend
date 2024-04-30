import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RoleService, AdminuserService, CustService, BusinessService, SelectService, PagerService, UserLogService, NasService } from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { DatePipe } from '@angular/common';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';


@Component({
  selector: 'listnaslog',
  templateUrl: './listnaslog.component.html',
  styleUrls: ['./listnaslog.component.scss']
})

export class ListNasLogComponent implements OnInit {
  tot; proid; custlog; search;bus;nas1;
  bus_name = '';nas_name='';

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  pager: any = {}; page: number = 1; pagedItems: any = []; limit = 25;
  constructor(
    private router: Router,
    private select: SelectService,
    private repser : UserLogService,
    private custser: CustService,
    public role: RoleService,
    public pageservice: PagerService,
    private busser : BusinessService,
    private nas : NasService,
    private datePipe : DatePipe,

  ) { }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event })
    // console.log(result)
  }

  async showGroupNas($event = '') {
    this.nas1 = await this.nas.showGroupNas({ bus_id: this.bus_name, like: $event });
    // console.log("nas:", result)
  }

  async ngOnInit() {
    localStorage.removeItem('array');
    await this.initiallist();
    await this.showBusName();
    if(this.role.getroleid()<777){
      this.bus_name = this.role.getispid();
    }
  }

  async refresh(){
    this.bus_name='';
    this.nas_name='';
    await this.initiallist();
  }

  async initiallist() {
    this.loading = true;
    let result = await this.repser.listNaslog(
      {
        index: (this.page - 1) * this.limit,
        limit: this.limit,
        bus_id:this.bus_name,
        nasid : this.nas_name,
      });
    // console.log(result)
    if (result) {
      this.custlog = result[0];
      this.tot = result[1]['count']
    }
    for( let i=0 ;i < this.custlog.length; i++){
      this.custlog[i]['duration'] = this.secondconvert(this.custlog[i]['seconds_logged_in_time'])
    }
    this.loading = false;
    this.setPage()
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
    return (days + " days, " + hrs + " Hrs, " + mnts + " Minutes, " + seconds + " Seconds")
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
    this.pagedItems = this.custlog;
    // console.log('asdfg',this.pagedItems)
  }

  async download() {
    let res = await this.repser.listNaslog({
      bus_id:this.bus_name,
      nasid : this.nas_name, })
      if (res) {
        let tempdata = [], temp: any = res[0];
        for (var i = 0; i < temp.length; i++) {
          let param = {};
          if(this.role.getroleid()>777){
            param['ISP NAME'] = temp[i]['busname'];
          }
          param['NAS NAME'] = temp[i]['shortname'];
          param['NAS IP'] = temp[i]['nasname'];
          param['START TIME'] = this.datePipe.transform(temp[i]['start_time'],'d MMM y hh:mm:ss a');
          param['END TIME'] = this.datePipe.transform(temp[i]['end_time'],'d MMM y hh:mm:ss a');
          temp[i]['duration'] = this.secondconvert(temp[i]['seconds_logged_in_time'])
          param['UPLINK DURATION'] = temp[i]['duration'];
          param['STATUS'] = temp[i]['status']==1 ? 'UP Time':'Down Time';
          tempdata[i] = param
        }
        const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
        const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
        JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
        JSXLSX.writeFile(wb, 'Nas StatusReport' + EXCEL_EXTENSION);
      }
  }

  // Edit_User(item) {
  //   localStorage.setItem('array', JSON.stringify(item));
  //   this.router.navigate(['/pages/business/edit-business']);
  // }
}
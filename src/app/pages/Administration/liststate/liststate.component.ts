import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddStaticIPComponent } from '../add-staticip/addstaticip.component';
// import { editNasComponent } from '../Edit-nas/edit-nas.component'
import { RoleService, PagerService, SelectService } from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'liststate',
  styleUrls: ['./liststate.component.scss'],
  templateUrl: './liststate.component.html',
})
export class ListStateComponent implements OnInit {
  data; totalpage = 10; pages = [1, 2, 3, 4, 5]; count; Ddata; Dcount;stsearch;dtsearch;dts;
  state='';district='';states;distdata;
  pager: any = {}; page: number = 1; pagedItems: any = []; pagedDItems: any = []; limit: number = 25;
  Dpager: any ={};Dpage:number = 1;Dlimit:number = 25;
  constructor(
    public role: RoleService,
    public pageservice: PagerService,
    private ser: SelectService,

  ) { }

  async ngOnInit() {
    await this.initiallist();
    await this.stateshow();
    await this.cityshow();
  }

  async cityshow($event = '') {
    this.distdata = await this.ser.showDistrict({ like: $event, index: 0, limit: 15 });
  }

  async stateshow($event = '') {
    this.states = await this.ser.showState({ like: $event });
    
  }

  distsearch(){
    this.dts=1;
  }
  
  searchST(){
    this.dts='';
  }

  async Srefresh(){
    this.state='';
    await this.initiallist()
  }

  async initiallist() {
    let result = await this.ser.listState({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      state: this.state,

    });
    // console.log("state",result)
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

  async stateDL() {
    let res = await this.ser.listState({
    })
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        param['STATE ID'] = temp[i]['id'];
        param['STATE NAME'] = temp[i]['name'];
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'State List' + EXCEL_EXTENSION);
    }
  }

  setPage() {
    // console.log(this.data);
    this.pager = this.pageservice.getPager(this.count, this.page, this.limit);
    this.pagedItems = this.data;
    // console.log('asdfg',this.pagedItems)
  }

  async Drefresh(){
    this.district='';
    await this.disctrict();

  }

  async disctrict() {
    let result = await this.ser.listDistrict({
      index: (this.Dpage - 1) * this.Dlimit,
      limit: this.Dlimit,
      district:this.district,
    });
    // console.log("district",result)
    if (result) {
      this.Ddata = result[0];
      this.Dcount = result[1]["count"];
      // console.log("naslist : ", result)
      this.setDPage();

    }
  }

  getDlist(page) {
    var total = Math.ceil(this.Dcount / this.Dlimit);
    let result = this.pageservice.pageValidator(this.Dpage, page, total);
    this.Dpage = result['value'];
    if (result['result']) {
      this.disctrict();
    }
  }

  setDPage() {
    // console.log(this.Ddata);
    this.Dpager = this.pageservice.getPager(this.Dcount, this.Dpage, this.Dlimit);
    this.pagedDItems = this.Ddata;
    // console.log('asdfg',this.pagedItems)
  }

  async districtDL() {
    let res = await this.ser.listDistrict({
    })
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        param['DISTRICT ID'] = temp[i]['id'];
        param['DISTRICT NAME'] = temp[i]['name'];
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'District List' + EXCEL_EXTENSION);
    }
  }
}
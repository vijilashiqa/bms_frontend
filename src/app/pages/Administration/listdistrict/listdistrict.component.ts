import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddStaticIPComponent } from '../add-staticip/addstaticip.component';
// import { editNasComponent } from '../Edit-nas/edit-nas.component'
import {  RoleService, PagerService,  SelectService } from '../../_service/indexService';
@Component({
  selector: 'listdistrict',
  styleUrls: ['./listdistrict.component.scss'],
  templateUrl: './listdistrict.component.html',
})
export class ListDistrictComponent implements OnInit {
  data; totalpage = 10; pages = [1, 2, 3, 4, 5]; count; search;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;

  constructor(
    public role: RoleService,
    public pageservice: PagerService,
    private ser: SelectService,

  ) { }

  async ngOnInit() {
    await this.initiallist();
   
  }

  async initiallist() {
    let result = await this.ser.listDistrict({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
     
    });
    console.log(result)
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
 
}
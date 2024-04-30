import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddsmscreditsComponent } from '../addsmscredits/addsmscredits.component';
import { ResellerService, BusinessService, RoleService, PagerService, AdminuserService } from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Component({
  selector: 'ngx-smscredits',
  templateUrl: './smscredits.component.html',
  styleUrls: ['./smscredits.component.scss']
})
export class SmscreditsComponent implements OnInit {
  data; totalpage = 10; pages = [1, 2, 3, 4, 5]; count; search;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;download;

  constructor(
    private nasmodel: NgbModal,
    private busser: BusinessService,
    private resser: ResellerService,
    public role: RoleService,
    public pageservice: PagerService,
    private admin: AdminuserService,

  ) { }

  async ngOnInit() {
    await this.initiallist()
  }

  async initiallist() {
    let result = await this.admin.listSmsCredit({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
    })
    // console.log(result)
    if (result) {
      this.data = result[0];
      this.count = result[1]["count"];
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
    this.pager = this.pageservice.getPager(this.count, this.page, this.limit);
    this.pagedItems = this.data;
  }
  addSmsCredit() {
    const activeModal = this.nasmodel.open(AddsmscreditsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Add SMS Credits';
    activeModal.result.then((data) => {
      this.initiallist();
    });
  }

  editSmsCredit(item) {
    const activeModal = this.nasmodel.open(AddsmscreditsComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Edit SMS Credits';
    activeModal.componentInstance.item = item
    activeModal.result.then((data) => {
      this.initiallist();
    });
  }

}

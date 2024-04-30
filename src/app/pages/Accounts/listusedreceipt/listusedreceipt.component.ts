import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewReceiptComponent } from '../viewreceipt/viewreceipt.component';
import { SelectService, ResellerService, AccountService, BusinessService, GroupService, RoleService, PagerService } from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'listusedreceipt',
  templateUrl: './listusedreceipt.component.html',
  styleUrls: ['./listusedreceipt.component.scss']
})
export class ListUsedReceiptComponent implements OnInit {
  data; totalpage = 10; pages = [1, 2, 3, 4, 5]; count; bus; bus_name; search; pro; res_name = '';
  resel_type = ''; res1; start_num = ''; end_num = '';
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25; receiptdata; id;

  constructor(
    private accser: AccountService,
    private nasmodel: NgbModal,
    private select: SelectService,
    private busser: BusinessService,
    private resser: ResellerService,
    public role: RoleService,
    public pageservice: PagerService,
    private datePipe : DatePipe

  ) { }

  async ngOnInit() {
    await this.initiallist();
  }

  async initiallist() {
    let res = await this.accser.listInvReceipt({ 
      uid: this.id, 
      index: (this.page - 1) * this.limit,
      limit: this.limit, })
    if(res){
      this.receiptdata = res[0];
      this.count = res[1]['tot']
      this.setPage();
    }
    
    // console.log(res);
  }

  async download() {
    let res = await this.accser.listInvReceipt({
      uid: this.id, 
    })
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        param['PROFILE ID'] = temp[i]['username'];
        param['SERVICE NAME'] = temp[i]['srvname'];
        param['SUB PLAN'] = temp[i]['sub_plan'];
        param['PROVIDED BY'] = temp[i]['creator'];
        param['RECEIPT NO'] = temp[i]['receipt_num'];
        temp[i]['date'] = this.datePipe.transform(temp[i]['receipt_date'],'d MMM y h:mm:ss a')
        param['RECEIPT DATE'] = temp[i]['date'];
        param['AMOUNT'] = temp[i]['received_amt'];

        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'UsedReceipt List' + EXCEL_EXTENSION);
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

  view_receipt(item) {
    const activeModal = this.nasmodel.open(ViewReceiptComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.data = { recid: item };
    activeModal.componentInstance.modalHeader = 'View Receipt';
    activeModal.result.then((data) => {

    })
  }
}
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddreceiptComponent } from '../addreceipt/addreceipt.component'
// import { editNasComponent } from '../Edit-nas/edit-nas.component'
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { SelectService, ResellerService, AccountService, BusinessService, GroupService, RoleService, PagerService } from '../../_service/indexService';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';

@Component({
  selector: 'listreceipt',
  styleUrls: ['./listreceipt.component.scss'],
  templateUrl: './listreceipt.component.html',
})
export class ListReceiptComponent implements OnInit {
  data; totalpage = 10; pages = [1, 2, 3, 4, 5]; count; bus; bus_name; search; pro; res_name = '';
  resel_type = ''; res1; start_num = ''; end_num = '';
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;

  constructor(
    private acntser: AccountService,
    private nasmodel: NgbModal,
    private select: SelectService,
    private busser: BusinessService,
    private resser: ResellerService,
    public role: RoleService,
    public pageservice: PagerService,
    private alert: ToasterService,


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
    this.bus = await this.busser.showBusName({ like: $event });
  }

  async profile($event = '') {
    this.pro = await this.resser.showProfileReseller({ rec_role: 1, bus_id: this.bus_name, like: $event })
    // console.log(res)
  }

  alertmsg() {
    if (!this.resel_type) {
      this.toastalert('Please Select Reseller Type');
    }
  }

  async showResellerName($event = '') {
    // console.log('inside', this.resel_type)
    this.res1 = await this.resser.showResellerName({ bus_id: this.bus_name, role: this.resel_type, like: $event });
    // console.log("resellername",result)
  }

  changeclear(item) {
    if (item == 1) {
      this.resel_type = '';
      this.res_name = '';
      this.start_num = '';
      this.end_num = '';
    }
    if (item == 2) {
      this.res_name = '';
      this.start_num = '';
      this.end_num = '';
    }
  }

  async refresh() {
    this.bus_name = '';
    this.resel_type = '';
    this.res_name = '';
    this.start_num = '';
    this.end_num = '';
    this.pro = '';
    this.res1 = '';
    await this.initiallist();
    if (this.role.getroleid() == 666 || this.role.getroleid() == 555) {
      await this.profile();
      await this.showResellerName();
    }
  }

  async initiallist() {
    let result = await this.acntser.listReceipt({
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
      this.count = result[1]["tot"];
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

  async download() {
    let res = await this.acntser.listReceipt({
      bus_id: this.bus_name,
      Role: this.resel_type,
      resel_id: this.res_name,
      start_number: this.start_num,
      end_number: this.end_num
    })
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        if (this.role.getroleid() > 777) {
          param['ISP NAME'] = temp[i]['busname'];
        }
        if (this.role.getroleid() >= 775 || this.role.getroleid() > 444) {
          param['RESELLER BUSINESS NAME'] = temp[i]['company']
        }
        param['START NUMBER'] = temp[i]['start_num'];
        param['END NUMBER'] = temp[i]['end_num'];
        param['TOTAl'] = temp[i]['tot_rcp'];
        param['USED'] = temp[i]['used'];
        param['AVAILABLE'] = temp[i]['unused'];
        param['STATUS'] = temp[i]['rstatus'] == 1 ? 'Active' : temp[i]['rstatus'] == 2 ? 'Disable' : 'Cancel';
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Receipt List' + EXCEL_EXTENSION);
    }
  }

  Add_receipt() {
    const activeModal = this.nasmodel.open(AddreceiptComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

    activeModal.componentInstance.modalHeader = 'Add Receipt';

    activeModal.result.then((data) => {
      this.initiallist();
    });
  }

  Edit_receipt(item) {
    localStorage.setItem('array', JSON.stringify(item));
    const activeModal = this.nasmodel.open(AddreceiptComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.componentInstance.modalHeader = 'Edit Receipt';
    activeModal.componentInstance.item = item
    // console.log(item)
    activeModal.result.then((data) => {
      this.initiallist();
    });
  }

  toastalert(msg, status = 0) {
    const toast: Toast = {
      type: status == 1 ? 'success' : 'warning',
      title: status == 1 ? 'Success' : 'Failure',
      body: msg,
      timeout: 5000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
  }
}
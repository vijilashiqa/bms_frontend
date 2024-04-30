import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CancelScheduleCustComponent } from '../schedulecancel/schedulecancel.component';
import { ScheduleChangeComponent } from '../schedulechange/schedulechange.component';
import { Router } from '@angular/router';
// import { editNasComponent } from '../Edit-nas/edit-nas.component'
import { SelectService, ResellerService, BusinessService, GroupService, RoleService, AccountService, PagerService, CustService } from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { DatePipe } from '@angular/common';
import { RefreshScheduleComponent } from '../refresh-schedule/refresh-schedule.component';
@Component({
  selector: 'listscheduled',
  styleUrls: ['./listscheduled.component.scss'],
  templateUrl: './listscheduled.component.html',
})
export class ListScheduledCustComponent implements OnInit {
  data; totalpage = 10; pages = [1, 2, 3, 4, 5]; count; bus; bus_name; search; pro; res_name = '';
  resel_type = ''; res1; start_num = ''; end_num = ''; cust_name = ''; start_date = ''; end_date = '';
  custname; status = '';
  pager: any = {}; page: number = 1; pagedItems: any = []; limit = 25;
  constructor(
    private custser: CustService,
    private nasmodel: NgbModal,
    private select: SelectService,
    private busser: BusinessService,
    private resser: ResellerService,
    private acntser: AccountService,
    public role: RoleService,
    public pageservice: PagerService,
    private datePipe: DatePipe,
    private router: Router

  ) { }

  async ngOnInit() {
    localStorage.removeItem('details');
    localStorage.removeItem('schedflag');
    await this.initiallist();
    await this.showBusName();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.profile();
      await this.showResellerName();
    }
    if (this.role.getroleid() < 775) {
      await this.showUser();
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
    this.res1 = await this.resser.showResellerName({ bus_id: this.bus_name, role: this.resel_type, like: $event })
    // console.log("resellername",result)
  }

  async showUser($event = '') {
    this.custname = await this.custser.showUser({ bus_id: this.bus_name, role: this.resel_type, role_flag: 1, resel_id: this.res_name, like: $event })
    // console.log("customer", this.custname)
  }

  async refresh() {
    this.bus_name = '';
    this.resel_type = '';
    this.res_name = '';
    this.cust_name = '';
    this.status = '';
    this.start_date = '';
    this.end_date = '';
    await this.initiallist();
    if (this.role.getroleid() == 666 || this.role.getroleid() == 555) {
      await this.profile();
      await this.showResellerName();
    }
  }

  async initiallist() {
    let result = await this.acntser.listRenewalSchedule({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      bus_id: this.bus_name,
      Role: this.resel_type,
      resel_id: this.res_name,
      cust_id: this.cust_name,
      status: this.status,
      start_date: this.start_date,
      end_date: this.end_date
    })
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

  async download() {
    let res = await this.acntser.listRenewalSchedule({
      bus_id: this.bus_name,
      Role: this.resel_type,
      resel_id: this.res_name,
      cust_id: this.cust_name,
      status: this.status,
      start_date: this.start_date,
      end_date: this.end_date
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
        param['SUBSCRIBER NAME'] = temp[i]['cust_name'];
        param['SERVICE NAME'] = temp[i]['srvname'];
        param['SUB PLAN'] = temp[i]['sub_plan'];
        param['INVOICE AMOUNT'] = temp[i]['inv_amt'];
        param['TAX AMOUNT'] = temp[i]['inv_tax'];
        if (temp[i]['schedule_status'] != 3) {
          param['SCHEDULED BY'] = temp[i]['creator'];
        }
        if (temp[i]['schedule_status'] == 3) {
          param['SCHEDULED BY'] = temp[i]['modified'];
        }
        if (temp[i]['schedule_status'] != 3) {
          temp[i]['sch_date'] = this.datePipe.transform(temp[i]['schedule_date'], 'd MMM y h:mm:ss a');
          param['SCHEDULED DATE'] = temp[i]['sch_date'];
        }
        if (temp[i]['schedule_status'] == 3) {
          temp[i]['schedul_date'] = this.datePipe.transform(temp[i]['lm_date'], 'd MMM y h:mm:ss a');
          param['SCHEDULED DATE'] = temp[i]['schedul_date'];
        }
        param['SCHEDULE COMPLETED'] = this.datePipe.transform(temp[i]['schedule_completed_on'], 'd MMM y h:mm:ss a');
        param['STATUS'] = temp[i]['schedule_status'] == 1 ? 'On Process' : temp[i]['schedule_status'] == 2 ? 'Completed'
          : temp[i]['schedule_status'] == 3 ? 'Canceled' : temp[i]['schedule_status'] == 4 ? 'Already Done' : temp[i]['schedule_status'] == 5 ? 'Initialized' : '--';
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Scheduled List' + EXCEL_EXTENSION);
    }
  }

  cancel(rsid) {
    const activeModal = this.nasmodel.open(CancelScheduleCustComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Cancel Schedule';
    activeModal.componentInstance.item = rsid
    // console.log(item)
    activeModal.result.then((data) => {
      this.initiallist();
    });
  }

  refreshSchedule(rsid){
    const activeModal = this.nasmodel.open(RefreshScheduleComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Refresh Schedule';
    activeModal.componentInstance.item = rsid
    // console.log(item)
    activeModal.result.then((data) => {
      this.initiallist();
    });
  }

  view_cust(item, flag) {
    localStorage.setItem('details', JSON.stringify(item));
    localStorage.setItem('schedflag', JSON.stringify(flag));
    this.router.navigate(['/pages/cust/viewcust']);
  }

  change_sched(scid) {
    const activeModal = this.nasmodel.open(ScheduleChangeComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Change Schedule Time';
    activeModal.componentInstance.item = { sched_id: scid }
    activeModal.result.then((data) => {
      this.initiallist();
    })
  };

  changeclear(item) {
    if (item == 1) {
      this.resel_type = '';
      this.res_name = '';
      this.cust_name = '';
      this.status = '';
    } else if (item == 2) {
      this.res_name = '';
      this.cust_name = '';
      this.status = '';
    } else {
      this.cust_name = '';
      this.status = '';
    }
  };

}
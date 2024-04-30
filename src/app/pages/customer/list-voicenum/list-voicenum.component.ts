import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddVoiceNumComponent } from '../add-voicenum/add-voicenum.component';
import { AssigneVoiceComponent } from '../assignevoice/assignevoice.component';
import { UnAssignedVoiceComponent } from '../unassignevoice/unassignevoice.component';
import { VoicePasswordComponent } from '../voicepassword/voicepassword.component';
import { SelectService, ResellerService, BusinessService, GroupService, RoleService, PagerService, CustService } from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'list-voicenum',
  styleUrls: ['./list-voicenum.component.scss'],
  templateUrl: './list-voicenum.component.html',
})
export class ListVoiceNumComponent implements OnInit {
  data; totalpage = 10; pages = [1, 2, 3, 4, 5]; count; search;
  bus; bus_name = ''; res_name = ''; voice_num = ''; status = ''
  res1; custname; cust_name = '';

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
      await this.showResellerName();
    }
  }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event })
  }

  async showResellerName($event = '') {
    // console.log('inside', this.resel_type)
    this.res1 = await this.resser.showResellerName({ bus_id: this.bus_name, like: $event })
    // console.log("resellername",result)
  }

  async showUser($event = '') {
    this.custname = await this.custser.showUser({ bus_id: this.bus_name, role_flag: 1, resel_id: this.res_name, like: $event })
    // console.log("customer", this.custname)
  }

  async refresh() {
    this.bus_name = '';
    this.res_name = '';
    this.voice_num = '';
    this.status = '';
    this.cust_name = '';
    await this.initiallist();
  }

  async initiallist() {
    let result = await this.custser.listVoice({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      bus_id: this.bus_name,
      resel_id: this.res_name,
      voice_num: this.voice_num,
      status: this.status,
      uid: this.cust_name
    })
    // console.log(result)
    if (result) {
      this.data = result[0];
      this.count = result[1]["count"];
      // console.log("naslist : ", result)
      this.setPage();

    }
  }

  async download() {
    let res = await this.custser.listVoice({
      bus_id: this.bus_name,
      resel_id: this.res_name,
      voice_num: this.voice_num,
      status: this.status,
      uid: this.cust_name
    });
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        if (this.role.getroleid() > 777) {
          param['ISP NAME'] = temp[i]['busname'];
        }
        if (this.res_name) param['RESELLER'] = temp[i]['resel_name']
        param['SUBSCRIBER ID'] = !temp[i]['cust_profile_id'] ? '--' : temp[i]['cust_profile_id'];
        param['VOICE NUMBER'] = temp[i]['vnumber'];
        param['CURRENT PASSWORD'] = !temp[i]['lpwd'] ? '--' : temp[i]['lpwd'];
        param['LAST PASSWORD'] = !temp[i]['lppwd'] ? '--' : temp[i]['lppwd'];
        param['STATUS'] = temp[i]['vflag'] == 1 ? 'Assigned' : 'Not-Assinged';

        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Voice_Number_List' + EXCEL_EXTENSION);
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

  Add_voice() {
    const activeModal = this.nasmodel.open(AddVoiceNumComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Add Voice Number';

    activeModal.result.then((data) => {
      this.initiallist();
    });
  }

  Edit_voice(item) {
    const activeModal = this.nasmodel.open(AddVoiceNumComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Edit Voice Number';
    activeModal.componentInstance.item = item
    // console.log(item)
    activeModal.result.then((data) => {
      this.initiallist();
    });
  }

  assigne(item) {
    const activeModal = this.nasmodel.open(AssigneVoiceComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Assign Voice Number';
    activeModal.componentInstance.item = item
    // console.log(item)
    activeModal.result.then((data) => {
      this.initiallist();
    });
  }

  unassigne(item) {
    const activeModal = this.nasmodel.open(UnAssignedVoiceComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Unassign Voice Number';
    activeModal.componentInstance.item = item
    // console.log(item)
    activeModal.result.then((data) => {
      this.initiallist();
    });
  }

  changepswd(item) {
    const activeModal = this.nasmodel.open(VoicePasswordComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Change Password';
    activeModal.componentInstance.item = item
    // console.log(item)
    activeModal.result.then((data) => {
      this.initiallist();
    });
  }
}
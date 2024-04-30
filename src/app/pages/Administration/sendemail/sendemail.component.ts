import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleService, CustService, BusinessService, GroupService, S_Service, ResellerService, SelectService, AdminuserService } from '../../_service/indexService';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { AddSuccessComponent } from '../success/add-success.component';

@Component({
  selector: 'ngx-sendemail',
  templateUrl: './sendemail.component.html',
  styleUrls: ['./sendemail.component.scss']
})
export class SendemailComponent implements OnInit {
  bus; bus_name; group1; profile; res1; resel_type; group_name; res_name; sbranch;
  custname; state; cust_name; state_id; act_status; s_branch; start_exp; end_exp;
  data; count; cust_count; subject; msg; editorMail;
  ckeConfig: CKEDITOR.config; selectUserData: any;


  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(
    private alert: ToasterService,
    private custser: CustService,
    private busser: BusinessService,
    private groupser: GroupService,
    private ser: S_Service,
    private reselser: ResellerService,
    private activeModal: NgbModal,
    public role: RoleService,
    private select: SelectService,
    private admin: AdminuserService,
  ) { }

  onChange($event: any): void {
    // console.log("onChange");
    //this.log += new Date() + "<br />";
  }

  onPaste($event: any): void {
    // console.log("onPaste");
    //this.log += new Date() + "<br />";
  }
  public isReadOnly = false;
  public editorData =
    `<p>{{ editorMail}} </p>`;
  // editors = ['Classic', 'Inline'];
  editors = ['Classic'];

  isHidden = false;

  isRemoved = false;
  public componentEvents: string[] = [];


  async ngOnInit() {
    await this.showBusName();
    this.ckeConfig = {
      allowedContent: false,
      // extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      height: 600,// Setting height
      width: 'auto'
    };
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid();
      await this.showGroupName();
      await this.showState();
    }
    if (this.role.getroleid() < 775) {
      await this.showUser();
      await this.showResellerBranch();
    }
  }
  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event })
  }

  async showGroupName($event = '') {
    this.group1 = await this.groupser.showGroupName({ bus_id: this.bus_name, like: $event })
  }

  async showProfileReseller($event = '') {
    this.profile = await this.reselser.showProfileReseller({ bus_id: this.bus_name, like: $event })
  }

  async showResellerName($event = '') {
    if (this.role.getroleid() >= 775) {
      this.res1 = await this.reselser.showResellerName({ res_Search: 1, role: this.resel_type, bus_id: this.bus_name, groupid: this.group_name, like: $event })
    } else {
      this.res1 = await this.reselser.showResellerName({ role: this.resel_type, bus_id: this.bus_name, groupid: this.group_name, like: $event })
    }

  }
  async showResellerBranch($event = '') {
    if (this.bus_name || this.group_name || this.res_name) {
      this.sbranch = await this.reselser.showResellerBranch({ bus_id: this.bus_name, groupid: this.group_name, resel_id: this.res_name, like: $event })
    }
  }
  async showUser($event = '') {
    this.custname = await this.custser.showUser({ bus_id: this.bus_name, groupid: this.group_name, role: this.resel_type, role_flag: 1, resel_id: this.res_name, like: $event })

  }

  async showState() {
    this.state = await this.select.showState({});
  }

  async userDetails() {
    if (this.role.getroleid() >= 775 || this.role.getroleid() == 666 || this.role.getroleid() == 555) {
      if (this.res_name) {
        let result = await this.custser.showSubscriber({
          bus_id: this.bus_name, groupid: this.group_name, role: this.resel_type, resel_id: this.res_name, branch: this.s_branch, active: this.act_status,
          uid: this.cust_name, state_id: this.state_id, expsdate: this.start_exp, expedate: this.end_exp
        });
        console.log('Result---', result)
        if (result) {
          this.data = result[0];
          this.count = result[1]['count'];
        }
      } else {
        window.alert('Please Select Reseller')
      }
    } else {
      let result = await this.custser.showSubscriber({
        branch: this.s_branch, active: this.act_status,
        uid: this.cust_name, state_id: this.state_id, expsdate: this.start_exp, expedate: this.end_exp
      });
      console.log('Result---', result)
      if (result) {
        this.data = result[0];
        this.count = result[1]['count'];
      }
    }
  }
  checkAllCheckBox(ev) { // Angular 9
    // checkAllCheckBox(ev: any) { // Angular 13
    this.data.forEach(x => x.checked = ev.target.checked)
    this.cust_count = this.data.filter(x => x.checked === true && x.emailverifystatus == 1).length
  }

  isAllCheckBoxChecked() {
    if (this.data) {
      return this.data.every(p => p.checked);
    }
  }

  checkBoxChecked() {
    let resp = this.data.filter(x => x.checked == true && x.emailverifystatus == 1).length
    this.cust_count = resp;
  }


  changeclear(item) {
    if (item == 1) {
      this.group_name = ''; this.resel_type = ''; this.res_name = ''; this.cust_name = ''; this.act_status = ''; this.s_branch = ''; this.state_id = '';
      this.start_exp = ''; this.end_exp = '';
    }
    if (item == 2) {
      this.resel_type = ''; this.res_name = ''; this.cust_name = ''; this.act_status = ''; this.s_branch = ''; this.state_id = '';
      this.start_exp = ''; this.end_exp = '';
    }
    if (item == 3) {
      this.res_name = ''; this.cust_name = ''; this.act_status = ''; this.s_branch = ''; this.state_id = '';
      this.start_exp = ''; this.end_exp = '';
    }
    if (item == 4) {
      this.cust_name = ''; this.act_status = ''; this.s_branch = ''; this.state_id = '';
      this.start_exp = ''; this.end_exp = '';
    }
    if (item == 5) {
      this.act_status = ''; this.s_branch = ''; this.state_id = '';
      this.start_exp = ''; this.end_exp = '';
    }
  }

  async sendEmail() {
    this.selectUserData = this.data.filter(x => x.checked == true && x.emailverifystatus == 1)
    console.log('Select data', this.selectUserData)
    if (!this.selectUserData.length || !this.msg || !this.subject) {
      window.alert('Please Select User Or fill Mail Content')
      return;
    }
    this.loading = true;
    let result = await this.admin.sendbulkemail({ msg: this.msg, subject: this.subject, user: this.selectUserData, isp_id: this.bus_name, eto: 1 });
    console.log('Mail Sending Result', result);
    if (result) {
      this.loading = false;
      this.result_pop(result);
      if (result[0].error_msg == 0) {
        this.selectUserData = []; this.msg = ''; this.subject = '';
        this.group_name = ''; this.resel_type = ''; this.res_name = ''; this.cust_name = ''; this.act_status = ''; this.s_branch = ''; this.state_id = '';
        this.start_exp = ''; this.end_exp = ''; this.data = [];
      }
    } else this.loading = false;

  }


  result_pop(item) {
    const activeModal = this.activeModal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.result.then((data) => {

    });
  }


}

import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BusinessService, ComplaintService, CustService, DashboardService, ResellerService, RoleService } from '../../_service/indexService';
import { validateConfig } from '@angular/router/src/config';

@Component({
  selector: 'add-Comp',
  templateUrl: './add-comp.component.html',
  styleUrls: ['./compstyle.scss'],
})

export class AddCompComponent implements OnInit {
  submit: boolean = false; AddComplaintForm; id: any[]; resell; datas; user; config;
  ip; data; cust; mob; editdatas; comp; busname; employdata; comptypdata; subsdata; subsresel;
  pro;

  constructor(
    private alert: ToasterService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private dash: DashboardService,
    private busser: BusinessService,
    public role: RoleService,
    private reselser: ResellerService,
    private service: ComplaintService,
    private custser: CustService,

  ) { }

  async ngOnInit() {
    this.createForm();
    this.business();
    this.aRoute.queryParams.subscribe(param => {
      this.id = param.id || null;
    });
    if (this.id) {
      await this.edit();
      this.AddComplaintForm.get('resel_flag').clearValidators();
      this.AddComplaintForm.get('resel_flag').updateValueAndValidity();
    }
    await this.main();
  }

  async main() {
    if (this.role.getroleid() <= 777) {
      this.AddComplaintForm.get('bus_id').setValue(this.role.getispid());
      await this.showResellerName();
      await this.employe();
      await this.comptype();
      await this.profile();
    }
    if (this.role.getroleid() < 775) {
      this.AddComplaintForm.get('bus_id').setValue(this.role.getispid());
      if (this.role.getroleid() == 444 || this.role.getroleid() == 333 || this.role.getroleid() == 222) {
        this.AddComplaintForm.get('reseller').setValue(this.role.getresellerid());
      } else if (this.role.getroleid() == 444 || this.role.getroleid() == 333 || this.role.getroleid() == 222) {
        this.AddComplaintForm.get('reseller').setValue(this.role.getmanagerid());
      } else {
        this.AddComplaintForm.get('reseller').setValue(this.role.getresellerid());
      }
      this.AddComplaintForm.get('resel_flag').clearValidators();
      this.AddComplaintForm.get('resel_flag').updateValueAndValidity();

    }
  }

  async business() {
    this.busname = await this.busser.showBusName({})
  }

  async profile() {
    if (this.role.getroleid() > 777) {
      this.pro = await this.reselser.showProfileReseller({ bus_id: this.AddComplaintForm.value['bus_id'], rec_role: 1 });
      // console.log(res)
    }
    if (this.role.getroleid() <= 777) {
      this.pro = await this.reselser.showProfileReseller({ bus_id: this.AddComplaintForm.value['bus_id'], rec_role: 1 });
      // console.log(result)
    }
  }

  flagchange() {
    this.AddComplaintForm.get('reseller').setValue('');
    this.AddComplaintForm.get('sflag').setValue('');
    this.AddComplaintForm.get('cust_id').setValue('');
    this.AddComplaintForm.get('Assign').setValue('');
    this.AddComplaintForm.get('complaint').setValue('');
  }

  sflagchange() {
    this.AddComplaintForm.get('cust_id').setValue('');

  }

  async showResellerName($event = '') {
    if (!this.id) {
      this.resell = await this.reselser.getResellerName({ edit_flag: 1, role: this.AddComplaintForm.value['Role'], bus_id: this.AddComplaintForm.value['bus_id'], nameflag: this.AddComplaintForm.value['resel_flag'], like: $event })
      // console.log("resname",this.resell)
    }
    if (this.id) {
      this.resell = await this.reselser.getResellerName({ role: this.AddComplaintForm.value['Role'], edit_flag: 1, bus_id: this.AddComplaintForm.value['bus_id'], nameflag: this.AddComplaintForm.value['resel_flag'], like: $event })
      // console.log("resname",this.resell)
    }
  }

  async searchresult($event = '') {
    if (this.id) {
      let result = await this.dash.search({ comp_flag: 1, comp_edit: 1, role: this.AddComplaintForm.value['Role'], sflag: this.AddComplaintForm.value['sflag'], bus_id: this.AddComplaintForm.value['bus_id'], resel_id: this.AddComplaintForm.value['reseller'], like: $event })
      this.datas = result;
    } else {
      let result = await this.dash.search({ comp_flag: 1, role: this.AddComplaintForm.value['Role'], sflag: this.AddComplaintForm.value['sflag'], bus_id: this.AddComplaintForm.value['bus_id'], resel_id: this.AddComplaintForm.value['reseller'], like: $event })
      this.datas = result;
    }
    // console.log(result)
  }

  async employe($event = '') {
    this.employdata = await this.service.showEmployee({ resel_id: this.AddComplaintForm.value['reseller'], like: $event });
    // console.log("empres",this.employdata);
  }

  async comptype($event = '') {
    this.comptypdata = await this.service.showComplaintType({ resel_id: this.AddComplaintForm.value['reseller'], like: $event });
    // console.log("comptype",this.comptypdata);

  }

  async subsdetails() {
    this.subsdata = await this.custser.ViewSubscriber({ id: this.AddComplaintForm.value['cust_id'] });
    console.log("subsdetails", this.subsdata);
    this.subsresel = this.subsdata['reseller_id'];
    if (this.subsresel) {
      this.AddComplaintForm.get('reseller').setValue(this.subsresel);
      await this.employe();
      await this.comptype();
    }
  }

  async addNac() {
    if (this.AddComplaintForm.invalid) {
      this.submit = true;
      return;
    }
    let method = 'addComplaint';
    if (this.id) {
      method = 'editComplaint';
      this.AddComplaintForm.value['id'] = this.id;
    }
    // console.log("inside", this.AddComplaintForm.value);

    let complaintdata = [this.AddComplaintForm.value];
    let res = await this.service[method]({ complaints: complaintdata });
    // console.log('result', res);
    const toast: Toast = {
      type: res[0]['error_msg'] == 0 ? 'success' : 'warning',
      title: res[0]['error_msg'] == 0 ? 'Success' : 'Failure',
      body: res[0]['msg'],
      timeout: 3000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
    if (res[0]['error_msg'] == 0) {
      this.router.navigate(['/pages/complaint/list-comp'])
    }
  }

  async edit() {
    let result = await this.service.getEditComplaint({ id: this.id })
    this.editdatas = result;
    // console.log("getedit", result)
    this.createForm();
    await this.showResellerName();
    await this.employe();
    // await this.comptype();
    await this.subsdetails();
    await this.searchresult();

  }

  cancel() {
    this.router.navigate(['/pages/complaint/list-comp']);

  }

  createForm() {
    this.AddComplaintForm = new FormGroup({
      bus_id: new FormControl(this.editdatas ? this.editdatas['isp_id'] : '', Validators.required),
      resel_flag: new FormControl(''),
      Role: new FormControl(''),
      reseller: new FormControl(this.editdatas ? this.editdatas['reseller_id'] : ''),
      sflag: new FormControl(this.editdatas ? 1 : '', Validators.required),
      cust_id: new FormControl(this.editdatas ? this.editdatas['uid'] : '', Validators.required),
      Assign: new FormControl(this.editdatas ? this.editdatas['emp_id'] : ''),
      Priority: new FormControl(this.editdatas ? this.editdatas['priority'] : '', Validators.required),
      complaint: new FormControl(this.editdatas ? this.editdatas['complaint_id'] : '', Validators.required),
      sub_comp: new FormControl(this.editdatas ? this.editdatas['subject'] : ''),
      Notes: new FormControl(this.editdatas ? this.editdatas['note'] : ''),
      status: new FormControl(this.editdatas ? this.editdatas['status'] : ''),
    });
  }

  get ctrl() {
    return this.AddComplaintForm.controls;
  }
  get val() {
    return this.AddComplaintForm.value;
  }
}
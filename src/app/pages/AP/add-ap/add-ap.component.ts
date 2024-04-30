import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { APService, RoleService, BusinessService, SelectService, ResellerService, GroupService } from '../../_service/indexService';
@Component({
  selector: 'add-ap',
  templateUrl: './add-ap.component.html',

})

export class AddAPComponent implements OnInit {
  submit: boolean = false; AddAPForm; groups; id; datas; editdatas;
  busname; grup; resell; config;
  constructor(
    private router: Router,
    private aRoute: ActivatedRoute,
    public role: RoleService,
    private alert: ToasterService,
    private AP: APService,
    private select: SelectService,
    private busser: BusinessService,
    private reselser: ResellerService,
    private groupser: GroupService,
  ) { }

  async business() {
    this.busname = await this.busser.showBusName({});
    // this.select.showBusName({})
  }

  async GroupName() {
    this.grup = await this.groupser.showGroupName({ bus_id: this.AddAPForm.value['bus_id'] });
  }

  async Reseller($event='') {
    this.resell = await this.reselser.showResellerName({ like:$event,bus_id: this.AddAPForm.value['bus_id'], groupid: this.AddAPForm.value['groupid'],edit_flag:1 });
  }

  password() {
    if (this.id) {
      this.AddAPForm.get('api_pass').clearValidators();
      this.AddAPForm.get('api_pass').updateValueAndValidity();
    }
  }

  async addAP() {
    if (this.AddAPForm.invalid) {
      this.submit = true;
      return;
    }
    let method = 'addap';
    if (this.id) {
      method = 'editap';
      this.AddAPForm.value['id'] = this.id;
    }
    let result = await this.AP[method](this.AddAPForm.value)
    this.groups = result;
    const toast: Toast = {
      type: result['status'] == 1 ? 'success' : 'warning',
      title: result['status'] == 1 ? 'Success' : 'Failure',
      body: result['msg'],
      timeout: 3000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
    if (result['status'] == 1) {
      this.router.navigate(['/pages/AP/list-ap'])
    }
  }

  async edit() {
    let result = await this.AP.getapedit({ id: this.id });
    if (result) {
      this.editdatas = result;
    }
    this.createForm();
    await this.GroupName();
    await this.Reseller();
    await this.password();
  }

  async ngOnInit() {
    this.createForm();
    this.aRoute.queryParams.subscribe(param => {
      this.id = param.id || null;
    })
    if (this.id) {
      await this.edit();
    }
    await this.main();
  }

  async main() {
    await this.business();
    if (this.role.getroleid() <= 777) {
      this.AddAPForm.controls['bus_id'].setValue(this.role.getispid());
      await this.GroupName();
      // this.Nas()
    }
    if(this.role.getroleid()<775){
      this.AddAPForm.get('groupid').setValue(this.role.getgrupid());
    }
  }

  createForm() {
    this.AddAPForm = new FormGroup({
      enable: new FormControl(this.editdatas ? (this.editdatas['enable']==0 ? this.editdatas['enable']=false : this.editdatas['enable']=true) : true, Validators.required),
      bus_id: new FormControl(this.editdatas ? this.editdatas['isp_id'] : '', Validators.required),
      groupid: new FormControl(this.editdatas ? this.editdatas['group_id'] : '', Validators.required),
      reseller: new FormControl(this.editdatas ? this.editdatas['reseller_id'] : ''),
      nam: new FormControl(this.editdatas ? this.editdatas['name'] : '', Validators.required),
      ip_add: new FormControl(this.editdatas ? this.editdatas['ip'] : '', Validators.required),
      api_nam: new FormControl(this.editdatas ? this.editdatas['apiusername'] : '', Validators.required),
      api_pass: new FormControl('', Validators.required),
      access_mode: new FormControl(this.editdatas ? JSON.stringify(this.editdatas['accessmode']) : '0', Validators.required),
      Description: new FormControl(this.editdatas ? this.editdatas['description'] : ''),
      comm: new FormControl(this.editdatas ? this.editdatas['community'] : '', Validators.required),
    });
  }
}
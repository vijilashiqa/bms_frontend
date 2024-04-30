import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ResellerService, RoleService, BusinessService, GroupService } from '../../_service/indexService';

@Component({
  selector: 'add-branch',
  templateUrl: './add-branch.component.html'
})

export class AddBranchComponent implements OnInit {
  submit: boolean = false; AddBranchForm; datas; id; editdatas; busname;
  grup; resell; config;pro;
  constructor(
    private alert: ToasterService,
    private ser: ResellerService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private busser: BusinessService,
    private groupser: GroupService,
    public role: RoleService,

  ) { }

  async business() {
    this.busname = await this.busser.showBusName({});
    // console.log(this.busname)
  }

  async GroupName() {
    this.grup = await this.groupser.showGroupName({ bus_id: this.AddBranchForm.value['bus_id'] });
    // console.log(res)
  }

  async showReseller($event='') {
    this.resell = await this.ser.showResellerName({ service_role:1,edit_flag:1, like:$event ,bus_id: this.AddBranchForm.value['bus_id'], groupid: this.AddBranchForm.value['groupid'] });
    // console.log(res)
  }

  async addBranch() {
    // console.log(this.AddBranchForm.value)
    if (this.AddBranchForm.invalid) {
      this.submit = true;
      return;
    }
    let method = 'addResBranch';
    if (this.id) {
      method = 'editResBranch';
      this.AddBranchForm.value['id'] = this.id;
    }
    // console.log("inside")
    let result = await this.ser[method](this.AddBranchForm.value);
    this.datas = result;
    // console.log(result)
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
      this.router.navigate(['/pages/reseller/list-branch'])
    }

  }
  async edit() {
    let result = await this.ser.getResBranch({ id: this.id });
    if (result) {
      this.editdatas = result;
      // console.log("branchedit ",result)
    }
    await this.GroupName();
    await this.showReseller();
    await this.createForm();
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
    if (this.role.getroleid() <= 775 || this.role.getroleid()==777) {
      this.AddBranchForm.controls['bus_id'].setValue(this.role.getispid());
      await this.GroupName();
      await this.showReseller();
    }
    if (this.role.getroleid()<775){
      this.AddBranchForm.get('groupid').setValue(this.role.getgrupid());
      this.AddBranchForm.get('reseller').setValue(this.role.getresellerid());
      this.AddBranchForm.get('reseller').clearValidators();
      this.AddBranchForm.get('reseller').updateValueAndValidity();
    }
  }

  createForm() {
    this.AddBranchForm = new FormGroup({
      bus_id: new FormControl(this.editdatas ? this.editdatas['isp_id'] : '', Validators.required),
      groupid: new FormControl(this.editdatas ? this.editdatas['group_id'] : '', Validators.required),
      reseller: new FormControl(this.editdatas ? this.editdatas['reseller'] : '', Validators.required),
      br_name: new FormControl(this.editdatas ? this.editdatas['branch'] : '', Validators.required),
      branch_addr: new FormControl(this.editdatas ? this.editdatas['address'] : '', Validators.required),
      status: new FormControl(this.editdatas ? this.editdatas['status'] : '1', Validators.required),
    });
  }
}
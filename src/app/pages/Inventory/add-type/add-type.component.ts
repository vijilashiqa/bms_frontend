import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService,SelectService,BusinessService,GroupService,ResellerService,RoleService } from '../../_service/indexService';
@Component({
  selector: 'add-type',
  templateUrl: './add-type.component.html',

})

export class AddTypeComponent implements OnInit {
  submit: boolean = false; AddTypeForm; groups; item; resell; editdatas;pro;
   busname; grup; mak; mod;
  modalHeader;
  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private alert: ToasterService,
    private select: SelectService,
    private busser : BusinessService,
    private groupser : GroupService,
    private resser : ResellerService,
    public role : RoleService,
    private inventser: InventoryService
  ) { }

  async business() {
    this.busname = await this.busser.showBusName({})
      // console.log(this.busname)
  }

  async GroupName() {
    this.grup = await this.groupser.showGroupName({ bus_id: this.AddTypeForm.value['bus_id'] })
      // console.log(res)
  }

  async profile() {
    if (this.role.getroleid() > 777) {
      this.pro = await this.resser.showProfileReseller({ bus_id: this.AddTypeForm.value['bus_id'] });
      // console.log(res)
    }
    if (this.role.getroleid() <= 777) {
      this.pro = await this.resser.showProfileReseller({});
      // console.log(result)
    }
  }

  async showReseller($event='') {
    this.resell = await this.resser.showResellerName({ role:this.AddTypeForm.value['Role'],bus_id: this.AddTypeForm.value['bus_id'], groupid: this.AddTypeForm.value['groupid'],like:$event });
    // console.log(res)
  }

  async addType() {
    // console.log(this.AddTypeForm.value)
    if (this.AddTypeForm.invalid) {
      this.submit = true;
      return;
    }
    let method = 'addType';
    if (this.item) {
      method = 'editType';
      this.AddTypeForm.value['id'] = this.item['type_id'];
    }
    let result = await this.inventser[method](this.AddTypeForm.value)
      this.groups = result;
      // console.log(result)
      const toast: Toast = {
        type: result['status'] == 1 ? 'success' : 'warning',
        title: result['status'] == 1 ? 'Success' : 'Failure',
        body: result['msg'],
        timeout: 5000,
        showCloseButton: true,
        bodyOutputType: BodyOutputType.TrustedHtml,
      };
      this.alert.popAsync(toast);
      if (result['status'] == 1) {
        this.activeModal.close(true);
      }
  }

  closeModal() {
    this.activeModal.close();
  }

  async ngOnInit() {
    this.createForm();
    await this.business();
    if(this.role.getroleid()<=777){
      this.AddTypeForm.get('bus_id').setValue(this.role.getispid());
      await this.GroupName();
      await this.profile();
      await this.showReseller();
    }
    if(this.role.getroleid()<775){
      this.AddTypeForm.get('reseller').setValue(this.role.getresellerid());
      this.AddTypeForm.get('groupid').setValue(this.role.getgrupid());
      this.AddTypeForm.get('Role').clearValidators();
      this.AddTypeForm.get('Role').updateValueAndValidity();
    }
  }

  createForm() {
    this.AddTypeForm = new FormGroup({
     bus_id : new FormControl(this.item ? this.item['isp_id']:'',Validators.required),
     groupid : new FormControl(this.item ? this.item['group_id']:'',Validators.required),
     Role: new FormControl(this.item ? this.item['role']:'',Validators.required),
     reseller : new FormControl(this.item ? this.item['reseller_id']:'',Validators.required),
     model_type : new  FormControl(this.item ? this.item['type_name']:'',Validators.required),
     status : new FormControl(this.item ? this.item['status']:true)
    });
  }
}


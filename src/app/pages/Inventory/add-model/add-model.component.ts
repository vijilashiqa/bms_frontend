import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder, } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BusinessService, GroupService, ResellerService, RoleService, InventoryService } from '../../_service/indexService';

@Component({
  selector: 'add-model',
  templateUrl: './add-model.component.html',
})

export class ModelComponent implements OnInit {
  modalHeader: string; busname; grup; resell; make_name; modtype;pro;
  AddModelForm; item; data;
  submit: boolean;
  constructor(
    public activeModal: NgbActiveModal,
    private alert: ToasterService,
    private busser: BusinessService,
    private groupser: GroupService,
    private resser: ResellerService,
    public role: RoleService,
    private inventser: InventoryService,
  ) { }

  closeModal() {
    this.activeModal.close();
  }

  async business() {
    this.busname = await this.busser.showBusName({});
    // console.log(this.busname)
  }

  async GroupName() {
    this.grup = await this.groupser.showGroupName({ bus_id: this.AddModelForm.value['bus_id'] });
    // console.log(res)
  }

  async profile() {
    if (this.role.getroleid() > 777) {
      this.pro = await this.resser.showProfileReseller({ bus_id: this.AddModelForm.value['bus_id'] });
      // console.log(res)
    }
    if (this.role.getroleid() <= 777) {
      this.pro = await this.resser.showProfileReseller({});
      // console.log(result)
    }
  }

  async showReseller($event='') {
    this.resell = await this.resser.showResellerName({ role:this.AddModelForm.value['Role'],bus_id: this.AddModelForm.value['bus_id'], groupid: this.AddModelForm.value['groupid'],like:$event });
    // console.log(res)
  }

  async showmake() {
    this.make_name = await this.inventser.showMake({})
    // console.log(res)
  }

  async type() {
    this.modtype = await this.inventser.showType({});
    // console.log(res)
  }

  async ngOnInit() {
    this.createForm();
    await this.business();
    await this.showmake();
    await this.type();
    if (this.item) {
      await this.showReseller();
    }
    if (this.role.getroleid() <= 777) {
      this.AddModelForm.get('bus_id').setValue(this.role.getispid());
      await this.GroupName();
      await this.profile();
      await this.showReseller();
    }
    if(this.role.getroleid()<775){
      this.AddModelForm.get('reseller').setValue(this.role.getresellerid());
      this.AddModelForm.get('groupid').setValue(this.role.getgrupid());
      this.AddModelForm.get('Role').clearValidators();
      this.AddModelForm.get('Role').updateValueAndValidity();
    }
  };


  async addmodel() {
    // console.log(this.AddModelForm.value)
    if (!this.AddModelForm.valid) {
      return;
    }
    let method = this.item ? 'editModel' : 'addModel';
    if (this.item) {
      this.AddModelForm.value['id'] = this.item['model_id'];
    }
    // console.log('inside',this.AddModelForm.value)
    let result = await this.inventser[method](this.AddModelForm.value);
    if (result) {
      this.data = result;
      if (result != null) {
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
    }
  }

  createForm() {
    this.AddModelForm = new FormGroup({
      bus_id: new FormControl(this.item ? this.item['isp_id'] : ''),
      groupid: new FormControl(this.item ? this.item['group_id'] : ''),
      Role : new FormControl(''),
      reseller: new FormControl(this.item ? this.item['id'] : ''),
      makename: new FormControl(this.item ? this.item['make_id'] : '', Validators.required),
      modelname: new FormControl(this.item ? this.item['model_name'] : '', Validators.required),
      model_type: new FormControl(this.item ? this.item['type_id'] : '', Validators.required),
      status: new FormControl(this.item ? this.item['status'] : true),
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BusinessService, GroupService, ResellerService, RoleService, InventoryService } from '../../_service/indexService';

@Component({
  selector: 'add-make',
  templateUrl: './add-make.component.html',
})

export class MakeComponent implements OnInit {
  modalHeader: string; item: any; busname; grup; resell;pro;
  AddMakeForm; id
  submit: boolean;
  Make;
  constructor(
    public activeModal: NgbActiveModal,
    private alert: ToasterService,
    private busser: BusinessService,
    private groupser: GroupService,
    private resser: ResellerService,
    public role: RoleService,
    private inventser: InventoryService,
  ) { }

  async business() {
    this.busname = await this.busser.showBusName({});
    // console.log(this.busname)
  }

  async GroupName() {
    this.grup = await this.groupser.showGroupName({ bus_id: this.AddMakeForm.value['bus_id'] });
    // console.log(res)
  }

  async profile() {
    if (this.role.getroleid() > 777) {
      this.pro = await this.resser.showProfileReseller({ bus_id: this.AddMakeForm.value['bus_id'] });
      // console.log(res)
    }
    if (this.role.getroleid() <= 777) {
      this.pro = await this.resser.showProfileReseller({});
      // console.log(result)
    }
  }

  async showReseller($event='') {
    this.resell = await this.resser.showResellerName({ role:this.AddMakeForm.value['Role'],bus_id: this.AddMakeForm.value['bus_id'], groupid: this.AddMakeForm.value['groupid'],like:$event });
    // console.log(res)
  }

  closeModal() {
    this.activeModal.close();
  }

  async ngOnInit() {
    this.createForm();
    await this.business();
    // console.log(this.role.getroleid())
    if (this.role.getroleid() <= 777) {
      this.AddMakeForm.get('bus_id').setValue(this.role.getispid());
      await this.GroupName();
      await this.profile();
      await this.showReseller();
    }
    if(this.role.getroleid()<775){
      this.AddMakeForm.get('reseller').setValue(this.role.getresellerid());
      this.AddMakeForm.get('groupid').setValue(this.role.getgrupid());
      this.AddMakeForm.get('Role').clearValidators();
      this.AddMakeForm.get('Role').updateValueAndValidity();

    }
  };

  async addmake() {
    // console.log(this.AddMakeForm.value)
    if (!this.AddMakeForm.valid) {
      return;
    }
    // console.log('inside',this.AddMakeForm.value)
    let method = this.item ? 'editMake' : 'addMake';
    if (this.item) {
      this.AddMakeForm.value['id'] = this.item['make_id'];
    }
    let result = await this.inventser[method](this.AddMakeForm.value)
    if (result) {
      this.Make = result;
      if (result != null) {
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
          this.activeModal.close(true);
        }
      }
    }
  };

  createForm() {
    this.AddMakeForm = new FormGroup({
      bus_id: new FormControl(this.item ? this.item['isp_id'] : ''),
      makename: new FormControl(this.item ? this.item['make_name'] : '', Validators.required),
      groupid: new FormControl(this.item ? this.item['group_id'] : ''),
      Role : new FormControl(this.item ? this.item['role'] :'',Validators.required),
      reseller: new FormControl(this.item ? this.item['reseller_id'] : ''),
      status: new FormControl(this.item ? this.item['status'] : true)
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BusinessService, GroupService, RoleService, ResellerService, AdminuserService } from '../../_service/indexService';
import { Router } from '@angular/router';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { AddSuccessComponent } from '../success/add-success.component';

@Component({
  selector: 'ngx-addsmscredits',
  templateUrl: './addsmscredits.component.html',
  styleUrls: ['./addsmscredits.component.scss']
})
export class AddsmscreditsComponent implements OnInit {
  submit: boolean = false; AddSmsCreditForm;
  modalHeader; item; data; busdata; reseldata;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes; servtype; custname;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(
    private activeModal: NgbActiveModal,
    private activemodal: NgbModal,
    private alert: ToasterService,
    public role: RoleService,
    private busser: BusinessService,
    private grupser: GroupService,
    private resser: ResellerService,
    private router: Router,
    private admin: AdminuserService,
  ) { }

  closeModal() {
    this.activeModal.close();
  }

  async ngOnInit() {
    this.createForm();
    await this.business();
    if (this.item) {
      await this.resellername();
    }
    if (this.role.getroleid() <= 777) {
      this.AddSmsCreditForm.get('isp_id').setValue(this.role.getispid());
      await this.resellername();
    }
  }

  async business($event = '') {
    this.busdata = await this.busser.showBusName({ like: $event })
  }

  async resellername($event = '') {
    if (this.role.getroleid() > 777) {
      this.reseldata = await this.resser.showResellerName({ bus_id: this.AddSmsCreditForm.value['isp_id'], except: 1, like: $event })
    }
    if (this.role.getroleid() <= 777) {
      this.reseldata = await this.resser.showResellerName({ except: 1, like: $event })
    }
  }

  async smsCreditSubmit() {
    this.submit = true;
    if (this.AddSmsCreditForm.invalid) {
      window.alert('Please Fill all Mandatory Fields');
      return;
    }
    let method = 'addSmscredit'
    if (this.item) {
      method = 'editSmscredit'
      this.AddSmsCreditForm.value['id'] = this.item.id;
    }
    let result = await this.admin[method](this.AddSmsCreditForm.value)
    if (result) {
      this.result_pop(result);
      if (result[0].error_msg == 0) await this.closeModal();
    }
  }


  result_pop(item) {
    const activeModal = this.activemodal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.result.then((data) => {

    });
  }







  createForm() {
    this.AddSmsCreditForm = new FormGroup({
      isp_id: new FormControl(this.item ? this.item.isp_id : '', Validators.required),
      manid: new FormControl(this.item ? this.item.manid : '', Validators.required),
      sms: new FormControl(this.item ? this.item.sms : '', Validators.required),
    });
  }


}

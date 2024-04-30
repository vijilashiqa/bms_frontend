import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleService, CustService } from '../../_service/indexService';
import { TemperatureDraggerComponent } from '../../dashboard/temperature/temperature-dragger/temperature-dragger.component';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';

@Component({
  selector: 'updatelimit',
  templateUrl: './updatelimit.component.html',
})

export class LimitUpdateComponent implements OnInit {
  modalHeader: string; item; busname; grup; resell; pro;
  LimitUpdateForm;dl_flag;ul_flag;tot_flag;
  submit: boolean;
  Make;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(
    public activeModal: NgbActiveModal,
    private alert: ToasterService,
    public role: RoleService,
    private custser: CustService,
  ) { }

  closeModal() {
    this.activeModal.close();
  }

  async ngOnInit() {
    this.createForm();
    this.dl_flag = this.item['dl_limit'];
    this.ul_flag = this.item['ul_limit'];
    this.tot_flag = this.item['tot_limit']
    await this.validation()

  };

  validation(){
    this.dl_flag==1 ? this.LimitUpdateForm.get('dl_limit').setValidators(Validators.required):this.LimitUpdateForm.get('dl_limit').clearValidators();
    this.LimitUpdateForm.get('dl_limit').updateValueAndValidity();
    this.dl_flag==1 ? this.LimitUpdateForm.get('dl_size').setValidators(Validators.required):this.LimitUpdateForm.get('dl_size').clearValidators();
    this.LimitUpdateForm.get('dl_size').updateValueAndValidity();

    this.ul_flag==1 ? this.LimitUpdateForm.get('ul_limit').setValidators(Validators.required):this.LimitUpdateForm.get('ul_limit').clearValidators();
    this.LimitUpdateForm.get('ul_limit').updateValueAndValidity(); 
    this.ul_flag==1 ? this.LimitUpdateForm.get('ul_size').setValidators(Validators.required):this.LimitUpdateForm.get('ul_size').clearValidators();
    this.LimitUpdateForm.get('ul_size').updateValueAndValidity();

    this.tot_flag==1 ? this.LimitUpdateForm.get('tot_limit').setValidators(Validators.required):this.LimitUpdateForm.get('tot_limit').clearValidators();
    this.LimitUpdateForm.get('tot_limit').updateValueAndValidity(); 
    this.tot_flag==1 ? this.LimitUpdateForm.get('tot_size').setValidators(Validators.required):this.LimitUpdateForm.get('tot_size').clearValidators();
    this.LimitUpdateForm.get('tot_size').updateValueAndValidity();
  }

  async subsupdate() {
    // console.log(this.LimitUpdateForm.value)
    if (this.LimitUpdateForm.invalid) {
      return;
    }
      this.loading = true;
      this.LimitUpdateForm.value['uid'] = this.item['cust_id'];
      this.LimitUpdateForm.value['type'] = 1;
      let limitdata = [this.LimitUpdateForm.value]
      let res = await this.custser.addlimit({ limit:limitdata });
      if(res){
        this.loading = false
      }
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
        await this.closeModal()
      }
  };

  createForm() {
    this.LimitUpdateForm = new FormGroup({
      dl_limit: new FormControl(''),
      dl_size: new FormControl('MB'),
      ul_limit: new FormControl(''),
      ul_size: new FormControl('MB'),
      tot_limit: new FormControl(''),
      tot_size: new FormControl('MB'),
      type:new FormControl(1)
    });
  }
}

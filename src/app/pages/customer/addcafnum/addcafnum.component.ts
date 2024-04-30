import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustService, BusinessService, GroupService, RoleService, ResellerService } from '../../_service/indexService';
import { Router } from '@angular/router';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';

@Component({
  selector: 'addcafnum',
  templateUrl: './addcafnum.component.html',
  // styleUrls: ['./macstyle.scss'],

})

export class AddCafNumComponent implements OnInit {
  submit: boolean = false; AddCafForm; hr = []; minsec = [];
  ratio = []; pack; modalHeader; item; data; busdata; groupdata; pro; reseldata;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes; servtype; custname;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(

    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private custser: CustService,
    public role: RoleService,
    private busser: BusinessService,
    private grupser: GroupService,
    private resser: ResellerService,
    private router: Router

  ) { }
  closeModal() {
    this.activeModal.close();
    // this.router.navigate(['/pages/Accounts/listreceipt']);
  }

  async ngOnInit() {
    this.createForm();
    await this.business();
    if (this.item) {
      await this.resellername();
      await this.profile();
    }
    if (this.role.getroleid() <= 777) {
      this.AddCafForm.get('bus_id').setValue(this.role.getispid());
      await this.profile();
    }
    // console.log(this.item)
  }

  async business($event = '') {
    this.busdata = await this.busser.showBusName({ like: $event })
  }

  async profile() {
    this.pro = await this.resser.showProfileReseller({ rec_role: 1, bus_id: this.AddCafForm.value['bus_id'] })
    // console.log(res)
  }

  async resellername($event='') {
    if(this.role.getroleid()> 777){
      this.reseldata = await this.resser.showResellerName({ bus_id:this.AddCafForm.value['bus_id'],role: this.AddCafForm.value['Role'],like:$event })
    }
    if (this.role.getroleid() <= 777) {
      this.reseldata = await this.resser.showResellerName({ role: this.AddCafForm.value['Role'],like:$event })
      // console.log(res)
    }
  }


  async receiptsubmit() {
    // this.loading = true;
    // console.log("entry")
    if (this.AddCafForm.invalid) {
      this.submit = true;
      return;
    }
    let method = 'addCaf'
    if (this.item) {
      method = 'editCaf'
      this.AddCafForm.value['id'] = this.item.cafid;
    }
    // console.log("inside")
    // console.log(this.AddCafForm.value)
    let result = await this.custser[method](this.AddCafForm.value)
    this.data = result
    // console.log(result)
    // this.loading = false;
    const toast: Toast = {
      type: result[0]['error_msg'] == 0 ? 'success' : 'warning',
      title: result[0]['error_msg'] == 0 ? 'Success' : 'Failure',
      body: result[0]['msg'],
      timeout: 3000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
    if (result[0]['error_msg'] == 0) {
      this.closeModal();
    }

  }

  createForm() {
    this.AddCafForm = new FormGroup({
      bus_id: new FormControl(this.item ? this.item.isp_id : '', Validators.required),
      groupid: new FormControl(''),
      Role: new FormControl(this.item ? this.item.role : '', Validators.required),
      reseller: new FormControl(this.item ? this.item.reseller_id : '',Validators.required),
      initial: new FormControl('2022/',Validators.required),
      st_num: new FormControl(this.item ? this.item.s_num : '', Validators.required),
      end_num: new FormControl(this.item ? this.item.e_num : '', Validators.required),
      rstatus: new FormControl(this.item ? this.item.caf_status : ''),
    });
  }
}
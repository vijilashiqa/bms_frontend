import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService, BusinessService, GroupService, RoleService, ResellerService } from '../../_service/indexService';
import { Router } from '@angular/router';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';

@Component({
  selector: 'receipt',
  templateUrl: './addreceipt.component.html',
  // styleUrls: ['./macstyle.scss'],

})

export class AddreceiptComponent implements OnInit {
  submit: boolean = false; AddreceiptForm; hr = []; minsec = [];
  ratio = []; pack; modalHeader; item; data; busdata; groupdata; pro; reseldata;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes; servtype; custname;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(

    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private acntser: AccountService,
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
      this.AddreceiptForm.get('bus_id').setValue(this.role.getispid());
      await this.profile();
    }
  }

  async business($event = '') {
    this.busdata = await this.busser.showBusName({ like: $event })
  }

  async profile() {
    this.pro = await this.resser.showProfileReseller({ rec_role: 1, bus_id: this.AddreceiptForm.value['bus_id'] })
  }

  async resellername($event = '') {
    if (this.role.getroleid() > 777) {
      this.reseldata = await this.resser.showResellerName({ bus_id: this.AddreceiptForm.value['bus_id'], role: this.AddreceiptForm.value['Role'], like: $event })
    }
    if (this.role.getroleid() <= 777) {
      this.reseldata = await this.resser.showResellerName({ role: this.AddreceiptForm.value['Role'], like: $event })
    }
  }


  async receiptsubmit() {
    // this.loading = true;
    if (this.AddreceiptForm.invalid) {
      this.submit = true;
      return;
    }
    let method = 'addReceipt'
    if (this.item) {
      method = 'editReceipt'
      this.AddreceiptForm.value['id'] = this.item.receiptid;
    }
    this.data = await this.acntser[method](this.AddreceiptForm.value)
    // this.loading = false;
    const toast: Toast = {
      type: this.data[0]['error_msg'] == 0 ? 'success' : 'warning',
      title: this.data[0]['error_msg'] == 0 ? 'Success' : 'Failure',
      body: this.data[0]['msg'],
      timeout: 3000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
    if (this.data[0]['error_msg'] == 0) {
      this.closeModal();
    }

  }

  createForm() {
    this.AddreceiptForm = new FormGroup({
      bus_id: new FormControl(this.item ? this.item.isp_id : '', Validators.required),
      groupid: new FormControl(''),
      Role: new FormControl(this.item ? this.item.role : ''),
      reseller: new FormControl(this.item ? this.item.reseller_id : ''),
      initial: new FormControl('BLSS/2021/R/', Validators.required),
      st_num: new FormControl(this.item ? this.item.start_num : '', Validators.required),
      end_num: new FormControl(this.item ? this.item.end_num : '', Validators.required),
      rstatus: new FormControl(this.item ? this.item.rstatus : ''),
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustService } from '../../_service/indexService';
import { Router } from '@angular/router';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';

@Component({
  selector: 'MacManagment',
  templateUrl: './mac.component.html',
  styleUrls: ['./macstyle.scss'],

})

export class MacComponent implements OnInit {
  submit: boolean = false; MacForm; hr = []; minsec = [];
  ratio = []; pack; modalHeader; item; data;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes; servtype; custname;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(

    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private custser: CustService,
    private router: Router

  ) { }
  closeModal() {
    this.activeModal.close();
    this.router.navigate(['/pages/cust/viewcust']);
  }
  async ngOnInit() {
    this.createForm();
    await this.getmacmanagement();
    // console.log(this.item)
  }

  async getmacmanagement() {
    let res = await this.custser.getmacmanagement({ uid: this.item })
    this.item = res[0];
    // console.log(this.item)
    this.createForm()

  }

  macvalid() {
    // if(this.item.acctype==0 && this.MacForm.value['login_type']==1){
    //   this.MacForm.get('login_mac').setValidators(Validators.required)
    // }else{
    //   this.MacForm.get('login_mac').clearValidators();
    //   this.MacForm.get('login_mac').updateValueAndValidity();
    // }
  }

  async macsubmit() {
    this.loading = true;
    if (this.MacForm.invalid) {
      this.submit = true;
      return;
    }
    this.MacForm.value['uid'] = this.item.uid
    if (this.item.online_status == 1 && this.item.expiry_status == 1) {
      this.MacForm.value['status'] = 1;
    } else {
      this.MacForm.value['status'] = 0;
    }
    // console.log(this.MacForm.value)
    let result = await this.custser.updatemac(this.MacForm.value)
    this.data = result
    // console.log(result)
    this.loading = false;
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

  bindmap() {
    if (this.item.online_status == 1 && this.item.expiry_status == 1 && this.MacForm.value['login_type'] == 1) {
      this.MacForm.get('login_mac').setValue(this.MacForm.value['currentmac'])

    }
  }

  createForm() {
    this.MacForm = new FormGroup({
      login_type: new FormControl(this.item ? this.item['acctype'] : Number(''), Validators.required),
      currentmac: new FormControl(this.item ? this.item['callingstationid'] : ''),
      login_mac: new FormControl('', Validators.pattern("^([0-9 a-f A-F]{2}[:-]){5}[0-9a-fA-F]{2}$")),
      user_id: new FormControl('')
    });
  }
}
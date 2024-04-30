import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustService } from '../../_service/indexService';
import { Router } from '@angular/router';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';

@Component({
  selector: 'macbinding',
  templateUrl: './macbinding.component.html',
  styleUrls: ['./macbindingstyle.scss'],

})

export class MacBindingComponent implements OnInit {
  submit: boolean = false; MacbindForm; hr = []; minsec = [];
  ratio = []; pack; modalHeader; item; data; macbinddata = [];

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
    await this.getmacbind();
    // console.log(this.item)
  }

  async getmacbind() {
    let res = await this.custser.getMacBind({ uid: this.item })
    this.item = res[0];
    // console.log(this.item)
    this.createForm()

  }

  bindvalid() {
    // console.log("hitt")
    this.MacbindForm.value['mac_addr'] == true ? this.MacbindForm.get('amac').setValidators([Validators.required]) : this.MacbindForm.get('amac').clearValidators();
    this.MacbindForm.get('amac').updateValueAndValidity();
    this.MacbindForm.value['mac_addr'] == false ? this.MacbindForm.get('amac').setValue('') : this.MacbindForm.value['amac'];
  }

  async macsubmit() {
    // this.loading = true;
    this.bindvalid();
    if (this.MacbindForm.invalid) {
      this.submit = true;
      return;
    }
    this.loading = true;
    this.MacbindForm.value['uid'] = this.item.uid;
    this.MacbindForm.value['login_type'] = this.item.acctype;
    this.macbinddata = [this.MacbindForm.value]
    // console.log(this.macbinddata)
    let result = await this.custser.updateMacBind({ macbind: this.macbinddata })
    this.data = result
    console.log(result)
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

  createForm() {
    this.MacbindForm = new FormGroup({
      // login_type: new FormControl(this.item ? this.item['acctype'] : Number(''), Validators.required),
      mac_addr: new FormControl(this.item ? this.item['usemacauth'] : ''),
      amac: new FormControl(this.item ? this.item['mac'] : ''),
    });
  }
}
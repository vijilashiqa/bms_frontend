import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustService, S_Service } from '../../_service/indexService';
import { Router } from '@angular/router';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';

@Component({
  selector: 'changevalidity',
  templateUrl: './changevalidity.component.html',
  styleUrls: ['./changevaliditystyle.scss'],

})

export class ChangeValidityComponent implements OnInit {
  submit: boolean = false; ChangevalidityForm; hr = []; minsec = [];
  ratio = []; pack; modalHeader; item; data; custvalidity = []; subpack;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes; servtype; custname;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private custser: CustService,
    private serv: S_Service,
    private router: Router

  ) { }

  closeModal() {
    this.activeModal.close();
    if (this.item.card_flag) {
      this.router.navigate(['/pages/cust/list-card-user'])
    } else {
      this.router.navigate(['/pages/cust/viewcust']);
    }
  }

  async ngOnInit() {
    // console.log(this.item)
    this.createForm();
    await this.Service();
  }

  async Service($event = '') {
    this.pack = await this.serv.showServiceName({ u_id: this.item.cust_id, like: $event })
    // console.log(res)
  }

  async changevaliditysubmit() {
    // this.loading = true;
    if (this.ChangevalidityForm.invalid) {
      this.submit = true;
      return;
    }
    this.ChangevalidityForm.value['uid'] = this.item.cust_id;
    this.custvalidity = [this.ChangevalidityForm.value]
    // console.log(this.custvalidity)
    let result = await this.custser.changeCustValidity({ custvalidity: this.custvalidity })
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
    this.ChangevalidityForm = new FormGroup({
      validity: new FormControl('', Validators.required),
      reason: new FormControl('', Validators.required),
    });
  }
}
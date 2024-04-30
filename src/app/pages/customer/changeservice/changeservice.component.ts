import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustService, S_Service } from '../../_service/indexService';
import { Router } from '@angular/router';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';

@Component({
  selector: 'changeservice',
  templateUrl: './changeservice.component.html',
  styleUrls: ['./changeservicestyle.scss'],

})

export class ChangeServiceComponent implements OnInit {
  submit: boolean = false; ChangeSerForm; hr = []; minsec = [];
  ratio = []; pack; modalHeader; item; data; custservdata = []; subpack;

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
    this.router.navigate(['/pages/cust/viewcust']);
  }

  ngOnInit() {
    // console.log(this.item)
    this.createForm();
    this.Service();
  }

  async Service($event = '') {
    this.pack = await this.serv.showServiceName({ view_flag:1,u_id: this.item.cust_id, like: $event });
    // console.log(res)
  }

  async subplanshow($event = '') {
    this.subpack = await this.serv.showSubPlan({ srvid: this.ChangeSerForm.value['package'], u_id: this.item.cust_id, like: $event })
    // console.log(result)
  }

  async changesersubmit() {
    // this.loading = true;
    if (this.ChangeSerForm.invalid) {
      this.submit = true;
      return;
    }
    this.ChangeSerForm.value['uid'] = this.item.cust_id;
    this.custservdata = [this.ChangeSerForm.value]
    // console.log(this.custservdata)
    let result = await this.custser.changeCustService({ custservdata: this.custservdata });
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
    this.ChangeSerForm = new FormGroup({
      srv_id: new FormControl('', Validators.required),
      reason: new FormControl('', Validators.required),
    });
  }
}
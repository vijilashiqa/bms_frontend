import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustService, S_Service } from '../../_service/indexService';
import { Router } from '@angular/router';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';

@Component({
  selector: 'ngx-change-sim-use',
  templateUrl: './change-sim-use.component.html',
  styleUrls: ['./change-sim-use.component.scss']
})
export class ChangeSimUseComponent implements OnInit {

  submit: boolean = false; ChangeSimuseForm;  item;data;modalHeader;

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
     this.createForm();
   }

  
  async changeSimusesubmit() {
    // this.loading = true;
    if (this.ChangeSimuseForm.invalid) {
      this.submit = true;
      return;
    }
    this.ChangeSimuseForm.value['uid'] = this.item.cust_id;
  
    let result = await this.custser.changeSimUse( this.ChangeSimuseForm.value)
    this.data = result
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
    this.ChangeSimuseForm = new FormGroup({
      simultaneous_use: new FormControl('', Validators.required),
      reason: new FormControl('', Validators.required),
    });
  }
}
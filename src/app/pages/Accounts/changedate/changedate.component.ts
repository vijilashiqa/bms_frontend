import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../_service/indexService';

@Component({
  selector: 'ngx-changedate',
  templateUrl: './changedate.component.html',
  styleUrls: ['./changedate.component.scss']
})
export class ChangedateComponent implements OnInit {
  submit: boolean = false; ChangeDateForm; datas; id; modalHeader; item;
  constructor(
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private account: AccountService,
    private router: Router,
  ) { }

  closeModal() {
    this.activeModal.close();
  }

  ngOnInit() {
    this.createForm();
  }

  async changeDate() {
    this.submit = true;
    if (this.ChangeDateForm.invalid) {
      window.alert('Please Select Date');
      return;
    }
    this.ChangeDateForm.value['invid'] = this.item['invid'];
    let result = await this.account.updateEinvoice(this.ChangeDateForm.value)
    const toast: Toast = {
      type: result['error_msg'] == 0 ? 'success' : 'warning',
      title: result['error_msg'] == 0 ? 'Success' : 'Failure',
      body: result['msg'],
      timeout: 3000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
    if (result['error_msg'] == 0) {
      this.closeModal();
    }
  }



  createForm() {
    this.ChangeDateForm = new FormGroup({
      date_time: new FormControl('', Validators.required),
    });
  }
}

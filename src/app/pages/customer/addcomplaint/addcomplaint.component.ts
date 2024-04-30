import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';
import { ComplaintService, CustService } from '../../_service/indexService';


@Component({
  selector: 'addcomplaint',
  templateUrl: './addcomplaint.component.html',

})

export class CustComplaintAddComponent implements OnInit {
  submit: boolean = false; CustCompForm; datas; id; modalHeader;employdata;comptypdata;item;

  constructor(
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private ser: CustService,
    private router: Router,
    private compser : ComplaintService,

  ) {  }

  closeModal() {
    this.activeModal.close();
    this.router.navigate(['/pages/cust/viewcust'])
  }

  async ngOnInit() {
    this.createForm();
    // console.log("ispid",this.item['busid']);
    // console.log("resid",this.item['resid']);
    // console.log("uid",this.item['uid']);
    await this.employe();
    await this.comptype();
    
  }

  async employe($event = '') {
    this.employdata = await this.compser.showEmployee({ resel_id: this.item['resid'], like: $event });
    // console.log("empres",this.employdata);
  }

  async comptype($event = '') {
    this.comptypdata = await this.compser.showComplaintType({ resel_id: this.item['resid'], like: $event });
    // console.log("comptype",this.comptypdata);

  }

  async custcompsubmit() {
    if (this.CustCompForm.invalid) {
      this.submit = true;
      return;
    }
    // console.log('qqqq')
    this.CustCompForm.value['bus_id'] = this.item['busid'];
    this.CustCompForm.value['reseller'] = this.item['resid'];
    this.CustCompForm.value['cust_id'] = this.item['uid'];
    let compdata = [this.CustCompForm.value];
    let result = await this.compser.addComplaint({complaints:compdata})
    // console.log(result)
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
    this.CustCompForm = new FormGroup({
      Assign: new FormControl('', Validators.required),
      complaint: new FormControl('', Validators.required),
      Priority: new FormControl('',Validators.required),
      sub_comp : new FormControl(''),
      Notes : new FormControl(''),
      status : new FormControl('',Validators.required)

    });
  }
}
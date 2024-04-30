import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder, } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'add-hsn',
  templateUrl: './add-hsn.component.html',
})

export class HsnComponent implements OnInit {
  modalHeader: string; item;
  hsnForm; submit: boolean; STB;
  constructor(
    public activeModal: NgbActiveModal,
    private alert: ToasterService,
    // private stb: STBService,
  ) { }

  ngOnInit() {
    this.createForm();
  };

  number() {
    // this.submit = true;
    // if (!this.hsnForm.valid) {
    //   return;
    // }
    // let method = this.item ? 'editHsn' : 'addHsn';
    // if (this.item) {
    //   this.hsnForm.value['hsn_id'] = this.item['hsn_id'];
    // }

    // this.stb[method](this.hsnForm.value).subscribe(result => {
    //   if (result) {
    //     this.STB = result;
    //     if (result != null) {
    //       const toast: Toast = {
    //         type: result['status'] == 1 ? 'success' : 'warning',
    //         title: result['status'] == 1 ? 'Success' : 'Failure',
    //         body: result['msg'],
    //         timeout: 5000,
    //         showCloseButton: true,
    //         bodyOutputType: BodyOutputType.TrustedHtml,
    //       };
    //       this.alert.popAsync(toast);
    //       if (result['status'] == 1) {
    //         this.activeModal.close(true);
    //       }
    //     }
    //   }
    // });
  };

  createForm() {
    this.hsnForm = new FormGroup({
      name: new FormControl(this.item ? this.item['hsn_name'] : '', Validators.required),
      hsn_sac: new FormControl(this.item ? this.item['hsn_num'] : '', Validators.required),
      status: new FormControl(this.item ? this.item['status'] == 1 : true),
    });
  }

}

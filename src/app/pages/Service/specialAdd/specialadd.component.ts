import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectService, S_Service, NasService } from '../../_service/indexService';

@Component({
  selector: 'specialAdd',
  templateUrl: './specialadd.component.html',
  styles: ['.input-invalid input[type=text]::-webkit-input-placeholder::after { visibility: visible;}']
})

export class SpecialAddComponent implements OnInit {
  submit: boolean = false; SpecialForm; data; pack;
  ratio = []; item; grup; busname; modalHeader;

  constructor(
    private ser: S_Service,
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private nas: NasService,
    private select: SelectService

  ) {
    this.ratio = [
      { value: 0.0, percentage: '0' },
      { value: 0.05, percentage: '5' },
      { value: 0.10, percentage: '10' },
      { value: 0.15, percentage: '15' },
      { value: 0.20, percentage: '20' },
      { value: 0.25, percentage: '25' },
      { value: 0.30, percentage: '30' },
      { value: 0.35, percentage: '35' },
      { value: 0.40, percentage: '40' },
      { value: 0.45, percentage: '45' },
      { value: 0.50, percentage: '50' },
      { value: 0.55, percentage: '55' },
      { value: 0.60, percentage: '60' },
      { value: 0.65, percentage: '65' },
      { value: 0.70, percentage: '70' },
      { value: 0.75, percentage: '75' },
      { value: 0.80, percentage: '80' },
      { value: 0.85, percentage: '85' },
      { value: 0.90, percentage: '90' },
      { value: 0.95, percentage: '95' },
      { value: 1.0, percentage: '100' }
    ];
  }
  closeModal() {
    this.activeModal.close();
  }
  group() {
    // this.select.showBusGroup({ business_id: this.SpecialForm.value['bus_name'] }).subscribe(res => {
    //   this.grup = res;
    // })
  }

  business() {
    // this.select.showBusName({}).subscribe(result => {
    //   this.busname = result;
    // })
  }

  busservice() {
    // this.select.showBusSer({ isp_id: this.SpecialForm.value['bus_name'] }).subscribe(res => {
    //   this.pack = res;
    // });
  }

  grupser() {
    // if (this.SpecialForm.value['group_name'] != '') {
    //   this.select.showBusGrpSer({ isp_id: this.SpecialForm.value['bus_name'], group_id: this.SpecialForm.value['group_name'] }).subscribe(result => {
    //     this.pack = result;
    //   })
    // }

  }

  AddSpecialAervice() {
    // this.submit = true
    // if (this.SpecialForm.invalid) {
    //   return;
    // }
    // let method = 'insertAddSer';
    // if (this.item) {
    //   method = 'updateAddSer';
    //   this.SpecialForm.value['id'] = this.item['id'];
    // }
    // this.ser[method](this.SpecialForm.value).subscribe(result => {
    //   this.data = result;
    //   const toast: Toast = {
    //     type: result.msg.status == 1 ? 'success' : 'warning',
    //     title: result.msg.status == 1 ? 'Success' : 'Failure',
    //     body: result.msg.msg,
    //     timeout: 5000,
    //     showCloseButton: true,
    //     bodyOutputType: BodyOutputType.TrustedHtml,
    //   };
    //   this.alert.popAsync(toast);
    //   if (result.msg.status == 1)
    //     this.closeModal();
    // });
  }

  ngOnInit() {
    // this.createForm();
    // this.business();
    // if(this.item){
    //   this.busservice();
    // this.grupser();
    // }
  }

  createForm() {
    this.SpecialForm = new FormGroup({
      bus_name: new FormControl(this.item ? this.item['isp_id'] : ''),
      group_name: new FormControl(this.item ? this.item['group_id'] : ''),
      pack: new FormControl(this.item ? this.item['srvid'] : '', Validators.required),
      tratio: new FormControl(this.item ? this.item['timeratio'] : '', Validators.required),
      dlratio: new FormControl(this.item ? this.item['dlratio'] : '', Validators.required),
      upratio: new FormControl(this.item ? this.item['ulratio'] : '', Validators.required),
      shr: new FormControl(this.item ? this.item['starttime'] : '', Validators.required),
      ehr: new FormControl(this.item ? this.item['endtime'] : '', Validators.required),
      mon: new FormControl(this.item ? this.item['mon'] : true),
      tue: new FormControl(this.item ? this.item['tue'] : true),
      wed: new FormControl(this.item ? this.item['wed'] : true),
      thur: new FormControl(this.item ? this.item['thu'] : true),
      fri: new FormControl(this.item ? this.item['fri'] : true),
      sat: new FormControl(this.item ? this.item['sat'] : true),
      sun: new FormControl(this.item ? this.item['sun'] : true)
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NasService, S_Service } from '../../_service/indexService';
@Component({
  selector: 'dynamicEdit',
  templateUrl: './dynamicedit.component.html'
})

export class dynamicEditComponent implements OnInit {
  submit: boolean = false; dynamicForm; hr = []; minsec = []; pack; modalHeader;
  constructor(
    private ser: S_Service,
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private nas: NasService
  ) { }

  closeModal() {
    this.activeModal.close();
  }
  ngOnInit() {
    this.createForm();
    this.showService();

    for (var i = 0; i < 24; ++i) {
      this.hr.push({ value: '0' + i })
    }
    for (var i = 0; i < 60; ++i) {
      this.minsec.push({ value: '0' + i })
    }
  }

  async showService() {
    this.pack = await this.ser.showServiceName({})
  }

  async AddDyn() {
    this.submit = true;
    console.log(this.dynamicForm.value)
    if (this.dynamicForm.invalid) {
      return;
    }
    let result = this.ser.insertDynSer(this.dynamicForm.value)
    console.log(result['msg']['msg'])
    const toast: Toast = {
      type: result['msg']['status'] == 1 ? 'success' : 'warning',
      title: result['msg'][status] == 1 ? 'Success' : 'Failure',
      body: result['msg']['msg'],
      timeout: 5000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
    if (result['msg']['status'] == 1)
      this.closeModal();
  }

  createForm() {
    this.dynamicForm = new FormGroup({
      pack: new FormControl('', Validators.required),
      shr: new FormControl('00'),
      smin: new FormControl('00'),
      ssec: new FormControl('00'),
      ehr: new FormControl('00'),
      emin: new FormControl('00'),
      esec: new FormControl('00'),
      enburst: new FormControl(false),
      mon: new FormControl(true),
      tue: new FormControl(true),
      wed: new FormControl(true),
      thur: new FormControl(true),
      fri: new FormControl(true),
      sat: new FormControl(true),
      sun: new FormControl(true),
      dlburst: new FormControl('', Validators.pattern('^[0-9]*$')),
      ulburst: new FormControl('', Validators.pattern('^[0-9]*$')),
      dlburstth: new FormControl('', Validators.pattern('^[0-9]*$')),
      ulburstth: new FormControl('', Validators.pattern('^[0-9]*$')),
      dlbursttime: new FormControl('', Validators.pattern('^[0-9]*$')),
      ulbrusttime: new FormControl('', Validators.pattern('^[0-9]*$')),
      dlrate: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      uprate: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      priority: new FormControl('', [Validators.required, Validators.pattern('^[0-8]{1}$')])
    });
  }
}
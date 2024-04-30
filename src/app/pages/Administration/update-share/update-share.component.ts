import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BusinessService, GroupService, ResellerService, RoleService } from '../../_service/indexService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as JSXLSX from 'xlsx';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { AddSuccessComponent } from '../success/add-success.component';


@Component({
  selector: 'ngx-update-share',
  templateUrl: './update-share.component.html',
  styleUrls: ['./update-share.component.scss']
})
export class UpdateShareComponent implements OnInit, AfterViewChecked {
  busdata; groupdata; reseldata; rdata: any;
  shareForm; submit: boolean = false; readonly;
  file: any[]; bulk = []; arrayBuffer: any; bulk_meta;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;
  @ViewChild('myFile') myInputFile: ElementRef;

  constructor(private alert: ToasterService,
    private router: Router,
    private busser: BusinessService,
    private groupser: GroupService,
    private resser: ResellerService,
    public role: RoleService,
    private fb: FormBuilder,
    public activeModal: NgbModal,
    private cdRef: ChangeDetectorRef,
  ) { }


  async ngOnInit() {
    await this.createForm();
    await this.business();
    if (this.role.getroleid() <= 777) {
      this.shareForm.get('bus_id').setValue(this.role.getispid());
      await this.groupname();
    }
  }
  ngAfterViewChecked() {   // To check  template if condition i.e initially it sets to false then afterwards it seems true so in order to check ,use ViewCheck
    this.cdRef.detectChanges();
  }
  async business($event = '') {
    this.busdata = await this.busser.showBusName({ like: $event })
  }

  async groupname($event = '') {
    this.groupdata = await this.groupser.showGroupName({ bus_id: this.val['bus_id'], like: $event })
  }

  async resellername($event = '') {
    this.reseldata = await this.resser.showResellerName({ bus_id: this.val['bus_id'], groupid: this.val['groupid'], role: 333, like: $event })  // Only Deposit Reseller
  }


  async resData() {
    [this.rdata] = this.reseldata.filter(x => x.id == this.val['res_name'])
    // console.log('Rdata---', this.rdata);
    this.shareForm.patchValue({
      'share_type': this.rdata['sharing_type'], 'resel_under': this.rdata['sub_isp_or_dist'],
      'isp_share': this.rdata.isp_share, 'resel_share': this.rdata.reseller_share
    });

    switch (this.rdata.sub_isp_or_dist) {

      case 1: case '1':
      case 2: case '2':
        {
          this.shareForm.patchValue({ 'sisp_share': this.rdata.sub_isp_share });
          this.clearValid('sdisp_share');
          this.setValid('sisp_share');
          break;
        }
      case 3: case '3':
      case 4: case '4':
        {
          this.shareForm.patchValue({ 'sisp_share': this.rdata.sub_isp_share, 'sdisp_share': this.rdata.sub_dist_share });
          this.setValid('sisp_share', 'sdisp_share');
          break;
        }
      default: break;
    }

  }

  sharevalidation() {
    if (this.val['resel_under'] != 0) this.setValid('sisp_share');
    if (this.val['resel_under'] == 3 || this.val['resel_under'] == 4) this.setValid('sdisp_share');
    if (this.val['resel_under'] == 0) this.clearValid('sisp_share', 'sdisp_share');
    if (this.val['resel_under'] == 1 || this.val['resel_under'] == 2) this.clearValid('sdisp_share');
  }

  clearValid(...value) {
    for (let val of value) {
      this.shareForm.get(val).clearValidators();
      this.shareForm.get(val).updateValueAndValidity();
    }
  }

  setValid(...value) {
    for (let val of value) {
      this.shareForm.get(val).setValidators(Validators.required);
    }
  }


  clearFile() {
    if (this.bulk.length > 0) this.myInputFile.nativeElement.value = '';
  }

  async updateShare() {
    this.submit = true;
    const invalid = [], controls = this.ctrl;
    for (const name in controls) {
      if (controls[name].invalid) invalid.push(name)
    }
    if (this.shareForm.invalid || (this.bulk.length == 0 && this.val['share_type'] == 2 && this.val['share_mode'] == 1)) {
      console.log('Invlaid', invalid);
      window.alert('Please fill all mandatory field or upload file');
      return;
    }
    if(this.val['resel_under'] == 0) {
      this.val['sisp_share'] = this.val['sdisp_share'] = 0;
    }
    if(this.val['resel_under'] == 1 || this.val['resel_under'] == 2) {
       this.val['sdisp_share'] = 0;
    }
    

    if (this.val['share_type'] == 2) {
      let result = this.metaData();
      for (let i = 0; i < this.bulk.length; i++) {
        for (let meta of result) {
          if (meta.required && !this.bulk[i].hasOwnProperty(meta.label)) {
            this.toastalert(meta.msg);
          } else {
            this.bulk[i][meta.assign_to] = this.bulk[i][meta.label];
          }
        }
      }
      // console.log('bulk data---', this.bulk);
      this.val['plan'] = this.bulk;
    }
    this.loading = true;
    // console.log('Form value', this.val);
    let result = await this.resser.updatePackageShare(this.val);
    // console.log('Response-----', result);

    if (result) {
      this.loading = false;
      this.result_pop(result)
      if (result[0]['err_msg'] == 0) {
        this.shareForm.reset();
        this.bulk = []; this.submit = false;
      }
    } else this.loading = false;
  }

  toastalert(msg, status = 1) {
    const toast: Toast = {
      type: status == 0 ? 'success' : 'warning',
      title: status == 0 ? 'Success' : 'Failure',
      body: msg,
      timeout: 5000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
  }

  result_pop(item) {
    const activeModal = this.activeModal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.result.then((data) => {

    });
  }

  changeListener(file) {
    this.file = file;
    this.filereader(this.file, result => {
      this.bulk = result;
    });
  }

  filereader(file, callback) {
    if (file) {
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = JSXLSX.read(bstr, { type: "binary" });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        callback(JSXLSX.utils.sheet_to_json(worksheet, { raw: true }))
      }
      fileReader.readAsArrayBuffer(file);
    } else {
      callback([])
    }
  }

  createForm() {
    this.shareForm = this.fb.group({
      bus_id: new FormControl('', Validators.required),
      groupid: new FormControl(''),
      res_name: new FormControl('', Validators.required),
      share_type: new FormControl('', Validators.required),
      resel_under: new FormControl(0, Validators.required),
      isp_share: new FormControl('', Validators.required),
      sisp_share: new FormControl(''),
      sdisp_share: new FormControl(''),
      resel_share: new FormControl('', Validators.required),
      share_mode: new FormControl('0', Validators.required)

    });
  }
  get ctrl() {
    return this.shareForm.controls;
  }
  get val() {
    return this.shareForm.value;
  }

  metaData() {
    return this.bulk_meta = [
      { msg: 'Please fill subplan name', label: 'SUB PLAN NAME', assign_to: 'plan_name', required: true },
      { msg: 'Please fill Isp Share', label: 'ISP SHARE', assign_to: 'ispshare', required: true },
      { msg: 'Please fill SubIsp Share', label: 'SUBISP SHARE', assign_to: 'sshare', required: true },
      { msg: 'Please fill SubDist Share', label: 'SUBDIST SHARE', assign_to: 'dshare', required: true },
      { msg: 'Please fill Reseller Share', label: 'RESELLER SHARE', assign_to: 'rshare', required: true }
    ]
  }



}

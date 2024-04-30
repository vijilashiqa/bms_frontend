import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BusinessService, CustService, ResellerService, RoleService } from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import { AddSuccessComponent } from '../success/add-success.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';


@Component({
  selector: 'ngx-bulkupdate',
  templateUrl: './bulkupdate.component.html',
  styleUrls: ['./bulkupdate.component.scss']
})
export class BulkupdateComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false; bulkUpdateForm; submit: boolean = false;
  bulk = []; failure: any[]; arrayBuffer: any; file: any[]; service; bulk_meta: any; config;
  busname; profile; reseldata; roleid;

  @ViewChild('myFile') myInputFile: ElementRef;
  constructor(
    private cust: CustService,
    private alert: ToasterService,
    public activeModal: NgbModal,
    private busser: BusinessService,
    public role: RoleService,
    private resser: ResellerService,


  ) { }

  async ngOnInit() {
    this.createForm();
    await this.business();
    if (this.role.getroleid() <= 777) {
      this.bulkUpdateForm.get('bus_id').setValue(this.role.getispid());
      await this.showProfile();
    }
  }

  metaData(val) {
    if (val == 1) {
      this.bulk_meta = [
        { msg: 'Please Fill Login id', label: 'ProfileId', assign_to: 'profileid', required: true },
        { msg: 'Please Fill Expiry Date', label: 'ExpiryDate', assign_to: 'expiry', required: true },
      ]
    }
    if (val == 3) {
      this.bulk_meta = [
        { msg: 'Please Fill Login Id', label: 'profile_id', required: true },
        { msg: 'Please Fill Service', label: 'service_name', required: true },
        { msg: 'Please Fill SubPlan', label: 'subplan', required: true },
        { msg: 'Please Fill Renewal Date', label: 'renewal_date', required: true }
      ]
    }
    if (val == 4) {
      this.bulk_meta = [
        { msg: 'Please Fill Login Id', label: 'profile_id', required: true },
        { msg: 'Please Fill Branch Name', label: 'To_Branch_Name', required: true },
      ]
    }
    if (val == 5) {
      this.bulk_meta = [
        { msg: 'Please Fill Login Id', label: 'profile_id', required: true },
        { msg: 'Please Fill Service', label: 'service_name', required: true },
        { msg: 'Please Fill SubPlan', label: 'subplan', required: true },
      ]
    }
    if (val == 6) {
      this.bulk_meta = [
        { msg: 'Please Fill Login Id', label: 'profile_id', required: true },
        { msg: 'Please Fill Password', label: 'password', required: true },
      ]
    }
    return this.bulk_meta;
  }
  async business() {
    this.busname = await this.busser.showBusName({})
  }

  
  async showProfile($event = '') {
    if (this.bulkUpdateForm.value['bus_id']) {
      this.profile = await this.resser.showProfileReseller({ like: $event, rec_role: 1, bus_id: this.bulkUpdateForm.value['bus_id'] })
    }
  }
  async resellername($event = '', val = 0) {
    if (this.bulkUpdateForm.value['bus_id'] && (this.bulkUpdateForm.value['resel_type'] || this.bulkUpdateForm.value['fresel_type'] || this.bulkUpdateForm.value['tresel_type'])) {
      this.roleid = val == 1 ? this.bulkUpdateForm.value['fresel_type'] : val == 2 ? this.bulkUpdateForm.value['tresel_type'] : this.bulkUpdateForm.value['resel_type']
      this.reseldata = await this.resser.showResellerName({ like: $event, bus_id: this.bulkUpdateForm.value['bus_id'], role: this.roleid });
    }
  }
  async bulkUpdate() {
    this.submit = true;
    const invalid = [], controls = this.bulkUpdateForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) invalid.push(name)
    }
    if (this.bulkUpdateForm.invalid || (this.bulk.length == 0 && this.bulkUpdateForm.value['format'] != 2)) {
      console.log('Invlaid', invalid);
      window.alert('Please fill all mandatory field or upload file');
      return;
    }
    let value = this.bulkUpdateForm.value['format'];
    if (value == 1) {     //Update Expiry Details
      let result = this.metaData(value)
      for (let i = 0; i < this.bulk.length; i++) {
        for (let meta of result) {
          if (meta.required && !this.bulk[i].hasOwnProperty(meta.label)) {
            this.toastalert(meta.msg);
            return;
          } else {
            switch (meta.label) {
              case 'ExpiryDate':
                this.bulk[i][meta.assign_to] = new Date((this.bulk[i][meta.label] - (25567 + 2)) * 86400 * 1000)
                break;

              default:
                this.bulk[i][meta.assign_to] = this.bulk[i][meta.label]
                break;
            }
          }
        };
      };
      this.loading = true;
      console.log('Expiry', this.bulk)
      let resp = await this.cust.bulkUpdateExpiry({ expiry: this.bulk });
      if (resp) {
        this.loading = false;
        this.result_pop(resp, true);
        if (resp[0]['error_msg'] == 0) this.myInputFile.nativeElement.value = "";
      } else this.loading = false;
    }
    if (value == 2) {     //Update Service
      this.loading = true;
      let resp = await this.cust.bulkUpdateSrvmode(this.bulkUpdateForm.value);
      if (resp) {
        this.loading = false;
        this.result_pop(resp, true);
        if (resp[0]['error_msg'] == 0) this.reset();
      } else this.loading = false;
    }
    if (value == 3) {  //Update Data Split
      let result = this.metaData(value)
      for (let i = 0; i < this.bulk.length; i++) {
        for (let meta of result) {
          if (meta.required && !this.bulk[i].hasOwnProperty(meta.label)) this.toastalert(meta.msg)
        }
        this.bulk[i].bus_id = this.bulkUpdateForm.value['bus_id']
        this.bulk[i].reseller_id = this.bulkUpdateForm.value['reseller'];
      }
      this.loading = true;
      let resp = await this.cust.bulkUpdateDatasplit({ datasplit: this.bulk });
      if (resp) {
        this.loading = false;
        this.result_pop(resp, true);
        if (resp[0]['error_msg'] == 0) this.reset();
      } else this.loading = false;
    }
    if (value == 4) {  // Replace Reseller 
      let result = this.metaData(value)
      for (let i = 0; i < this.bulk.length; i++) {
        for (let meta of result) {
          if (meta.required && !this.bulk[i].hasOwnProperty(meta.label)) this.toastalert(meta.msg)
          else this.bulk[i][meta.label] = this.bulk[i][meta.label]
        }
        this.bulk[i].bus_id = this.bulkUpdateForm.value['bus_id']
        this.bulk[i].role = this.bulkUpdateForm.value['resel_type']
        this.bulk[i].freseller_id = this.bulkUpdateForm.value['freseller'];
        this.bulk[i].treseller_id = this.bulkUpdateForm.value['treseller'];
      }
      // console.log('bulk', this.bulk)
      this.loading = true;
      let resp = await this.cust.bulkResellerReplace({ replacereseller: this.bulk });
      if (resp) {
        this.loading = false;
        this.result_pop(resp, true);
        if (resp[0]['error_msg'] == 0) this.reset();
      } else this.loading = false;
    }
    if (value == 5) {  //Service Replace
      let result = this.metaData(value)
      for (let i = 0; i < this.bulk.length; i++) {
        for (let meta of result) {
          console.log("value", this.bulk[i].hasOwnProperty(meta.label))
          if (meta.required && !this.bulk[i].hasOwnProperty(meta.label)) this.toastalert(meta.msg)
        }
        this.bulk[i].reseller_id = this.bulkUpdateForm.value['reseller'];
      }
      // console.log("bulk", this.bulk)
      this.loading = true;
      let resp = await this.cust.bulkSrvReplace({ replaceservice: this.bulk });
      // console.log("resp", resp)
      if (resp) {
        this.loading = false;
        this.result_pop(resp, true);
        if (resp[0]['error_msg'] == 0) this.reset();
      } else this.loading = false;

    }

    if (value == 6) {     //Update Authentication Password 
      let result = this.metaData(value)
      for (let i = 0; i < this.bulk.length; i++) {
        for (let meta of result) {
          if (meta.required && !this.bulk[i].hasOwnProperty(meta.label)) this.toastalert(meta.msg)
        }
      };
      this.loading = true;
      let resp = await this.cust.bulkPwdUpdate({ replacePwd: this.bulk });
      if (resp) {
        this.loading = false;
        this.result_pop(resp, true);
        if (resp[0]['error_msg'] == 0) this.myInputFile.nativeElement.value = "";
      } else this.loading = false;
    }
  }

  clearSetValidation() {
    let resetValue = ['resel_type', 'reseller', 'srvmode', 'freseller', 'treseller', 'fresel_type', 'tresel_type', 'file']
    for (let val of resetValue) {
      if (this.bulkUpdateForm.controls[val]) this.bulkUpdateForm.controls[val].setValue('');
    }
    let value = this.bulkUpdateForm.value['format'];
    //! Set and Clear Validation
    if (value == 1 || value == 6) this.clearValid('bus_id', 'resel_type', 'reseller', 'srvmode');
    if (value != 4) this.clearValid('fresel_type', 'tresel_type', 'freseller', 'treseller')   // val in (1,2,3,5,6)
    if (value == 3 || value == 5) {
      this.clearValid('srvmode');
      this.setValid('bus_id', 'resel_type', 'reseller');
    }
    if (value == 4) {
      this.clearValid('resel_type', 'reseller', 'srvmode');
      this.setValid('bus_id', 'fresel_type', 'tresel_type', 'freseller', 'treseller');
    }

    if (value == 2) {
      this.setValid('bus_id', 'resel_type', 'reseller', 'srvmode');
      this.myInputFile.nativeElement.value = "";
    }

  }

  clearValid(...value) {
    for (let val of value) {
      this.bulkUpdateForm.get(val).clearValidators();
      this.bulkUpdateForm.get(val).updateValueAndValidity();
    }
  }

  setValid(...value) {
    for (let val of value) {
      this.bulkUpdateForm.get(val).setValidators(Validators.required);
    }
  }

  reset() {
    // if (this.bulkUpdateForm.value['format'] == 4) { 
    //   this.myInputFile.nativeElement.value = "";
    //   this.bulkUpdateForm.reset()
    //   this.bulkUpdateForm.controls['format'].setValue(4);
    //   this.submit = false
    //   this.bulk = [];
    //   return
    // }
    if (this.bulkUpdateForm.value['format'] != 2) this.myInputFile.nativeElement.value = "";
    this.bulkUpdateForm.reset()
    if (this.role.getroleid() <= 777) this.bulkUpdateForm.get('bus_id').setValue(this.role.getispid());
    this.bulkUpdateForm.controls['format'].setValue(1);
    this.bulk = []; this.submit = false
  }

  result_pop(item, flag) {
    const activeModal = this.activeModal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.componentInstance.limit_flag = flag;
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
      let fileReader = new FileReader(), filedata;
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

  toastalert(msg, status = 0) {
    const toast: Toast = {
      type: status == 1 ? 'success' : 'warning',
      title: status == 1 ? 'Success' : 'Failure',
      body: msg,
      timeout: 5000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
  }

  createForm() {
    this.bulkUpdateForm = new FormGroup({
      format: new FormControl('1', Validators.required),
      bus_id: new FormControl(''),
      resel_type: new FormControl(''),
      fresel_type: new FormControl(''),
      tresel_type: new FormControl(''),
      reseller: new FormControl(''),
      freseller: new FormControl(''),
      treseller: new FormControl(''),
      srvmode: new FormControl(''),
    })
  }

}

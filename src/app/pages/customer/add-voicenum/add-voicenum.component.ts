import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustService, BusinessService, GroupService, RoleService, ResellerService } from '../../_service/indexService';
import { Router } from '@angular/router';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { AddSuccessComponent } from './../success/add-success.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'add-voicenum',
  templateUrl: './add-voicenum.component.html',
  // styleUrls: ['./macstyle.scss'],

})

export class AddVoiceNumComponent implements OnInit {
  submit: boolean = false; AddVoiceForm; hr = []; minsec = [];
  ratio = []; pack; modalHeader; item; data; busdata; groupdata; pro; reseldata;
  arrayBuffer: any; file: any[]; bulk = []; s = 0; f = 0; failure: any[];
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes; servtype; custname;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(

    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private custser: CustService,
    public role: RoleService,
    private activemodal: NgbModal,
    private busser: BusinessService,
    private router: Router

  ) { }
  closeModal() {
    this.activeModal.close();
    // this.router.navigate(['/pages/Accounts/listreceipt']);
  }

  async ngOnInit() {
    this.createForm();
    await this.business();
    if (this.item) {
      this.AddVoiceForm.get('create_type').setValue(0);
      await this.showUser();
    }
    if (this.role.getroleid() <= 777) {
      this.AddVoiceForm.get('bus_id').setValue(this.role.getispid());
    }
    // console.log(this.item)
  }

  async business($event = '') {
    this.busdata = await this.busser.showBusName({ like: $event })
  }

  async showUser($event = '') {
    if (this.item) {
      this.custname = await this.custser.showUser({ edit_flag: 1, bus_id: this.AddVoiceForm.value['bus_id'], like: $event })

    } else {
      this.custname = await this.custser.showUser({ bus_id: this.AddVoiceForm.value['bus_id'], like: $event })
      // console.log("customer", this.custname)
    }

  }


  bulkvalid() {
    if (this.AddVoiceForm.value['create_type'] == 1) {
      this.AddVoiceForm.get('voice_num').clearValidators();
      this.AddVoiceForm.get('voice_num').updateValueAndValidity();

      this.AddVoiceForm.get('status').clearValidators();
      this.AddVoiceForm.get('status').updateValueAndValidity();
    }
  }


  async voicesubmit() {
    this.submit = true;
    let val = this.AddVoiceForm.value;
    let bulkvald: boolean = false;
    for (var i = 0; i < this.bulk.length; i++) {
      if (!this.bulk[i].hasOwnProperty('Voice Number')) {
        this.toastalert('Please fill the Voice Number in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let vnum = this.bulk[i]['Voice Number']
        this.bulk[i].voice_num = vnum;
      }
      if (!this.bulk[i].hasOwnProperty('Status')) {
        this.toastalert('Please fill the Status in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let status = this.bulk[i]['Status'] == 'Assigned' ? 1 : 0;
        this.bulk[i].status = status;
      }
      this.bulk[i].bus_id = this.AddVoiceForm.value['bus_id'];
    }
    this.s = 0; this.f = 0;
    let s = 0;
    this.failure = [];
    if (this.AddVoiceForm.invalid) {
      this.submit = true;
      return;
    }
    let method = 'addVoice'
    if (this.item) {
      method = 'editVoice'
    }
    if (this.item) {
      this.AddVoiceForm.value['id'] = this.item['vid'];
      let voicedata = [this.AddVoiceForm.value];
      let result = await this.custser[method]({ voice: voicedata })
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
    if (this.AddVoiceForm.value['create_type'] == 0 && !this.item) {
      let voicedata = [this.AddVoiceForm.value];
      let result = await this.custser[method]({ voice: voicedata })
      if (result[0]['error_msg'] == 0) {
        await this.closeModal();
        await this.result_pop(result)
      } else {
        await this.result_pop(result)
      }
    }
    if (this.AddVoiceForm.value['create_type'] == 1) {
      let result = await this.custser[method]({ voice: this.bulk })
      if (result[0]['error_msg'] == 0) {
        await this.closeModal();
        await this.result_pop(result)
      } else {
        await this.result_pop(result)
      }
    }

  }

  result_pop(item) {
    const activeModal = this.activemodal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.result.then((data) => {

    });
  }

  toastalert(msg, status = 0) {
    const toast: Toast = {
      type: status == 1 ? 'success' : 'warning',
      title: status == 1 ? 'Success' : 'Failure',
      body: msg,
      timeout: 3000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
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
        // console.log(JSXLSX.utils.sheet_to_json(worksheet,{raw:true}));
        callback(JSXLSX.utils.sheet_to_json(worksheet, { raw: true }))
      }
      fileReader.readAsArrayBuffer(file);
    } else {
      callback([])
    }
  }

  changeListener(file) {
    this.file = file;
    this.filereader(this.file, result => {
      this.bulk = result;
    });
  }


  createForm() {
    this.AddVoiceForm = new FormGroup({
      bus_id: new FormControl(this.item ? this.item.isp_id : '', Validators.required),
      create_type: new FormControl('', Validators.required),
      voice_num: new FormControl(this.item ? this.item.vnumber : '', Validators.required),
      password: new FormControl(''),
      slot_num: new FormControl(this.item ? this.item['slotnumber'] : ''),
      status: new FormControl(this.item ? this.item.vflag : '0'),
    });
  }
}
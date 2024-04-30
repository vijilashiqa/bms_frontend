import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';
import { AddSuccessComponent } from './../success/add-success.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as FileSaver from 'file-saver';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { RoleService, ResellerService, AdminuserService, GroupService, BusinessService, SelectService } from '../../_service/indexService';

@Component({
  selector: 'add-smsgateway',
  templateUrl: './add-smsgateway.component.html',

})


export class AddsmsgatewayComponent implements OnInit {
  submit: boolean = false; AddSmsgatewayForm; item; data; grup; busname; pro;
  editdatas; id; groups; arrayBuffer: any; file: any[]; bulk = []; s = 0; f = 0; failure: any[];
  bulkGateway = []; reseldata;
  constructor(

    private alert: ToasterService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private adminuser: AdminuserService,
    public role: RoleService,
    public activeModal: NgbModal,
    private busser: BusinessService,
    private reselser: ResellerService,

  ) { }


  async business() {
    this.busname = await this.busser.showBusName({})
    // console.log(this.busname)
  }
  async resellername() {
    this.reseldata = await this.reselser.showResellerName({ bus_id: this.AddSmsgatewayForm.value['bus_id'], sms_role: this.AddSmsgatewayForm.value['gateway_type'] });
    // console.log(res)
  }

  changeListener(file) {
    this.file = file;
    this.filereader(this.file, result => {
      this.bulk = result;
      // console.log("inside file", this.bulk)
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
        // console.log(JSXLSX.utils.sheet_to_json(worksheet,{raw:true}));
        callback(JSXLSX.utils.sheet_to_json(worksheet, { raw: true }))
      }
      fileReader.readAsArrayBuffer(file);
    } else {
      callback([])
    }
  }

  async addSmsgateway() {
    // console.log(this.AddSmsgatewayForm.value);
    if (this.AddSmsgatewayForm.value['gateway_type'] == 1) {

      this.AddSmsgatewayForm.get('res_name').clearValidators();
      this.AddSmsgatewayForm.get('res_name').updateValueAndValidity();
    }
    if (this.AddSmsgatewayForm.invalid && !this.id) {
      // console.log('Inside');
      this.submit = true;
      return;
    }
    //  const md5 = new Md5;
    // this.AddSmsgatewayForm.value['password_en'] = md5.appendStr(this.AddSmsgatewayForm.value['Password']).end();

    let smsdata = [this.AddSmsgatewayForm.value];
    let method = 'addSMSGateway';
    if (this.id) {
      method = 'editSMSGateway'
      this.AddSmsgatewayForm.value['id'] = this.id;
    }
    let result = await this.adminuser[method]({ bulkGateway: smsdata })
    // console.log('Add SMS Result', result)
    if (result) {
      this.reseult_pop(result);
    }

  }

  async edit() {
    // console.log('Inside edit func')
    let result = await this.adminuser.getSMSGateway({ id: this.id });
    if (result) {
      this.editdatas = result;
      // console.log("res", result)
    }
    this.createForm();
  }

  async ngOnInit() {
    this.createForm();
    this.aRoute.queryParams.subscribe(param => {
      // console.log('Param', param);
      this.id = param.id || null;
    })
    if (this.id) {
      await this.edit();
      this.AddSmsgatewayForm.get('Password').clearValidators();
      this.AddSmsgatewayForm.get('Password').updateValueAndValidity();

    }
    await this.main();
  }

  async main() {
    await this.business();
    await this.resellername();
    if (this.role.getroleid() <= 777) {
      this.AddSmsgatewayForm.controls['bus_id'].setValue(this.role.getispid())
      this.AddSmsgatewayForm.get('bus_id').clearValidators();
      this.AddSmsgatewayForm.get('bus_id').updateValueAndValidity();

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

  reseult_pop(item) {
    Object.assign(item, { sms: "1" });
    const activeModal = this.activeModal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.result.then((data) => {

    });
  }

  createForm() {
    this.AddSmsgatewayForm = new FormGroup({
      bus_id: new FormControl(this.editdatas ? this.editdatas['isp_id'] : '', Validators.required),
      website: new FormControl(this.editdatas ? this.editdatas['website'] : '', Validators.required),
      gateway_type: new FormControl(this.editdatas ? this.editdatas['gateway_type'] : '', Validators.required),
      res_name: new FormControl(this.editdatas ? this.editdatas['manid'] : '', Validators.required),
      UserName: new FormControl(this.editdatas ? this.editdatas['loginid'] : '', Validators.required),
      Password: new FormControl('', Validators.required),
      sender_id: new FormControl(this.editdatas ? this.editdatas['sender_id'] : '', Validators.required),
      gateway_name: new FormControl(this.editdatas ? this.editdatas['gwname'] : '', Validators.required),
      gateway_by: new FormControl(this.editdatas ? this.editdatas['gwby'] : '', Validators.required),

    });
  }
}
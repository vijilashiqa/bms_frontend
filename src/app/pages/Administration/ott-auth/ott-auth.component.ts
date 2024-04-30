import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';
import { AddSuccessComponent } from '../success/add-success.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as FileSaver from 'file-saver';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { RoleService, ResellerService, AdminuserService, GroupService, BusinessService, SelectService } from '../../_service/indexService';

@Component({
  selector: 'ott-auth',
  templateUrl: './ott-auth.component.html',

})

export class OTTAuthComponent implements OnInit {
  submit: boolean = false; OTTAuthForm; item; data; grup; busname; pro; resell
  editdatas; id; groups;ottdata;
  isReadonly = false;
  arrayBuffer: any; file: any[]; bulk = []; s = 0; f = 0; failure: any[];
  bulkOTTdata = []; bulkdata = []; dist; states; resel; deptdata;
  constructor(

    private alert: ToasterService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private adminser: AdminuserService,
    public role: RoleService,
    public activeModal: NgbModal,
    private groupser: GroupService,
    private busser: BusinessService,
    private reselser: ResellerService,

  ) { }

  async business() {
    this.busname = await this.busser.showBusName({})
    // console.log(this.busname)
  }

  async GroupName() {
    this.grup = await this.groupser.showGroupName({ bus_id: this.OTTAuthForm.value['bus_id'] });
  }

  async ottplatform($event=''){
      this.ottdata = await this.adminser.showOTTPlatforms({ like:$event });
  }


  infovalid() {
    if (this.OTTAuthForm.value['create_type'] == '1') {
      this.OTTAuthForm.get('ott_name').clearValidators();
      this.OTTAuthForm.get('ott_name').updateValueAndValidity();

      this.OTTAuthForm.get('username').clearValidators();
      this.OTTAuthForm.get('username').updateValueAndValidity();

      this.OTTAuthForm.get('password').clearValidators();
      this.OTTAuthForm.get('password').updateValueAndValidity();

      this.OTTAuthForm.get('CPassword').clearValidators();
      this.OTTAuthForm.get('CPassword').updateValueAndValidity();

      this.OTTAuthForm.get('status').clearValidators();
      this.OTTAuthForm.get('status').updateValueAndValidity();

    }
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

  async addAdminuser() {
    this.submit = true;
    let bulkvald: boolean = false;
    for (var i = 0; i < this.bulk.length; i++) {
      if (!this.bulk[i].hasOwnProperty('OTT Name')) {
        this.toastalert('Please fill the OTT Name in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let ottname = this.bulk[i]['OTT Name']
        this.bulk[i].ott_name = ottname;
      }
      if (!this.bulk[i].hasOwnProperty('UserName')) {
        this.toastalert('Please fill the UserName in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let uname = this.bulk[i]['UserName']
        this.bulk[i].username = uname;
      }

      if (!this.bulk[i].hasOwnProperty('Password')) {
        this.toastalert('Please fill the Password in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let pass = this.bulk[i]['Password'];
        this.bulk[i].password = pass;
      }
      if (!this.bulk[i].hasOwnProperty('Status')) {
        this.toastalert('Please fill the Status in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let status = this.bulk[i]['Status'] == 'Not Assigned' ? 0 : this.bulk[i]['Status'] == 'Assigned' ? 1:
        this.bulk[i]['Status'] == 'Not Used' ? 2 : 3;
        this.bulk[i].status = status;
      }
      this.bulk[i].bus_id = this.OTTAuthForm.value['bus_id']
      this.bulk[i].groupid = this.OTTAuthForm.value['groupid']
    }
    this.s = 0; this.f = 0;
    let s = 0;
    this.failure = [];
    if (this.OTTAuthForm.invalid && !this.id) {
      this.submit = true;
      return;
    }
    if (this.OTTAuthForm.value['create_type'] == '0' || this.id) {
      
      let ottdata = [this.OTTAuthForm.value];
      let method = 'addOTTService';
      if (this.id) {
        method = 'editOTTService'
        this.OTTAuthForm.value['id'] = this.id;
      }
      let result = await this.adminser[method]({ bulkOTTdata: ottdata })
      if (result) {
        this.reseult_pop(result);
      }

    }
    if (this.OTTAuthForm.value['create_type'] == '1') {
      let method = 'addOTTService';
      let result = await this.adminser[method]({ bulkOTTdata: this.bulk });
      if (result) {
        this.reseult_pop(result);
      }
    }
  }

  async edit() {
    let result = await this.adminser.getOTTService({ id: this.id });
    if (result) {
      this.editdatas = result;
      // console.log("res", result)
    }
    this.createForm();
    await this.GroupName();

  }

  async ngOnInit() {
    this.createForm();
    this.aRoute.queryParams.subscribe(param => {
      this.id = param.id || null;
    })
    if (this.id) {
      await this.edit();
      this.isReadonly = true;
      this.OTTAuthForm.get('password').clearValidators();
      this.OTTAuthForm.get('password').updateValueAndValidity();

      this.OTTAuthForm.get('CPassword').clearValidators();
      this.OTTAuthForm.get('CPassword').updateValueAndValidity();
    }
    await this.main();
  }

  async main() {
    await this.business();
    await this.ottplatform();
    if (this.role.getroleid() <= 777) {
      this.OTTAuthForm.controls['bus_id'].setValue(this.role.getispid())
      await this.GroupName();
      this.OTTAuthForm.get('bus_id').clearValidators();
      this.OTTAuthForm.get('bus_id').updateValueAndValidity();

      this.OTTAuthForm.get('groupid').clearValidators();
      this.OTTAuthForm.get('groupid').updateValueAndValidity();

    }
    if(this.role.getroleid() < 775){
      this.OTTAuthForm.get('create_type').setValue('0');
      this.OTTAuthForm.get('groupid').setValue(this.role.getgrupid());
    }
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

  reseult_pop(item) {
    Object.assign(item, { ott: "1" });
    const activeModal = this.activeModal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.result.then((data) => {

    });
  }

  createForm() {
    this.OTTAuthForm = new FormGroup({
      create_type: new FormControl('', Validators.required),
      bus_id: new FormControl(this.editdatas ? this.editdatas['isp_id'] : '', Validators.required),
      groupid: new FormControl(this.editdatas ? this.editdatas['group_id'] : ''),
      ott_name: new FormControl(this.editdatas ? this.editdatas['ott_platform']:'',Validators.required),
      username: new FormControl(this.editdatas ? this.editdatas['ott_username']:'', Validators.required),
      password: new FormControl(this.editdatas ? this.editdatas['ott_password']:'', Validators.required),
      CPassword: new FormControl('', Validators.required),
      status: new FormControl(this.editdatas ? this.editdatas['ott_flag'] :0, Validators.required),
    });
  }
}


import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AddSuccessComponent } from './../success/add-success.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as FileSaver from 'file-saver';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { GroupService, RoleService, BusinessService, SelectService } from '../../_service/indexService';

@Component({
  selector: 'add-group',
  templateUrl: './add-group.component.html'
})

export class AddGroupComponent implements OnInit {
  submit: boolean = false; AddGroupForm; groups; id; editgroups; busname; bulkgroup = [];
  bulk = []; failure: any[]; arrayBuffer: any; file: any[]; s = 0; f = 0; config;
  constructor(
    private alert: ToasterService,
    private group: GroupService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private select: SelectService,
    private busser: BusinessService,
    public activeModal: NgbModal,
    public role: RoleService,

  ) {  }

  async business() {
    let result = await this.busser.showBusName({})
    this.busname = result;
    // console.log(this.busname)
  }

  groupvalid() {
    if (this.AddGroupForm.value['create_type'] == '1') {
      // this.AddGroupForm.get('bus_id').clearValidators();
      // this.AddGroupForm.get('bus_id').updateValueAndValidity();

      this.AddGroupForm.get('groupid').clearValidators();
      this.AddGroupForm.get('groupid').updateValueAndValidity();
    }
  }

  async addGroup() {
    this.submit = true;
    // let val = this.AddGroupForm.value;
    this.filereader(this.file, async res => {
      this.bulk = res;
      let bulkvald: boolean = false;
      for (var i = 0; i < this.bulk.length; i++) {
        if (!this.bulk[i].hasOwnProperty('Group Name')) {
          this.toastalert('Please fill the Group Name in Excel Sheet');
          bulkvald = true;
          break;
        }
        else {
          let groupType = this.bulk[i]['Group Name']
          this.bulk[i].groupid = groupType;
        }
        this.bulk[i].hasOwnProperty('Description')
        let descrp = this.bulk[i]['Description']
        this.bulk[i].descp = descrp;

        this.bulk[i].bus_id = this.AddGroupForm.value['bus_id']

        // let useid = this.role.getuserid()
        // this.bulk[i].user_id = useid
      }
      this.s = 0; this.f = 0;
      let s = 0;
      this.failure = [];

      // console.log(this.AddGroupForm.value)
      if (this.AddGroupForm.invalid) {
        this.submit = true;
        return;
      }
      if (this.AddGroupForm.value['create_type'] == '0') {
        // console.log('indiviiiii')
        let bulkdata = [this.AddGroupForm.value];
        // console.log(this.AddGroupForm.value)
        let res = await this.group.addgroup({ bulkGroup: bulkdata })
        // console.log(res)
        if (res) {
          this.result_pop(res);
        }
      }
      if (this.AddGroupForm.value['create_type'] == '1') {
        // console.log('bulkkk')
        // console.log(this.bulk)
        let result = await this.group.addgroup({ bulkGroup: this.bulk })
        // console.log(result)
        if (result) {
          this.result_pop(result);
        }
      }
    })
    if (this.id) {
      let method = 'editgroup'
      this.AddGroupForm.value['id'] = this.id;
      let result = await this.group[method](this.AddGroupForm.value)
      // console.log(result)
      const toast: Toast = {
        type: result['status'] == 1 ? 'success' : 'warning',
        title: result['status'] == 1 ? 'Success' : 'Failure',
        body: result['msg'],
        timeout: 3000,
        showCloseButton: true,
        bodyOutputType: BodyOutputType.TrustedHtml,
      };
      this.alert.popAsync(toast);
      if (result['status'] == 1) {
        this.router.navigate(['/pages/group/list-group'], { skipLocationChange: true })
      }
    }
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

  async edit() {
    let result = await this.group.getgroupedit({ id: this.id })
    if (result) {
      this.editgroups = result;
      // console.log(result)
    }
    this.createForm();
  }

  async ngOnInit() {
    this.createForm();
    if(this.role.getroleid()<775){
      this.AddGroupForm.get('create_type').setValue('0')
    }
    this.aRoute.queryParams.subscribe(param => {
      this.id = param.id || null
    })
    if (this.id) {
      await this.edit();
    }
    await this.main()
  }

  async main() {
    await this.business();
    if (this.role.getroleid() <= 777) {
      this.AddGroupForm.get('bus_id').setValue(this.role.getispid());
      this.AddGroupForm.get('bus_id').clearValidators();
      this.AddGroupForm.get('bus_id').updateValueAndValidity();
    }
  }

  createForm() {
    this.AddGroupForm = new FormGroup({
      create_type: new FormControl('', Validators.required),
      bus_id: new FormControl(this.editgroups ? this.editgroups['business_id'] : '', Validators.required),
      groupid: new FormControl(this.editgroups ? this.editgroups['groupname'] : '', Validators.required),
      descp: new FormControl(this.editgroups ? this.editgroups['descr'] : ''),
    });
  }
}
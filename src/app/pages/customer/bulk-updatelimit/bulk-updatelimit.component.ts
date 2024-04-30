import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AddSuccessComponent } from '../success/add-success.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as FileSaver from 'file-saver';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { RoleService, CustService } from '../../_service/indexService';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';

@Component({
  selector: 'bulk-updatelimit',
  templateUrl: './bulk-updatelimit.component.html'
})

export class BulkUpdateLimitComponent implements OnInit {
  submit: boolean = false; BulkLimitForm; groups; id; editgroups; busname; bulkgroup = [];
  bulk = []; failure: any[]; arrayBuffer: any; file: any[]; s = 0; f = 0; config;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(
    private alert: ToasterService,
    private router: Router,
    private custser: CustService,
    private aRoute: ActivatedRoute,
    public activeModal: NgbModal,
    public role: RoleService,

  ) { }


  async ngOnInit() {
    this.createForm();
  }

  async updatLimit() {
    this.submit = true;
    this.filereader(this.file, async res => {
      this.bulk = res;
      let bulkvald: boolean = false;
      for (var i = 0; i < this.bulk.length; i++) {
        this.bulk[i].hasOwnProperty('Profile ID')
        let userid = this.bulk[i]['Profile ID']
        this.bulk[i].uid = userid;

        this.bulk[i].hasOwnProperty('Download Limit')
        let dlimit = this.bulk[i]['Download Limit']
        this.bulk[i].dl_limit = dlimit;

        this.bulk[i].hasOwnProperty('Download Size')
        let dlsize = this.bulk[i]['Download Size']
        this.bulk[i].dl_size = dlsize;

        this.bulk[i].hasOwnProperty('Upload Limit')
        let ulimit = this.bulk[i]['Upload Limit']
        this.bulk[i].ul_limit = ulimit;

        this.bulk[i].hasOwnProperty('Upload Size')
        let ulsize = this.bulk[i]['Upload Size']
        this.bulk[i].ul_size = ulsize;

        this.bulk[i].hasOwnProperty('Total Limit')
        let totlimit = this.bulk[i]['Total Limit']
        this.bulk[i].tot_limit = totlimit;

        this.bulk[i].hasOwnProperty('Total Size')
        let totsize = this.bulk[i]['Total Size']
        this.bulk[i].tot_size = totsize;

        this.bulk[i].type = 2;

      }
      this.s = 0; this.f = 0;
      let s = 0;
      this.failure = [];
      this.loading = true;
      let result = await this.custser.addlimit({ limit: this.bulk })
      // console.log(result)
      if (result) {
        this.loading = false;
        this.result_pop(result,true);
      }
    })
  }

  result_pop(item,flag) {
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



  createForm() {
    // this.BulkLimitForm = new FormGroup({
    //   group : new FormControl('')
    // })
  }
}
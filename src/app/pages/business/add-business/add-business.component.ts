import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddSuccessComponent } from './../success/add-success.component';
import { Md5 } from 'ts-md5/dist/md5';
import { RoleService, BusinessService, SelectService, AdminuserService, sumValidator } from '../../_service/indexService';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.scss']
})

export class AddBusinessComponent implements OnInit {
  submit: boolean = false; AddBusForm; id; groups; datas; loc; ottdata;
  bulk = []; failure: any[]; arrayBuffer: any; file: any[]; s = 0; f = 0;
  dist; states; sumit; config; servtype; ott_name = [];
  selectedfile: File = null; fileupload; imageURL: any; files;
  constructor(
    private router: Router,
    private alert: ToasterService,
    private ser: BusinessService,
    private select: SelectService,
    public role: RoleService,
    public activeModal: NgbModal,
    private sanitizer: DomSanitizer,
    private adminser: AdminuserService,
    private fb: FormBuilder

  ) { }

  editvalid() {
    if (this.id) {
      this.AddBusForm.get('user_name').clearValidators();
      this.AddBusForm.get('user_name').updateValueAndValidity();

      this.AddBusForm.get('passwrd').clearValidators();
      this.AddBusForm.get('passwrd').updateValueAndValidity();

      this.AddBusForm.get('conpass').clearValidators();
      this.AddBusForm.get('conpass').updateValueAndValidity();

      if (this.AddBusForm.value['passwrd'] != '') {
        this.AddBusForm.get('passwrd').setValidators();
        this.AddBusForm.get('conpass').setValidators();
      }
    }
  }

  gstvalid() {
    this.AddBusForm.value['gst_type'] == '2' ? this.AddBusForm.get('igst').clearValidators() : this.AddBusForm.get('igst').setValidators([Validators.required]);
    this.AddBusForm.get('igst').updateValueAndValidity();

    this.AddBusForm.value['gst_type'] == '1' ? this.AddBusForm.get('cgst').clearValidators() : this.AddBusForm.get('cgst').setValidators([Validators.required]);
    this.AddBusForm.get('cgst').updateValueAndValidity();

    this.AddBusForm.value['gst_type'] == '1' ? this.AddBusForm.get('sgst').clearValidators() : this.AddBusForm.get('sgst').setValidators([Validators.required]);
    this.AddBusForm.get('sgst').updateValueAndValidity();
  }

  buckvalid() {
    this.AddBusForm.value['hot_bucket'] == '2' ? this.AddBusForm.get('hot_buckdays').clearValidators() : this.AddBusForm.get('hot_buckdays').setValidators([Validators.required]);
    this.AddBusForm.get('hot_buckdays').updateValueAndValidity();

  }

  async cityshow($event = '') {
    this.dist = await this.select.showDistrict({ state_id: this.AddBusForm.value['state'], like: $event, index: 0, limit: 15 });
  }

  async stateshow($event = '') {
    this.states = await this.select.showState({ like: $event });
  }

  async servicetype() {
    this.servtype = await this.ser.showServiceType({});
    // console.log("servtype",this.servtype);
  }

  async ottplatform($event = '') {
    if (this.AddBusForm.value['serv_type'] == 3 || this.AddBusForm.value['serv_type'] == 5 || this.AddBusForm.value['serv_type'] == 7 || this.AddBusForm.value['serv_type'] == 8) {
      this.ottdata = await this.adminser.showOTTPlatforms({ like: $event });
    }
  }

  upload(files: FileList) {
    this.selectedfile = files.item(0);
    if (this.selectedfile) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageURL = this.sanitizer.bypassSecurityTrustUrl(event.target.result)
      }
      reader.readAsDataURL(this.selectedfile);
    } else {
      this.imageURL = '';
    }
  }

  ottvalid() {
    if (this.AddBusForm.value['disney_flag'] == true) {
      this.AddBusForm.get('disney_igst').setValidators([Validators.required]);
      this.AddBusForm.get('disney_cgst').setValidators([Validators.required]);
      this.AddBusForm.get('disney_sgst').setValidators([Validators.required]);
    } else {
      this.AddBusForm.get('disney_igst').clearValidators();
      this.AddBusForm.get('disney_igst').updateValueAndValidity();
      this.AddBusForm.get('disney_cgst').clearValidators();
      this.AddBusForm.get('disney_cgst').updateValueAndValidity();
      this.AddBusForm.get('disney_sgst').clearValidators();
      this.AddBusForm.get('disney_sgst').updateValueAndValidity();
    }
    if (this.AddBusForm.vlaue['amazon_flag'] == true) {
      this.AddBusForm.get('amazon_igst').setValidators([Validators.required]);
      this.AddBusForm.get('amazon_cgst').setValidators([Validators.required]);
      this.AddBusForm.get('amazon_sgst').setValidators([Validators.required]);
    } else {
      this.AddBusForm.get('amazon_igst').clearValidators();
      this.AddBusForm.get('amazon_igst').updateValueAndValidity();
      this.AddBusForm.get('amazon_cgst').clearValidators();
      this.AddBusForm.get('amazon_cgst').updateValueAndValidity();
      this.AddBusForm.get('amazon_sgst').clearValidators();
      this.AddBusForm.get('amazon_sgst').updateValueAndValidity();
    }
    if (this.AddBusForm.value['netflix_flag'] == true) {
      this.AddBusForm.get('netflix_igst').setValidators([Validators.required]);
      this.AddBusForm.get('netflix_cgst').setValidators([Validators.required]);
      this.AddBusForm.get('netflix_sgst').setValidators([Validators.required]);
    } else {
      this.AddBusForm.get('netflix_igst').clearValidators();
      this.AddBusForm.get('netflix_igst').updateValueAndValidity();
      this.AddBusForm.get('netflix_cgst').clearValidators();
      this.AddBusForm.get('netflix_cgst').updateValueAndValidity();
      this.AddBusForm.get('netflix_sgst').clearValidators();
      this.AddBusForm.get('netflix_sgst').updateValueAndValidity();
    }
    if (this.AddBusForm.value['sun_flag'] == true) {
      this.AddBusForm.get('sun_igst').setValidators([Validators.required]);
      this.AddBusForm.get('sun_cgst').setValidators([Validators.required]);
      this.AddBusForm.get('sun_sgst').setValidators([Validators.required]);
    } else {
      this.AddBusForm.get('sun_igst').clearValidators();
      this.AddBusForm.get('sun_igst').updateValueAndValidity();
      this.AddBusForm.get('sun_cgst').clearValidators();
      this.AddBusForm.get('sun_cgst').updateValueAndValidity();
      this.AddBusForm.get('sun_sgst').clearValidators();
      this.AddBusForm.get('sun_sgst').updateValueAndValidity();
    }
    if (this.AddBusForm.value['zee_flag'] == true) {
      this.AddBusForm.get('zee_igst').setValidators([Validators.required]);
      this.AddBusForm.get('zee_cgst').setValidators([Validators.required]);
      this.AddBusForm.get('zee_sgst').setValidators([Validators.required]);
    } else {
      this.AddBusForm.get('zee_igst').clearValidators();
      this.AddBusForm.get('zee_igst').updateValueAndValidity();
      this.AddBusForm.get('zee_cgst').clearValidators();
      this.AddBusForm.get('zee_cgst').updateValueAndValidity();
      this.AddBusForm.get('zee_sgst').clearValidators();
      this.AddBusForm.get('zee_sgst').updateValueAndValidity();
    }
    if (this.AddBusForm.value['raj_flag'] == true) {
      this.AddBusForm.get('raj_igst').setValidators([Validators.required]);
      this.AddBusForm.get('raj_cgst').setValidators([Validators.required]);
      this.AddBusForm.get('raj_sgst').setValidators([Validators.required]);
    } else {
      this.AddBusForm.get('raj_igst').clearValidators();
      this.AddBusForm.get('raj_igst').updateValueAndValidity();
      this.AddBusForm.get('raj_cgst').clearValidators();
      this.AddBusForm.get('raj_cgst').updateValueAndValidity();
      this.AddBusForm.get('raj_sgst').clearValidators();
      this.AddBusForm.get('raj_sgst').updateValueAndValidity();
    }
    if (this.AddBusForm.value['sony_flag'] == true) {
      this.AddBusForm.get('sony_igst').setValidators([Validators.required]);
      this.AddBusForm.get('sony_cgst').setValidators([Validators.required]);
      this.AddBusForm.get('sony_sgst').setValidators([Validators.required]);
    } else {
      this.AddBusForm.get('sony_igst').clearValidators();
      this.AddBusForm.get('sony_igst').updateValueAndValidity();
      this.AddBusForm.get('sony_cgst').clearValidators();
      this.AddBusForm.get('sony_cgst').updateValueAndValidity();
      this.AddBusForm.get('sony_sgst').clearValidators();
      this.AddBusForm.get('sony_sgst').updateValueAndValidity();
    }
    if (this.AddBusForm.value['hunga_flag'] == true) {
      this.AddBusForm.get('hunga_igst').setValidators([Validators.required]);
      this.AddBusForm.get('hunga_cgst').setValidators([Validators.required]);
      this.AddBusForm.get('hunga_sgst').setValidators([Validators.required]);
    } else {
      this.AddBusForm.get('hunga_igst').clearValidators();
      this.AddBusForm.get('hunga_igst').updateValueAndValidity();
      this.AddBusForm.get('hunga_cgst').clearValidators();
      this.AddBusForm.get('hunga_cgst').updateValueAndValidity();
      this.AddBusForm.get('hunga_sgst').clearValidators();
      this.AddBusForm.get('hunga_sgst').updateValueAndValidity();
    }

  }

  async addBusiness() {
    console.log(this.AddBusForm.value)
    if (this.AddBusForm.invalid || this.AddBusForm.value['passwrd'] != this.AddBusForm.value['conpass']) {
      this.submit = true;
      return;
    }
    const md5 = new Md5;
    this.AddBusForm.value['password_en'] = md5.appendStr(this.AddBusForm.value['passwrd']).end();
    this.AddBusForm.value['disney_flag'] == true ? this.ott_name.push(1) : '';
    this.AddBusForm.value['amazon_flag'] == true ? this.ott_name.push(2) : '';
    this.AddBusForm.value['netflix_flag'] == true ? this.ott_name.push(3) : '';
    this.AddBusForm.value['sun_flag'] == true ? this.ott_name.push(4) : '';
    this.AddBusForm.value['zee_flag'] == true ? this.ott_name.push(5) : '';
    this.AddBusForm.value['raj_flag'] == true ? this.ott_name.push(6) : '';
    this.AddBusForm.value['sony_flag'] == true ? this.ott_name.push(7) : '';
    this.AddBusForm.value['hunga_flag'] == true ? this.ott_name.push(8) : '';
    this.AddBusForm.value['ott_name'] = this.ott_name;
    let result = await this.ser.addbusiness(this.AddBusForm.value)
    // console.log('Result', result);
    // console.log('file', this.selectedfile);

    if (result[0]['status'] == 1) {
      const file = new FormData();
      let id = result[0]['id'], filename = 'logo',
        name = id + '-' + filename;
      file.append('file', this.selectedfile, name)
      file.append('id', id)
      let logoresult = await this.ser.uploadLogo(file);
      // console.log(logoresult);
      const toast: Toast = {
        type: logoresult[0]['error_msg'] == 0 ? 'success' : 'warning',
        title: logoresult[0]['error_msg'] == 0 ? 'Success' : 'Failure',
        body: logoresult[0]['msg'],
        timeout: 3000,
        showCloseButton: true,
        bodyOutputType: BodyOutputType.TrustedHtml,
      };
      this.alert.popAsync(toast);
      if (logoresult[0]['error_msg'] == 0) {
        this.router.navigate(['/pages/business/list-business'])
      }

    } else {
      const toast: Toast = {
        type: result[0]['error_msg'] == 0 ? 'success' : 'warning',
        title: result[0]['error_msg'] == 0 ? 'Success' : 'Failure',
        body: result[0]['msg'],
        timeout: 3000,
        showCloseButton: true,
        bodyOutputType: BodyOutputType.TrustedHtml,
      };
      this.alert.popAsync(toast);
    }
  }

  async ngOnInit() {
    this.createForm();
    await this.stateshow();
    await this.servicetype();

  }

  createForm() {
    this.AddBusForm = this.fb.group({
      bus_id: new FormControl('', Validators.required),
      user_name: new FormControl('', [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),//[Validators.required,Validators.pattern('^[0-9 A-Z a-z]')]
      gender: new FormControl('', Validators.required),
      fname: new FormControl('', Validators.required),
      laname: new FormControl('', Validators.required),
      serv_type: new FormControl('', Validators.required),
      // ott_name : new FormControl(''),
      passwrd: new FormControl('', Validators.required),
      conpass: new FormControl('', Validators.required),
      isp_logo: new FormControl(''),
      subs_limit: new FormControl(0, Validators.required),
      bus_addr: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern("[0-9 A-Z a-z ,.`!@#$%^&*]*[@]{1}[a-z A-Z]*[.]{1}[a-z A-Z]{2,3}([.]{1}[a-z A-Z]{2,3})?")]),
      mob_num: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      phone_num: new FormControl('', [Validators.pattern('^[0-9]{11}$')]),
      custcare_num: new FormControl(''),
      // loc_name: new FormControl(['location'] : ''),
      pan_no: new FormControl(''),
      hsn_no: new FormControl(''),
      srvtax_no: new FormControl(''),
      gst_no: new FormControl('', Validators.required),
      igst: new FormControl(''),
      cgst: new FormControl(''),
      sgst: new FormControl(''),
      vo_igst: new FormControl(''),
      vo_cgst: new FormControl(''),
      vo_sgst: new FormControl(''),
      ott_igst: new FormControl(''),
      ott_cgst: new FormControl(''),
      ott_sgst: new FormControl(''),
      add_igst: new FormControl(''),
      add_cgst: new FormControl(''),
      add_sgst: new FormControl(''),
      gst_id: new FormControl('', [Validators.required, Validators.pattern('^[A-Z a-z]{6}$')]),

      tisp_share: new FormControl(''),
      tresel_share: new FormControl(''),
      tsub_isp_share: new FormControl(''),
      tsub_dist_share: new FormControl(''),
      //disney
      disney_flag: new FormControl(''),
      disney_igst: new FormControl(''),
      disney_cgst: new FormControl(''),
      disney_sgst: new FormControl(''),
      //amazon
      amazon_flag: new FormControl(''),
      amazon_igst: new FormControl(''),
      amazon_cgst: new FormControl(''),
      amazon_sgst: new FormControl(''),
      //netflix
      netflix_flag: new FormControl(''),
      netflix_igst: new FormControl(''),
      netflix_cgst: new FormControl(''),
      netflix_sgst: new FormControl(''),
      //sun
      sun_flag: new FormControl(''),
      sun_igst: new FormControl(''),
      sun_cgst: new FormControl(''),
      sun_sgst: new FormControl(''),
      //zee
      zee_flag: new FormControl(''),
      zee_igst: new FormControl(''),
      zee_cgst: new FormControl(''),
      zee_sgst: new FormControl(''),
      //raj
      raj_flag: new FormControl(''),
      raj_igst: new FormControl(''),
      raj_cgst: new FormControl(''),
      raj_sgst: new FormControl(''),
      //sony
      sony_flag: new FormControl(''),
      sony_igst: new FormControl(''),
      sony_cgst: new FormControl(''),
      sony_sgst: new FormControl(''),
      //hunga
      hunga_flag: new FormControl(''),
      hunga_igst: new FormControl(''),
      hunga_cgst: new FormControl(''),
      hunga_sgst: new FormControl(''),
      state: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      hot_bucket: new FormControl('', Validators.required),
      hot_buckdays: new FormControl(''),
      status: new FormControl(true, Validators.required),
      exp_alert: new FormControl(''),
      dl_alert: new FormControl(''),
      ul_alert: new FormControl(''),
      tot_alert: new FormControl(''),
      ontime_alert: new FormControl(''),
    }, {
      validator: sumValidator(100, 'tisp_share', 'tresel_share', 'tsub_isp_share', 'tsub_dist_share')

    });
  }
}
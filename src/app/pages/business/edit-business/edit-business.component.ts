import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleService, BusinessService, SelectService, AdminuserService, sumValidator } from '../../_service/indexService';

@Component({
  selector: 'edit-business',
  templateUrl: './edit-business.component.html',

})

export class EditBusinessComponent implements OnInit {
  submit: boolean = false; EditBusForm; id; groups; datas; editdatas; loc; ottdata; ott;
  bulk = []; failure: any[]; arrayBuffer: any; file: any[]; s = 0; f = 0; ott_name = [];
  dist; states; sumit; config; servtype;
  constructor(
    private router: Router,
    private alert: ToasterService,
    private ser: BusinessService,
    private select: SelectService,
    public role: RoleService,
    private adminser: AdminuserService,
    public activeModal: NgbModal,
    private fb: FormBuilder

  ) { this.id = JSON.parse(localStorage.getItem('array')); }

  gstvalid() {
    this.EditBusForm.value['gst_type'] == '2' ? this.EditBusForm.get('igst').clearValidators() : this.EditBusForm.get('igst').setValidators([Validators.required]);
    this.EditBusForm.get('igst').updateValueAndValidity();

    this.EditBusForm.value['gst_type'] == '1' ? this.EditBusForm.get('cgst').clearValidators() : this.EditBusForm.get('cgst').setValidators([Validators.required]);
    this.EditBusForm.get('cgst').updateValueAndValidity();

    this.EditBusForm.value['gst_type'] == '1' ? this.EditBusForm.get('sgst').clearValidators() : this.EditBusForm.get('sgst').setValidators([Validators.required]);
    this.EditBusForm.get('sgst').updateValueAndValidity();
  }

  buckvalid() {
    this.EditBusForm.value['hot_bucket'] == '2' ? this.EditBusForm.get('hot_buckdays').clearValidators() : this.EditBusForm.get('hot_buckdays').setValidators([Validators.required]);
    this.EditBusForm.get('hot_buckdays').updateValueAndValidity();

  }

  async cityshow($event = '') {
    // console.log("hit")
    this.dist = await this.select.showDistrict({ state_id: this.EditBusForm.value['state'], like: $event })
  }

  async stateshow($event = '') {
    this.states = await this.select.showState({ like: $event })
  }

  async servicetype() {
    this.servtype = await this.ser.showServiceType({})
  }

  async ottplatform($event = '') {
    if (this.EditBusForm.value['serv_type'] == 3 || this.EditBusForm.value['serv_type'] == 5 || this.EditBusForm.value['serv_type'] == 7 || this.EditBusForm.value['serv_type'] == 8) {
      this.ottdata = await this.adminser.showOTTPlatforms({ like: $event });
    }
  }

  ottvalid() {
    if (this.EditBusForm.value['disney_flag'] == true) {
      this.EditBusForm.get('disney_igst').setValidators([Validators.required]);
      this.EditBusForm.get('disney_cgst').setValidators([Validators.required]);
      this.EditBusForm.get('disney_sgst').setValidators([Validators.required]);
    } else {
      this.EditBusForm.get('disney_igst').setValue(0);
      this.EditBusForm.get('disney_cgst').setValue(0);
      this.EditBusForm.get('disney_sgst').setValue(0);

      this.EditBusForm.get('disney_igst').clearValidators();
      this.EditBusForm.get('disney_igst').updateValueAndValidity();
      this.EditBusForm.get('disney_cgst').clearValidators();
      this.EditBusForm.get('disney_cgst').updateValueAndValidity();
      this.EditBusForm.get('disney_sgst').clearValidators();
      this.EditBusForm.get('disney_sgst').updateValueAndValidity();
    }
    if (this.EditBusForm.vlaue['amazon_flag'] == true) {
      this.EditBusForm.get('amazon_igst').setValidators([Validators.required]);
      this.EditBusForm.get('amazon_cgst').setValidators([Validators.required]);
      this.EditBusForm.get('amazon_sgst').setValidators([Validators.required]);
    } else {
      this.EditBusForm.get('amazon_igst').setValue(0);
      this.EditBusForm.get('amazon_cgst').setValue(0);
      this.EditBusForm.get('amazon_sgst').setValue(0);

      this.EditBusForm.get('amazon_igst').clearValidators();
      this.EditBusForm.get('amazon_igst').updateValueAndValidity();
      this.EditBusForm.get('amazon_cgst').clearValidators();
      this.EditBusForm.get('amazon_cgst').updateValueAndValidity();
      this.EditBusForm.get('amazon_sgst').clearValidators();
      this.EditBusForm.get('amazon_sgst').updateValueAndValidity();
    }
    if (this.EditBusForm.value['netflix_flag'] == true) {
      this.EditBusForm.get('netflix_igst').setValidators([Validators.required]);
      this.EditBusForm.get('netflix_cgst').setValidators([Validators.required]);
      this.EditBusForm.get('netflix_sgst').setValidators([Validators.required]);
    } else {
      this.EditBusForm.get('netflix_igst').setValue(0);
      this.EditBusForm.get('netflix_cgst').setValue(0);
      this.EditBusForm.get('netflix_sgst').setValue(0);

      this.EditBusForm.get('netflix_igst').clearValidators();
      this.EditBusForm.get('netflix_igst').updateValueAndValidity();
      this.EditBusForm.get('netflix_cgst').clearValidators();
      this.EditBusForm.get('netflix_cgst').updateValueAndValidity();
      this.EditBusForm.get('netflix_sgst').clearValidators();
      this.EditBusForm.get('netflix_sgst').updateValueAndValidity();
    }
    if (this.EditBusForm.value['sun_flag'] == true) {
      this.EditBusForm.get('sun_igst').setValidators([Validators.required]);
      this.EditBusForm.get('sun_cgst').setValidators([Validators.required]);
      this.EditBusForm.get('sun_sgst').setValidators([Validators.required]);
    } else {
      this.EditBusForm.get('sun_igst').setValue(0);
      this.EditBusForm.get('sun_cgst').setValue(0);
      this.EditBusForm.get('sun_sgst').setValue(0);

      this.EditBusForm.get('sun_igst').clearValidators();
      this.EditBusForm.get('sun_igst').updateValueAndValidity();
      this.EditBusForm.get('sun_cgst').clearValidators();
      this.EditBusForm.get('sun_cgst').updateValueAndValidity();
      this.EditBusForm.get('sun_sgst').clearValidators();
      this.EditBusForm.get('sun_sgst').updateValueAndValidity();
    }
    if (this.EditBusForm.value['zee_flag'] == true) {
      this.EditBusForm.get('zee_igst').setValidators([Validators.required]);
      this.EditBusForm.get('zee_cgst').setValidators([Validators.required]);
      this.EditBusForm.get('zee_sgst').setValidators([Validators.required]);
    } else {
      this.EditBusForm.get('zee_igst').setValue(0);
      this.EditBusForm.get('zee_cgst').setValue(0);
      this.EditBusForm.get('zee_sgst').setValue(0);

      this.EditBusForm.get('zee_igst').clearValidators();
      this.EditBusForm.get('zee_igst').updateValueAndValidity();
      this.EditBusForm.get('zee_cgst').clearValidators();
      this.EditBusForm.get('zee_cgst').updateValueAndValidity();
      this.EditBusForm.get('zee_sgst').clearValidators();
      this.EditBusForm.get('zee_sgst').updateValueAndValidity();
    }
    if (this.EditBusForm.value['raj_flag'] == true) {
      this.EditBusForm.get('raj_igst').setValidators([Validators.required]);
      this.EditBusForm.get('raj_cgst').setValidators([Validators.required]);
      this.EditBusForm.get('raj_sgst').setValidators([Validators.required]);
    } else {
      this.EditBusForm.get('raj_igst').setValue(0);
      this.EditBusForm.get('raj_cgst').setValue(0);
      this.EditBusForm.get('raj_sgst').setValue(0);

      this.EditBusForm.get('raj_igst').clearValidators();
      this.EditBusForm.get('raj_igst').updateValueAndValidity();
      this.EditBusForm.get('raj_cgst').clearValidators();
      this.EditBusForm.get('raj_cgst').updateValueAndValidity();
      this.EditBusForm.get('raj_sgst').clearValidators();
      this.EditBusForm.get('raj_sgst').updateValueAndValidity();
    }
    if (this.EditBusForm.value['sony_flag'] == true) {
      this.EditBusForm.get('sony_igst').setValidators([Validators.required]);
      this.EditBusForm.get('sony_cgst').setValidators([Validators.required]);
      this.EditBusForm.get('sony_sgst').setValidators([Validators.required]);
    } else {
      this.EditBusForm.get('sony_igst').setValue(0);
      this.EditBusForm.get('sony_cgst').setValue(0);
      this.EditBusForm.get('sony_sgst').setValue(0);

      this.EditBusForm.get('sony_igst').clearValidators();
      this.EditBusForm.get('sony_igst').updateValueAndValidity();
      this.EditBusForm.get('sony_cgst').clearValidators();
      this.EditBusForm.get('sony_cgst').updateValueAndValidity();
      this.EditBusForm.get('sony_sgst').clearValidators();
      this.EditBusForm.get('sony_sgst').updateValueAndValidity();
    }
    if (this.EditBusForm.value['hunga_flag'] == true) {
      this.EditBusForm.get('hunga_igst').setValidators([Validators.required]);
      this.EditBusForm.get('hunga_cgst').setValidators([Validators.required]);
      this.EditBusForm.get('hunga_sgst').setValidators([Validators.required]);
    } else {
      this.EditBusForm.get('hunga_igst').setValue(0);
      this.EditBusForm.get('hunga_cgst').setValue(0);
      this.EditBusForm.get('hunga_sgst').setValue(0);

      this.EditBusForm.get('hunga_igst').clearValidators();
      this.EditBusForm.get('hunga_igst').updateValueAndValidity();
      this.EditBusForm.get('hunga_cgst').clearValidators();
      this.EditBusForm.get('hunga_cgst').updateValueAndValidity();
      this.EditBusForm.get('hunga_sgst').clearValidators();
      this.EditBusForm.get('hunga_sgst').updateValueAndValidity();
    }

  }


  async editBusiness() {
    //  console.log("outside",this.EditBusForm.value)
    if (this.EditBusForm.invalid || this.EditBusForm.value['passwrd'] != this.EditBusForm.value['conpass']) {
      this.submit = true;
      window.alert('Please fill mandatory fields')
      return;
    }
    this.EditBusForm.value['disney_flag'] == true ? this.ott_name.push(1) : '';
    this.EditBusForm.value['amazon_flag'] == true ? this.ott_name.push(2) : '';
    this.EditBusForm.value['netflix_flag'] == true ? this.ott_name.push(3) : '';
    this.EditBusForm.value['sun_flag'] == true ? this.ott_name.push(4) : '';
    this.EditBusForm.value['zee_flag'] == true ? this.ott_name.push(5) : '';
    this.EditBusForm.value['raj_flag'] == true ? this.ott_name.push(6) : '';
    this.EditBusForm.value['sony_flag'] == true ? this.ott_name.push(7) : '';
    this.EditBusForm.value['hunga_flag'] == true ? this.ott_name.push(8) : '';
    this.EditBusForm.value['ott_name'] = this.ott_name;
    this.EditBusForm.value['id'] = this.id;
    // console.log("inside",this.EditBusForm.value['gst_id']);
    let result = await this.ser.editbusiness(this.EditBusForm.value)
    this.datas = result;
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
      this.router.navigate(['/pages/business/list-business'])
    }
  }

  async edit() {
    let result = await this.ser.getbusinessedit({ id: this.id });
    if (result) {
      this.editdatas = result;
      // console.log("ott",this.ott);
    }
    this.createForm();
    await this.ottplatform();
    await this.cityshow();
  }

  async ngOnInit() {
    this.createForm();
    await this.stateshow();
    await this.servicetype();
    await this.edit();
  }

  createForm() {
    this.EditBusForm = this.fb.group({
      bus_id: new FormControl(this.editdatas ? this.editdatas['busname'] : '', Validators.required),
      // user_name: new FormControl('',[Validators.required,Validators.pattern(".*\\S.*[a-z A-z 0-9 ]")]),//[Validators.required,Validators.pattern('^[0-9 A-Z a-z]')]
      username: new FormControl(this.editdatas ? this.editdatas['managername'] : ''),
      gender: new FormControl(this.editdatas ? this.editdatas['gender'] : '', Validators.required),
      fname: new FormControl(this.editdatas ? this.editdatas['firstname'] : '', Validators.required),
      laname: new FormControl(this.editdatas ? this.editdatas['lastname'] : '', Validators.required),
      serv_type: new FormControl(this.editdatas ? this.editdatas['service_type'] : '', Validators.required),
      // ott_name: new FormControl(this.editdatas ? this.editdatas['ott_platform'] : ''),
      // passwrd : new FormControl('',[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
      // conpass : new FormControl(''),
      subs_limit: new FormControl(this.editdatas ? this.editdatas['subscriber_limit'] : '0', Validators.required),
      bus_addr: new FormControl(this.editdatas ? this.editdatas['busaddr'] : '', Validators.required),
      email: new FormControl(this.editdatas ? this.editdatas['email'] : '', [Validators.required, Validators.pattern("[0-9 A-Z a-z ,.`!@#$%^&*]*[@]{1}[a-z A-Z]*[.]{1}[a-z A-Z]{2,3}([.]{1}[a-z A-Z]{2,3})?")]),
      mob_num: new FormControl(this.editdatas ? this.editdatas['mobile'] : '', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      phone_num: new FormControl(this.editdatas ? this.editdatas['phone'] : '', [Validators.pattern('^[0-9]{11}$')]),
      custcare_num: new FormControl(this.editdatas ? this.editdatas['cust_care_no'] : ''),
      // loc_name: new FormControl(this.editdatas ? this.editdatas['location'] : ''),
      pan_no: new FormControl(this.editdatas ? this.editdatas['pan_no'] : ''),
      hsn_no: new FormControl(this.editdatas ? this.editdatas['hsn'] : ''),
      srvtax_no: new FormControl(this.editdatas ? this.editdatas['srvtax_no'] : ''),
      gst_no: new FormControl(this.editdatas ? this.editdatas['gst'] : '', Validators.required),
      igst: new FormControl(this.editdatas ? this.editdatas['igst'] : ''),
      cgst: new FormControl(this.editdatas ? this.editdatas['cgst'] : ''),
      sgst: new FormControl(this.editdatas ? this.editdatas['sgst'] : ''),
      vo_igst: new FormControl(this.editdatas ? this.editdatas['Vigst'] : ''),
      vo_cgst: new FormControl(this.editdatas ? this.editdatas['Vcgst'] : ''),
      vo_sgst: new FormControl(this.editdatas ? this.editdatas['Vsgst'] : ''),
      ott_igst: new FormControl(this.editdatas ? this.editdatas['Oigst'] : ''),
      ott_cgst: new FormControl(this.editdatas ? this.editdatas['Ocgst'] : ''),
      ott_sgst: new FormControl(this.editdatas ? this.editdatas['Osgst'] : ''),
      add_igst: new FormControl(this.editdatas ? this.editdatas['AONigst'] : ''),
      add_cgst: new FormControl(this.editdatas ? this.editdatas['AONcgst'] : ''),
      add_sgst: new FormControl(this.editdatas ? this.editdatas['AONsgst'] : ''),
      gst_id: new FormControl(this.editdatas ? this.editdatas['gst_inid'] : '', [Validators.required, Validators.pattern('^[A-Z a-z]{6}$')]),

      tisp_share: new FormControl(this.editdatas ? this.editdatas['tisp_share'] : ''),
      tresel_share: new FormControl(this.editdatas ? this.editdatas['tresel_share'] : ''),
      
      tsub_isp_share: new FormControl(this.editdatas ? this.editdatas['tsub_isp_share'] : ''),
      tsub_dist_share: new FormControl(this.editdatas ? this.editdatas['tsub_dist_share'] : ''),
      //disney
      disney_flag: new FormControl(this.editdatas ? this.editdatas['disney'] == 0 ? false : true : ''),
      disney_igst: new FormControl(this.editdatas ? this.editdatas['disneyigst'] : ''),
      disney_cgst: new FormControl(this.editdatas ? this.editdatas['disneycgst'] : ''),
      disney_sgst: new FormControl(this.editdatas ? this.editdatas['disneysgst'] : ''),
      //amazon
      amazon_flag: new FormControl(this.editdatas ? this.editdatas['amazon'] == 0 ? false : true : ''),
      amazon_igst: new FormControl(this.editdatas ? this.editdatas['amazonigst'] : ''),
      amazon_cgst: new FormControl(this.editdatas ? this.editdatas['amazoncgst'] : ''),
      amazon_sgst: new FormControl(this.editdatas ? this.editdatas['amazonsgst'] : ''),
      //netflix
      netflix_flag: new FormControl(this.editdatas ? this.editdatas['netflix'] == 0 ? false : true : ''),
      netflix_igst: new FormControl(this.editdatas ? this.editdatas['netflixigst'] : ''),
      netflix_cgst: new FormControl(this.editdatas ? this.editdatas['netflixcgst'] : ''),
      netflix_sgst: new FormControl(this.editdatas ? this.editdatas['netflixsgst'] : ''),
      //sun
      sun_flag: new FormControl(this.editdatas ? this.editdatas['sunnext'] == 0 ? false : true : ''),
      sun_igst: new FormControl(this.editdatas ? this.editdatas['sunnextigst'] : ''),
      sun_cgst: new FormControl(this.editdatas ? this.editdatas['sunnextcgst'] : ''),
      sun_sgst: new FormControl(this.editdatas ? this.editdatas['sunnextsgst'] : ''),
      //zee
      zee_flag: new FormControl(this.editdatas ? this.editdatas['zee5'] == 0 ? false : true : ''),
      zee_igst: new FormControl(this.editdatas ? this.editdatas['zee5igst'] : ''),
      zee_cgst: new FormControl(this.editdatas ? this.editdatas['zee5cgst'] : ''),
      zee_sgst: new FormControl(this.editdatas ? this.editdatas['zee5sgst'] : ''),
      //raj
      raj_flag: new FormControl(this.editdatas ? this.editdatas['raj'] == 0 ? false : true : ''),
      raj_igst: new FormControl(this.editdatas ? this.editdatas['rajigst'] : ''),
      raj_cgst: new FormControl(this.editdatas ? this.editdatas['rajcgst'] : ''),
      raj_sgst: new FormControl(this.editdatas ? this.editdatas['rajsgst'] : ''),
      //sony
      sony_flag: new FormControl(this.editdatas ? this.editdatas['sony'] == 0 ? false : true : ''),
      sony_igst: new FormControl(this.editdatas ? this.editdatas['sonyigst'] : ''),
      sony_cgst: new FormControl(this.editdatas ? this.editdatas['sonycgst'] : ''),
      sony_sgst: new FormControl(this.editdatas ? this.editdatas['sonysgst'] : ''),
      //hunga
      hunga_flag: new FormControl(this.editdatas ? this.editdatas['hungama'] == 0 ? false : true : ''),
      hunga_igst: new FormControl(this.editdatas ? this.editdatas['hunigst'] : ''),
      hunga_cgst: new FormControl(this.editdatas ? this.editdatas['huncgst'] : ''),
      hunga_sgst: new FormControl(this.editdatas ? this.editdatas['hunsgst'] : ''),
      state: new FormControl(this.editdatas ? this.editdatas['state'] : '', Validators.required),
      city: new FormControl(this.editdatas ? this.editdatas['city'] : '', Validators.required),
      hot_bucket: new FormControl(this.editdatas ? this.editdatas['hot_bucket'] : '', Validators.required),
      hot_buckdays: new FormControl(this.editdatas ? this.editdatas['hot_bucket_days'] : ''),
      status: new FormControl(true, Validators.required),
      exp_alert: new FormControl(this.editdatas ? this.editdatas['exp_alert'] : ''),
      dl_alert: new FormControl(this.editdatas ? this.editdatas['dl_alert'] : ''),
      ul_alert: new FormControl(this.editdatas ? this.editdatas['ul_alert'] : ''),
      tot_alert: new FormControl(this.editdatas ? this.editdatas['tt_alert'] : ''),
      ontime_alert: new FormControl(this.editdatas ? this.editdatas['ot_alert'] : ''),
    },{
      validator: sumValidator(100,'tisp_share','tresel_share','tsub_isp_share','tsub_dist_share')

    });
  }
}
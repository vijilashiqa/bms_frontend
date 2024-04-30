import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder, } from '@angular/forms';
import { AddSuccessComponent } from './../success/add-success.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Netmask } from 'netmask';
import { Md5 } from 'ts-md5/dist/md5';
import * as FileSaver from 'file-saver';
import * as JSXLSX from 'xlsx';
import { ThemeModule } from '../../../@theme/theme.module';
import { stat } from 'fs';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { BusinessService, GroupService, NasService, IppoolService, ResellerService, SelectService, RoleService, AdminuserService, S_Service } from '../../_service/indexService';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';


@Component({
  selector: 'addreseller',
  templateUrl: './add-reseller.component.html',
  styleUrls: ['./resellerstyle.scss'],
})

export class AddResellerComponent implements OnInit {
  submit: boolean = false; AddReselForm: FormGroup; item; anas; ip; datas; selectedfile: File = null;
  fileupload; imageURL: any; file: any[]; files; busname; pro; bulk = []; ottdata; ott_name = [];
  arrayBuffer: any; failure: any[]; s = 0; f = 0; dist; states
  sharename; distname; depname; bulkReseller = []; roleno; shareval; config; servtype; smsgateway; paymentgateway;
  // sizes = [] ;
  grup; reseldata = []; resellist: any;
  change: boolean;
  ispsharedefault = false; isReadonly = false;
  assign_service;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;
  public isOpening = false;

  constructor(
    private alert: ToasterService,
    private router: Router,
    private _fb: FormBuilder,
    private resell: ResellerService,
    private select: SelectService,
    public activeModal: NgbModal,
    private sanitizer: DomSanitizer,
    public role: RoleService,
    private busser: BusinessService,
    private groupser: GroupService,
    private nasser: NasService,
    private poolser: IppoolService,
    private adminser: AdminuserService,
    private service: S_Service
  ) { }

  async business() {
    this.busname = await this.busser.showBusName({});
  }

  async profile() {
    if (this.role.getroleid() > 777) {
      this.pro = await this.resell.showProfileReseller({ bus_id: this.value.bus_id });
    }
    if (this.role.getroleid() <= 777) {
      this.pro = await this.resell.showProfileReseller({});
    }
  }

  async Nas($event = '') {
    this.anas = await this.nasser.showGroupNas({ like: $event, bus_id: this.value.bus_id, groupid: this.value.groupid });
  }

  async PoolName($event = '') {
    this.ip = await this.poolser.showPoolName({ like: $event, bus_id: this.value.bus_id, ipflag: 1, nas_id: this.value.ass_nas, groupid: this.value.groupid });
  }

  async GroupName() {
    this.grup = await this.groupser.showGroupName({ bus_id: this.value.bus_id });
  }

  async cityshow($event = '') {
    this.dist = await this.select.showDistrict({ state_id: this.value.State, like: $event, index: 0, limit: 15 });
  }

  async stateshow($event = '') {
    this.states = await this.select.showState({ like: $event });
  }

  async showResellerUnder($event = '') {
    this.resellist = await this.resell.showResellerUnder({
      like: $event, reseller_under: this.value.reseller_under, Role: this.value.Role,
      bus_id: this.value.bus_id, groupid: this.value.groupid
    });
  }

  async servicetype() {
    this.servtype = await this.busser.showServiceType({ bus_id: this.value.bus_id, sertype: 1 });
  }

  async SMSgateway($event = '') {
    this.smsgateway = await this.adminser.getSMSGateway({ bus_id: this.value.bus_id, like: $event });
  }

  async ottplatform($event = '') {
    if (this.value['serv_type'] == 3 || this.value['serv_type'] == 5 || this.value['serv_type'] == 7 || this.value['serv_type'] == 8) {
      this.ottdata = await this.adminser.showOTTPlatforms({ like: $event });
    }
  }

  async payGateway() {
    this.paymentgateway = await this.resell.getPayGateway({ bus_id: this.value.bus_id });
  }

  async ngOnInit() {
    this.createForm();
    await this.business();
    await this.stateshow();
    await this.addvalid();
    // this.sharedefault();
    if (this.role.getroleid() <= 777) {
      this.AddReselForm.controls['bus_id'].setValue(this.role.getispid());
      await this.GroupName();
      await this.Nas()
      await this.profile();
      await this.servicetype();
      await this.SMSgateway();
      await this.payGateway();
    }
    if (this.role.getroleid() < 775) {
      this.AddReselForm.get('reselcreate_type').setValue(0)
    }
  }

  reselundervalid() {
    if (this.value.Role == 333 || this.value.Role == 444 || this.value['Role'] == 551) {
      this.ctrl.reseller_under.setValidators([Validators.required]);
    } else {
      this.ctrl.reseller_under.clearValidators();
      this.ctrl.reseller_under.updateValueAndValidity();
    }

  }

  duevalid() {
    if (this.value.topup_min == false) {
      this.ctrl.min_amount.setValue(0);
    }
    if (this.value.over_due == false) {
      this.ctrl.due_amt.setValue(0);
    }
  }

  creditvalid() {
    if (this.value.credit_flag == true) {
      this.ctrl.credit_limit.setValidators([Validators.required]);
      this.ctrl.credit_limit.setValue(0);
    } else {
      this.ctrl.credit_limit.clearValidators();
      this.ctrl.credit_limit.updateValueAndValidity();
    }
  }

  nasipcreate() {

    if (this.value.Role == 333 || this.value.Role == 444 || this.value.Role == 222) {
      this.ctrl.ip_type.setValidators([Validators.required]);
      this.ctrl.nas_type.setValidators([Validators.required]);
    } else {
      this.ctrl.ip_type.clearValidators();
      this.ctrl.ip_type.updateValueAndValidity();

      this.ctrl.nas_type.clearValidators();
      this.ctrl.nas_type.updateValueAndValidity();
    }
  }


  prefixchange() {
    if (this.value.prefix_enable == false) {
      this.AddReselForm.get('prefix').setValue('');
    }
  }

  ottchange() {
    if (this.value.disney_flag == false) {
      this.ctrl.disneyshare_type.setValue('');
    }
    if (this.value.amazon_flag == false) {
      this.ctrl.amazonshare_type.setValue('');
    } if (this.value.netflix_flag == false) {
      this.ctrl.netflixshare_type.setValue('');
    } if (this.value.sun_flag == false) {
      this.ctrl.sunshare_type.setValue('');
    } if (this.value.zee_flag == false) {
      this.ctrl.zeeshare_type.setValue('');
    } if (this.value.raj_flag == false) {
      this.ctrl.rajshare_type.setValue('');
    } if (this.value.sony_flag == false) {
      this.ctrl.sonyshare_type.setValue('');
    } if (this.value.hunga_flag == false) {
      this.ctrl.hungashare_type.setValue('');
    }
  }

  shareempty() {
    this.ctrl.isp_share.setValue('');
    this.ctrl.subisp_share.setValue('');
    this.ctrl.subdis_share.setValue('');
    this.ctrl.resel_share.setValue('');
    this.ctrl.VOisp_share.setValue('');
    this.ctrl.VOsubisp_share.setValue('');
    this.ctrl.VOsubdis_share.setValue('');
    this.ctrl.VOresel_share.setValue('');
    this.ctrl.OTTisp_share.setValue('');
    this.ctrl.OTTsubisp_share.setValue('');
    this.ctrl.OTTsubdis_share.setValue('');
    this.ctrl.OTTresel_share.setValue('');
    this.ctrl.ADDisp_share.setValue('');
    this.ctrl.ADDsubisp_share.setValue('');
    this.ctrl.ADDsubdis_share.setValue('');
    this.ctrl.ADDresel_share.setValue('');
  }
  reselunderempty() {
    this.ctrl.subisp_bulk.setValue('');
    this.ctrl.subdep_name.setValue('');
    this.ctrl.subdist_bulk.setValue('');
    this.ctrl.subdis_name.setValue('');
  }

  async sharedefault() {
    await this.shareempty();
    //SUB DISTRIBUTOR BULK UNDER SUB ISP BULK
    if (this.value.Role == 661) {
      let result = await this.resell.showResellerUnder({ resel_id: this.value.subisp_bulk });
      this.shareval = result[0];
      if (this.value.serv_type == 2) {
        this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
        this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
      }
      if (this.value.serv_type == 3) {
        this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
        this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
      }
      if (this.value.serv_type == 4) {
        this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
        this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
      }
      if (this.value.serv_type == 5) {
        this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
        this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
        this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
        this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
      }
      if (this.value.serv_type == 6) {
        this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
        this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
        this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
        this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
      }
      if (this.value.serv_type == 7) {
        this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
        this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
        this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
        this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
      }
      if (this.value.serv_type == 8) {
        this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
        this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
        this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
        this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
        this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
        this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
      }
    }
    // UNDER SUB ISP BULK
    if (this.value.reseller_under == 1) {
      let result = await this.resell.showResellerUnder({ resel_id: this.value.subisp_bulk });
      this.shareval = result[0];

      //BULK RESELLER UNDER SUB ISP BULK
      if (this.value.serv_type == 2 && this.value.Role == 444) {
        this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
        this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
      }
      if (this.value.serv_type == 3 && this.value.Role == 444) {
        this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
        this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
      }
      if (this.value.serv_type == 4 && this.value.Role == 444) {
        this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
        this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
      }
      if (this.value.serv_type == 5 && this.value.Role == 444) {
        this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
        this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
        this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
        this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
      }
      if (this.value.serv_type == 6 && this.value.Role == 444) {
        this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
        this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
        this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
        this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
      }
      if (this.value.serv_type == 7 && this.value.Role == 444) {
        this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
        this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
        this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
        this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
      }
      if (this.value.serv_type == 8 && this.value.Role == 444) {
        this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
        this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
        this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
        this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
        this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
        this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
      }

      //SUB DIST DEPOSIT UNDER SUB ISP BULK
      if (this.value.serv_type == 1 && this.value.Role == 551) {
        this.ctrl.isp_share.setValue(this.shareval['isp_share']);
        this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
      }
      if (this.value.serv_type == 2 && this.value.Role == 551) {
        this.ctrl.isp_share.setValue(this.shareval['isp_share']);
        this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
        this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
        this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
      }
      if (this.value.serv_type == 3 && this.value.Role == 551) {
        this.ctrl.isp_share.setValue(this.shareval['isp_share']);
        this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
        this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
        this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
      }
      if (this.value.serv_type == 4 && this.value.Role == 551) {
        this.ctrl.isp_share.setValue(this.shareval['isp_share']);
        this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
        this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
        this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
      }
      if (this.value.serv_type == 5 && this.value.Role == 551) {
        this.ctrl.isp_share.setValue(this.shareval['isp_share']);
        this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
        this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
        this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
        this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
        this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
      }
      if (this.value.serv_type == 6 && this.value.Role == 551) {
        this.ctrl.isp_share.setValue(this.shareval['isp_share']);
        this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
        this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
        this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
        this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
        this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
      }
      if (this.value.serv_type == 7 && this.value.Role == 551) {
        this.ctrl.isp_share.setValue(this.shareval['isp_share']);
        this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
        this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
        this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
        this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
        this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
      }
      if (this.value.serv_type == 8 && this.value.Role == 551) {
        this.ctrl.isp_share.setValue(this.shareval['isp_share']);
        this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
        this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
        this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
        this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
        this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
        this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
        this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
      }

      //DEPOSIT RESELLER UNDER SUB ISP BULK
      if (this.value.serv_type == 1 && this.value.Role == 333) {
        this.ctrl.isp_share.setValue(this.shareval['isp_share']);
        this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
      }
      if (this.value.serv_type == 2 && this.value.Role == 333) {
        this.ctrl.isp_share.setValue(this.shareval['isp_share']);
        this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
        this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
        this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
      }
      if (this.value.serv_type == 3 && this.value.Role == 333) {
        this.ctrl.isp_share.setValue(this.shareval['isp_share']);
        this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
        this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
        this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
      }
      if (this.value.serv_type == 4 && this.value.Role == 333) {
        this.ctrl.isp_share.setValue(this.shareval['isp_share']);
        this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
        this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
        this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
      }
      if (this.value.serv_type == 5 && this.value.Role == 333) {
        this.ctrl.isp_share.setValue(this.shareval['isp_share']);
        this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
        this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
        this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
        this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
        this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
      }
      if (this.value.serv_type == 6 && this.value.Role == 333) {
        this.ctrl.isp_share.setValue(this.shareval['isp_share']);
        this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
        this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
        this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
        this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
        this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
      }
      if (this.value.serv_type == 7 && this.value.Role == 333) {
        this.ctrl.isp_share.setValue(this.shareval['isp_share']);
        this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
        this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
        this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
        this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
        this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
      }
      if (this.value.serv_type == 8 && this.value.Role == 333) {
        this.ctrl.isp_share.setValue(this.shareval['isp_share']);
        this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
        this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
        this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
        this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
        this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
        this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
        this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
      }
    }
    //UNDER SUB ISP DEPOSIT
    if (this.value.reseller_under == 2) {
      let result = await this.resell.showResellerUnder({ resel_id: this.value.subdep_name });
      this.shareval = result[0]

      //DEPOSIT AND SUB DIST DEPOSIT UNDER SUB ISP DEPOSIT
      if (this.value.Role == 333 || this.value.Role == 551) {
        if (this.value.serv_type == 1) {
          this.ctrl.isp_share.setValue(this.shareval['isp_share']);
          this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
        }
        if (this.value.serv_type == 2) {
          this.ctrl.isp_share.setValue(this.shareval['isp_share']);
          this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
          this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
          this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
        }
        if (this.value.serv_type == 3) {
          this.ctrl.isp_share.setValue(this.shareval['isp_share']);
          this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
          this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
          this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
        }
        if (this.value.serv_type == 4) {
          this.ctrl.isp_share.setValue(this.shareval['isp_share']);
          this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
          this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
          this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
        }
        if (this.value.serv_type == 5) {
          this.ctrl.isp_share.setValue(this.shareval['isp_share']);
          this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
          this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
          this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
          this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
          this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
        }
        if (this.value.serv_type == 6) {
          this.ctrl.isp_share.setValue(this.shareval['isp_share']);
          this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
          this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
          this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
          this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
          this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
        }
        if (this.value.serv_type == 7) {
          this.ctrl.isp_share.setValue(this.shareval['isp_share']);
          this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
          this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
          this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
          this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
          this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
        }
        if (this.value.serv_type == 8) {
          this.ctrl.isp_share.setValue(this.shareval['isp_share']);
          this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
          this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
          this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
          this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
          this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
          this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
          this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
        }
      }
    }

    //UNDER SUB DIST BULK AND SUB DIST DEPOSIT
    if (this.value.reseller_under == 3 || this.value.reseller_under == 4) {
      if (this.value.subdist_bulk != '') {
        let result = await this.resell.showResellerUnder({ resel_id: this.value.subdist_bulk });
        this.shareval = result[0];
      }
      if (this.value.subdis_name != '') {
        let result = await this.resell.showResellerUnder({ resel_id: this.value.subdis_name });
        this.shareval = result[0];
      }
      //DEPOSIT UNDER SUB DISTBULK AND SUB DIST DEPOSIT
      if (this.value.Role == 333) {
        if (this.value.serv_type == 1) {
          this.ctrl.isp_share.setValue(this.shareval['isp_share']);
          this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
          this.ctrl.subdis_share.setValue(this.shareval['sub_dist_share'])
        }
        if (this.value.serv_type == 2) {
          this.ctrl.isp_share.setValue(this.shareval['isp_share']);
          this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
          this.ctrl.subdis_share.setValue(this.shareval['sub_dist_share'])

          this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
          this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
          this.ctrl.VOsubdis_share.setValue(this.shareval['Vsub_dist_share']);

        }
        if (this.value.serv_type == 3) {
          this.ctrl.isp_share.setValue(this.shareval['isp_share']);
          this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
          this.ctrl.subdis_share.setValue(this.shareval['sub_dist_share'])

          this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
          this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
          this.ctrl.OTTsubdis_share.setValue(this.shareval['Osub_dist_share']);

        }
        if (this.value.serv_type == 4) {
          this.ctrl.isp_share.setValue(this.shareval['isp_share']);
          this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
          this.ctrl.subdis_share.setValue(this.shareval['sub_dist_share'])

          this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
          this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
          this.ctrl.ADDsubdis_share.setValue(this.shareval['AONsub_dist_share']);

        }
        if (this.value.serv_type == 5) {
          this.ctrl.isp_share.setValue(this.shareval['isp_share']);
          this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
          this.ctrl.subdis_share.setValue(this.shareval['sub_dist_share']);

          this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
          this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
          this.ctrl.VOsubdis_share.setValue(this.shareval['Vsub_dist_share'])

          this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
          this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
          this.ctrl.OTTsubdis_share.setValue(this.shareval['Osub_dist_share']);

        }
        if (this.value.serv_type == 6) {
          this.ctrl.isp_share.setValue(this.shareval['isp_share']);
          this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
          this.ctrl.subdis_share.setValue(this.shareval['sub_dist_share']);

          this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
          this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
          this.ctrl.VOsubdis_share.setValue(this.shareval['Vsub_dist_share']);

          this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
          this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
          this.ctrl.ADDsubdis_share.setValue(this.shareval['AONsub_dist_share']);

        }
        if (this.value.serv_type == 7) {
          this.ctrl.isp_share.setValue(this.shareval['isp_share']);
          this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
          this.ctrl.subdis_share.setValue(this.shareval['sub_dist_share']);

          this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
          this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
          this.ctrl.OTTsubdis_share.setValue(this.shareval['Osub_dist_share']);

          this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
          this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
          this.ctrl.ADDsubdis_share.setValue(this.shareval['AONsub_dist_share']);

        }
        if (this.value.serv_type == 8) {
          this.ctrl.isp_share.setValue(this.shareval['isp_share']);
          this.ctrl.subisp_share.setValue(this.shareval['sub_isp_share']);
          this.ctrl.subdis_share.setValue(this.shareval['sub_dist_share']);

          this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
          this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
          this.ctrl.VOsubdis_share.setValue(this.shareval['Vsub_dist_share']);

          this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
          this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
          this.ctrl.OTTsubdis_share.setValue(this.shareval['Osub_dist_share']);

          this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
          this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
          this.ctrl.ADDsubdis_share.setValue(this.shareval['AONsub_dist_share']);

        }
      }
      //BULK RESELLER UNDER SUB DIST BULK
      if (this.value.serv_type == 2 && this.value.Role == 444) {
        this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
        this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
        this.ctrl.VOsubdis_share.setValue(this.shareval['Vsub_dist_share']);

      }
      if (this.value.serv_type == 3 && this.value.Role == 444) {
        this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
        this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
        this.ctrl.OTTsubdis_share.setValue(this.shareval['Osub_dist_share']);

      }
      if (this.value.serv_type == 4 && this.value.Role == 444) {
        this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
        this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
        this.ctrl.ADDsubdis_share.setValue(this.shareval['AONsub_dist_share']);

      }
      if (this.value.serv_type == 5 && this.value.Role == 444) {
        this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
        this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
        this.ctrl.VOsubdis_share.setValue(this.shareval['Vsub_dist_share']);

        this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
        this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
        this.ctrl.OTTsubdis_share.setValue(this.shareval['Osub_dist_share']);

      }
      if (this.value.serv_type == 6 && this.value.Role == 444) {
        this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
        this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
        this.ctrl.VOsubdis_share.setValue(this.shareval['Vsub_dist_share']);

        this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
        this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
        this.ctrl.ADDsubdis_share.setValue(this.shareval['AONsub_dist_share']);

      }
      if (this.value.serv_type == 7 && this.value.Role == 444) {
        this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
        this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
        this.ctrl.OTTsubdis_share.setValue(this.shareval['Osub_dist_share']);

        this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
        this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
        this.ctrl.ADDsubdis_share.setValue(this.shareval['AONsub_dist_share']);

      }
      if (this.value.serv_type == 8 && this.value.Role == 444) {
        this.ctrl.VOisp_share.setValue(this.shareval['Visp_share']);
        this.ctrl.VOsubisp_share.setValue(this.shareval['Vsub_isp_share']);
        this.ctrl.VOsubdis_share.setValue(this.shareval['Vsub_dist_share']);

        this.ctrl.OTTisp_share.setValue(this.shareval['Oisp_share']);
        this.ctrl.OTTsubisp_share.setValue(this.shareval['Osub_isp_share']);
        this.ctrl.OTTsubdis_share.setValue(this.shareval['Osub_dist_share']);

        this.ctrl.ADDisp_share.setValue(this.shareval['AONisp_share']);
        this.ctrl.ADDsubisp_share.setValue(this.shareval['AONsub_isp_share']);
        this.ctrl.ADDsubdis_share.setValue(this.shareval['AONsub_dist_share']);

      }
    }
  }

  nasipflag() {
    if (this.value.Role != '444' || this.value.Role != '333' || this.value.Role != '222') {
      this.AddReselForm.get('ip_type').clearValidators();
      this.AddReselForm.get('ip_type').updateValueAndValidity();

      this.AddReselForm.get('nas_type').clearValidators();
      this.AddReselForm.get('nas_type').updateValueAndValidity();
    }
  }

  // sharecal() {
  //   if (this.value.Role == '555' || this.value.Role == '333' || this.value.Role == '551') {
  //     var ispshare = parseInt(this.value.isp_share),
  //       subispshare = parseInt(this.value.subisp_share),
  //       subdistshare = parseInt(this.value.subdis_share),
  //       resellshare = parseInt(this.value.resel_share), status = true;
  //     if (this.value.Role == '555') {
  //       status = (ispshare + subispshare) == 100;
  //     }
  //     if (this.value.Role == '333' && this.value.reseller_under == '0') {
  //       status = (ispshare + resellshare) == 100
  //     }
  //     if (!status) {
  //       this.toastalert('please check the share calculation', 0);
  //     }
  //   }
  // }

  get ctrl() {
    return this.AddReselForm.controls
  }
  get value() {
    return this.AddReselForm.value
  }

  validclear() {
    this.ctrl.reseller_under.clearValidators();
    this.ctrl.reseller_under.updateValueAndValidity();

    this.ctrl.subisp_bulk.clearValidators();
    this.ctrl.subisp_bulk.updateValueAndValidity();
    this.ctrl.subdep_name.clearValidators();
    this.ctrl.subdep_name.updateValueAndValidity();
    this.ctrl.subdist_bulk.clearValidators();
    this.ctrl.subdist_bulk.updateValueAndValidity();
    this.ctrl.subdis_name.clearValidators();
    this.ctrl.subdis_name.updateValueAndValidity();

    this.ctrl.isp_share.clearValidators();
    this.ctrl.isp_share.updateValueAndValidity();
    this.ctrl.subisp_share.clearValidators();
    this.ctrl.subisp_share.updateValueAndValidity();
    this.ctrl.subdis_share.clearValidators();
    this.ctrl.subdis_share.updateValueAndValidity();
    this.ctrl.resel_share.clearValidators();
    this.ctrl.resel_share.updateValueAndValidity();

    this.ctrl.voshare_type.clearValidators();
    this.ctrl.voshare_type.updateValueAndValidity();
    this.ctrl.ottshare_type.clearValidators();
    this.ctrl.ottshare_type.updateValueAndValidity();
    this.ctrl.addshare_type.clearValidators();
    this.ctrl.addshare_type.updateValueAndValidity();

    this.ctrl.VOisp_share.clearValidators();
    this.ctrl.VOisp_share.updateValueAndValidity();
    this.ctrl.VOsubisp_share.clearValidators();
    this.ctrl.VOsubisp_share.updateValueAndValidity();
    this.ctrl.VOsubdis_share.clearValidators();
    this.ctrl.VOsubdis_share.updateValueAndValidity();
    this.ctrl.VOresel_share.clearValidators();
    this.ctrl.VOresel_share.updateValueAndValidity();

    this.ctrl.OTTisp_share.clearValidators();
    this.ctrl.OTTisp_share.updateValueAndValidity();
    this.ctrl.OTTsubisp_share.clearValidators();
    this.ctrl.OTTsubisp_share.updateValueAndValidity();
    this.ctrl.OTTsubdis_share.clearValidators();
    this.ctrl.OTTsubdis_share.updateValueAndValidity();
    this.ctrl.OTTresel_share.clearValidators();
    this.ctrl.OTTresel_share.updateValueAndValidity();

    this.ctrl.ADDisp_share.clearValidators();
    this.ctrl.ADDisp_share.updateValueAndValidity();
    this.ctrl.ADDsubisp_share.clearValidators();
    this.ctrl.ADDsubisp_share.updateValueAndValidity();
    this.ctrl.ADDsubdis_share.clearValidators();
    this.ctrl.ADDsubdis_share.updateValueAndValidity();
    this.ctrl.ADDresel_share.clearValidators();
    this.ctrl.ADDresel_share.updateValueAndValidity();
  }

  async provalid() {
    await this.validclear();
    const pro = this.value.Role
    switch (pro) {
      case 555:
        //Sub ISP Deposit
        this.ctrl.isp_share.setValidators([Validators.required]);
        this.ctrl.subisp_share.setValidators([Validators.required]);

        this.value.serv_type == 2 ? this.ctrl.voshare_type.setValidators([Validators.required]) : this.ctrl.voshare_type.clearValidators();
        this.ctrl.voshare_type.updateValueAndValidity();
        this.value.serv_type == 3 ? this.ctrl.voshare_type.setValidators([Validators.required]) : this.ctrl.ottshare_type.clearValidators();
        this.ctrl.ottshare_type.updateValueAndValidity();
        this.value.serv_type == 4 ? this.ctrl.voshare_type.setValidators([Validators.required]) : this.ctrl.addshare_type.clearValidators();
        this.ctrl.addshare_type.updateValueAndValidity();

        //SHARE TYPE VALIDATION
        if (this.value.voshare_type == 1) {
          this.ctrl.VOisp_share.setValidators([Validators.required]);
          this.ctrl.VOsubisp_share.setValidators([Validators.required]);
        }
        if (this.value.ottshare_type == 1) {
          this.ctrl.OTTisp_share.setValidators([Validators.required]);
          this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
        }
        if (this.value.addshare_type == 1) {
          this.ctrl.ADDisp_share.setValidators([Validators.required]);
          this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
        }
        if (this.value.serv_type == 5) {
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          if (this.value.ottshare_type == 1) {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
          }
          if (this.value.voshare_type == 1) {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
          }
        }
        if (this.value.serv_type == 6) {
          this.ctrl.addshare_type.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          if (this.value.addshare_type == 1) {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
          }
          if (this.value.voshare_type == 1) {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
          }
        }
        if (this.value.serv_type == 7) {
          this.ctrl.addshare_type.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          if (this.value.addshare_type == 1) {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
          }
          if (this.value.ottshare_type == 1) {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
          }
        }
        if (this.value.serv_type == 8) {
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == 1) {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == 1) {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
          }
          if (this.value.ottshare_type == 1) {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
          }
        }
        break;

      case 444:
        //Bulk Reseller
        this.ctrl.reseller_under.setValidators([Validators.required]);
        //RESELLER UNDER SUB ISP BULK
        if (this.value.reseller_under == '1' && this.value.serv_type == '1') {
          this.ctrl.subisp_bulk.setValidators([Validators.required]);
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '2') {
          this.ctrl.subisp_bulk.setValidators([Validators.required])
          this.ctrl.voshare_type.setValidators([Validators.required])
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '3') {
          this.ctrl.subisp_bulk.setValidators([Validators.required])
          this.ctrl.ottshare_type.setValidators([Validators.required])
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '4') {
          this.ctrl.subisp_bulk.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '5') {
          this.ctrl.subisp_bulk.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required])
          }
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '6') {
          this.ctrl.subisp_bulk.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required])
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required])
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.Addisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.Addresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '7') {
          this.ctrl.subisp_bulk.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.Addisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.Addresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '8') {
          this.ctrl.subisp_bulk.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required])
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required])
          }
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.Addisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.Addresel_share.setValidators([Validators.required]);
          }
        }
        //RESELLER UNDER SUB DIST BULK
        if (this.value.reseller_under == '3' && this.value.serv_type == '1') {
          this.ctrl.subdist_bulk.setValidators([Validators.required]);
        }
        if (this.value.reseller_under == '3' && this.value.serv_type == '2') {
          this.ctrl.subdist_bulk.setValidators([Validators.required])
          this.ctrl.voshare_type.setValidators([Validators.required])
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required])
            this.ctrl.VOsubisp_share.setValidators([Validators.required])
            this.ctrl.VOresel_share.setValidators([Validators.required])
            this.ctrl.VOsubdis_share.setValidators([Validators.required])
          }
        }
        if (this.value.reseller_under == '3' && this.value.serv_type == '3') {
          this.ctrl.subdist_bulk.setValidators([Validators.required])
          this.ctrl.ottshare_type.setValidators([Validators.required])
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required])
            this.ctrl.OTTsubisp_share.setValidators([Validators.required])
            this.ctrl.OTTresel_share.setValidators([Validators.required])
            this.ctrl.OTTsubdis_share.setValidators([Validators.required])
          }
        }
        if (this.value.reseller_under == '3' && this.value.serv_type == '4') {
          this.ctrl.subdist_bulk.setValidators([Validators.required])
          this.ctrl.addshare_type.setValidators([Validators.required])
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required])
            this.ctrl.ADDsubisp_share.setValidators([Validators.required])
            this.ctrl.ADDsubdis_share.setValidators([Validators.required])
            this.ctrl.ADDresel_share.setValidators([Validators.required])
          }
        }
        if (this.value.reseller_under == '3' && this.value.serv_type == '5') {
          this.ctrl.subdist_bulk.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required])
            this.ctrl.VOsubisp_share.setValidators([Validators.required])
            this.ctrl.VOsubdis_share.setValidators([Validators.required])
            this.ctrl.VOresel_share.setValidators([Validators.required])
          }
          if (this.value.ottshare_type == 1) {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required])
            this.ctrl.OTTsubdis_share.setValidators([Validators.required])
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '3' && this.value.serv_type == '6') {
          this.ctrl.subdist_bulk.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required])
            this.ctrl.VOsubisp_share.setValidators([Validators.required])
            this.ctrl.VOsubdis_share.setValidators([Validators.required])
            this.ctrl.VOresel_share.setValidators([Validators.required])
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.Addisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required])
            this.ctrl.ADDsubdis_share.setValidators([Validators.required])
            this.ctrl.Addresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '3' && this.value.serv_type == '7') {
          this.ctrl.subdist_bulk.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.ottshare_type == 1) {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required])
            this.ctrl.OTTsubdis_share.setValidators([Validators.required])
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.Addisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required])
            this.ctrl.ADDsubdis_share.setValidators([Validators.required])
            this.ctrl.Addresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '3' && this.value.serv_type == '8') {
          this.ctrl.subdist_bulk.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required])
            this.ctrl.VOsubisp_share.setValidators([Validators.required])
            this.ctrl.VOsubdis_share.setValidators([Validators.required])
            this.ctrl.VOresel_share.setValidators([Validators.required])
          }
          if (this.value.ottshare_type == 1) {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required])
            this.ctrl.OTTsubdis_share.setValidators([Validators.required])
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.Addisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required])
            this.ctrl.ADDsubdis_share.setValidators([Validators.required])
            this.ctrl.Addresel_share.setValidators([Validators.required]);
          }
        }

        //RESELLER UNDER DIRECT ISP
        if (this.value.reseller_under == '0' && this.value.serv_type == '2') {
          this.ctrl.voshare_type.setValidators([Validators.required])
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required])
            this.ctrl.VOresel_share.setValidators([Validators.required])
          }
        }
        if (this.value.reseller_under == '0' && this.value.serv_type == '3') {
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '0' && this.value.serv_type == '4') {
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.addshare_type == '1') {
            this.ctrl.Addisp_share.setValidators([Validators.required]);
            this.ctrl.Addresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '0' && this.value.serv_type == '5') {
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required])
            this.ctrl.VOresel_share.setValidators([Validators.required])
          }
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '0' && this.value.serv_type == '6') {
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required])
            this.ctrl.VOresel_share.setValidators([Validators.required])
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.Addisp_share.setValidators([Validators.required]);
            this.ctrl.Addresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '0' && this.value.serv_type == '7') {
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.Addisp_share.setValidators([Validators.required]);
            this.ctrl.Addresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '0' && this.value.serv_type == '8') {
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required])
            this.ctrl.VOresel_share.setValidators([Validators.required])
          }
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.Addisp_share.setValidators([Validators.required]);
            this.ctrl.Addresel_share.setValidators([Validators.required]);
          }
        }
        break;

      case 333:
        //Deposit Reseller
        this.ctrl.reseller_under.setValidators([Validators.required]);
        //RESELLER UNDER DIRECT ISP
        if (this.value.reseller_under == '0' && this.value.serv_type == '1') {
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
        }
        if (this.value.reseller_under == '0' && this.value.serv_type == '2') {
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '0' && this.value.serv_type == '3') {
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '0' && this.value.serv_type == '4') {
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '0' && this.value.serv_type == '5') {
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required]);
          }
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '0' && this.value.serv_type == '6') {
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '0' && this.value.serv_type == '7') {
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '0' && this.value.serv_type == '8') {
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required]);
          }
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDresel_share.setValidators([Validators.required]);
          }
        }
        //RESELLER UNDER SUB ISP BULK
        if (this.value.reseller_under == '1' && this.value.serv_type == '1') {
          this.ctrl.subisp_bulk.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_bulk.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '2') {
          this.ctrl.subisp_bulk.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '3') {
          this.ctrl.subisp_bulk.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '4') {
          this.ctrl.subisp_bulk.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '5') {
          this.ctrl.subisp_bulk.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required]);
          }
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '6') {
          this.ctrl.subisp_bulk.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '7') {
          this.ctrl.subisp_bulk.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '8') {
          this.ctrl.subisp_bulk.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required]);
          }
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDresel_share.setValidators([Validators.required]);
          }
        }

        if (this.value.reseller_under == '2' && this.value.serv_type == '1') {
          this.ctrl.subdep_name.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '2') {
          this.ctrl.subdep_name.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '3') {
          this.ctrl.subdep_name.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '4') {
          this.ctrl.subdep_name.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '5') {
          this.ctrl.subdep_name.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required]);
          }
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '6') {
          this.ctrl.subdep_name.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '7') {
          this.ctrl.subdep_name.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '8') {
          this.ctrl.subdep_name.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required]);
          }
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDresel_share.setValidators([Validators.required]);
          }
        }

        if (this.value.reseller_under == '3' && this.value.serv_type == '1') {
          this.ctrl.subdist_bulk.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
        }
        if (this.value.reseller_under == '3' && this.value.serv_type == '2') {
          this.ctrl.subdist_bulk.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubdis_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '3' && this.value.serv_type == '3') {
          this.ctrl.subdist_bulk.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubdis_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '3' && this.value.serv_type == '4') {
          this.ctrl.subdist_bulk.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubdis_share.setValidators([Validators.required]);
            this.ctrl.ADDresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '3' && this.value.serv_type == '5') {
          this.ctrl.subdist_bulk.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubdis_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required]);
          }
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubdis_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '3' && this.value.serv_type == '6') {
          this.ctrl.subdist_bulk.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubdis_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubdis_share.setValidators([Validators.required]);
            this.ctrl.ADDresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '3' && this.value.serv_type == '7') {
          this.ctrl.subdist_bulk.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubdis_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubdis_share.setValidators([Validators.required]);
            this.ctrl.ADDresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '3' && this.value.serv_type == '8') {
          this.ctrl.subdist_bulk.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubdis_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required]);
          }
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubdis_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubdis_share.setValidators([Validators.required]);
            this.ctrl.ADDresel_share.setValidators([Validators.required]);
          }
        }

        if (this.value.reseller_under == '4' && this.value.serv_type == '1') {
          this.ctrl.subdis_name.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
        }
        if (this.value.reseller_under == '4' && this.value.serv_type == '2') {
          this.ctrl.subdis_name.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubdis_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '4' && this.value.serv_type == '3') {
          this.ctrl.subdis_name.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubdis_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '4' && this.value.serv_type == '4') {
          this.ctrl.subdis_name.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubdis_share.setValidators([Validators.required]);
            this.ctrl.ADDresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '4' && this.value.serv_type == '5') {
          this.ctrl.subdis_name.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubdis_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required]);
          }
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubdis_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '4' && this.value.serv_type == '6') {
          this.ctrl.subdis_name.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubdis_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubdis_share.setValidators([Validators.required]);
            this.ctrl.ADDresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '4' && this.value.serv_type == '7') {
          this.ctrl.subdis_name.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubdis_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubdis_share.setValidators([Validators.required]);
            this.ctrl.ADDresel_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '4' && this.value.serv_type == '8') {
          this.ctrl.subdis_name.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.resel_share.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubdis_share.setValidators([Validators.required]);
            this.ctrl.VOresel_share.setValidators([Validators.required]);
          }
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubdis_share.setValidators([Validators.required]);
            this.ctrl.OTTresel_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubdis_share.setValidators([Validators.required]);
            this.ctrl.ADDresel_share.setValidators([Validators.required]);
          }
        }
        break;

      case 551:
        //sub Distributor Deposit
        this.ctrl.reseller_under.setValidators([Validators.required]);

        //RESELLER UNDER SUB ISP BULK
        if (this.value.reseller_under == '1' && this.value.serv_type == '1') {
          this.ctrl.subisp_bulk.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '2') {
          this.ctrl.subisp_bulk.setValidators([Validators.required])
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required])
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubdis_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '3') {
          this.ctrl.subisp_bulk.setValidators([Validators.required])
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubdis_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '4') {
          this.ctrl.subisp_bulk.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubdis_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '5') {
          this.ctrl.subisp_bulk.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubdis_share.setValidators([Validators.required]);
          }
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubdis_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '6') {
          this.ctrl.subisp_bulk.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubdis_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubdis_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '7') {
          this.ctrl.subisp_bulk.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubdis_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubdis_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '1' && this.value.serv_type == '8') {
          this.ctrl.subisp_bulk.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubdis_share.setValidators([Validators.required]);
          }
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubdis_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubdis_share.setValidators([Validators.required]);
          }
        }

        //RESELLER UNDER SUB ISP DEPOSIT
        if (this.value.reseller_under == '2' && this.value.serv_type == '1') {
          this.ctrl.subdep_name.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
        }
        if (this.value.reseller_under == '2' && this.value.serv_type == '2') {
          this.ctrl.subdep_name.setValidators([Validators.required])
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required])
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubdis_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '2' && this.value.serv_type == '3') {
          this.ctrl.subdep_name.setValidators([Validators.required])
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubdis_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '2' && this.value.serv_type == '4') {
          this.ctrl.subdep_name.setValidators([Validators.required])
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubdis_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '2' && this.value.serv_type == '5') {
          this.ctrl.subdep_name.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubdis_share.setValidators([Validators.required]);
          }
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubdis_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '2' && this.value.serv_type == '6') {
          this.ctrl.subdep_name.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubdis_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubdis_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '2' && this.value.serv_type == '7') {
          this.ctrl.subdep_name.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubdis_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubdis_share.setValidators([Validators.required]);
          }
        }
        if (this.value.reseller_under == '2' && this.value.serv_type == '8') {
          this.ctrl.subdep_name.setValidators([Validators.required]);
          this.ctrl.isp_share.setValidators([Validators.required]);
          this.ctrl.subisp_share.setValidators([Validators.required]);
          this.ctrl.subdis_share.setValidators([Validators.required]);
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
          if (this.value.voshare_type == '1') {
            this.ctrl.VOisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubisp_share.setValidators([Validators.required]);
            this.ctrl.VOsubdis_share.setValidators([Validators.required]);
          }
          if (this.value.ottshare_type == '1') {
            this.ctrl.OTTisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
            this.ctrl.OTTsubdis_share.setValidators([Validators.required]);
          }
          if (this.value.addshare_type == '1') {
            this.ctrl.ADDisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
            this.ctrl.ADDsubdis_share.setValidators([Validators.required]);
          }
        }
        break;

      case 666:
        //Sub ISP Bulk
        if (this.value.serv_type == '2') {
          this.ctrl.voshare_type.setValidators([Validators.required]);
        }
        if (this.value.serv_type == '3') {
          this.ctrl.ottshare_type.setValidators([Validators.required]);
        }
        if (this.value.serv_type == '4') {
          this.ctrl.addshare_type.setValidators([Validators.required]);
        }
        if (this.value.serv_type == '5') {
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required])
        }
        if (this.value.serv_type == '6') {
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required])
        }
        if (this.value.serv_type == '7') {
          this.ctrl.addshare_type.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required])
        }
        if (this.value.serv_type == '8') {
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
        }
        if (this.value.voshare_type == '1') {
          this.ctrl.VOisp_share.setValidators([Validators.required]);
          this.ctrl.VOsubisp_share.setValidators([Validators.required]);
          this.ctrl.VOsubdis_share.setValidators([Validators.required]);
        }
        if (this.value.ottshare_type == '1') {
          this.ctrl.OTTisp_share.setValidators([Validators.required]);
          this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
          this.ctrl.OTTsubdis_share.setValidators([Validators.required]);
        }
        if (this.value.addshare_type == '1') {
          this.ctrl.ADDisp_share.setValidators([Validators.required]);
          this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
          this.ctrl.ADDsubdis_share.setValidators([Validators.required]);
        }
        break;
      case 661:
        //Sub Distributor Bulk
        this.ctrl.subisp_bulk.setValidators([Validators.required]);
        if (this.value.serv_type == '2') {
          this.ctrl.voshare_type.setValidators([Validators.required]);
        }
        if (this.value.serv_type == '3') {
          this.ctrl.ottshare_type.setValidators([Validators.required]);
        }
        if (this.value.serv_type == '4') {
          this.ctrl.addshare_type.setValidators([Validators.required]);
        }
        if (this.value.serv_type == '5') {
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required])
        }
        if (this.value.serv_type == '6') {
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required])
        }
        if (this.value.serv_type == '7') {
          this.ctrl.addshare_type.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required])
        }
        if (this.value.serv_type == '8') {
          this.ctrl.voshare_type.setValidators([Validators.required]);
          this.ctrl.ottshare_type.setValidators([Validators.required]);
          this.ctrl.addshare_type.setValidators([Validators.required]);
        }
        if (this.value.voshare_type == '1') {
          this.ctrl.VOisp_share.setValidators([Validators.required]);
          this.ctrl.VOsubisp_share.setValidators([Validators.required]);
          this.ctrl.VOsubdis_share.setValidators([Validators.required]);
        }
        if (this.value.ottshare_type == '1') {
          this.ctrl.OTTisp_share.setValidators([Validators.required]);
          this.ctrl.OTTsubisp_share.setValidators([Validators.required]);
          this.ctrl.OTTsubdis_share.setValidators([Validators.required]);
        }
        if (this.value.addshare_type == '1') {
          this.ctrl.ADDisp_share.setValidators([Validators.required]);
          this.ctrl.ADDsubisp_share.setValidators([Validators.required]);
          this.ctrl.ADDsubdis_share.setValidators([Validators.required]);
        }
        break;
    }

  }

  infovalid() {
    if (this.value.reselcreate_type == '1') {
      this.ctrl.Role.clearValidators();
      this.ctrl.Role.updateValueAndValidity();

      this.ctrl.RName.clearValidators();
      this.ctrl.RName.updateValueAndValidity();

      this.ctrl.serv_type.clearValidators();
      this.ctrl.serv_type.updateValueAndValidity();

      this.ctrl.FName.clearValidators();
      this.ctrl.FName.updateValueAndValidity();

      this.ctrl.LName.clearValidators();
      this.ctrl.LName.updateValueAndValidity();

      this.ctrl.gender.clearValidators();
      this.ctrl.gender.updateValueAndValidity();

      this.ctrl.email.clearValidators();
      this.ctrl.email.updateValueAndValidity();

      this.ctrl.Mobile.clearValidators();
      this.ctrl.Mobile.updateValueAndValidity();

      this.ctrl.Address.clearValidators();
      this.ctrl.Address.updateValueAndValidity();

      this.ctrl.UserName.clearValidators();
      this.ctrl.UserName.updateValueAndValidity();

      this.ctrl.Password.clearValidators();
      this.ctrl.Password.updateValueAndValidity();

      this.ctrl.CPassword.clearValidators();
      this.ctrl.CPassword.updateValueAndValidity();

      this.ctrl.brname.clearValidators();
      this.ctrl.brname.updateValueAndValidity();

      this.ctrl.Address1.clearValidators();
      this.ctrl.Address1.updateValueAndValidity();

      this.ctrl.State.clearValidators();
      this.ctrl.State.updateValueAndValidity();

      this.ctrl.City.clearValidators();
      this.ctrl.City.updateValueAndValidity();

      this.ctrl.subs_limit.clearValidators();
      this.ctrl.subs_limit.updateValueAndValidity();

      this.ctrl.tax_pay.clearValidators();
      this.ctrl.tax_pay.updateValueAndValidity();

      this.ctrl.reseller_under.clearValidators();
      this.ctrl.reseller_under.updateValueAndValidity();

      this.ctrl.nas_type.clearValidators();
      this.ctrl.nas_type.updateValueAndValidity();

      this.ctrl.ip_type.clearValidators();
      this.ctrl.ip_type.updateValueAndValidity();

      this.ctrl.start_date.clearValidators();
      this.ctrl.start_date.updateValueAndValidity();

      this.ctrl.end_date.clearValidators();
      this.ctrl.end_date.updateValueAndValidity();

      this.ctrl.agrmnt_status.clearValidators();
      this.ctrl.agrmnt_status.updateValueAndValidity();

    }
  }

  poolvalidation() {
    this.value.ip_type == '1' ? this.ctrl.iptype.setValidators([Validators.required]) : this.ctrl.iptype.clearValidators()
    this.ctrl.iptype.updateValueAndValidity();

    this.value.ip_type == '1' ? this.ctrl.FirstIp.setValidators([Validators.required, Validators.pattern('^(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])[.]{1}(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])[.]{1}(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])[.]{1}(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])$')]) : this.ctrl.FirstIp.clearValidators()
    this.ctrl.FirstIp.updateValueAndValidity();

    this.value.ip_type == '1' ? this.ctrl.LastIp.setValidators([Validators.required, Validators.pattern('^(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])[.]{1}(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])[.]{1}(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])[.]{1}(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])$')]) : this.ctrl.LastIp.clearValidators()
    this.ctrl.LastIp.updateValueAndValidity();

    this.value.ip_type == '1' ? this.ctrl.PoolName.setValidators([Validators.required]) : this.ctrl.PoolName.clearValidators()
    this.ctrl.PoolName.updateValueAndValidity();

    this.value.ip_type == '2' ? this.ctrl.ass_ip.setValidators([Validators.required]) : this.ctrl.ass_ip.clearValidators()
    this.ctrl.ass_ip.updateValueAndValidity();
  }

  nasvalidation() {

    this.value.nas_type == '1' ? this.ctrl.nasname.setValidators([Validators.required]) : this.ctrl.nasname.clearValidators()
    this.ctrl.nasname.updateValueAndValidity();

    this.value.nas_type == '1' ? this.ctrl.ip.setValidators([Validators.required, Validators.pattern('^(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])[.]{1}(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])[.]{1}(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])[.]{1}(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])$')]) : this.ctrl.ip.clearValidators()
    this.ctrl.ip.updateValueAndValidity();

    this.value.nas_type == '1' ? this.ctrl.typ.setValidators([Validators.required]) : this.ctrl.typ.clearValidators()
    this.ctrl.typ.updateValueAndValidity();

    this.value.nas_type == '1' ? this.ctrl.ping_status.setValue([Validators.required]) : this.ctrl.ping_status.clearValidators();
    this.ctrl.ping_status.updateValueAndValidity();

    this.value.nas_type == '1' ? this.ctrl.secret.setValidators([Validators.required]) : this.ctrl.secret.clearValidators()
    this.ctrl.secret.updateValueAndValidity();

    this.value.nas_type == '1' && this.value.typ == '0' ? this.ctrl.coamode.setValidators([Validators.required]) : this.ctrl.coamode.clearValidators()
    this.ctrl.coamode.updateValueAndValidity();

    this.value.nas_type == '1' && this.value.typ == '0' ? this.ctrl.api_ver.setValidators([Validators.required]) : this.ctrl.api_ver.clearValidators()
    this.ctrl.api_ver.updateValueAndValidity();

    this.value.nas_type == '1' && this.value.typ == '0' ? this.ctrl.apiusername.setValidators([Validators.required]) : this.ctrl.apiusername.clearValidators()
    this.ctrl.apiusername.updateValueAndValidity();

    this.value.nas_type == '1' && this.value.typ == '0' ? this.ctrl.apipassword.setValidators([Validators.required]) : this.ctrl.apipassword.clearValidators()
    this.ctrl.apipassword.updateValueAndValidity();

    this.value.nas_type == '1' && this.value.typ == '1' ? this.ctrl.password.setValidators([Validators.required]) : this.ctrl.password.clearValidators()
    this.ctrl.password.updateValueAndValidity();

    this.value.nas_type == '1' && this.value.typ == '3' ? this.ctrl.ciscobwmode.setValidators([Validators.required]) : this.ctrl.ciscobwmode.clearValidators()
    this.ctrl.ciscobwmode.updateValueAndValidity();

    this.value.nas_type == '2' ? this.ctrl.ass_nas.setValidators([Validators.required]) : this.ctrl.ass_nas.clearValidators()
    this.ctrl.ass_nas.updateValueAndValidity();

  }

  pingchange() {
    this.value.ping_status == 1 ? this.ctrl.port.setValidators(Validators.required) : this.ctrl.port.clearValidators();
    this.ctrl.port.updateValueAndValidity();
  }

  agreementvalid() {
    this.value.agrmnt_status == '2' ? this.ctrl.drop_date.setValidators([Validators.required]) : this.ctrl.drop_date.clearValidators()
    this.ctrl.drop_date.updateValueAndValidity();

    this.value.agrmnt_status == '2' ? this.ctrl.drop_reason.setValidators([Validators.required]) : this.ctrl.drop_reason.clearValidators()
    this.ctrl.drop_reason.updateValueAndValidity();
  }

  agreementchange() {
    this.ctrl.drop_date.setValue('');
    this.ctrl.drop_reason.setValue('');
  }

  exptimesetting() {
    if (this.value.exp_mode == 2) {
      this.ctrl.exp_time.setValidators(Validators.required);
      this.ctrl.exp_time.updateValueAndValidity();
    } else {
      this.ctrl.exp_time.clearValidators();
      this.ctrl.exp_time.updateValueAndValidity();
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

  GenerateIppool() {
    let ip = this.value.ip_add
    const range = new Netmask(ip)
    this.AddReselForm.controls['FirstIp'].setValue(range.first)
    this.AddReselForm.controls['LastIp'].setValue(range.last)
   }


  async addReseller() {
    this.submit = true;
    // let val = this.AddReselForm.value;
    // this.filereader(this.file, async res => {
    // this.bulk = res;
     // let total = this.mats.length,
 
    let bulkvald: boolean = false;
    for (var i = 0; i < this.bulk.length; i++) {
      if (!this.bulk[i].hasOwnProperty('Reseller Profile*')) {
        this.toastalert('Please fill the Reseller Profile in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let role = this.bulk[i]['Reseller Profile*']
        role = role == 'Bulk Reseller' ? 444 : role == 'Deposit Reseller' ? 333 : role == 'SUB ISP Bulk' ? 666 :
          role == 'SUB ISP Deposit' ? 555 : role == 'Sub Distributor Bulk' ? 661 : role == 'Sub Distributor Deposit' ? 551 : 222;
        this.bulk[i].Role = role;
      }
      if (this.bulk[i].hasOwnProperty('Reseller Under')) {
        let subdepdis = this.bulk[i]['Reseller Under']
        subdepdis = subdepdis == 'None' ? 0 : subdepdis == 'Sub ISP Bulk' ? 1 : subdepdis == 'Sub ISP Deposit' ? 2 : subdepdis == 'Sub Distributor Bulk' ? 3 : 4
        this.bulk[i].reseller_under = subdepdis;
      }
      else {
        this.bulk[i].reseller_under = this.AddReselForm.value['reseller_under']
      }
      if (!this.bulk[i].hasOwnProperty('Reseller Business Name*')) {
        this.toastalert('Please fill the Reseller Business Name in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let rbusname = this.bulk[i]['Reseller Business Name*']
        this.bulk[i].RName = rbusname;
      }
      if (!this.bulk[i].hasOwnProperty('First Name*')) {
        this.toastalert('Please fill the First Name in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let fname = this.bulk[i]['First Name*']
        this.bulk[i].FName = fname;
      }
      if (!this.bulk[i].hasOwnProperty('Last Name*')) {
        this.toastalert('Please fill the Last Name in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let lname = this.bulk[i]['Last Name*']
        this.bulk[i].LName = lname;
      }
      if (!this.bulk[i].hasOwnProperty('Gender*')) {
        this.toastalert('Please fill the Gender in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let gender = this.bulk[i]['Gender*']
        gender = gender == 'Female' ? 1 : gender == 'Male' ? 2 : 3;
        this.bulk[i].gender = gender;
      }
      if (!this.bulk[i].hasOwnProperty('Email*')) {
        this.toastalert('Please fill the Email in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let mail = this.bulk[i]['Email*']
        this.bulk[i].email = mail;
      }
      if (this.bulk[i].hasOwnProperty('Alternate Email')) {
        let amail = this.bulk[i]['Alternate Email']
        this.bulk[i].Aemail = amail;
      }
      else {
        this.bulk[i].Aemail = this.AddReselForm.value['Aemail']
      }
      if (!this.bulk[i].hasOwnProperty('Mobile Number*')) {
        this.toastalert('Please fill the Mobile Number in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let mobnum = this.bulk[i]['Mobile Number*']
        this.bulk[i].Mobile = mobnum;
      }
      if (this.bulk[i].hasOwnProperty('Telephone Number')) {
        let telnum = this.bulk[i]['Telephone Number']
        this.bulk[i].Telephone = telnum;
      }
      else {
        this.bulk[i].Telephone = this.AddReselForm.value['Telephone']
      }
      if (!this.bulk[i].hasOwnProperty('Residential Address*')) {
        this.toastalert('Please fill the Residential Address in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let readdr = this.bulk[i]['Residential Address*']
        this.bulk[i].Address = readdr;
      }
      if (!this.bulk[i].hasOwnProperty('Reseller Login ID*')) {
        this.toastalert('Please fill the Reseller Login ID in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let rlogin = this.bulk[i]['Reseller Login ID*']
        this.bulk[i].UserName = rlogin;
      }
      if (!this.bulk[i].hasOwnProperty('Password*')) {
        this.toastalert('Please fill the Password in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        const md = new Md5
        let password = this.bulk[i]['Password*']
        this.bulk[i].password_en = md.appendStr(password).end();
      }
      if (!this.bulk[i].hasOwnProperty('Branch Name*')) {
        this.toastalert('Please fill the Branch Name in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let branch = this.bulk[i]['Branch Name*']
        this.bulk[i].brname = branch;
      }

      if (!this.bulk[i].hasOwnProperty('Business Address*')) {
        this.toastalert('Please fill the Business Address in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let busaddr = this.bulk[i]['Business Address*']
        this.bulk[i].Address1 = busaddr;
      }
      if (!this.bulk[i].hasOwnProperty('State*')) {
        this.toastalert('Please fill the State in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let stat = this.bulk[i]['State*']
        this.bulk[i].State = stat;
      }
      if (!this.bulk[i].hasOwnProperty('City*')) {
        this.toastalert('Please fill the City in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let cit = this.bulk[i]['City*']
        this.bulk[i].City = cit;
      }
      if (!this.bulk[i].hasOwnProperty('Subscriber Limit*')) {
        this.toastalert('Please fill the Subscriber Limit in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let sublimit = this.bulk[i]['Subscriber Limit*']
        this.bulk[i].subs_limit = sublimit;
      }
      if (!this.bulk[i].hasOwnProperty('Status*')) {
        this.toastalert('Please fill the Status in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let status = this.bulk[i]['Status*']
        status = status == 'Active' ? true : false;
        this.bulk[i].status = status;
      }
      if (this.bulk[i].hasOwnProperty('Nas Name')) {
        let nas = this.bulk[i]['Nas Name']
        this.bulk[i].ass_nas = nas;
      }
      else {
        this.bulk[i].ass_nas = this.AddReselForm.value['ass_nas'];
      }
      if (!this.bulk[i].hasOwnProperty('Agreement Start Date*')) {
        this.toastalert('Please fill the Agreement Start Date in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let stdate = this.bulk[i]['Agreement Start Date*']
        let strtdate = new Date((stdate - (25567 + 2)) * 86400 * 1000)
        this.bulk[i].start_date = strtdate;
      }
      if (!this.bulk[i].hasOwnProperty('Agreement End Date*')) {
        this.toastalert('Please fill the Agreement End Date in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let endate = this.bulk[i]['Agreement End Date*']
        let enddate = new Date((endate - (25567 + 2)) * 86400 * 1000)
        this.bulk[i].end_date = enddate;
      }
      if (this.bulk[i].hasOwnProperty('Sub ISP Bulk')) {
        let subispname = this.bulk[i]['Sub ISP Bulk']
        this.bulk[i].subisp_bulk = subispname;
      }
      else {
        this.bulk[i].subisp_bulk = this.AddReselForm.value['subisp_bulk'];
      }
      if (this.bulk[i].hasOwnProperty('Sub ISP Deposit')) {
        let subispdep = this.bulk[i]['Sub ISP Deposit']
        this.bulk[i].subdep_name = subispdep;
      }
      else {
        this.bulk[i].subdep_name = this.AddReselForm.value['subdep_name']
      }
      if (this.bulk[i].hasOwnProperty('Sub Distributor Bulk')) {
        let subdisbulk = this.bulk[i]['Sub Distributor Bulk']
        this.bulk[i].subdist_bulk = subdisbulk;
      }
      else {
        this.bulk[i].subdist_bulk = this.AddReselForm.value['subdist_bulk'];
      }
      if (this.bulk[i].hasOwnProperty('Sub Distributor Deposit')) {
        let subdisdep = this.bulk[i]['Sub Distributor Deposit']
        this.bulk[i].subdis_name = subdisdep
      }
      else {
        this.bulk[i].subdis_name = this.AddReselForm.value['subdis_name'];
      }
      if (!this.bulk[i].hasOwnProperty('Service Type*')) {
        this.toastalert('Please fill the Service Type in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let sertype = this.bulk[i]['Service Type*']
        sertype = sertype == 'Internet' ? 1 : sertype == 'Internet & Voice' ? 2 : sertype == 'Internet & OTT' ? 3 : sertype == 'Internet & AddOn' ? 4 :
          sertype == 'Internet&Voice&OTT' ? 5 : sertype == 'Internet&Voice&AddOn' ? 6 : sertype == 'Internet&OTT&AddON' ? 7 : 8;
        this.bulk[i].serv_type = sertype;
      }
      if (this.bulk[i].hasOwnProperty('Bandwidth Rate')) {
        let bandrate = this.bulk[i]['Bandwidth Rate']
        this.bulk[i].band_rate = bandrate;
      }
      else {
        this.bulk[i].band_rate = this.AddReselForm.value['band_rate'];
      }
      if (this.bulk[i].hasOwnProperty('Bandwidth Amount')) {
        let bandamt = this.bulk[i]['Bandwidth Amount']
        this.bulk[i].band_amount = bandamt;
      }
      else {
        this.bulk[i].band_amount = this.AddReselForm.value['band_amount'];
      }

      if (this.bulk[i].hasOwnProperty('ISP Share')) {
        let ispshare = this.bulk[i]['ISP Share']
        this.bulk[i].isp_share = ispshare;
      }
      else {
        this.bulk[i].isp_share = this.AddReselForm.value['isp_share'];
      }

      if (this.bulk[i].hasOwnProperty('SubISP Share')) {
        let subispshare = this.bulk[i]['SubISP Share']
        this.bulk[i].subisp_share = subispshare;
      }
      else {
        this.bulk[i].subisp_share = this.AddReselForm.value['subisp_share'];
      }
      if (this.bulk[i].hasOwnProperty('Sub Dist Share')) {
        let subdisshare = this.bulk[i]['Sub Dist Share']
        this.bulk[i].subdis_share = subdisshare;
      }
      else {
        this.bulk[i].subdis_share = this.AddReselForm.value['subdis_share'];
      }
      if (this.bulk[i].hasOwnProperty('Reseller Share')) {
        let reselshare = this.bulk[i]['Reseller Share']
        this.bulk[i].resel_share = reselshare;
      }
      else {
        this.bulk[i].resel_share = this.AddReselForm.value['resel_share'];
      }
      if (this.bulk[i].hasOwnProperty('Voice Enable')) {
        let venable = this.bulk[i]['Voice Enable']
        venable = venable == 'true' ? true : false;
        this.bulk[i].vo_enable = venable;
      }
      else {
        this.bulk[i].vo_enable = this.AddReselForm.value['vo_enable'];
      }
      if (this.bulk[i].hasOwnProperty('Voice ShareType')) {
        let vsharetyp = this.bulk[i]['Voice ShareType']
        vsharetyp = vsharetyp == 'Share' ? 1 : 2;
        this.bulk[i].voshare_type = vsharetyp;
      }
      else {
        this.bulk[i].voshare_type = this.AddReselForm.value['voshare_type'];
      }
      if (this.bulk[i].hasOwnProperty('Voice ISP Share')) {
        let vispshare = this.bulk[i]['Voice ISP Share']
        this.bulk[i].VOisp_share = vispshare;
      }
      else {
        this.bulk[i].VOisp_share = this.AddReselForm.value['VOisp_share'];
      }

      if (this.bulk[i].hasOwnProperty('Voice SubISP Share')) {
        let vsubispshare = this.bulk[i]['Voice SubISP Share']
        this.bulk[i].VOsubisp_share = vsubispshare;
      }
      else {
        this.bulk[i].VOsubisp_share = this.AddReselForm.value['VOsubisp_share'];
      }
      if (this.bulk[i].hasOwnProperty('Voice Sub Dist Share')) {
        let vsubdisshare = this.bulk[i]['Voice Sub Dist Share']
        this.bulk[i].VOsubdis_share = vsubdisshare;
      }
      else {
        this.bulk[i].VOsubdis_share = this.AddReselForm.value['VOsubdis_share'];
      }
      if (this.bulk[i].hasOwnProperty('Voice Reseller Share')) {
        let vreselshare = this.bulk[i]['Voice Reseller Share']
        this.bulk[i].VOresel_share = vreselshare;
      }
      else {
        this.bulk[i].VOresel_share = this.AddReselForm.value['VOresel_share'];
      }
      if (this.bulk[i].hasOwnProperty('OTT Enable')) {
        let oenable = this.bulk[i]['OTT Enable'];
        oenable = oenable == 'true' ? true : false;
        this.bulk[i].ott_enable = oenable;
      }
      else {
        this.bulk[i].ott_enable = this.AddReselForm.value['ott_enable'];
      }
      if (this.bulk[i].hasOwnProperty('OTT ShareType')) {
        let osharetyp = this.bulk[i]['OTT ShareType']
        osharetyp = osharetyp == 'Share' ? 1 : 2;
        this.bulk[i].ottshare_type = osharetyp;
      }
      else {
        this.bulk[i].ottshare_type = this.AddReselForm.value['ottshare_type'];
      }
      if (this.bulk[i].hasOwnProperty('OTT ISP Share')) {
        let oispshare = this.bulk[i]['OTT ISP Share']
        this.bulk[i].OTTisp_share = oispshare;
      }
      else {
        this.bulk[i].OTTisp_share = this.AddReselForm.value['OTTisp_share'];
      }

      if (this.bulk[i].hasOwnProperty('OTT SubISP Share')) {
        let osubispshare = this.bulk[i]['OTT SubISP Share']
        this.bulk[i].OTTsubisp_share = osubispshare;
      }
      else {
        this.bulk[i].OTTsubisp_share = this.AddReselForm.value['OTTsubisp_share'];
      }
      if (this.bulk[i].hasOwnProperty('OTT Sub Dist Share')) {
        let osubdisshare = this.bulk[i]['OTT Sub Dist Share']
        this.bulk[i].OTTsubdis_share = osubdisshare;
      }
      else {
        this.bulk[i].OTTsubdis_share = this.AddReselForm.value['OTTsubdis_share'];
      }
      if (this.bulk[i].hasOwnProperty('OTT Reseller Share')) {
        let oreselshare = this.bulk[i]['OTT Reseller Share']
        this.bulk[i].OTTresel_share = oreselshare;
      }
      else {
        this.bulk[i].OTTresel_share = this.AddReselForm.value['OTTresel_share'];
      }
      if (this.bulk[i].hasOwnProperty('Addon Enable')) {
        let aoenable = this.bulk[i]['Addon Enable'];
        aoenable = aoenable == 'true' ? true : false;
        this.bulk[i].add_enable = aoenable;
      }
      else {
        this.bulk[i].add_enable = this.AddReselForm.value['add_enable'];
      }
      if (this.bulk[i].hasOwnProperty('Addon ShareType')) {
        let aosharetyp = this.bulk[i]['Addon ShareType']
        aosharetyp = aosharetyp == 'Share' ? 1 : 2;
        this.bulk[i].addshare_type = aosharetyp;
      }
      else {
        this.bulk[i].addshare_type = this.AddReselForm.value['addshare_type'];
      }
      if (this.bulk[i].hasOwnProperty('Addon ISP Share')) {
        let aoispshare = this.bulk[i]['Addon ISP Share']
        this.bulk[i].ADDisp_share = aoispshare;
      }
      else {
        this.bulk[i].ADDisp_share = this.AddReselForm.value['ADDisp_share'];
      }

      if (this.bulk[i].hasOwnProperty('Addon SubISP Share')) {
        let aosubispshare = this.bulk[i]['Addon SubISP Share']
        this.bulk[i].ADDsubisp_share = aosubispshare;
      }
      else {
        this.bulk[i].ADDsubisp_share = this.AddReselForm.value['ADDsubisp_share'];
      }
      if (this.bulk[i].hasOwnProperty('Addon Sub Dist Share')) {
        let aosubdisshare = this.bulk[i]['Addon Sub Dist Share']
        this.bulk[i].ADDsubdis_share = aosubdisshare;
      }
      else {
        this.bulk[i].ADDsubdis_share = this.AddReselForm.value['ADDsubdis_share'];
      }
      if (this.bulk[i].hasOwnProperty('Addon Reseller Share')) {
        let aoreselshare = this.bulk[i]['Addon Reseller Share']
        this.bulk[i].ADDresel_share = aoreselshare;
      }
      else {
        this.bulk[i].ADDresel_share = this.AddReselForm.value['ADDresel_share'];
      }
      if (this.bulk[i].hasOwnProperty('GST Number')) {
        let gst = this.bulk[i]['GST Number']
        this.bulk[i].gst_no = gst;
      }
      else {
        this.bulk[i].gst_no = this.AddReselForm.value['gst_no']
      }
      this.ctrl.ip_type.setValue(0);
      this.bulk[i].bus_id = this.AddReselForm.value['bus_id']
      this.bulk[i].ip_type = this.AddReselForm.value['ip_type']
      this.bulk[i].groupid = this.AddReselForm.value['groupid']
      this.bulk[i].ass_ip = this.AddReselForm.value['ass_ip']
      this.bulk[i].share_imed = this.AddReselForm.value['share_imed']
      this.bulk[i].agrmnt_status = this.AddReselForm.value['agrmnt_status']
      this.bulk[i].reselcreate_type = this.AddReselForm.value['reselcreate_type']
      this.bulk[i].sms_app = this.AddReselForm.value['sms_app'];
      this.bulk[i].registration_email = this.AddReselForm.value['registration_email'];
      this.bulk[i].renew_email = this.AddReselForm.value['renew_sms'];
      this.bulk[i].auto_renew_email = this.AddReselForm.value['auto_renew_email'];
      this.bulk[i].auto_renew = this.AddReselForm.value['auto_renew'];
      this.bulk[i].invoice_email = this.AddReselForm.value['invoice_email'];
      this.bulk[i].billpaid_email = this.AddReselForm.value['billpaid_email'];
      this.bulk[i].package_change_email = this.AddReselForm.value['package_change_email'];
      this.bulk[i].extra_data_email = this.AddReselForm.value['extra_data_email'];
      this.bulk[i].temporary_suspend_email = this.AddReselForm.value['temporary_suspend_email'];
      this.bulk[i].amntcredit_add_email = this.AddReselForm.value['amntcredit_add_email'];
      this.bulk[i].amount_balance_email = this.AddReselForm.value['amount_balance_email'];
      this.bulk[i].expiry_alert_email = this.AddReselForm.value['expiry_alert_email'];
      this.bulk[i].expiry_send = this.AddReselForm.value['expiry_send'];
      this.bulk[i].register_alert_email = this.AddReselForm.value['register_alert_email'];
      this.bulk[i].resolve_email = this.AddReselForm.value['resolve_email'];
      this.bulk[i].close_email = this.AddReselForm.value['close_email'];
      this.bulk[i].assigned_email = this.AddReselForm.value['assigned_email'];
      this.bulk[i].register_alert_user_email = this.AddReselForm.value['register_alert_user_email'];
      this.bulk[i].assign_alert_email = this.AddReselForm.value['assign_alert_email'];
      this.bulk[i].deposit_alert_email = this.AddReselForm.value['deposit_alert_email'];
      this.bulk[i].drop_date = this.AddReselForm.value['drop_date'];
      this.bulk[i].drop_reason = this.AddReselForm.value['drop_reason'];
      this.bulk[i].prefix_enable = this.AddReselForm.value['prefix_enable'];
      this.bulk[i].Logo = this.AddReselForm.value['Logo'];
      this.bulk[i].ereceipt = this.AddReselForm.value['ereceipt'];
      this.bulk[i].ecaf = this.AddReselForm.value['ecaf']
    }


    if (this.value.reselcreate_type == '1') {
      this.AddReselForm.controls.ip_type.setValue('0')
    }
    this.s = 0; this.f = 0;
    let s = 0;
    this.failure = [];
     const invalid = [];
    const controls = this.AddReselForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name)
      }
    };
    if (this.AddReselForm.invalid || this.value.Password != this.value.CPassword) {
       window.alert('Please fill all mandatory fields')
      this.submit = true;
      return;
    }
    if (this.value.reselcreate_type == '0') {
      const md5 = new Md5;
      this.value.password_en = md5.appendStr(this.value.Password).end();
       this.value.disney_flag == true ? this.ott_name.push(1) : '';
      this.value.amazon_flag == true ? this.ott_name.push(2) : '';
      this.value.netflix_flag == true ? this.ott_name.push(3) : '';
      this.value.sun_flag == true ? this.ott_name.push(4) : '';
      this.value.zee_flag == true ? this.ott_name.push(5) : '';
      this.value.raj_flag == true ? this.ott_name.push(6) : '';
      this.value.sony_flag == true ? this.ott_name.push(7) : '';
      this.value.hunga_flag == true ? this.ott_name.push(8) : '';
      this.value.ott_name = this.ott_name;
      let reselldata = [this.value];
      let method = 'addReseller';
      this.loading = true;
      let result = await this.resell[method]({ bulkReseller: reselldata });
       if (result[0]['error_msg'] != 0) {
        this.ott_name = [];
      }
      if (result) {
        if (result[0].error_msg == 0) {
          if (this.AddReselForm.value['Logo']) {
            const file = new FormData();
            // let id = result[0]['id'], filename = 'logo',
            let id = '10', filename = 'logo',
              name = id + '-' + filename;
            file.append('file', this.selectedfile, name)
            file.append('id', id)
            let logoresult = await this.resell.uploadResellerLogo(file);
            if (logoresult) {
              this.result_pop(logoresult);
            }
          } else {
            this.result_pop(result);
          }
          this.loading = false;
        } else {
          this.loading = false
          this.result_pop(result);
        }
      }
      // this.createForm();
    }
    if (this.value.reselcreate_type == '1') {
      this.loading = true;
      let method = 'addReseller';
      let result = await this.resell[method]({ bulkReseller: this.bulk });
      if (result) {
        this.loading = false;
        this.result_pop(result);
      }
      // this.createForm();
    }
    // })
  }

  changeListener(file) {
    this.isOpening = true;
    this.file = file;
    this.filereader(this.file, result => {
      this.isOpening = false;
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

  result_pop(item) {
    const activeModal = this.activeModal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.result.then((data) => {

    });
  }

  addvalid() {
    if (this.role.getroleid() < 775) {
      this.AddReselForm.get('bus_id').clearValidators();
      this.AddReselForm.get('bus_id').updateValueAndValidity();

      this.AddReselForm.get('groupid').clearValidators();
      this.AddReselForm.get('groupid').updateValueAndValidity();

      this.AddReselForm.get('reselcreate_type').clearValidators();
      this.AddReselForm.get('reselcreate_type').updateValueAndValidity();
    }
  }

  cancel() {
    this.router.navigate(['/pages/reseller/resellerList']);

  }

  async getService($event = '') {
    if (this.value.Role == 331) {
      const result = await this.service.showServiceName({ bus_id: this.value.bus_id, show_service: 1, like: $event });
      this.assign_service = result;
    }
  }

  createForm() {
    this.AddReselForm = new FormGroup({
      bus_id: new FormControl('', Validators.required),
      groupid: new FormControl('', Validators.required),
      serv_type: new FormControl('', Validators.required),
      // ott_name: new FormControl(''),
      Role: new FormControl('', Validators.required),
      reseller_under: new FormControl(''),
      // bulk_under : new FormControl(0),
      subisp_bulk: new FormControl(''),
      subdep_name: new FormControl(''),
      subdist_bulk: new FormControl(''),
      subdis_name: new FormControl(''),
      band_rate: new FormControl(''),
      band_amount: new FormControl(''),
      isp_share: new FormControl(''),
      resel_share: new FormControl(''),
      subdis_share: new FormControl(''),
      subisp_share: new FormControl(''),
      VOisp_share: new FormControl(''),
      VOresel_share: new FormControl(''),
      VOsubdis_share: new FormControl(''),
      VOsubisp_share: new FormControl(''),
      OTTisp_share: new FormControl(''),
      OTTresel_share: new FormControl(''),
      OTTsubdis_share: new FormControl(''),
      OTTsubisp_share: new FormControl(''),
      ADDisp_share: new FormControl(''),
      ADDresel_share: new FormControl(''),
      ADDsubdis_share: new FormControl(''),
      ADDsubisp_share: new FormControl(''),
      vo_enable: new FormControl(''),
      ott_enable: new FormControl(''),
      add_enable: new FormControl(''),
      voshare_type: new FormControl(''),
      ottshare_type: new FormControl(''),
      addshare_type: new FormControl(''),
      share_type: new FormControl(1),
      //disney
      disney_flag: new FormControl(''),
      disneyshare_type: new FormControl(''),
      disney_isp_share: new FormControl(''),
      disney_subisp_share: new FormControl(''),
      disney_dist_share: new FormControl(''),
      disney_resel_share: new FormControl(''),
      //amazon
      amazon_flag: new FormControl(''),
      amazonshare_type: new FormControl(''),
      amazon_isp_share: new FormControl(''),
      amazon_subisp_share: new FormControl(''),
      amazon_dist_share: new FormControl(''),
      amazon_resel_share: new FormControl(''),
      //netflix
      netflix_flag: new FormControl(''),
      netflixshare_type: new FormControl(''),
      netflix_isp_share: new FormControl(''),
      netflix_subisp_share: new FormControl(''),
      netflix_dist_share: new FormControl(''),
      netflix_resel_share: new FormControl(''),
      //sun
      sun_flag: new FormControl(''),
      sunshare_type: new FormControl(''),
      sun_isp_share: new FormControl(''),
      sun_subisp_share: new FormControl(''),
      sun_dist_share: new FormControl(''),
      sun_resel_share: new FormControl(''),
      //zee
      zee_flag: new FormControl(''),
      zeeshare_type: new FormControl(''),
      zee_isp_share: new FormControl(''),
      zee_subisp_share: new FormControl(''),
      zee_dist_share: new FormControl(''),
      zee_resel_share: new FormControl(''),
      //raj
      raj_flag: new FormControl(''),
      rajshare_type: new FormControl(''),
      raj_isp_share: new FormControl(''),
      raj_subisp_share: new FormControl(''),
      raj_dist_share: new FormControl(''),
      raj_resel_share: new FormControl(''),
      //sony
      sony_flag: new FormControl(''),
      sonyshare_type: new FormControl(''),
      sony_isp_share: new FormControl(''),
      sony_subisp_share: new FormControl(''),
      sony_dist_share: new FormControl(''),
      sony_resel_share: new FormControl(''),
      //hunga
      hunga_flag: new FormControl(''),
      hungashare_type: new FormControl(''),
      hunga_isp_share: new FormControl(''),
      hunga_subisp_share: new FormControl(''),
      hunga_dist_share: new FormControl(''),
      hunga_resel_share: new FormControl(''),
      share_show: new FormControl(1),
      reselcreate_type: new FormControl('', Validators.required),
      UserName: new FormControl('', Validators.required),
      FName: new FormControl('', Validators.required),
      LName: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      Address: new FormControl('', Validators.required),
      Address1: new FormControl('', Validators.required),
      State: new FormControl('', Validators.required),
      City: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern("[0-9 A-Z a-z ,.`!@#$%^&*_]*[@]{1}[a-z A-Z]*[.]{1}[a-z A-Z]{2,3}([.]{1}[a-z A-Z]{2,3})?")]),
      Password: new FormControl('', Validators.required),
      CPassword: new FormControl('', Validators.required),
      Mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      Telephone: new FormControl(''),
      subs_limit: new FormControl('0', Validators.required),
      Notes: new FormControl(''),
      status: new FormControl(true),
      share_imed: new FormControl(false),
      brname: new FormControl('', Validators.required),
      RName: new FormControl('', Validators.required),
      Aemail: new FormControl('', [Validators.pattern("[0-9 A-Z a-z ,.`!@#$%^&*_]*[@]{1}[a-z A-Z]*[.]{1}[a-z A-Z]{2,3}([.]{1}[a-z A-Z]{2,3})?")]),
      gst_no: new FormControl(''),
      ass_ip: new FormControl(''),
      ass_nas: new FormControl(''),
      start_date: new FormControl('', Validators.required),
      end_date: new FormControl('', Validators.required),
      agrmnt_status: new FormControl('1', Validators.required),
      drop_date: new FormControl(''),
      drop_reason: new FormControl(''),
      prefix_enable: new FormControl(''),
      prefix: new FormControl(''),
      sms_app: new FormControl(true),
      mobile_sms: new FormControl(''),
      sms_api: new FormControl(''),
      topup_min: new FormControl(''),
      min_amount: new FormControl(''),
      gateway_type: new FormControl(''),
      limit_charges: new FormControl(''),
      sms_gateway: new FormControl(''),
      subpay_gateway: new FormControl(''),
      subpay_gateway_type: new FormControl('0'),
      pay_gateway: new FormControl(''),
      pay_gateway_type: new FormControl('0'),
      due_amt: new FormControl(''),
      over_due: new FormControl(''),
      credit_flag: new FormControl(''),
      credit_limit: new FormControl(''),
      due_invoice: new FormControl(''),
      expiry_type: new FormControl('1'),
      exp_mode: new FormControl('0'),
      exp_time: new FormControl(''),
      ereceipt: new FormControl(''),
      ecaf: new FormControl(''),
      unique_no: new FormControl(''),
      unique_mail: new FormControl(''),
      registration_sms: new FormControl(''),
      registration_email: new FormControl(true),
      renew_sms: new FormControl(''),
      renew_email: new FormControl(true),
      auto_renew_sms: new FormControl(''),
      auto_renew_email: new FormControl(true),
      auto_renew: new FormControl('4'),
      invoice_sms: new FormControl(''),
      invoice_email: new FormControl(true),
      billpaid_sms: new FormControl(''),
      billpaid_email: new FormControl(true),
      package_change_sms: new FormControl(''),
      package_change_email: new FormControl(true),
      extra_data_sms: new FormControl(''),
      extra_data_email: new FormControl(true),
      temporary_suspend_sms: new FormControl(''),
      temporary_suspend_email: new FormControl(true),
      amntcredit_add_sms: new FormControl(''),
      amntcredit_add_email: new FormControl(true),
      amount_balance_sms: new FormControl(''),
      amount_balance_email: new FormControl(true),
      expiry_alert_sms: new FormControl(''),
      expiry_alert_email: new FormControl(true),
      expiry_send: new FormControl('4'),
      register_alert_sms: new FormControl(''),
      register_alert_email: new FormControl(true),
      resolve_sms: new FormControl(''),
      resolve_email: new FormControl(true),
      close_sms: new FormControl(''),
      close_email: new FormControl(true),
      assigned_sms: new FormControl(''),
      assigned_email: new FormControl(true),
      register_alert_user_sms: new FormControl(''),
      register_alert_user_email: new FormControl(true),
      assign_alert_sms: new FormControl(''),
      assign_alert_email: new FormControl(true),
      deposit_alert_sms: new FormControl(''),
      deposit_alert_email: new FormControl(true),
      Logo: new FormControl(''),
      tax_pay: new FormControl(''),
      ip_type: new FormControl('', Validators.required),
      iptype: new FormControl('1'),
      ip_add: new FormControl(''),
      PoolName: new FormControl(''),
      FirstIp: new FormControl(''),
      LastIp: new FormControl(''),
      NextPool: new FormControl(''),
      Description: new FormControl(''),
      ping_status: new FormControl(0),
      port: new FormControl(''),
      nas_type: new FormControl('', Validators.required),
      nasname: new FormControl(''),
      ip: new FormControl(''),
      typ: new FormControl(''),
      secret: new FormControl(''),
      password: new FormControl(''),
      coamode: new FormControl('2'),
      apiusername: new FormControl(''),
      apipassword: new FormControl(''),
      ciscobwmode: new FormControl('0'),
      api_ver: new FormControl('0'),
      descr: new FormControl(''),

      srsrvid: new FormControl(''),
      srtime: new FormControl('')
    });
  }
}

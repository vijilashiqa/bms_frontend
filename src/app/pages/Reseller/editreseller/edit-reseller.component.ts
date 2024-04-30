import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder, } from '@angular/forms';
import { Router } from '@angular/router';
import { AddSuccessComponent } from './../success/add-success.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BusinessService, GroupService, NasService, IppoolService, ResellerService, SelectService, RoleService, AdminuserService, S_Service } from '../../_service/indexService';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'editreseller',
  templateUrl: './edit-reseller.component.html',
  styleUrls: ['./resellerstyle.scss'],
})

export class EditResellerComponent implements OnInit {
  submit: boolean = false; EditReselForm; id: any = []; anas; ip; grup; editdatas; resellist;
  data; busname; pro; dist; states; bulkReseller = []; servtype; shareval; ottdata; ott_name = [];
  sizes = []; sharename; distname; smsgateway; paymentgateway; ottcheckids; upload; imageURL;
  change: boolean;
  ispsharedefault = true; isReadonly = false; config;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;
  public isOpening = false;
  assign_service;

  constructor(
    private alert: ToasterService,
    private router: Router,
    private _fb: FormBuilder,
    private resell: ResellerService,
    private select: SelectService,
    private busser: BusinessService,
    private groupser: GroupService,
    private activeModal: NgbModal,
    public role: RoleService,
    private nasser: NasService,
    private poolser: IppoolService,
    private adminser: AdminuserService,
    private service: S_Service
  ) {
    this.id = JSON.parse(localStorage.getItem('array'));
  }

  async GroupName() {
    this.grup = await this.groupser.showGroupName({ bus_id: this.value.bus_id });
  }

  async business() {
    this.busname = await this.busser.showBusName({});
  }

  async cityshow($event = '') {
    this.dist = await this.select.showDistrict({ state_id: this.value.State, like: $event });
  }

  async stateshow($event = '') {
    this.states = await this.select.showState({ like: $event });
  }

  async showResellerUnder($event = '') {
    this.resellist = await this.resell.showResellerUnder({
      like: $event, reseller_under: this.value.reseller_under, Role: this.value.Role,
      bus_id: this.value.bus_id, groupid: this.value.groupid, edit_resel: 1
    });
  }

  async SMSgateway($event = '') {
    this.smsgateway = await this.adminser.getSMSGateway({ bus_id: this.value.bus_id, like: $event });
  }

  async PAYGateway() {
    this.paymentgateway = await this.resell.getPayGateway({ bus_id: this.value.bus_id });
  }

  async ottplatform($event = '') {
    if (this.value['serv_type'] == 3 || this.value['serv_type'] == 5 || this.value['serv_type'] == 7 || this.value['serv_type'] == 8) {
      this.ottdata = await this.adminser.showOTTPlatforms({ like: $event });
    }
  }

  prefixChange() {

    if (this.value.prefix_enable == false) {
      this.ctrl.prefix.setValue('');
      this.ctrl.prefix.clearValidators();
      this.ctrl.prefix.updateValueAndValidity()
    } else {
      this.ctrl.prefix.setValidators([Validators.required]);
      this.ctrl.prefix.updateValueAndValidity()

    }
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
    this.anas = await this.nasser.showGroupNas({ like: $event, edit_flag: 1, bus_id: this.value.bus_id, groupid: this.value.groupid });
  }

  async PoolName($event = '') {
    this.ip = await this.poolser.showPoolName({ like: $event, edit_flag: 1, bus_id: this.value.bus_id, ipflag: 1, nas_id: this.value.ass_nas, groupid: this.value.groupid });
  }


  async servicetype() {
    this.servtype = await this.busser.showServiceType({ bus_id: this.value.bus_id, sertype: 1 })
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
    // this.ctrl.isp_share.setValue('');
    // this.ctrl.subisp_share.setValue('');
    // this.ctrl.subdis_share.setValue('');
    // this.ctrl.resel_share.setValue('');
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
    console.log('share--',this.ispsharedefault);
    if (!this.ispsharedefault) {
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
  }

  get ctrl() {
    return this.EditReselForm.controls
  }
  get value() {
    return this.EditReselForm.value
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
        // Sub ISP Deposit

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
        // Bulk Reseller
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
          this.ctrl.subisp_bulk.updateValueAndValidity();
          this.ctrl.isp_share.setValidators([Validators.required]);
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
        // Sub Distributor Deposit
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

  async editReseller() {
    const invalid = [];
    const controls = this.EditReselForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name)
      }
    };
    if (this.EditReselForm.invalid) {
      this.submit = true;
      window.alert('Please Fill All Mandatory Fields')
      return;
    }
    this.value.id = this.id
    this.value.disney_flag == true ? this.ott_name.push(1) : '';
    this.value.amazon_flag == true ? this.ott_name.push(2) : '';
    this.value.netflix_flag == true ? this.ott_name.push(3) : '';
    this.value.sun_flag == true ? this.ott_name.push(4) : '';
    this.value.zee_flag == true ? this.ott_name.push(5) : '';
    this.value.raj_flag == true ? this.ott_name.push(6) : '';
    this.value.sony_flag == true ? this.ott_name.push(7) : '';
    this.value.hunga_flag == true ? this.ott_name.push(8) : '';
    this.value.ott_name = this.ott_name;
    let editresell = [this.value]
    this.loading = true;
    let res = await this.resell.editReseller({ bulkReseller: editresell });
    this.loading = false;
    if (res[0]['error_msg'] != 0) {
      this.ott_name = [];
    }
    if (res) {
      this.result_pop(res);
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

  editvalid() {
    if (this.role.getroleid() < 775) {
      this.ctrl.bus_id.clearValidators();
      this.ctrl.bus_id.updateValueAndValidity();

      this.ctrl.groupid.clearValidators();
      this.ctrl.groupid.updateValueAndValidity();

    }
  }

  async ngOnInit() {
    this.createForm();
    await this.edit();
    await this.business();
    await this.stateshow();
    this.editvalid();
    this.setShareReadOnly();
    if (this.role.getroleid() <= 777) {
      this.ctrl['bus_id'].setValue(this.role.getispid());
      await this.GroupName();
      await this.profile();
      await this.servicetype();
    }
  }

  paymentType() {
    if (!this.EditReselForm.value['pay_gateway']) {
      this.EditReselForm.value['pay_gateway_type'] = 0;
    }
    if (!this.EditReselForm.value['subpay_gateway']) {
      this.EditReselForm.value['subpay_gateway_type'] = 0;
    }
  }

  async edit() {
    let result = await this.resell.getResellerEdit({ id: this.id });
    if (result) {
      this.editdatas = result;

      if (this.editdatas['ott_platform'] != null) {
        var ottid = this.editdatas['ott_platform'].slice(1, -1),
          ott_id = ottid.split(',')
        this.ottcheckids = ott_id.map((i) => Number(i));
      }
    }
    this.createForm();
    await this.GroupName();
    await this.profile();
    await this.cityshow();
    await this.stateshow();
    await this.showResellerUnder();
    await this.servicetype();
    await this.Nas();
    await this.PoolName();
    await this.SMSgateway();
    await this.PAYGateway();
    await this.ottplatform();
    await this.getService();
    // await this.sharedefault();
  }

  cancel() {
    this.router.navigate(['/pages/reseller/resellerList']);
  }


  async getService($event = '') {
    if (this.value.Role == 331) {
      const result = await this.service.showServiceName({ bus_id: this.value.bus_id, show_service: 1, like: $event, resel_id: this.id });
      this.assign_service = result;
    }
  }

  setShareReadOnly() {
    if ([666, 555, 661, 551].includes(this.EditReselForm.value.Role)) {
      this.ispsharedefault = false
    } else this.ispsharedefault = true
  }

  createForm() {
    this.EditReselForm = new FormGroup({
      Role: new FormControl(this.editdatas ? this.editdatas['role'] : ''),
      bus_id: new FormControl(this.editdatas ? this.editdatas['isp_id'] : '', Validators.required),
      groupid: new FormControl(this.editdatas ? this.editdatas['group_id'] : '', Validators.required),
      serv_type: new FormControl(this.editdatas ? this.editdatas['service_type'] : '', Validators.required),
      // ott_name : new FormControl(this.editdatas ? this.editdatas['ott_platform']:''),
      reseller_under: new FormControl(this.editdatas ? this.editdatas['sub_isp_or_dist'] : ''),
      subisp_bulk: new FormControl(this.editdatas ? this.editdatas['sub_isp_id'] : ''),
      subdep_name: new FormControl(this.editdatas ? this.editdatas['sub_isp_id'] : ''),
      subdis_name: new FormControl(this.editdatas ? this.editdatas['sub_dist_id'] : ''),
      subdist_bulk: new FormControl(this.editdatas ? this.editdatas['sub_dist_id'] : ''),
      band_rate: new FormControl(this.editdatas ? this.editdatas['bts_mb'] : ''),
      band_amount: new FormControl(this.editdatas ? this.editdatas['mb_rate'] : ''),
      isp_share: new FormControl(this.editdatas ? this.editdatas['isp_share'] : ''),
      subdis_share: new FormControl(this.editdatas ? this.editdatas['sub_dist_share'] : ''),
      resel_share: new FormControl(this.editdatas ? this.editdatas['reseller_share'] : ''),
      subisp_share: new FormControl(this.editdatas ? this.editdatas['sub_isp_share'] : ''),
      VOisp_share: new FormControl(this.editdatas ? this.editdatas['Visp_share'] : ''),
      VOresel_share: new FormControl(this.editdatas ? this.editdatas['Vreseller_share'] : ''),
      VOsubdis_share: new FormControl(this.editdatas ? this.editdatas['Vsub_dist_share'] : ''),
      VOsubisp_share: new FormControl(this.editdatas ? this.editdatas['Vsub_isp_share'] : ''),
      OTTisp_share: new FormControl(this.editdatas ? this.editdatas['Oisp_share'] : ''),
      OTTresel_share: new FormControl(this.editdatas ? this.editdatas['Oreseller_share'] : ''),
      OTTsubdis_share: new FormControl(this.editdatas ? this.editdatas['Osub_dist_share'] : ''),
      OTTsubisp_share: new FormControl(this.editdatas ? this.editdatas['Osub_isp_share'] : ''),
      ADDisp_share: new FormControl(this.editdatas ? this.editdatas['AONisp_share'] : ''),
      ADDresel_share: new FormControl(this.editdatas ? this.editdatas['AONreseller_share'] : ''),
      ADDsubdis_share: new FormControl(this.editdatas ? this.editdatas['AONsub_dist_share'] : ''),
      ADDsubisp_share: new FormControl(this.editdatas ? this.editdatas['AONsub_isp_share'] : ''),
      vo_enable: new FormControl(this.editdatas ? this.editdatas['Vstatus'] == 2 ? true : false : ''),
      ott_enable: new FormControl(this.editdatas ? this.editdatas['Ostatus'] == 2 ? true : false : ''),
      add_enable: new FormControl(this.editdatas ? this.editdatas['AONstatus'] == 2 ? true : false : ''),
      voshare_type: new FormControl(this.editdatas ? this.editdatas['Vshare'] : ''),
      ottshare_type: new FormControl(this.editdatas ? this.editdatas['Oshare'] : ''),
      addshare_type: new FormControl(this.editdatas ? this.editdatas['AONshare'] : ''),
      UserName: new FormControl(this.editdatas ? this.editdatas['managername'] : ''),
      share_type: new FormControl(this.editdatas ? this.editdatas['sharing_type'] : ''),
      share_show: new FormControl(this.editdatas ? this.editdatas['sharing_show'] : ''),
      share_imed: new FormControl(this.editdatas ? this.editdatas['share_immediate'] : ''),
      //disney
      disney_flag: new FormControl(this.ottcheckids ? this.ottcheckids.includes(1) ? true : false : ''),
      disneyshare_type: new FormControl(this.editdatas ? this.editdatas['disney_share_type'] : ''),
      disney_isp_share: new FormControl(this.editdatas ? this.editdatas['disneyIspShare'] : ''),
      disney_subisp_share: new FormControl(this.editdatas ? this.editdatas['disneySubispShare'] : ''),
      disney_dist_share: new FormControl(this.editdatas ? this.editdatas['disneySubDistShare'] : ''),
      disney_resel_share: new FormControl(this.editdatas ? this.editdatas['disneyResellerShare'] : ''),
      //amazon
      amazon_flag: new FormControl(this.ottcheckids ? this.ottcheckids.includes(2) ? true : false : ''),
      amazonshare_type: new FormControl(this.editdatas ? this.editdatas['amazon_share_type'] : ''),
      amazon_isp_share: new FormControl(this.editdatas ? this.editdatas['amazonIspShare'] : ''),
      amazon_subisp_share: new FormControl(this.editdatas ? this.editdatas['amazonSubispShare'] : ''),
      amazon_dist_share: new FormControl(this.editdatas ? this.editdatas['amazonSubDistShare'] : ''),
      amazon_resel_share: new FormControl(this.editdatas ? this.editdatas['amazonResellerShare'] : ''),
      //netflix
      netflix_flag: new FormControl(this.ottcheckids ? this.ottcheckids.includes(3) ? true : false : ''),
      netflixshare_type: new FormControl(this.editdatas ? this.editdatas['netflix_share_type'] : ''),
      netflix_isp_share: new FormControl(this.editdatas ? this.editdatas['netflixIspShare'] : ''),
      netflix_subisp_share: new FormControl(this.editdatas ? this.editdatas['netflixSubispShare'] : ''),
      netflix_dist_share: new FormControl(this.editdatas ? this.editdatas['netflixSubDistShare'] : ''),
      netflix_resel_share: new FormControl(this.editdatas ? this.editdatas['netflixResellerShare'] : ''),
      //sun
      sun_flag: new FormControl(this.ottcheckids ? this.ottcheckids.includes(4) ? true : false : ''),
      sunshare_type: new FormControl(this.editdatas ? this.editdatas['sunnext_share_type'] : ''),
      sun_isp_share: new FormControl(this.editdatas ? this.editdatas['sunnextIspShare'] : ''),
      sun_subisp_share: new FormControl(this.editdatas ? this.editdatas['sunnextSubispShare'] : ''),
      sun_dist_share: new FormControl(this.editdatas ? this.editdatas['sunnextSubDistShare'] : ''),
      sun_resel_share: new FormControl(this.editdatas ? this.editdatas['sunnextResellerShare'] : ''),
      //zee
      zee_flag: new FormControl(this.ottcheckids ? this.ottcheckids.includes(5) ? true : false : ''),
      zeeshare_type: new FormControl(this.editdatas ? this.editdatas['zee5_share_type'] : ''),
      zee_isp_share: new FormControl(this.editdatas ? this.editdatas['zee5IspShare'] : ''),
      zee_subisp_share: new FormControl(this.editdatas ? this.editdatas['zee5SubispShare'] : ''),
      zee_dist_share: new FormControl(this.editdatas ? this.editdatas['zee5SubDistShare'] : ''),
      zee_resel_share: new FormControl(this.editdatas ? this.editdatas['zee5ResellerShare'] : ''),
      //raj
      raj_flag: new FormControl(this.ottcheckids ? this.ottcheckids.includes(6) ? true : false : ''),
      rajshare_type: new FormControl(this.editdatas ? this.editdatas['raj_share_type'] : ''),
      raj_isp_share: new FormControl(this.editdatas ? this.editdatas['rajIspShare'] : ''),
      raj_subisp_share: new FormControl(this.editdatas ? this.editdatas['rajSubispShare'] : ''),
      raj_dist_share: new FormControl(this.editdatas ? this.editdatas['rajSubDistShare'] : ''),
      raj_resel_share: new FormControl(this.editdatas ? this.editdatas['rajResellerShare'] : ''),
      //sony
      sony_flag: new FormControl(this.ottcheckids ? this.ottcheckids.includes(7) ? true : false : ''),
      sonyshare_type: new FormControl(this.editdatas ? this.editdatas['sony_share_type'] : ''),
      sony_isp_share: new FormControl(this.editdatas ? this.editdatas['sonyIspShare'] : ''),
      sony_subisp_share: new FormControl(this.editdatas ? this.editdatas['sonySubispShare'] : ''),
      sony_dist_share: new FormControl(this.editdatas ? this.editdatas['sonySubDistShare'] : ''),
      sony_resel_share: new FormControl(this.editdatas ? this.editdatas['sonyResellerShare'] : ''),
      //hunga
      hunga_flag: new FormControl(this.ottcheckids ? this.ottcheckids.includes(8) ? true : false : ''),
      hungashare_type: new FormControl(this.editdatas ? this.editdatas['hun_share_type'] : ''),
      hunga_isp_share: new FormControl(this.editdatas ? this.editdatas['hunIspShare'] : ''),
      hunga_subisp_share: new FormControl(this.editdatas ? this.editdatas['hunSubispShare'] : ''),
      hunga_dist_share: new FormControl(this.editdatas ? this.editdatas['hunSubDistShare'] : ''),
      hunga_resel_share: new FormControl(this.editdatas ? this.editdatas['hunResellerShare'] : ''),
      FName: new FormControl(this.editdatas ? this.editdatas['firstname'] : '', Validators.required),
      LName: new FormControl(this.editdatas ? this.editdatas['lastname'] : '', Validators.required),
      gender: new FormControl(this.editdatas ? this.editdatas['gender'] : '', Validators.required),
      Address: new FormControl(this.editdatas ? this.editdatas['address'] : '', Validators.required),
      Address1: new FormControl(this.editdatas ? this.editdatas['res_branch_address'] : '', Validators.required),
      State: new FormControl(this.editdatas ? this.editdatas['state'] : '', Validators.required),
      City: new FormControl(this.editdatas ? this.editdatas['city'] : '', Validators.required),
      email: new FormControl(this.editdatas ? this.editdatas['email'] : '', [Validators.required, Validators.pattern("[0-9 A-Z a-z ,.`!@#$%^&*_]*[@]{1}[a-z A-Z]*[.]{1}[a-z A-Z]{2,3}([.]{1}[a-z A-Z]{2,3})?")]),
      Mobile: new FormControl(this.editdatas ? this.editdatas['mobile'] : '', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      Telephone: new FormControl(this.editdatas ? this.editdatas['phone'] : ''),
      Notes: new FormControl(this.editdatas ? this.editdatas['notes'] : ''),
      subs_limit: new FormControl(this.editdatas ? this.editdatas['sub_limit'] : '', Validators.required),
      status: new FormControl(this.editdatas ? this.editdatas['status'] : ''),
      brname: new FormControl(this.editdatas ? this.editdatas['branch'] : ''),
      RName: new FormControl(this.editdatas ? this.editdatas['company'] : '', Validators.required),
      Aemail: new FormControl(this.editdatas ? this.editdatas['altr_email'] : '', [Validators.pattern("[0-9 A-Z a-z ,.`!@#$%^&*_]*[@]{1}[a-z A-Z]*[.]{1}[a-z A-Z]{2,3}([.]{1}[a-z A-Z]{2,3})?")]),
      gst_no: new FormControl(this.editdatas ? this.editdatas['gst_no'] : ''),
      ass_ip: new FormControl(this.editdatas ? this.editdatas['ippool_id'] : ''),
      ass_nas: new FormControl(this.editdatas ? this.editdatas['prim_nas_id'] : ''),
      sms_app: new FormControl(this.editdatas ? this.editdatas['MobileAppAccess'] : ''),
      topup_min: new FormControl(this.editdatas ? this.editdatas['topup_minimum'] : ''),
      min_amount: new FormControl(this.editdatas ? this.editdatas['minimum_amt'] : ''),
      gateway_type: new FormControl(this.editdatas ? this.editdatas['sms_gtwy_id'] : ''),
      sms_gateway: new FormControl(this.editdatas ? this.editdatas['sms_gateway'] : ''),
      subpay_gateway: new FormControl(this.editdatas ? this.editdatas['sub_pay_gtwy'] : ''),
      subpay_gateway_type: new FormControl(this.editdatas ? this.editdatas['sub_pay_gtwy_id'] : '0'),
      pay_gateway: new FormControl(this.editdatas ? this.editdatas['pay_gtwy'] : ''),
      pay_gateway_type: new FormControl(this.editdatas ? this.editdatas['pay_gtwy_id'] : '0'),
      due_amt: new FormControl(this.editdatas ? this.editdatas['max_due_amt'] : ''),
      over_due: new FormControl(this.editdatas ? this.editdatas['overdue'] : ''),
      credit_flag: new FormControl(this.editdatas ? this.editdatas['credit_flag'] : ''),
      credit_limit: new FormControl(this.editdatas ? this.editdatas['credit_limit'] : ''),
      due_invoice: new FormControl(this.editdatas ? this.editdatas['check_due_invoices'] : ''),
      expiry_type: new FormControl(this.editdatas ? JSON.stringify(this.editdatas['expiry_type']) : '1'),
      exp_mode: new FormControl(this.editdatas ? JSON.stringify(this.editdatas['expmode']) : ''),
      exp_time: new FormControl(this.editdatas ? this.editdatas['exptime'] : ''),
      ereceipt: new FormControl(this.editdatas ? this.editdatas['ereceipt'] : ''),
      ecaf: new FormControl(this.editdatas ? this.editdatas['ecaf'] : ''),
      prefix_enable: new FormControl(this.editdatas ? (this.editdatas['prefix_on'] == 'false' ? false : true) : ''),
      prefix: new FormControl(this.editdatas ? this.editdatas['prefix'] : ''),
      unique_no: new FormControl(this.editdatas ? this.editdatas['uniq_mbl_num'] : ''),
      unique_mail: new FormControl(this.editdatas ? this.editdatas['uniq_mail_id'] : ''),
      registration_sms: new FormControl(this.editdatas ? this.editdatas['cust_reg_sms'] : ''),
      registration_email: new FormControl(this.editdatas ? this.editdatas['cust_reg_email'] : ''),
      renew_sms: new FormControl(this.editdatas ? this.editdatas['cust_pck_renewal_sms'] : ''),
      renew_email: new FormControl(this.editdatas ? this.editdatas['cust_pck_renewal_email'] : ''),
      auto_renew_sms: new FormControl(this.editdatas ? this.editdatas['autoRenew_alrt_sms'] : ''),
      auto_renew_email: new FormControl(this.editdatas ? this.editdatas['autoRenew_alrt_email'] : ''),
      auto_renew: new FormControl(this.editdatas ? this.editdatas['auto_renew'] : ''),
      invoice_sms: new FormControl(this.editdatas ? this.editdatas['cust_invoice_alrt_sms'] : ''),
      invoice_email: new FormControl(this.editdatas ? this.editdatas['cust_invoice_alrt_email'] : ''),
      billpaid_sms: new FormControl(this.editdatas ? this.editdatas['cust_billpay_alrt_sms'] : ''),
      billpaid_email: new FormControl(this.editdatas ? this.editdatas['cust_billpay_alrt_email'] : ''),
      package_change_sms: new FormControl(this.editdatas ? this.editdatas['package_change_sms'] : ''),
      package_change_email: new FormControl(this.editdatas ? this.editdatas['package_change_email'] : ''),
      extra_data_sms: new FormControl(this.editdatas ? this.editdatas['extra_data_sms'] : ''),
      extra_data_email: new FormControl(this.editdatas ? this.editdatas['extra_data_email'] : ''),
      amntcredit_add_sms: new FormControl(this.editdatas ? this.editdatas['amntcredit_add_sms'] : ''),
      amntcredit_add_email: new FormControl(this.editdatas ? this.editdatas['amntcredit_add_email'] : ''),
      amount_balance_sms: new FormControl(this.editdatas ? this.editdatas['amount_balance_sms'] : ''),
      amount_balance_email: new FormControl(this.editdatas ? this.editdatas['amount_balance_email'] : ''),
      expiry_alert_sms: new FormControl(this.editdatas ? this.editdatas['expiry_sms'] : ''),
      expiry_alert_email: new FormControl(this.editdatas ? this.editdatas['expiry_email'] : ''),
      expiry_send: new FormControl(this.editdatas ? this.editdatas['expiry_send'] : ''),
      temporary_suspend_sms: new FormControl(this.editdatas ? this.editdatas['cust_tempSusp_sms'] : ''),
      temporary_suspend_email: new FormControl(this.editdatas ? this.editdatas['cust_tempSusp_email'] : ''),
      register_alert_sms: new FormControl(this.editdatas ? this.editdatas['comp_reg_alrt_toUser_sms'] : ''),
      register_alert_email: new FormControl(this.editdatas ? this.editdatas['comp_reg_alrt_toUser_email'] : ''),
      resolve_sms: new FormControl(this.editdatas ? this.editdatas['comp_resol_toUser_Cust_sms'] : ''),
      resolve_email: new FormControl(this.editdatas ? this.editdatas['comp_resol_toUser_Cust_email'] : ''),
      close_sms: new FormControl(this.editdatas ? this.editdatas['comp_clse_toUser_Cust_sms'] : ''),
      close_email: new FormControl(this.editdatas ? this.editdatas['comp_clse_toUser_Cust_email'] : ''),
      assigned_sms: new FormControl(this.editdatas ? this.editdatas['comp_asignToEmp_sms'] : ''),
      assigned_email: new FormControl(this.editdatas ? this.editdatas['comp_asignToEmp_email'] : ''),
      register_alert_user_sms: new FormControl(this.editdatas ? this.editdatas['comp_reg_alrt_toCust_sms'] : ''),
      register_alert_user_email: new FormControl(this.editdatas ? this.editdatas['comp_reg_alrt_toCust_email'] : ''),
      assign_alert_sms: new FormControl(this.editdatas ? this.editdatas['lead_asign_toEmp_sms'] : ''),
      assign_alert_email: new FormControl(this.editdatas ? this.editdatas['lead_asign_toEmp_email'] : ''),
      deposit_alert_sms: new FormControl(this.editdatas ? this.editdatas['deposit_alert_sms'] : ''),
      deposit_alert_email: new FormControl(this.editdatas ? this.editdatas['deposit_alert_email'] : ''),
      Logo: new FormControl(this.editdatas ? this.editdatas['Logo'] : ''),
      tax_pay: new FormControl(this.editdatas ? this.editdatas['tax_payby'] : ''),
      start_date: new FormControl(this.editdatas ? this.editdatas['start_date'] : '', Validators.required),
      end_date: new FormControl(this.editdatas ? this.editdatas['end_date'] : '', Validators.required),
      agrmnt_status: new FormControl(this.editdatas ? this.editdatas['agg_status'] : '1', Validators.required),
      drop_date: new FormControl(this.editdatas ? this.editdatas['drop_date'] : ''),
      drop_reason: new FormControl(this.editdatas ? this.editdatas['drop_reason'] : ''),

      srsrvid: new FormControl(this.editdatas ? this.editdatas['srsrvid'] : ''),
      srtime: new FormControl(this.editdatas ? this.editdatas['srtime'] : '')
    });
  }
}

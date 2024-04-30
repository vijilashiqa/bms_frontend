
import { Component, OnInit, ChangeDetectorRef, ViewRef } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AddSuccessComponent } from './../success/add-success.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Md5 } from 'ts-md5/dist/md5';
import {
  CustService, S_Service, SelectService, RoleService,
  BusinessService, GroupService, ResellerService, UsernameValidator
} from '../../_service/indexService';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'ngx-add-card-user',
  templateUrl: './add-card-user.component.html',
  styleUrls: ['./add-card-user.component.scss']
})
export class AddCardUserComponent implements OnInit {
  submit: boolean = false; AddSubsForm; resell; datas; pack; cusprefix; branches;
  ip; busname; grup; states; dist; subsid;
  simul = false; id; editdata;config;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;


  constructor(
    private alert: ToasterService,
    private router: Router,
    private serv: S_Service,
    private custser: CustService,
    private select: SelectService,
    public activeModal: NgbModal,
    private busser: BusinessService,
    private groupser: GroupService,
    private resser: ResellerService,
    public role: RoleService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private aRoute: ActivatedRoute

  ) { }

  ngAfterViewChecked(): void {
    if (this.changeDetectorRef !== null &&
      this.changeDetectorRef !== undefined &&
      !(this.changeDetectorRef as ViewRef).destroyed) {
      this.changeDetectorRef.detectChanges();
    }
  }

  async ngOnInit() {
    this.createForm();

    await this.business();
    await this.stateshow();
    this.addvalid();
    if (this.role.getroleid() <= 775) {
      this.AddSubsForm.get('bus_id').setValue(this.role.getispid());
      await this.GroupName();
      await this.showReseller();
      await this.Service();
     await this.subprefix();
      await this.reselbranch();
    }
    if (this.role.getroleid() < 775) {
      this.AddSubsForm.get('bus_id').setValue(this.role.getispid())
      this.AddSubsForm.get('groupid').setValue(this.role.getgrupid());
      if (this.role.getroleid() == 330 || this.role.getroleid() == 221) {
        this.AddSubsForm.get('reseller').setValue(this.role.getmanagerid());
      } else if (this.role.getroleid() == 331 || this.role.getroleid() == 222) {
        this.AddSubsForm.get('reseller').setValue(this.role.getresellerid());
      }
      this.AddSubsForm.get('create_type').setValue('0')
      this.AddSubsForm.get('groupid').clearValidators();
      this.AddSubsForm.get('groupid').updateValueAndValidity();

      this.AddSubsForm.get('reseller').clearValidators();
      this.AddSubsForm.get('reseller').updateValueAndValidity();
      await this.showReseller();

    }
    if (this.role.getroleid() > 444) {
      this.AddSubsForm.get('bus_id').setValue(this.role.getispid())
      this.AddSubsForm.get('groupid').setValue(this.role.getgrupid());
      this.AddSubsForm.get('create_type').setValue('0')
      this.AddSubsForm.get('groupid').clearValidators();
      this.AddSubsForm.get('groupid').updateValueAndValidity();

    }
    if (this.role.getroleid() >= 775) {
      this.AddSubsForm.get('sim_use').clearValidators();
      this.AddSubsForm.get('sim_use').updateValueAndValidity();

      this.AddSubsForm.get('Expiry').clearValidators();
      this.AddSubsForm.get('Expiry').updateValueAndValidity();
    }

    if (this.aRoute.snapshot.queryParams.id) {
      await this.GroupName();
      await this.showReseller();
      await this.reselbranch();
      this.id = this.aRoute.snapshot.queryParams.id;
      await this.getEditData()
      await this.createForm()
      await this.Service();
      await this.cityshow();
     }
  }

  async getEditData() {
    const result = await this.custser.getSubscriberEdit({ id: this.id })
    this.editdata = result[0]
  }

  async business() {
    this.busname = await this.busser.showBusName({})
  }
  async GroupName() {
    this.grup = await this.groupser.showGroupName({ bus_id: this.AddSubsForm.value['bus_id'] })
  }
  async showReseller($event = '') {
    this.resell = await this.resser.showResellerName({ bus_id: this.AddSubsForm.value['bus_id'], groupid: this.AddSubsForm.value['groupid'], role: 331, like: $event });
  }
  async cityshow($event = '') {
    this.dist = await this.select.showDistrict({ state_id: this.AddSubsForm.value['state'], like: $event, index: 0, limit: 15 })
  }
  async stateshow($event = '') {
    this.states = await this.select.showState({ like: $event })
  }

  async subprefix() {
    if (this.role.getroleid() >= 775) {
      let result = await this.custser.custprofileid({ resel_id: this.AddSubsForm.value['reseller'] })
      this.cusprefix = result[1];
      let custprofile = result[0]
      let rid = this.AddSubsForm.value['reseller']
    if(this.cusprefix)  this.subsid = this.cusprefix['status']   
      if (this.subsid == true) {
        this.AddSubsForm.controls.ID.setValue(custprofile.next_id)
      }
      else {
        this.AddSubsForm.controls.ID.setValue('')
      }
    }
    if (this.role.getroleid() < 775) {
      let result;
      if (this.role.getroleid() == 330 || this.role.getroleid() == 221) {
        result = await this.custser.custprofileid({ resel_id: this.role.getmanagerid() })
      } else if (this.role.getroleid() == 331 || this.role.getroleid() == 222) {
        result = await this.custser.custprofileid({ resel_id: this.role.getresellerid() })
      }
      this.cusprefix = result[1];
      let custprofile = result[0]
      let rid = this.AddSubsForm.value['reseller']
      this.subsid = this.cusprefix['status']
      if (this.subsid == true) {
        this.AddSubsForm.controls.ID.setValue(custprofile.next_id)
      }
      else {
        this.AddSubsForm.controls.ID.setValue('')
      }
    }

  }

  addvalid() {
    if (this.role.getroleid() < 775) {
      this.AddSubsForm.get('bus_id').clearValidators();
      this.AddSubsForm.get('bus_id').updateValueAndValidity();

      this.AddSubsForm.get('groupid').clearValidators();
      this.AddSubsForm.get('groupid').updateValueAndValidity();

      this.AddSubsForm.get('reseller').clearValidators();
      this.AddSubsForm.get('reseller').updateValueAndValidity();

      this.AddSubsForm.get('create_type').clearValidators();
      this.AddSubsForm.get('create_type').updateValueAndValidity();

      this.AddSubsForm.get('Expiry').clearValidators();
      this.AddSubsForm.get('Expiry').updateValueAndValidity();
    }
  }

  async Service($event = '') {
    if (this.role.getroleid() >= 775) {
      console.log('show service data', this.AddSubsForm.value['reseller'])
      this.pack = await this.serv.showServiceName({ resel_id: this.AddSubsForm.value['reseller'], like: $event, show_service: 1 })
    }
    if (this.role.getroleid() < 775) {
      if (this.role.getroleid() == 330) {
        this.pack = await this.serv.showServiceName({ show_service: 1, resel_id: this.role.getmanagerid(), like: $event })
      } else if (this.role.getroleid() == 331) {
        this.pack = await this.serv.showServiceName({ show_service: 1, resel_id: this.role.getresellerid(), like: $event })
      }
    }

  }

  async reselbranch() {
    if (this.role.getroleid() >= 775) {
      this.branches = await this.resser.showResellerBranch({ resel_id: this.AddSubsForm.value['reseller'] })
    }
    if (this.role.getroleid() < 775 && (this.role.getroleid() <= 444)) {
      if (this.role.getroleid() == 330 || this.role.getroleid() == 221) {
        this.branches = await this.resser.showResellerBranch({ resel_id: this.role.getmanagerid() })
      } else if (this.role.getroleid() == 331 || this.role.getroleid() == 222) {
        this.branches = await this.resser.showResellerBranch({ resel_id: this.role.getresellerid() })
      }
    }
  }



  async formSubmit() {
    this.submit = true;
    const invalid = [];
    const controls = this.AddSubsForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name)
      }
    };
    if (this.AddSubsForm.invalid) {
      console.log('Invalid', invalid)
      window.alert('Please fill all the fields marked with Asterisks*')
      return;
    }
    const md = new Md5;

    if (this.AddSubsForm.value['create_type'] == '0') {
      const md5 = new Md5;
      if (!this.id) this.AddSubsForm.value['propass_en'] = md5.appendStr(this.AddSubsForm.value['propass']).end();
      this.AddSubsForm.value['sub_role'] = 111;
      if(this.id) this.AddSubsForm.value.id = this.id
      let subsdata = [this.AddSubsForm.value];
      const method = this.id ? 'updateCardUser' : 'addCardUser'
      this.loading = true;
      let result = await this.custser[method]({ cardUser: subsdata });
      if (result) {
        this.loading = false;
        this.result_pop(result, true);
      }
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

  result_pop(item, add_res) {
    const activeModal = this.activeModal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.componentInstance.add_card_res = add_res;
    activeModal.result.then((data) => {

    });
  }


  cancel() {
    this.router.navigate(['/pages/cust/list-card-user']);
  }



  createForm() {
    this.AddSubsForm = new FormGroup({
      bus_id: new FormControl(this.editdata ? this.editdata['isp_id'] : '', Validators.required),
      groupid: new FormControl(this.editdata ? this.editdata['groupid'] : '', Validators.required),
      reseller: new FormControl(this.editdata ? this.editdata['reseller_id'] : '', Validators.required),
      create_type: new FormControl('0', Validators.required),
      loc: new FormControl(this.editdata ? this.editdata['location_id'] : '', Validators.required),
      propass: new FormControl('', !this.id ? Validators.required:[]),
      confpass: new FormControl(''),
      // ID: new FormControl(this.editdata ? this.editdata['username'] : '', [Validators.required, Validators.pattern("[a-z0-9._\-\]{5,20}$"), UsernameValidator.cannotContainSpace]),
      ID: new FormControl(this.editdata ? this.editdata['username'] : '', Validators.required),
      First: new FormControl(this.editdata ? this.editdata['firstname'] : '', Validators.required),
      mobnum: new FormControl(this.editdata ? this.editdata['mobile'] : '', [Validators.pattern('^[0-9]{10}$')]),
      phonenum: new FormControl(this.editdata ? this.editdata['phone'] : '', [Validators.pattern('^[0-9]{11}$')]),
      state: new FormControl(this.editdata ? this.editdata['state'] : '', Validators.required),
      city: new FormControl(this.editdata ? this.editdata['city'] : '', Validators.required),
      email: new FormControl(this.editdata ? this.editdata['email'] : '', [Validators.pattern("[0-9 A-Z a-z ,.`!@#$%^&*_]*[@]{1}[a-z A-Z 0-9]*[.]{1}[a-z A-Z]{2,3}([.]{1}[a-z A-Z]{2,3})?")]),
      locality: new FormControl(this.editdata ? this.editdata['area'] : ''),
      Installation: new FormControl(this.editdata ? this.editdata['address'] : ''),
      descr: new FormControl(this.editdata ? this.editdata['descr'] : ''),
      status: new FormControl('1', Validators.required),
      package: new FormControl(this.editdata ? this.editdata['srvid'] : '', Validators.required),
      Expiry: new FormControl(this.editdata ? this.editdata['expiration'] == '0000-00-00 00:00:00' ? '' : this.editdata['expiration'] : '', Validators.required),
      sim_use: new FormControl(this.editdata ? this.editdata['simultaneous_use'] : '1', Validators.required),
      pincode: new FormControl(this.editdata ? this.editdata['zip'] : ''),

    });
  }




}
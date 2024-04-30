import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BusinessService, CustService, S_Service, OperationService, RoleService, PaymentService, ResellerService } from '../../_service/indexService';
import { AddSuccessComponent } from './../success/add-success.component';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { timingSafeEqual } from 'crypto';

@Component({
  selector: 'subsrenewal',
  templateUrl: './subsrenewal.component.html'
  // styleUrls:['./custstyle.scss'],
})

export class SubsRenewalComponent implements OnInit {
  submit: boolean = false; SubsRenewForm; config; modalHeader; servtype; pack; subser; id; condition;
  subpack; datas; item; packc; expdate; lastpack; lastsubplan; sstatus; cu_date; expirydate; curentdate;
  reselData; ottplans; ottPlanDetails; ottPlatforms; ottsched_date; sched_date;
  acc_type = 0;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(
    private alert: ToasterService,
    private router: Router,
    private activemodal: NgbModal,
    private busser: BusinessService,
    private serv: S_Service,
    private custser: CustService,
    private opser: OperationService,
    private payser: PaymentService,
    private role: RoleService,
    private resrv: ResellerService,

  ) { }

  async ngOnInit() {
    this.acc_type = this.role.getAccountType();
    console.log('Account type',this.acc_type);
    this.createForm();
    await this.Service();
    await this.previouspack();
    await this.showReseller();

    var edate = window.localStorage.getItem('subsexp_date');
    this.expdate = new Date(edate)
    this.expdate.setTime(Math.floor((this.expdate.getTime()) + (5 * 3600 * 1000 + 1800000)))
    this.expirydate = ((this.expdate).toISOString()).slice(0, 16);
    // console.log(this.expdate);

    this.cu_date = new Date();
    this.cu_date.setTime(Math.floor((this.cu_date.getTime()) + (5 * 3600 * 1000 + 1800000)))
    this.curentdate = ((this.cu_date).toISOString()).slice(0, 16);
    this.SubsRenewForm.get('pay_date').setValue(this.curentdate);
    // console.log('cdate',this.curentdate);
    if (this.expirydate <= this.curentdate) {
      this.SubsRenewForm.get('schedule_date').setValue(this.curentdate);
      this.SubsRenewForm.get('pay_type').setValue(2);
    } else {
      // console.log("edate",this.expirydate);
      this.SubsRenewForm.get('schedule_date').setValue(this.expirydate);
    }


  }
  async showReseller() {
    this.reselData = await this.resrv.showResellerName({ cust_id: this.role.getsubid() });
    [this.reselData] = this.reselData;
    console.log('Reseller Data', this.reselData)
    if ([3, 5, 7, 8].includes(this.reselData['service_type'])) await this.showottplan()
  }
  async showottplan($event = '') {
    this.ottplans = await this.serv.renewOtt({ reseller_id: this.reselData['id'], like: $event });
    console.log('ShowOttPlans', this.ottplans)
  }

  async getottDetails() {
    console.log('ottplanid', this.SubsRenewForm.value['ottplanid'])
    this.ottPlanDetails = this.ottplans.filter(item => item.omid == this.SubsRenewForm.value['ottplanid']);
    [this.ottPlanDetails] = this.ottPlanDetails;
    console.log('Selected ott plan', this.ottPlanDetails);
    await this.paidamount();
  }

  async getOttPlatforms() {
    if (this.SubsRenewForm.value['ottplanid']) {
      let resp = await this.serv.getottplanname({ ottplanid: this.ottPlanDetails['ottplanid'] })
      console.log('Response', resp)
      if (resp['ottname']) this.ottPlatforms = resp['ottname'].split(',')
      console.log('ottplatform', this.ottPlatforms)
    }

  }

  paidamount() {
    if (this.SubsRenewForm.value['ottplanid']) {
      this.SubsRenewForm.get('amt').setValue(Number(this.packc[0]['base_amount']) + Number(this.packc[0]['tax_amount'] + Number(this.ottPlanDetails['ottamt'])))
    } else {
      this.SubsRenewForm.get('amt').setValue(Number(this.packc[0]['base_amount']) + Number(this.packc[0]['tax_amount']))
    }

  }

  async schedulecal() {
    if (this.SubsRenewForm.value['pay_type'] == 5) {
      this.sched_date = new Date(this.SubsRenewForm.value['schedule_date']);
      if (this.packc[0]['type'] == 0) {
        const days = this.packc[0]['time_unit'] + this.packc[0]['additional_days']
        this.sched_date.setDate(this.sched_date.getDate() + days);
      } else {
        const days = this.packc[0]['additional_days']
        if (days != 0) this.sched_date.setDate(this.sched_date.getDate() + days);
        this.sched_date.setMonth(this.sched_date.getMonth() + this.packc[0]['time_unit'])
      }
      if(this.reselData.expmode == 1){
        this.sched_date = new Date(this.sched_date).setHours(23,59,59,999)
      }
      if(this.reselData.expmode == 2){
        const time = this.reselData.exptime.split(':')
        this.sched_date = new Date(this.sched_date).setHours(time[0],time[1],59,999)
      }

    }
  }

  async ottScheduleCal() {
    if (this.SubsRenewForm.value['pay_type'] == 5 && this.SubsRenewForm.value['ottplanid']) {
      this.ottsched_date = new Date(this.SubsRenewForm.value['schedule_date']);
      if (this.ottPlanDetails['dayormonth'] == 1) {
        this.ottsched_date.setDate(this.ottsched_date.getDate() + this.ottPlanDetails['days']);
      } else {
        this.ottsched_date.setMonth(this.ottsched_date.getMonth() + this.ottPlanDetails['days'])
      }

    }
  }


  async previouspack() {
    if (this.sstatus == 1) {
      this.lastpack = await this.pack.filter(item => item.sstatus == 1).map(item => item.srvid);
      // this.SubsRenewForm.get('last_pack').setValue(this.lastpack)
      this.SubsRenewForm.get('srvid').setValue(Number(this.lastpack))
      this.subplanshow();
    }
  }

  async Service($event = '') {
    // console.log($event);
    let res = await this.serv.showServiceName({ rflag: 1, like: $event })
    this.pack = res;
    // console.log(res)
    this.sstatus = this.pack.filter(item => item.sstatus == 1).map(item => item.sstatus);
  }

  async subplanshow($event = '') {
    this.SubsRenewForm.get('sub_plan_id').setValue('')
    let result = await this.serv.showSubPlan({ rflag: 1, srvid: this.SubsRenewForm.value['srvid'], like: $event })
    this.subpack = result;
    // console.log(result)
    let spstatus = this.subpack.filter(item => item.spstatus == 1).map(item => item.spstatus);
    if (spstatus == 1) {
      this.lastsubplan = this.subpack.filter(item => item.spstatus == 1).map(item => item.id);
      this.SubsRenewForm.get('sub_plan_id').setValue(Number(this.lastsubplan))
      this.packcal()
    }
  }
  ottValidation() {
    let [mode] = this.pack.filter(x => x.srvid == this.SubsRenewForm.value['srvid']).map(x => x.renewalmode)
    if (mode == 1) {
      this.SubsRenewForm.controls['ottplanid'].setValidators([Validators.required])
    } else {
      this.SubsRenewForm.controls['ottplanid'].clearValidators();
      this.SubsRenewForm.controls['ottplanid'].updateValueAndValidity();
    }

  }

  async Renewsubs() {
    // console.log(this.SubsRenewForm.value)
    if (this.SubsRenewForm.invalid || this.SubsRenewForm.value['srvid'] == null || this.SubsRenewForm.value['sub_plan_id'] == null) {
      window.alert('Please fill mandatory fields')
      this.submit = true;
      return;
    }
    this.loading = true;
    this.SubsRenewForm.value['cust_id'] = this.role.getsubid();
    this.SubsRenewForm.value['role'] = this.role.getroleid();

    let renewaldata = [this.SubsRenewForm.value]
    // let result = await this.opser.subscriber_renewal({ renewal: renewaldata })
    let result = await this.payser.payment(this.SubsRenewForm.value);
    this.loading = false;
    // console.log("result", JSON.parse(result));
    result = JSON.parse(result);
    // console.log("result",JSON.parse(result));
    if (result['error_msg'] == 0) {
      const div = document.createElement('div');
      div.innerHTML = result['ldata'];
      while (div.children.length > 0) {
        document.body.appendChild(div.children[0])
      }
      const form: any = document.getElementById("f1");
      // console.log('form',form)
      form.submit();
    } else {
      // this.toastalert(result['msg'],result['error_msg']);
      window.alert(result['msg'])
    }

    // console.log(result);
    //  let res = result[0]
    // if (result) {
    //   this.result_pop(result, 1);
    // }
  }

  async packcal() {
    // console.log(this.SubsRenewForm.value['sub_plan_id'])
    this.packc = this.subpack.filter(item => item.id == this.SubsRenewForm.value['sub_plan_id'])
    if(this.reselData.expmode == 1){
      this.packc[0].days = new Date(this.packc[0].days).setHours(23,59,59,999)
    }
    if(this.reselData.expmode == 2){
      const time = this.reselData.exptime.split(':')
      this.packc[0].days = new Date(this.packc[0].days).setHours(time[0],time[1],59,999)
    }
    console.log('asd', this.packc)
    await this.paidamount();

  }

  toastalert(msg, status = 0) {
    const toast: Toast = {
      type: status == 1 ? 'success' : 'warning',
      title: status == 1 ? 'Success' : 'Failure',
      body: msg,
      timeout: 2000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
  }

  result_pop(item, subs) {
    const activemodal = this.activemodal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activemodal.componentInstance.modalHeader = 'Result';
    activemodal.componentInstance.item = item, subs;
    activemodal.result.then((data) => {
    });
  }

  onNavigate() {
    window.open("http://www.bluelotusservices.com/terms.php#Terms", "_blank");
  }

  createForm() {
    this.SubsRenewForm = new FormGroup({
      last_pack: new FormControl(''),
      srvid: new FormControl('', Validators.required),
      sub_plan_id: new FormControl('', Validators.required),
      // pay_status: new FormControl('1'),
      pay_date: new FormControl(''),
      pay_type: new FormControl('2'),
      Discount: new FormControl(''),
      exp_date: new FormControl(''),
      schedule_date: new FormControl(''),
      comment: new FormControl(''),
      amt: new FormControl(''),
      ottplanid: new FormControl(''),

    });
  }
}
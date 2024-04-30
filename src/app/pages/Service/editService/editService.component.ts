import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AddSuccessComponent } from './../success/add-success.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NbAccordionItemComponent } from '@nebular/theme';
import { RoleService, SelectService, S_Service, BusinessService, GroupService, NasService, ResellerService } from '../../_service/indexService';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'edit-service',
  templateUrl: './editService.component.html',
  styles: ['hr{border: 0px;}'],
  styleUrls: ['./editService.component.scss']
})

export class EditServiceComponent implements OnInit {
  submit: boolean = false; EditServiceForm; id; editdatas; busname; nasips;
  resell; buresellitems; nasresel; grup; reseldata; edititems; idnas; res_id; bulkService = [];
  editprice; config; falback; svst_date; svend_date; carryover; expvalid;

  constructor(
    private alert: ToasterService,
    private ser: S_Service,
    private select: SelectService,
    private router: Router,
    private _fb: FormBuilder,
    private service: S_Service,
    private busser: BusinessService,
    private groupser: GroupService,
    private nasser: NasService,
    public activeModal: NgbModal,
    public role: RoleService,
    private resser: ResellerService,
    private datePipe: DatePipe

  ) { this.id = JSON.parse(localStorage.getItem('array')); }

  async group() {
    this.grup = await this.groupser.showGroupName({ bus_id: this.EditServiceForm.value['bus_id'] });
  }

  async business() {
    this.busname = await this.busser.showBusName({});
  }

  async busresell() {
    this.buresellitems = await this.nasser.showGroupNas({ edit_flag: 1, bus_id: this.EditServiceForm.value['bus_id'], groupid: this.EditServiceForm.value['groupid'], serassign_type: 2 });
    await this.reselledit();

  }

  async resellcheck(check) {
    await this.buresellitems.forEach(x => x.datas = check)
  }

  async checkedreselitems() {
    let checkedresell = this.buresellitems.filter(item => item.datas).map(item => item.id)
    this.reseldata = checkedresell;
    this.fallbackser();
  }

  reselledit() {
    if (this.res_id) {
      this.buresellitems.filter(item => item.datas = this.res_id.includes(item.id))
    }
    this.checkedreselitems();
  }

  srvdatachange() {
    this.EditServiceForm.controls['Download'].setValue(false)
    this.EditServiceForm.controls['Upload'].setValue(false)
    this.EditServiceForm.controls['Online'].setValue(false)
    this.EditServiceForm.controls['Total'].setValue(false)
  }

  servalidcheck() {
    this.EditServiceForm.value['ser_validity'] == 2 ? this.EditServiceForm.get('st_date').setValidators([Validators.required]) : this.EditServiceForm.get('st_date').clearValidators();
    this.EditServiceForm.get('st_date').updateValueAndValidity();

    this.EditServiceForm.value['ser_validity'] == 2 ? this.EditServiceForm.get('end_date').setValidators([Validators.required]) : this.EditServiceForm.get('end_date').clearValidators();
    this.EditServiceForm.get('end_date').updateValueAndValidity();

    this.EditServiceForm.value['ser_validity'] == 1 ? this.EditServiceForm.get('st_date').setValue(null) : this.EditServiceForm.value['st_date']
    this.EditServiceForm.value['ser_validity'] == 1 ? this.EditServiceForm.get('end_date').setValue(null) : this.EditServiceForm.value['end_date']

  }

  changecheck() {
    if (this.EditServiceForm.value['Total'] == true) {
      this.EditServiceForm.controls['Download'].setValue(false)
      this.EditServiceForm.controls['Upload'].setValue(false)
    }
    else {
      this.EditServiceForm.controls.tTraffic.setValue(0);
      this.EditServiceForm.controls.tottraf_initial.setValue(0);
    }
    if (this.EditServiceForm.value['Download'] == false) {
      this.EditServiceForm.controls.dTraffic.setValue(0);
      this.EditServiceForm.controls.dltraf_initial.setValue(0);


    }
    if (this.EditServiceForm.value['Upload'] == false) {
      this.EditServiceForm.controls.uTraffic.setValue(0);
      this.EditServiceForm.controls.ultraf_initial.setValue(0);

    }
    if (this.EditServiceForm.value['Online'] == false) {
      this.EditServiceForm.controls.ontime.setValue(0);

      this.EditServiceForm.controls.initial.setValue(0);

      this.EditServiceForm.controls.timeunit.setValue('');
    }

  }

  ciscovalid() {
    this.EditServiceForm.value['ciscopolicy'] == true ? this.EditServiceForm.get('cisco_dl').setValidators([Validators.required]) : this.EditServiceForm.get('cisco_dl').clearValidators();
    this.EditServiceForm.value['ciscopolicy'] == true ? this.EditServiceForm.get('cisco_ul').setValidators([Validators.required]) : this.EditServiceForm.get('cisco_ul').clearValidators();
    if (this.EditServiceForm.value['ciscopolicy'] == false) {
      this.EditServiceForm.controls.cisco_dl.setValue('')
      this.EditServiceForm.controls.cisco_ul.setValue('')
    }
  }

  burst() {
    if (this.EditServiceForm.value['burst_mode'] == false) {
      this.EditServiceForm.controls.Limit.setValue('');
      this.EditServiceForm.controls.Limit1.setValue('');
      this.EditServiceForm.controls.Treshold.setValue('');
      this.EditServiceForm.controls.Treshold1.setValue('');
      this.EditServiceForm.controls.Time.setValue('');
      this.EditServiceForm.controls.Time1.setValue('');
    }
  }

  validdate() {
    if (this.EditServiceForm.value['ser_valid'] == '1') {
      this.EditServiceForm.get('stprice_date').setValue('');
      this.EditServiceForm.get('endprice_date').setValue('');

      this.EditServiceForm.get('stprice_date').clearValidators()
      this.EditServiceForm.get('stprice_date').updateValueAndValidity()

      this.EditServiceForm.get('endprice_date').clearValidators()
      this.EditServiceForm.get('endprice_date').updateValueAndValidity()
    }
    if (this.EditServiceForm.value['ser_valid'] == '2') {
      this.EditServiceForm.get('stprice_date').setValidators([Validators.required])
      this.EditServiceForm.get('endprice_date').setValidators([Validators.required])
    }
  }

  async ngOnInit() {
    await this.business();
    this.createForm();
    await this.edit();
    if (this.role.getroleid() <= 777) {
      this.EditServiceForm.get('bus_id').setValue(this.role.getispid());
      this.group();
    }
    if (this.role.getroleid() < 775) {
      this.EditServiceForm.get('groupid').clearValidators();
      this.EditServiceForm.get('groupid').updateValueAndValidity();
    }
    if (this.role.getroleid() >= 775 || this.role.getroleid() == 666 || this.role.getroleid() == 665) {
      this.EditServiceForm.get('ser_validity').setValidators([Validators.required]);
    }
    if (this.role.getroleid() < 443) {
      this.EditServiceForm.get('ser_validity').setValue('1')
    }
  }

  cancel() {
    this.router.navigate(['/pages/service/service-list']);
  }

  async edit() {
    let result = await this.ser.getService({ srvid: this.id });
    // console.log(result)      
    this.editdatas = result[0][0];
    this.edititems = result[1]
    this.editprice = result[2]
    this.res_id = this.edititems.map(item => item.id);
    this.createForm();
    await this.group();
    await this.busresell();
    await this.priceedit();
    await this.fallbackser();
    await this.servalidcheck()
    this.svst_date = new Date(this.editdatas.svstartdate)
    this.svend_date = new Date(this.editdatas.svenddate)
    this.svst_date.setTime(Math.floor((this.svst_date.getTime()) + (5 * 3600 * 1000 + 1800000)))
    this.svend_date.setTime(Math.floor((this.svend_date.getTime()) + (5 * 3600 * 1000 + 1800000)))
    var start_date = ((this.svst_date).toISOString()).slice(0, 16),
      end_date = ((this.svend_date).toISOString()).slice(0, 16);
    // this.svst_date = new Date(this.editdatas.svstartdate).toISOString().slice(0,16),
    // this.svend_date = new Date(this.editdatas.svenddate).toISOString().slice(0,16)
    //  console.log("Start Date",start_date)
    this.EditServiceForm.get('st_date').setValue(start_date)
    this.EditServiceForm.get('end_date').setValue(end_date)
  }

  priceedit() {
    if (this.role.getroleid() == 444 && this.EditServiceForm.value['Type'] == 0) {
      let pricedata = this.editprice
      for (var i = 0; i < pricedata.length; i++) {
        this.priceDetails.push(this.createMaterial(pricedata[i]['srp_id'], pricedata[i]['sub_plan'], pricedata[i]['amount'], pricedata[i]['time_unit'], pricedata[i]['type'], pricedata['days_flag'],
          pricedata[i]['additional_days'], pricedata[i]['status'], pricedata[i]['validity'], pricedata[i]['startdate'], pricedata[i]['enddate'], pricedata[i]['tax_type']));
      }
    }
  }

  async fallbackser() {
    this.falback = await this.service.showFallback({ resel_id: this.reseldata, serassign_type: 2 })
    // console.log(res)
  }

  async editService() {
    // console.log(this.EditServiceForm.value)
    if (this.EditServiceForm.value['Data'] == '2' && (this.EditServiceForm.value['Download'] == false && this.EditServiceForm.value['Upload'] == false && this.EditServiceForm.value['Total'] == false)) {
      this.toastalert('Please Select Any Limit Download or Upload or Total', 0)
      return;
    }
    const invalid = [];
    const controls = this.EditServiceForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name)
      }
    };
    // console.log('Invalid', invalid);
    if (this.EditServiceForm.invalid) {
      this.submit = true;
      return;
    }
    this.EditServiceForm.value['id'] = this.id;
    this.EditServiceForm.value['reselid'] = this.reseldata;
    let servicedata = [this.EditServiceForm.value]
    let result = await this.ser.editService({ bulkService: servicedata });
    // console.log(result);
    if (result) {
      this.result_pop(result, true)
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

  result_pop(item, editpackage) {
    const activeModal = this.activeModal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.componentInstance.editpackage = editpackage;
    activeModal.result.then((data) => {
    });
  }

  get priceDetails(): FormArray {
    return this.EditServiceForm.get('priceDetails') as FormArray;
  }
  addPrice() {
    this.priceDetails.push(this.createMaterial());
  }
  deletepriceField(index: number) {
    this.priceDetails.removeAt(index);
  }
  createMaterial(subid = '', plan = '', serprice = '', timeunit = '', timetype = '', days = '', addays = '', substatus = '',
    sub_validity = '', st_date = '', end_date = '', tax_type = ''): FormGroup {
    return this._fb.group({
      srp_id: [subid],
      sub_plan: [plan],
      ser_price: [serprice],
      time_unit: [timeunit],
      timeunit_type: [timetype],
      dayflag: [days],
      add_days: [addays],
      subplan_status: [substatus],
      subplan_validity: [sub_validity],
      subst_date: [st_date],
      subend_date: [end_date],
      sertax_cal: [tax_type]
    });
  }

  assignCardService() {
    if (this.EditServiceForm.value.srv_type == 1) this.EditServiceForm.get('Service').setValue('0');
  }

  createForm() {
    this.EditServiceForm = new FormGroup({
      // serassign_type: new FormControl(this.editdatas ? this.editdatas : ''),
      bus_id: new FormControl(this.editdatas ? this.editdatas['isp_id'] : '', Validators.required),
      groupid: new FormControl(this.editdatas ? this.editdatas['group_id'] : ''),
      Name: new FormControl(this.editdatas ? this.editdatas['srvname'] : '', Validators.required),
      Type: new FormControl(this.editdatas ? this.editdatas['srvmode'] : '', Validators.required),
      ciscopolicy: new FormControl(this.editdatas ? this.editdatas['policy'] : ''),
      cisco_dl: new FormControl(this.editdatas ? this.editdatas['policymapdl'] : ''),
      cisco_ul: new FormControl(this.editdatas ? this.editdatas['policymapul'] : ''),
      datadl_rate: new FormControl(this.editdatas ? this.editdatas['downrate'] : ''),
      dataul_rate: new FormControl(this.editdatas ? this.editdatas['uprate'] : ''),
      Service: new FormControl(this.editdatas ? (this.editdatas['srvtype']) : '', Validators.required),
      srv_type: new FormControl(this.editdatas ? JSON.stringify(this.editdatas['srv_type']): '0', Validators.required),
      Expiry: new FormControl(this.editdatas ? this.editdatas['limitexpiration'] : '', Validators.required),
      ser_validity: new FormControl(this.editdatas ? this.editdatas['svalidity'] : ''),
      st_date: new FormControl(''),
      end_date: new FormControl(''),
      data_split: new FormControl(this.editdatas ? this.editdatas['datasplit'] : ''),
      serstatus: new FormControl(this.editdatas ? this.editdatas['enableservice'] : ''),
      Data: new FormControl(this.editdatas ? this.editdatas['srvdatatype'] : '', Validators.required),
      Total: new FormControl(this.editdatas ? (this.editdatas['limitcomb'] == 0 ? this.editdatas['limitcomb'] = false : this.editdatas['limitcomb'] = true) : ''),
      tTraffic: new FormControl(this.editdatas ? this.editdatas['trafficunitcomb'] : ''),
      tottraf_initial: new FormControl(this.editdatas ? this.editdatas['inittotal'] : ''),
      Download: new FormControl(this.editdatas ? (this.editdatas['limitdl'] == 0 ? this.editdatas['limitdl'] = false : this.editdatas['limitdl'] = true) : ''),
      dTraffic: new FormControl(this.editdatas ? this.editdatas['trafficunitdl'] : ''),
      dltraf_initial: new FormControl(this.editdatas ? this.editdatas['initdl'] : ''),
      Upload: new FormControl(this.editdatas ? this.editdatas['limitul'] : ''),
      uTraffic: new FormControl(this.editdatas ? this.editdatas['trafficunitul'] : ''),
      ultraf_initial: new FormControl(this.editdatas ? this.editdatas['initul'] : ''),
      Online: new FormControl(this.editdatas ? this.editdatas['limituptime'] : ''),
      ontime: new FormControl(this.editdatas ? this.editdatas['timeunitonline'] : ''),
      initial: new FormControl(this.editdatas ? this.editdatas['inittimeonline'] : ''),
      timeunit: new FormControl(this.editdatas ? this.editdatas['timebaseonline'] : ''),
      // quota: new FormControl(this.editdatas ? this.editdatas['d_quota'] : ''),
      dQuota: new FormControl(this.editdatas ? this.editdatas['dlquota'] : '0'),
      uQuota: new FormControl(this.editdatas ? this.editdatas['uQuota'] : '0'),
      // tot_quota: new FormControl(this.editdatas ? this.editdatas['tot_quota'] : ''),
      tQuota: new FormControl(this.editdatas ? this.editdatas['combquota'] : '0'),
      sQuota: new FormControl(this.editdatas ? this.editdatas['timequota'] : ''),
      disable_ser: new FormControl(this.editdatas ? this.editdatas['disnextsrvid'] : ''),
      exp_service: new FormControl(this.editdatas ? this.editdatas['nextsrvid'] : ''),
      daily_service: new FormControl(this.editdatas ? this.editdatas['dailynextsrvid'] : ''),
      burst_mode: new FormControl(this.editdatas ? this.editdatas['enableburst'] : ''),
      Limit: new FormControl(this.editdatas ? this.editdatas['dlburstlimit'] : ''),
      Limit1: new FormControl(this.editdatas ? this.editdatas['ulburstlimit'] : ''),
      Priority: new FormControl(this.editdatas ? this.editdatas['priority'] : ''),
      Treshold: new FormControl(this.editdatas ? this.editdatas['dlburstthreshold'] : ''),
      Treshold1: new FormControl(this.editdatas ? this.editdatas['ulburstthreshold'] : ''),
      Time: new FormControl(this.editdatas ? this.editdatas['dlbursttime'] : ''),
      Time1: new FormControl(this.editdatas ? this.editdatas['ulbursttime'] : ''),
      carry_over: new FormControl(this.editdatas ? this.editdatas['carryover'] : ''),
      reset_dateexp: new FormControl(this.editdatas ? this.editdatas['resetctrdate'] : ''),
      traffic_neg: new FormControl(this.editdatas ? this.editdatas['resetctrneg'] : ''),
      add_credits: new FormControl(this.editdatas ? this.editdatas['enaddcredits'] : ''),
      srvtype: new FormControl(JSON.stringify(this.editdatas ? this.editdatas['timeaddmodeexp'] : '')),
      srvtype1: new FormControl(JSON.stringify(this.editdatas ? this.editdatas['timeaddmodeonline'] : '')),
      srvtype2: new FormControl(JSON.stringify(this.editdatas ? this.editdatas['trafficaddmode'] : '')),
      expdate_unit: new FormControl(this.editdatas ? this.editdatas['timeunitexp'] : ''),
      exp_initial: new FormControl(this.editdatas ? this.editdatas['inittimeexp'] : ''),
      exp_period: new FormControl(this.editdatas ? this.editdatas['timebaseexp'] : ''),
      minbase_qty: new FormControl(this.editdatas ? this.editdatas['minamount'] : ''),
      addtrafic_unit: new FormControl(this.editdatas ? this.editdatas['addamount'] : ''),
      minadd_qty: new FormControl(this.editdatas ? this.editdatas['minamountadd'] : ''),
      resell_name: new FormControl(this.editdatas ? this.editdatas['managername'] : ''),
      ass_nas: new FormControl(this.editdatas ? this.editdatas['nasid'] : ''),
      ser_tax: new FormControl(true),
      // sertax_cal: new FormControl(this.editdatas ? this.editdatas['tax_type']:''),
      // price_status: new FormControl(''),
      ser_valid: new FormControl(''),
      stprice_date: new FormControl(''),
      endprice_date: new FormControl(''),
      renewalmode: new FormControl(this.editdatas ? this.editdatas['renewalmode'] : ''),
      priceDetails: new FormArray([
        // this.createMaterial()
      ]),
    });
  }

}
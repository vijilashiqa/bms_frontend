import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { S_Service, BusinessService, GroupService, RoleService, ResellerService, AdminuserService } from '../../_service/indexService';
import { find } from 'rxjs/operators';
import { AddSuccessComponent } from './../success/add-success.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'edit-price',
  templateUrl: './edit-price.component.html',
  styleUrls: ['./edit-price.component.scss'],
})

export class EditPriceComponent implements OnInit {
  submit: boolean = false; EditPriceForm; groups; id; editdatas; resell; plan;
  busname; grup; pack; sharetyp; reselrole; edititems; config; servtype; ottdata; resott; ottflag; ott_ids;
  deletePricefield;

  constructor(
    private router: Router,
    private alert: ToasterService,
    private ser: S_Service,
    private busser: BusinessService,
    private groupser: GroupService,
    public role: RoleService,
    private resser: ResellerService,
    private _fb: FormBuilder,
    private adminser: AdminuserService,
    public activeModal: NgbModal,


  ) { this.id = JSON.parse(localStorage.getItem('array')); }

  async business() {
    this.busname = await this.busser.showBusName({});
    // console.log(result);
  }

  async group() {
    this.grup = await this.groupser.showGroupName({ bus_id: this.EditPriceForm.value['bus_id'] });

  }

  async packshow($event = '') {
    if (this.role.getroleid() > 444) {
      this.pack = await this.ser.showServiceName({ edit_flag: 1, resel_id: this.EditPriceForm.value['reseller'], like: $event });
      // console.log(res);
    }
    if (this.role.getroleid() <= 444) {
      this.pack = await this.ser.showServiceName({ edit_flag: 1, like: $event });
      // console.log(res);
    }
  }

  async showReseller() {
    if (this.role.getroleid() > 444) {
      this.resell = await this.resser.showResellerName({
        edit_flag: 1,
        bus_id: this.EditPriceForm.value['bus_id'], groupid: this.EditPriceForm.value['groupid'], except: 1
      });
      // console.log(res)
      await this.share();
    }
    if (this.role.getroleid() <= 444) {
      this.resell = await this.resser.showResellerName({ edit_flag: 1, except: 1 });
      // console.log(res)
      await this.share();
    }
  }
  async showottplan() {
    this.plan = await this.ser.showOTTPlans({ bus_id: this.EditPriceForm.value['bus_id'] });
  }

  ottids() {
    var resid = this.EditPriceForm.value['reseller']
    const ottdata = this.resell.filter(item => item.id == resid).map(item => item.ott_platform)
    let ottid = ottdata[0] != null ? ottdata[0].slice(1, -1) : '',
      ott_id = ottid.split(',');
    this.ott_ids = ott_id.map((i) => Number(i))
    console.log('ottids', this.ott_ids)
    if (this.ott_ids != null) {
      this.ottplatforms();
    }
  }

  async ottplatforms() {
    this.ottdata = await this.adminser.showOTTPlatforms({});
    console.log('ottids', this.ottdata)
    this.resott = this.ottdata.filter(item => this.ott_ids.includes(item.ott_id));
    // this.ottflag = this.resott.reduce((a, o) => (a.push(o.ott_id), a), [])
    this.ottflag = this.resott.filter(x => x.ott_id).map(a => a.ott_id)
    console.log('Ottflag', this.ottflag)
  }

  share() {
    if (this.role.getroleid() > 444) {
      let reselid = this.EditPriceForm.value['reseller']
      this.sharetyp = this.resell.filter(item => item.id == reselid).map(item => item.sharing_type)
      this.reselrole = this.resell.filter(item => item.id == reselid).map(item => item.role)
      // console.log("share",this.sharetyp,"role",this.reselrole)

    }
    if (this.role.getroleid() <= 444) {
      let reselid = this.role.getresellerid();
      this.sharetyp = this.resell.filter(item => item.id == reselid).map(item => item.sharing_type)
      this.reselrole = this.role.getroleid();
      // console.log("share",this.sharetyp,"role",this.reselrole)
    }
  }

  async servicetype() {
    if (this.role.getroleid() <= 444) {
      this.servtype = await this.busser.showServiceType({ sertype: 1 });
      // console.log(result);
    }
    if (this.role.getroleid() > 444) {
      this.servtype = await this.busser.showServiceType({ sertype: 1, price_flag: 1, resel_id: this.EditPriceForm.value['reseller'] });
      // console.log(result);
    }
  }

  async editPrice() {
    // console.log('val',this.EditPriceForm.value['priceDetails'])
    this.EditPriceForm.value['id'] = this.id;

    if (this.EditPriceForm.invalid) {
      this.submit = true;
      return;
    }

    let result = await this.ser.updateprice(this.EditPriceForm.value);
    if (result) {
      this.Add_nas(result, true);
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

  Add_nas(item, editprice) {
    const activeModal = this.activeModal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.componentInstance.editprice = editprice;
    activeModal.result.then((data) => {

    });
  }

  async edit() {
    let result = await this.ser.geteditprice({ id: this.id });
    if (result) {
      this.edititems = result[0];
      this.editdatas = result;
      // console.log(result);
      // console.log(this.edititems)
    }
    this.createForm();
    await this.group();
    await this.showReseller();
    await this.ottids();
    await this.packshow();
    await this.servicetype();
    await this.showottplan();
    let svst_date = new Date(this.editdatas[0].startdate),
    svend_date = new Date(this.editdatas[0].enddate);
    svst_date.setTime(Math.floor((svst_date.getTime()) + (5 * 3600 * 1000 + 1800000)))
    svend_date.setTime(Math.floor((svend_date.getTime()) + (5 * 3600 * 1000 + 1800000)))
    this.editdatas[0].startdate = ((svst_date).toISOString()).slice(0, 16),
    this.editdatas[0].enddate = ((svend_date).toISOString()).slice(0, 16);
    console.log('Edit data',this.editdatas)
    let priceitems = this.editdatas
    for (var i = 0; i < priceitems.length; i++) {
      this.priceDetails.push(this.createMaterial(priceitems[i]['srvid'], priceitems[i]['service_type'], priceitems[i]['sub_plan'], priceitems[i]['amount'], priceitems[i]['type'],
        priceitems[i]['time_unit'], priceitems[i]['additional_days'], priceitems[i]['isp_share'], priceitems[i]['days_flag'], priceitems[i]['sub_isp_share'], priceitems[i]['sub_dist_share'], priceitems[i]['reseller_share'],
        priceitems[i]['validity'], priceitems[i]['startdate'], priceitems[i]['enddate'],
        priceitems[i]['voice_amount'], priceitems[i]['aon_amount'], priceitems[i]['dhstatus'], priceitems[i]['apstatus'], priceitems[i]['netfstatus'], priceitems[i]['snstatus'], priceitems[i]['zeestatus'],
        priceitems[i]['rnstatus'], priceitems[i]['slstatus'], priceitems[i]['hunstatus'], priceitems[i]['dhamt'], priceitems[i]['apamt'], priceitems[i]['netfamt'], priceitems[i]['snamt'], priceitems[i]['zeeamt'],
        priceitems[i]['rnamt'], priceitems[i]['slamt'], priceitems[i]['hunamt']));
    }
  }

  addPrice() {
    // this.priceDetails['value'][0]['ottplan'] = ''
    // this.priceDetails['value'][0]['ottstatus'] = ''
  }

  get priceDetails(): FormArray {
    return this.EditPriceForm.get('priceDetails') as FormArray;
  }

  createMaterial(srvname = '', servtyp = '', pack = '', amnt = '', timetype = '', timeunit = '', addays = '', ispshare = '', dayflag = '',
    subshare = '', subdistshare = '', reselshare = '', subvalidity = '', start_date = '', end_date = '', vamount = '', aonamount = '', dhstatus = '', apstatus = '', netfstatus = '', snstatus = '', zeestatus = '',
    rnstatus = '', slstatus = '', hunstatus = '', dhamt = '', apamt = '', netfamt = '', snamt = '', zeeamt = '', rnamt = '', slamt = '', hunamt = ''): FormGroup {
    return this._fb.group({
      pack_name: [srvname],
      serv_type: [servtyp],
      sub_plan: [pack],
      ser_price: [amnt],
      vo_price: [vamount],
      // ott_price:[otamount],
      add_price: [aonamount],
      timeunit_type: [timetype],
      time_unit: [timeunit],
      dayflag: [dayflag],
      add_days: [addays],
      isp_share: [ispshare],
      subisp_share: [subshare],
      subdist_share: [subdistshare],
      resel_share: [reselshare],
      subplan_validity: [subvalidity],
      subst_date: [start_date],
      subend_date: [end_date],

      hotstar: [dhstatus],
      amazon: [apstatus],
      netflix: [netfstatus],
      sun: [snstatus],
      zee: [zeestatus],
      raj: [rnstatus],
      sony: [slstatus],
      hungama: [hunstatus],

      disney_price: [dhamt],
      amazon_price: [apamt],
      netflix_price: [netfamt],
      sun_price: [snamt],
      zee_price: [zeeamt],
      raj_price: [rnamt],
      sony_price: [slamt],
      hunga_price: [hunamt],

      // ottstatus:[sottfrom],
      // ottplan:[ottplan],
      // ott_price:[ott_amount]
    });
  }

  sharevalid() {
    if (this.sharetyp != 1 && this.reselrole != 444) {
      this.EditPriceForm.get('isp_share').clearValidators();
      this.EditPriceForm.get('isp_share').updateValueAndValidity();

      this.EditPriceForm.get('subisp_share').clearValidators();
      this.EditPriceForm.get('subisp_share').updateValueAndValidity();

      this.EditPriceForm.get('subdist_share').clearValidators();
      this.EditPriceForm.get('subdist_share').updateValueAndValidity();

      this.EditPriceForm.get('resel_share').clearValidators();
      this.EditPriceForm.get('resel_share').updateValueAndValidity();
    }
  }



  ngOnInit() {
    this.createForm();
    this.business();
    if (this.role.getroleid() <= 777) {
      this.EditPriceForm.get('bus_id').setValue(this.role.getispid());
      this.group();
      this.showReseller();
      this.packshow();
      // this.share();
      this.servicetype();
      this.showottplan();
    }
    if (this.id) {
      this.edit();
    }
  }

  createForm() {
    this.EditPriceForm = new FormGroup({
      bus_id: new FormControl(this.edititems ? this.edititems['isp_id'] : '', Validators.required),
      groupid: new FormControl(this.edititems ? this.edititems['group_id'] : ''),
      reseller: new FormControl(this.edititems ? this.edititems['reseller_id'] : '', Validators.required),
      // ser_tax: new FormControl(true),
      sertax_cal: new FormControl(this.edititems ? this.edititems['tax_type'] : '', Validators.required),
      status: new FormControl(this.edititems ? this.edititems['status'] : '1', Validators.required),
      priceDetails: new FormArray([
        // this.createMaterial()
      ]),
    });
  }
}
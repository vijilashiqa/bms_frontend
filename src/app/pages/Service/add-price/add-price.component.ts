import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { S_Service, BusinessService, GroupService, RoleService, ResellerService, AdminuserService } from '../../_service/indexService';
import { find } from 'rxjs/operators';
import { AddSuccessComponent } from './../success/add-success.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as JSXLSX from 'xlsx';
import { iterateListLike } from '@angular/core/src/change_detection/change_detection_util';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'add-price',
  templateUrl: './add-price.component.html',
  styleUrls: ['./add-price.component.scss'],
})

export class AddPriceComponent implements OnInit {
  submit: boolean = false; AddPriceForm; groups; id; editdatas; resell; plan;
  busname; grup; pack; sharetyp; reselrole; config; servtype; service_type;
  bulk = []; failure: any[]; arrayBuffer: any; file: any[]; s = 0; f = 0; resott;
  ottflag: any;

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
    this.grup = await this.groupser.showGroupName({ bus_id: this.AddPriceForm.value['bus_id'] });
  }

  async packshow($event = '') {
    if (this.role.getroleid() > 444) {
      this.pack = await this.ser.showServiceName({ resel_id: this.AddPriceForm.value['reseller'], like: $event });
      // console.log(res);
    }
    if (this.role.getroleid() <= 444) {
      this.pack = await this.ser.showServiceName({ like: $event });
      // console.log(res);
    }

  }

  async showReseller($event = '') {
    if (this.role.getroleid() > 444) {
      this.resell = await this.resser.showResellerName({
        bus_id: this.AddPriceForm.value['bus_id'], groupid: this.AddPriceForm.value['groupid'], except: 1, like: $event
      });
      // console.log(this.resell)
      await this.share();
    }
    if (this.role.getroleid() <= 444) {
      this.resell = await this.resser.showResellerName({ except: 1, like: $event });
      // console.log(res)
      await this.share();
    }
  }

  // async showottplan() {  // called from business
  //   this.plan = await this.ser.showOTTPlans({ bus_id: this.AddPriceForm.value['bus_id'] });
  // }

  // ottids() {  // Called from reseller
  //   var resid = this.AddPriceForm.value['reseller']
  //   const ottdata = this.resell.filter(item => item.id == resid).map(item => item.ott_platform)
  //   let ottid = ottdata[0] != null ? ottdata[0].slice(1, -1) : '',
  //     ott_id = ottid.split(',');
  //   this.ott_ids = ott_id.map((i) => Number(i))
  //   console.log('ottids', this.ott_ids)
  //   if (this.ott_ids != null) {
  //     this.ottplatforms();
  //   }

  // }

  // async ottplatforms() {
  //   this.ottdata = await this.adminser.showOTTPlatforms({});
  //   this.config.log('ottdata', this.ottdata)
  //   this.resott = this.ottdata.filter(item => this.ott_ids.includes(item.ott_id));
  //   // this.ottflag = this.resott.reduce((a, o) => (a.push(o.ott_id), a), [])
  //   this.ottflag = this.resott.filter(x => x.ott_id).map(a => a.ott_id)
  // }

  share() {
    if (this.role.getroleid() > 444) {
      let reselid = this.AddPriceForm.value['reseller']
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
      this.servtype = await this.busser.showServiceType({ sertype: 1, price_flag: 1, resel_id: this.AddPriceForm.value['reseller'] });
      // console.log(result);
    }
  }

  bulkvalid() {
    if (this.AddPriceForm.value['create_type'] == 1) {

      this.AddPriceForm.get('sertax_cal').clearValidators();
      this.AddPriceForm.get('sertax_cal').updateValueAndValidity();

      this.AddPriceForm.get('status').clearValidators();
      this.AddPriceForm.get('status').updateValueAndValidity();

      this.AddPriceForm.get('ser_valid').clearValidators();
      this.AddPriceForm.get('ser_valid').updateValueAndValidity();

    }
  }

  async addserPrice() {
    // console.log(this.AddPriceForm.value)
    this.submit = true;
    // let val = this.AddPriceForm.value;
    this.filereader(this.file, async res => {
      this.bulk = res;
      let bulkvald: boolean = false;
      for (var i = 0; i < this.bulk.length; i++) {
        if (!this.bulk[i].hasOwnProperty('Tax Calculation')) {
          this.toastalert('Please fill the Tax Calculation in Excel Sheet');
          bulkvald = true;
          break;
        }
        else {
          let taxcal = this.bulk[i]['Tax Calculation'];
          let sertaxcal = taxcal == 'Including Tax' ? 1 : 0;
          this.bulk[i].sertax_cal = sertaxcal;
        }
        if (!this.bulk[i].hasOwnProperty('Status')) {
          this.toastalert('Please fill the Status in Excel Sheet');
          bulkvald = true;
          break;
        }
        else {
          let status = this.bulk[i]['Status'];
          let serstatus = status == 'Active' ? 1 : 0;
          this.bulk[i].status = serstatus;
        }
        if (!this.bulk[i].hasOwnProperty('Service Validity')) {
          this.toastalert('Please fill the Service Validity in Excel Sheet');
          bulkvald = true;
          break;
        }
        else {
          let servalid = this.bulk[i]['Service Validity'];
          let servalidity = servalid == 'Enable' ? 2 : 1;
          this.bulk[i].ser_valid = servalidity;
        }
        if (this.bulk[i].hasOwnProperty('Start Date')) {
          let strtdate = this.bulk[i]['Start Date']
          let fromdate = new Date((strtdate - (25567 + 2)) * 86400 * 1000)
          this.bulk[i].start_date = fromdate;
        }
        else {
          this.bulk[i].start_date = this.AddPriceForm.value['start_date'];
        }
        if (this.bulk[i].hasOwnProperty('End Date')) {
          let endate = this.bulk[i]['End Date']
          let fromdate = new Date((endate - (25567 + 2)) * 86400 * 1000)
          this.bulk[i].end_date = fromdate;
        }
        else {
          this.bulk[i].end_date = this.AddPriceForm.value['end_date'];
        }
        if (!this.bulk[i].hasOwnProperty('Service Name')) {
          this.toastalert('Please fill the Service Name in Excel Sheet');
          bulkvald = true;
          break;
        }
        else {
          let sername = this.bulk[i]['Service Name'];
          this.bulk[i].pack_name = sername;
        }
        if (!this.bulk[i].hasOwnProperty('Service Type')) {
          this.toastalert('Please fill the Service Type in Excel Sheet');
          bulkvald = true;
          break;
        }
        else {
          let sertype = this.bulk[i]['Service Type']
          sertype = sertype == 'Internet' ? 1 : sertype == 'Internet & Voice' ? 2 : sertype == 'Internet & OTT' ? 3 : sertype == 'Internet & AddOn' ? 4 :
            sertype == 'Internet&Voice&OTT' ? 5 : sertype == 'Internet&Voice&AddOn' ? 6 : sertype == 'Internet&OTT&AddON' ? 7 : 8;
          this.bulk[i].serv_type = sertype;
        }
        if (!this.bulk[i].hasOwnProperty('Sub Plan Name')) {
          this.toastalert('Please fill the Sub Plan Name in Excel Sheet');
          bulkvald = true;
          break;
        }
        else {
          let planname = this.bulk[i]['Sub Plan Name'];
          this.bulk[i].sub_plan = planname;
        }
        if (!this.bulk[i].hasOwnProperty('Time UnitType')) {
          this.toastalert('Please fill the Time UnitType in Excel Sheet');
          bulkvald = true;
          break;
        }
        else {
          let tutype = this.bulk[i]['Time UnitType'];
          let unittype = tutype == 'Days' ? 0 : 1;
          this.bulk[i].timeunit_type = unittype;
        }
        if (!this.bulk[i].hasOwnProperty('Days') && this.bulk[i]['Time UnitType'] == 'Days') {
          this.toastalert('Please fill the Days in Excel Sheet');
          bulkvald = true;
          break;
        }
        else {
          let dayf = this.bulk[i]['Days'];
          // console.log('Day flag', dayf)
          // let days = dayf == '28 Days' ? 0 : 1;
          let days = dayf;
          this.bulk[i].dayflag = days;
        }

        if (!this.bulk[i].hasOwnProperty('Time Unit')) {
          this.toastalert('Please fill the Time Unit in Excel Sheet');
          bulkvald = true;
          break;
        }
        else {
          let timunit = this.bulk[i]['Time Unit'];
          this.bulk[i].time_unit = timunit;
        }
        if (!this.bulk[i].hasOwnProperty('Internet Price')) {
          this.toastalert('Please fill the Internet Price in Excel Sheet');
          bulkvald = true;
          break;
        }
        else {
          let price = this.bulk[i]['Internet Price'];
          this.bulk[i].ser_price = price;
        }

        this.bulk[i].hasOwnProperty('Voice Price')
        let vprice = this.bulk[i]['Voice Price']
        this.bulk[i].vo_price = vprice;

        // this.bulk[i].hasOwnProperty('OTT Price')
        // let oprice = this.bulk[i]['OTT Price']
        // this.bulk[i].ott_price = oprice;

        this.bulk[i].hasOwnProperty('AddOn Price')
        let aprice = this.bulk[i]['AddOn Price']
        this.bulk[i].add_price = aprice;

        // this.bulk[i].hasOwnProperty('ISP Share')
        // let ispshare = this.bulk[i]['ISP Share']
        // this.bulk[i].isp_share = ispshare;

        // this.bulk[i].hasOwnProperty('Sub ISP Share')
        // let subispshare = this.bulk[i]['Sub ISP Share']
        // this.bulk[i].subisp_share = subispshare;

        // this.bulk[i].hasOwnProperty('Sub Dist Share')
        // let subdishare = this.bulk[i]['Sub Dist Share']
        // this.bulk[i].subdist_share = subdishare;

        // this.bulk[i].hasOwnProperty('Reseller Share')
        // let resshare = this.bulk[i]['Reseller Share']
        // this.bulk[i].resel_share = resshare;

        if (this.bulk[i].hasOwnProperty('ISP Share')) {
          let ispshare = this.bulk[i]['ISP Share']
          this.bulk[i].isp_share = ispshare;
        } else {
          console.log('ISp share',this.bulk[i]['ISP Share'])
          this.bulk[i].isp_share = 0;
        }
        if (this.bulk[i].hasOwnProperty('Sub ISP Share')) {
          let subispshare = this.bulk[i]['Sub ISP Share']
          this.bulk[i].subisp_share = subispshare;
        } else {
          this.bulk[i].subisp_share = 0;
        }
        if (this.bulk[i].hasOwnProperty('Sub Dist Share')) {
          let subdishare = this.bulk[i]['Sub Dist Share']
          this.bulk[i].subdist_share = subdishare;
        } else {
          this.bulk[i].subdist_share = 0;
        }
        if (this.bulk[i].hasOwnProperty('Reseller Share')) {
          let resshare = this.bulk[i]['Reseller Share']
          this.bulk[i].resel_share = resshare;
        } else {
          this.bulk[i].resel_share = 0;
        }

        this.bulk[i].hasOwnProperty('Additional Days')
        let addays = this.bulk[i]['Additional Days']
        this.bulk[i].add_days = addays;

        this.bulk[i].bus_id = this.AddPriceForm.value['bus_id'];
        this.bulk[i].groupid = this.AddPriceForm.value['groupid'];
        this.bulk[i].reseller = this.AddPriceForm.value['reseller'];
        this.bulk[i].create_type = this.AddPriceForm.value['create_type'];

        // let useid = this.role.getuserid()
        // this.bulk[i].user_id = useid
      }
      this.s = 0; this.f = 0;
      let s = 0;
      this.failure = [];
      const invalid=[];
      const controls = this.AddPriceForm['controls'];
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name)
        }
      };
      if (this.AddPriceForm.invalid) {
        console.log('Invalid',invalid)
        window.alert('Please fill all mandatory fields')
        this.submit = true;
        return;
      }
      if (this.AddPriceForm.value['create_type'] == 0) {
        let result = await this.ser.addprice(this.AddPriceForm.value);
        // this.groups = result;
        if (result) {
          this.result_pop(result, true);
        }
      }
      if (this.AddPriceForm.value['create_type'] == 1) {
        let result = await this.ser.addBulkPrice({ bulkPrice: this.bulk });
        if (result) {
          this.result_pop(result, true);
        }
      }
    })
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


  validdate() {
    if (this.AddPriceForm.value['ser_valid'] == '1') {
      this.AddPriceForm.get('start_date').setValue('');
      this.AddPriceForm.get('end_date').setValue('');

      this.AddPriceForm.get('start_date').clearValidators()
      this.AddPriceForm.get('start_date').updateValueAndValidity()

      this.AddPriceForm.get('end_date').clearValidators()
      this.AddPriceForm.get('end_date').updateValueAndValidity()
    }
    if (this.AddPriceForm.value['ser_valid'] == '2') {
      this.AddPriceForm.get('start_date').setValidators([Validators.required])
      this.AddPriceForm.get('end_date').setValidators([Validators.required])
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

  result_pop(item, addprice) {
    const activeModal = this.activeModal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.componentInstance.addprice = addprice;
    activeModal.result.then((data) => {
    });
  }

  get priceDetails(): FormArray {
    return this.AddPriceForm.get('priceDetails') as FormArray;
  }

  addPrice() {
    this.priceDetails.push(this.createMaterial());
  }
  deletePricefield(index: number) {
    this.priceDetails.removeAt(index);
  }
  createMaterial(): FormGroup {
    return this._fb.group({
      pack_name: [''],
      serv_type: [''],
      sub_plan: [''],
      ser_price: [''],
      vo_price: [''],
      // ott_price: [''],
      add_price: [''],
      dayflag: [''],
      time_unit: [''],
      timeunit_type: [''],
      add_days: [''],
      isp_share: [''],
      subisp_share: [''],
      subdist_share: [''],
      resel_share: [''],
      subplan_validity: ['1'],
      subst_date: [''],
      subend_date: [''],

      hotstar: [''],
      amazon: [''],
      netflix: [''],
      sun: [''],
      zee: [''],
      raj: [''],
      sony: [''],
      hungama: [''],

      disney_price: [''],
      amazon_price: [''],
      netflix_price: [''],
      sun_price: [''],
      zee_price: [''],
      raj_price: [''],
      sony_price: [''],
      hunga_price: [''],
      // ottstatus: [''],
      // ottplan: ['']


    });
  }

  async ngOnInit() {
    this.createForm();
    await this.business();
    if (this.role.getroleid() <= 777) {
      this.AddPriceForm.get('bus_id').setValue(this.role.getispid());
      await this.group();
      await this.showReseller();
      await this.packshow();
      // this.share();
      await this.servicetype();
      // await this.showottplan();
    }
    if (this.role.getroleid() < 775) {
      this.AddPriceForm.get('groupid').setValue(this.role.getgrupid());
      this.AddPriceForm.get('create_type').setValue('0');
    }
    if(this.role.getroleid() ==444) this.AddPriceForm.get('reseller').setValue(this.role.getresellerid());
    if(this.role.getroleid() ==443) this.AddPriceForm.get('reseller').setValue(this.role.getmanagerid());

  }

  createForm() {
    this.AddPriceForm = new FormGroup({
      bus_id: new FormControl('', Validators.required),
      groupid: new FormControl(''),
      reseller: new FormControl('', Validators.required),
      create_type: new FormControl('', Validators.required),
      // ser_tax: new FormControl(true),
      sertax_cal: new FormControl('', Validators.required),
      status: new FormControl('1', Validators.required),
      ser_valid: new FormControl('1', Validators.required),
      start_date: new FormControl(''),
      end_date: new FormControl(''),
      priceDetails: new FormArray([
        this.createMaterial()
      ]),
    });
  }
}
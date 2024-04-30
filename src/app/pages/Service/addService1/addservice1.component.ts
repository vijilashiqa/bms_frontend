import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AddSuccessComponent } from './../success/add-success.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as FileSaver from 'file-saver';
import * as JSXLSX from 'xlsx';
import { RoleService, SelectService, S_Service, BusinessService, GroupService, NasService, ResellerService } from '../../_service/indexService';
@Component({
  selector: 'addService1',
  templateUrl: './addservice1.component.html',
  styleUrls: ['./servicestyle.scss'],
})

export class addService1Component implements OnInit {
  @ViewChild('multiSelect') multiSelect; file: any;
  public loadContent: boolean = false; tab: boolean = false;
  submit: boolean = false; AddServiceForm; resell; alnas: any = []; nasresel: any = []; busname;
  datas; settings; nassettings; grup; searchnas: string; searchresell: string; busresel: any = []; nas; reseldata;
  buresellitems; config; falback; arrayBuffer: any; bulk: any = []; data: any;

  constructor(
    private alert: ToasterService,
    private router: Router,
    private _fb: FormBuilder,
    // private select: SelectService,
    private service: S_Service,
    private busser: BusinessService,
    private groupser: GroupService,
    private nasser: NasService,
    public activeModal: NgbModal,
    public role: RoleService,
    private resser: ResellerService,


  ) { }

  async group() {
    this.grup = await this.groupser.showGroupName({ bus_id: this.AddServiceForm.value['bus_id'] });
  }

  async business() {
    this.busname = await this.busser.showBusName({})
    // console.log(result)
  }

  async busgrupnas() {
    if (this.AddServiceForm.value['serassign_type'] == '1') {
      this.alnas = await this.nasser.showGroupNas({ bus_id: this.AddServiceForm.value['bus_id'], serassign_type: this.AddServiceForm.value['serassign_type'], groupid: this.AddServiceForm.value['groupid'] });
      // console.log("nas",res);
    }
  }

  async busresell($event = '') {
    if (this.AddServiceForm.value['serassign_type'] == '2') {
      this.buresellitems = await this.nasser.showGroupNas({ bus_id: this.AddServiceForm.value['bus_id'], groupid: this.AddServiceForm.value['groupid'], serassign_type: this.AddServiceForm.value['serassign_type'], edit_flag: 1 });
      // console.log("resell",this.buresellitems)
    }
    if (this.AddServiceForm.value['create_type'] == 2) {
      this.buresellitems = await this.nasser.showGroupNas({ bus_id: this.AddServiceForm.value['bus_id'], groupid: this.AddServiceForm.value['groupid'], serassign_type: 2, like: $event });

    }
  }

  async nasresll() {
    let checkednas = this.alnas.filter(item => item.state).map(item => item.id)
    this.nas = checkednas;
    // console.log("checkednas",this.nas)
    this.nasresel = await this.resser.showResellerName({ nas_id: this.nas, bus_id: this.AddServiceForm.value['bus_id'], except: 1, groupid: this.AddServiceForm.value['groupid'] });
    // console.log("nasresell",this.nasresel)

  }

  async checkAll(check) {
    await this.alnas.forEach(x => x.state = check)
    // console.log(this.alnas)
    // this.nasresll();
  }

  async resellcheck(check) {
    if (this.AddServiceForm.value['serassign_type'] == '1') {
      await this.nasresel.forEach(x => x.data = check)
      // this.busresell()
    }
    if (this.AddServiceForm.value['serassign_type'] == '2') {
      await this.buresellitems.forEach(x => x.datas = check)
    }
  }

  carryover() {
    if (this.AddServiceForm.value['carry_over'] == true) {
      this.AddServiceForm.get('srvtype2').setValue('1')
    }
    else {
      this.AddServiceForm.get('srvtype2').setValue('0')
    }
  }

  async checkedreselitems() {
    if (this.AddServiceForm.value['serassign_type'] == '1') {
      let checkedresell = await this.nasresel.filter(item => item.data).map(item => item.id)

      this.reseldata = checkedresell;
      // console.log(this.reseldata)
      await this.fallbackser();
    }
    if (this.AddServiceForm.value['serassign_type'] == '2') {
      let checkedresell = await this.buresellitems.filter(item => item.datas).map(item => item.id)
      this.reseldata = checkedresell;
      // console.log(this.reseldata);
      await this.fallbackser();
    }
  }

  async fallbackser() {
    if (this.AddServiceForm.value['serassign_type'] == '1') {
      this.falback = await this.service.showFallback({ nas_id: this.nas, resel_id: this.reseldata, serassign_type: this.AddServiceForm.value['serassign_type'] });
      // console.log(res)
    }
    if (this.AddServiceForm.value['serassign_type'] == '2') {
      this.falback = await this.service.showFallback({ resel_id: this.reseldata, serassign_type: this.AddServiceForm.value['serassign_type'] });
      // console.log(res)
    }
  }

  validdate() {
    if (this.AddServiceForm.value['ser_valid'] == '1') {
      this.AddServiceForm.get('stprice_date').setValue('');
      this.AddServiceForm.get('endprice_date').setValue('');

      this.AddServiceForm.get('stprice_date').clearValidators()
      this.AddServiceForm.get('stprice_date').updateValueAndValidity()

      this.AddServiceForm.get('endprice_date').clearValidators()
      this.AddServiceForm.get('endprice_date').updateValueAndValidity()
    }
    if (this.AddServiceForm.value['ser_valid'] == '2') {
      this.AddServiceForm.get('stprice_date').setValidators([Validators.required])
      this.AddServiceForm.get('endprice_date').setValidators([Validators.required])
    }
  }

  expvalid() {
    if (this.AddServiceForm.value['Type'] == '0' && this.AddServiceForm.value['Service'] == '2') {
      this.AddServiceForm.controls.Expiry.setValue('0')
    }
    if (this.AddServiceForm.value['Type'] == '0' && this.AddServiceForm.value['Service'] == '0') {
      this.AddServiceForm.controls.Expiry.setValue('1')
    }
  }

  async ngOnInit() {
    this.createForm();
    await this.business();
    if (this.role.getroleid() <= 777) {
      this.AddServiceForm.controls['bus_id'].setValue(this.role.getispid());
      await this.group();
    }
    if (this.role.getroleid() < 775) {
      this.AddServiceForm.get('create_type').setValue('1')
    }
    if (this.role.getroleid() <= 444) {
      this.AddServiceForm.get('serassign_type').setValue('2');
      await this.fallbackser();
      this.AddServiceForm.get('create_type').clearValidators();
      this.AddServiceForm.get('create_type').updateValueAndValidity();
    }
    if (this.role.getroleid() >= 775 || this.role.getroleid() == 666 || this.role.getroleid() == 665) {
      this.AddServiceForm.get('ser_validity').setValidators([Validators.required]);
    }
    if (this.role.getroleid() < 661) {
      this.AddServiceForm.get('ser_validity').setValue('1')
    }
  }

  cancel() {
    this.router.navigate(['/pages/service/service-list']);
  }

  servalidcheck() {
    this.AddServiceForm.value['ser_validity'] == 2 ? this.AddServiceForm.get('st_date').setValidators([Validators.required]) : this.AddServiceForm.get('st_date').clearValidators();
    this.AddServiceForm.get('st_date').updateValueAndValidity();

    this.AddServiceForm.value['ser_validity'] == 2 ? this.AddServiceForm.get('end_date').setValidators([Validators.required]) : this.AddServiceForm.get('end_date').clearValidators();
    this.AddServiceForm.get('end_date').updateValueAndValidity();

  }

  srvmodechange() {
    this.AddServiceForm.get('cisco_dl').setValue(0);
    this.AddServiceForm.get('cisco_ul').setValue(0);

    this.AddServiceForm.get('datadl_rate').setValue(0);
    this.AddServiceForm.get('dataul_rate').setValue(0);

    this.AddServiceForm.get('Data').setValue('')
    this.srvdatachange()
    this.changecheck()
  }


  srvdatachange() {
    this.AddServiceForm.controls['Download'].setValue(false)
    this.AddServiceForm.controls['Upload'].setValue(false)
    this.AddServiceForm.controls['Online'].setValue(false)
    this.AddServiceForm.controls['Total'].setValue(false)
  }

  changecheck() {
    if (this.AddServiceForm.value['Total'] == true) {
      this.AddServiceForm.controls['Download'].setValue(false)
      this.AddServiceForm.controls['Upload'].setValue(false)
    }
    else {
      this.AddServiceForm.controls.tTraffic.setValue(0);
      this.AddServiceForm.controls.tottraf_initial.setValue(0);
    }
    if (this.AddServiceForm.value['Download'] == false) {
      this.AddServiceForm.controls.dTraffic.setValue(0);
      this.AddServiceForm.controls.dltraf_initial.setValue(0);


    }
    if (this.AddServiceForm.value['Upload'] == false) {
      this.AddServiceForm.controls.uTraffic.setValue(0);
      this.AddServiceForm.controls.ultraf_initial.setValue(0);

    }
    if (this.AddServiceForm.value['Online'] == false) {
      this.AddServiceForm.controls.ontime.setValue(0);

      this.AddServiceForm.controls.initial.setValue(0);

      this.AddServiceForm.controls.timeunit.setValue('');
    }

  }

  ciscovalid() {
    this.AddServiceForm.value['ciscopolicy'] == true ? this.AddServiceForm.get('cisco_dl').setValidators([Validators.required]) : this.AddServiceForm.get('cisco_dl').clearValidators();
    this.AddServiceForm.value['ciscopolicy'] == true ? this.AddServiceForm.get('cisco_ul').setValidators([Validators.required]) : this.AddServiceForm.get('cisco_ul').clearValidators();
    if (this.AddServiceForm.value['ciscopolicy'] == false) {
      this.AddServiceForm.controls.cisco_dl.setValue('')
      this.AddServiceForm.controls.cisco_ul.setValue('')
    }
  }

  burst() {
    if (this.AddServiceForm.value['burst_mode'] == false) {
      this.AddServiceForm.controls.Limit.setValue('');
      this.AddServiceForm.controls.Limit1.setValue('');
      this.AddServiceForm.controls.Treshold.setValue('');
      this.AddServiceForm.controls.Treshold1.setValue('');
      this.AddServiceForm.controls.Time.setValue('');
      this.AddServiceForm.controls.Time1.setValue('');
    }
  }

  async addService() {
    if (this.AddServiceForm.value['create_type'] == '2') {
      this.submit = true;
      this.filereader(this.file, async result => {
        this.bulk = result;
        let bulkvald: boolean = false;
        for (var i = 0; i < this.bulk.length; i++) {
          this.bulk[i].bus_id = this.AddServiceForm.value['bus_id']
          this.bulk[i].groupid = this.AddServiceForm.value['groupid']
          this.bulk[i].create_type = this.AddServiceForm.value['create_type']
          this.bulk[i].reseller = this.AddServiceForm.value['reseller']
          this.bulk[i].Type = this.bulk[i]['Package_Type']
          this.bulk[i].Service = this.bulk[i]['Type_of_Service']
          this.bulk[i].Data = this.bulk[i]['Service_data_type']
          this.bulk[i].Name = this.bulk[i]['Package_Name']
        }
        if (bulkvald || this.bulk.length == 0) {
          return;
        }
        if (this.AddServiceForm.value['create_type'] == '2') {
          let result = await this.service.addBulkService({ bulkService: this.bulk });
          if (result) {
            this.result_pop(result, true)
          }
        }
      });
    }
    if (this.AddServiceForm.value['create_type'] == '1') {
      if (this.AddServiceForm.value['Data'] == '2' && (this.AddServiceForm.value['Download'] == false && this.AddServiceForm.value['Upload'] == false && this.AddServiceForm.value['Total'] == false)) {
        this.toastalert('Please Select Any Limit Download or Upload or Total', 0)
        return;
      }
      const invalid = [];
      const controls = this.AddServiceForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name)
        }
      };
      // console.log('Invalid', invalid);
      if (this.AddServiceForm.invalid) {
        this.submit = true;
        return;
      }
      this.AddServiceForm.value['nasid'] = this.nas;
      this.AddServiceForm.value['reselid'] = this.reseldata;
      let servicedata = [this.AddServiceForm.value]
      // if (this.AddServiceForm.value['create_type'] == '1'){
      let result = await this.service.addService({ bulkService: servicedata });
      // this.datas = result;
      // console.log(result)
      if (result) {
        this.result_pop(result, true)
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

  result_pop(item, addpackage) {
    const activeModal = this.activeModal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.componentInstance.addpackage = addpackage;
    activeModal.result.then((data) => {

    });
  }
  get priceDetails(): FormArray {
    return this.AddServiceForm.get('priceDetails') as FormArray;
  }
  addPrice() {
    this.priceDetails.push(this.createMaterial());
  }
  deletepriceField(index: number) {
    this.priceDetails.removeAt(index);
  }
  createMaterial(): FormGroup {
    return this._fb.group({
      sub_plan: [''],
      ser_price: [''],
      time_unit: [''],
      timeunit_type: [''],
      dayflag: [''],
      add_days: [''],
      subplan_validity: ['1'],
      subst_date: [''],
      subend_date: [''],
    });
  }

  changeListener(file) {
    // console.log(file)
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
        callback(JSXLSX.utils.sheet_to_json(worksheet, { raw: true }));
      }
      fileReader.readAsArrayBuffer(file);
    } else {
      callback([]);
    }
  }

  assignCardService() {
    if (this.AddServiceForm.value.srv_type == 1) this.AddServiceForm.get('Service').setValue('0');
  }

  createForm() {
    this.AddServiceForm = new FormGroup({
      create_type: new FormControl('', Validators.required),
      reseller: new FormControl(''),
      sercreate_type: new FormControl(''),
      bus_id: new FormControl('', Validators.required),
      groupid: new FormControl(''),
      serassign_type: new FormControl('', Validators.required),
      Name: new FormControl('', Validators.required),
      Type: new FormControl('', Validators.required),
      ciscopolicy: new FormControl(''),
      cisco_dl: new FormControl('0'),
      cisco_ul: new FormControl('0'),
      Total: new FormControl(''),
      Download: new FormControl(''),
      Upload: new FormControl(''),
      Online: new FormControl(''),
      time_quota: new FormControl(''),
      ontime: new FormControl('0'),
      initial: new FormControl('0'),
      timeunit: new FormControl(''),
      datadl_rate: new FormControl('0'),
      dataul_rate: new FormControl('0'),
      Service: new FormControl('0', Validators.required),
      srv_type: new FormControl('0', Validators.required),
      Expiry: new FormControl('1', Validators.required),
      ser_validity: new FormControl(''),
      st_date: new FormControl(''),
      end_date: new FormControl(''),
      data_split: new FormControl(''),
      serstatus: new FormControl(true),
      Data: new FormControl('', Validators.required),
      Time: new FormControl('0'),
      Time1: new FormControl('0'),
      Limit: new FormControl('0'),
      Limit1: new FormControl('0'),
      Treshold: new FormControl('0'),
      Treshold1: new FormControl('0'),
      Priority: new FormControl('8'),
      burst_mode: new FormControl(''),
      dQuota: new FormControl('0', [Validators.pattern('^[0-9]*$')]),
      uQuota: new FormControl('0', [Validators.pattern('^[0-9]*$')]),
      tQuota: new FormControl('0', [Validators.pattern('^[0-9]*$')]),
      sQuota: new FormControl('0', [Validators.pattern('^[0-9]*$')]),
      disable_ser: new FormControl(''),
      exp_service: new FormControl(''),
      daily_service: new FormControl(''),
      dTraffic: new FormControl('0', [Validators.pattern('^[0-9]*$')]),
      dltraf_initial: new FormControl('0', [Validators.pattern('^[0-9]*$')]),
      uTraffic: new FormControl('0', [Validators.pattern('^[0-9]*$')]),
      ultraf_initial: new FormControl('0', [Validators.pattern('^[0-9]*$')]),
      tTraffic: new FormControl('0', [Validators.pattern('^[0-9]*$')]),
      tottraf_initial: new FormControl('0', [Validators.pattern('^[0-9]*$')]),
      // quota :new FormControl(''),
      // tot_quota :new FormControl(''),
      carry_over: new FormControl(''),
      reset_dateexp: new FormControl(''),
      traffic_neg: new FormControl(''),
      add_credits: new FormControl(''),
      srvtype: new FormControl('0'),
      srvtype1: new FormControl('0'),
      srvtype2: new FormControl('0'),
      // resell_name:new FormControl(''),
      // ass_nas:new FormControl(''),
      // ser_price: new FormControl(''),
      // time_unit:new FormControl(''),
      // timeunit_type:new FormControl(''),
      expdate_unit: new FormControl(''),
      exp_initial: new FormControl('0'),
      exp_period: new FormControl(''),
      onlintime_unit: new FormControl(''),
      online_initial: new FormControl('0'),
      onlinetime_unit: new FormControl(''),
      minbase_qty: new FormControl(''),
      addtrafic_unit: new FormControl(''),
      minadd_qty: new FormControl(''),
      // status : new FormControl(''),
      ser_tax: new FormControl(true),
      sertax_cal: new FormControl(''),
      price_status: new FormControl('1'),
      ser_valid: new FormControl(''),
      stprice_date: new FormControl(''),
      endprice_date: new FormControl(''),
      renewalmode: new FormControl(''),
      priceDetails: new FormArray([
        this.createMaterial()
      ]),
    });
    this.loadContent = true;
  }

  // onkeyupQty(event: any, index: number) { // without type info
  //   //console.log(index, test);
  //   if (event.target.value != "") {
  //     console.log(this.AddServiceForm.value["priceDetails"][index]["qty"], this.AddServiceForm.value["priceDetails"][index]["price"])
  //     var total = Number(this.AddServiceForm.value["priceDetails"][index]["qty"]) * Number(this.AddServiceForm.value["priceDetails"][index]["price"]);
  //     const controlArray = <FormArray>this.AddServiceForm.get('priceDetails');
  //     controlArray.controls[index].get('total').setValue(total);
  //   }
  // }
}
import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder, } from '@angular/forms';
import { Router } from '@angular/router';
import { AddSuccessComponent } from './../success/add-success.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CustService, S_Service, SelectService, RoleService, BusinessService, GroupService,
  IppoolService, ResellerService, InventoryService
} from '../../_service/indexService';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';

@Component({
  selector: 'Edit-Cust',
  templateUrl: './edit-Cust.component.html',
  styleUrls: ['./custstyle.scss'],
})

export class EditCustComponent implements OnInit {
  submit: boolean = false; EditSubsForm; id: any = []; resell; datas; pack; subsid; branches;
  editdatas; ip; busname; grup; mod; mak; typ; edititems; cusprefix; dist; states; config;
  simul = false; servtype; account_type; acnt_type; statipdata; view_flag;destroyOnHide:boolean=true;sip_address;pip_address;
  editable = false;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(
    private alert: ToasterService,
    private router: Router,
    private _fb: FormBuilder,
    private serv: S_Service,
    private ser: CustService,
    private select: SelectService,
    public activeModal: NgbModal,
    private busser: BusinessService,
    private groupser: GroupService,
    private resser: ResellerService,
    private inventser: InventoryService,
    public role: RoleService,
    private ipser: IppoolService,

  ) {
    this.id = JSON.parse(localStorage.getItem('array'));
    this.view_flag = JSON.parse(localStorage.getItem('view_flag'))
  }

  previous(){
    this.destroyOnHide = !this.destroyOnHide;
    console.log('Hide',this.destroyOnHide);
    
  }

  async business() {
    this.busname = await this.busser.showBusName({})
    // console.log(this.busname)
  }

  async GroupName() {
    this.grup = await this.groupser.showGroupName({ bus_id: this.EditSubsForm.value['bus_id'] })
    // console.log(res)
  }

  async cityshow($event = '') {
    this.dist = await this.select.showDistrict({ state_id: this.EditSubsForm.value['state'], like: $event, edit_flag: 1 })
    // console.log(result)
  }

  async stateshow($event = '') {
    if (this.id) {
      this.states = await this.select.showState({ like: $event, edit_flag: 1 })
    } else {
      this.states = await this.select.showState({ like: $event })
    }
    // console.log(result)
  }

  async showReseller($event = '') {
    this.resell = await this.resser.showResellerName({ edit_flag: 1, like: $event, bus_id: this.EditSubsForm.value['bus_id'], groupid: this.EditSubsForm.value['groupid'] })
    // console.log(res)
  }

  async Service($event = '') {
    this.pack = await this.serv.showServiceName({ resel_id: this.EditSubsForm.value['reseller'], like: $event })
    // console.log(res)
  }

  async servicetype() {
    this.servtype = await this.busser.showServiceType({ bus_id: this.EditSubsForm.value['bus_id'], sertype: 1 })
    // console.log(result);
  }

  async PoolName() {
    if (this.role.getroleid() >= 775 || this.role.getroleid() > 444) {
      this.ip = await this.ipser.showPoolName({ groupid: this.EditSubsForm.value['groupid'], isp_id: this.EditSubsForm.value['bus_id'], resel_id: this.EditSubsForm.value['reseller'] })
     }
    // if (this.role.getroleid() < 775) {
    //   this.ip = await this.ipser.showPoolName({ resel_id: this.role.getresellerid() })
    //  }
     
    if (this.role.getroleid() < 775 && (this.role.getroleid() <= 444)) {
      if (this.role.getroleid() == 443 || this.role.getroleid() == 332 || this.role.getroleid() == 221) {
        this.ip = await this.ipser.showPoolName({ resel_id: this.role.getmanagerid() })
      } else if (this.role.getroleid() == 444 || this.role.getroleid() == 333 || this.role.getroleid() == 222) {
        this.ip = await this.ipser.showPoolName({ resel_id: this.role.getresellerid() })
      } else {
        this.ip = await this.ipser.showPoolName({ resel_id: this.role.getresellerid() })
      }
    }
  }

  async staticip($event = '') {
    this.statipdata = await this.ipser.showPublicIp({ resel_id: this.EditSubsForm.value['reseller'], like: $event, static: 1 })
    // console.log(result);,
  }

  async modelshow() {
    if (this.role.getroleid() >= 775) {
      this.mod = await this.inventser.showModel({ resel_id: this.EditSubsForm.value['reseller'] })
    }
    if (this.role.getroleid() < 775) {
      this.mod = await this.inventser.showModel({ resel_id: this.role.getresellerid() })
    }
  }

  async reselbranch() {
    if (this.role.getroleid() >= 775 || this.role.getroleid() > 444) {
      this.branches = await this.resser.showResellerBranch({ resel_id: this.EditSubsForm.value['reseller'] })
     }
    if (this.role.getroleid() < 775 && (this.role.getroleid()<= 444)) {
      if (this.role.getroleid() == 443 || this.role.getroleid() == 332 || this.role.getroleid() == 221) {
        this.branches = await this.resser.showResellerBranch({ resel_id: this.role.getmanagerid() })
      } else if (this.role.getroleid() == 444 || this.role.getroleid() == 333 || this.role.getroleid() == 222) {
        this.branches = await this.resser.showResellerBranch({ resel_id: this.role.getresellerid() })
      } else {
        this.branches = await this.resser.showResellerBranch({ resel_id: this.role.getresellerid() })
      }
     }
  }


  proof() {
    this.EditSubsForm.value["Proof"] != "" ? this.EditSubsForm.get('ProofID').setValidators([Validators.required]) : this.EditSubsForm.get('ProofID').clearValidators()
    this.EditSubsForm.get('ProofID').updateValueAndValidity();
  }

  ipmodevalidclear() {
    this.EditSubsForm.get('ippool').clearValidators();
    this.EditSubsForm.get('ippool').updateValueAndValidity();

    this.EditSubsForm.get('statip_type').clearValidators();
    this.EditSubsForm.get('statip_type').updateValueAndValidity();

  }

  staticipvalidcelar() {
    this.EditSubsForm.get('staticip').clearValidators();
    this.EditSubsForm.get('staticip').updateValueAndValidity();

    this.EditSubsForm.get('public_ip').clearValidators();
    this.EditSubsForm.get('public_ip').updateValueAndValidity();
  }

  async mode() {
    await this.ipmodevalidclear();

    this.EditSubsForm.get('ippool').setValue('');
    this.EditSubsForm.get('statip_type').setValue('');
    this.EditSubsForm.get('public_ip').setValue('');
    this.EditSubsForm.get('staticip').setValue('');

    if (this.EditSubsForm.value['ipmode'] == 1) {
      this.EditSubsForm.get('ippool').setValidators([Validators.required]);
    }
    if (this.EditSubsForm.value['ipmode'] == 2) {
      this.EditSubsForm.get('statip_type').setValidators([Validators.required]);
    }
  }

  async staticmode() {
    this.EditSubsForm.value['statip_type'] == 0 ? this.EditSubsForm.get('staticip').setValidators([Validators.required]) : this.EditSubsForm.get('staticip').clearValidators();
    this.EditSubsForm.get('staticip').updateValueAndValidity();

    this.EditSubsForm.value['statip_type'] == 1 ? this.EditSubsForm.get('public_ip').setValidators([Validators.required]) : this.EditSubsForm.get('public_ip').clearValidators();
    this.EditSubsForm.get('public_ip').updateValueAndValidity();
  }

  type() {
    this.EditSubsForm.get('mac_addr').setValue(false)
    this.EditSubsForm.value["acctype"] == "1" ? this.EditSubsForm.get('mac_id').setValidators([Validators.required]) : this.EditSubsForm.get('mac_id').clearValidators()
    this.EditSubsForm.get('mac_id').updateValueAndValidity();

    if (this.EditSubsForm.value['acctype'] == '1') {
      this.simul = true;
      this.EditSubsForm.get('sim_use').setValue('1');
    }
    else {
      this.simul = false;
    }
  }

  mac() {
    if (this.EditSubsForm.value['mac_addr'] == true) {
      this.EditSubsForm.get('amac').setValidators([Validators.required]);
    }
    if (this.EditSubsForm.value['mac_addr'] == false) {
      this.EditSubsForm.controls.amac.setValue('');
      this.EditSubsForm.get('amac').clearValidators();
    }
  }

  async editSubscriber() {
    const invalid = [];
    const controls = this.EditSubsForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name)
      }
    };
    console.log('Invalid', invalid);
    if (this.EditSubsForm.invalid) {
      this.submit = true;
      window.alert('Please fill all the fields marked with Asterisks*')
      return;
    }
    this.EditSubsForm.value['id'] = this.id;
    let subsdata = [this.EditSubsForm.value]
    this.loading = true;
    let result = await this.ser.editsubscriber({ bulkSubscriber: subsdata })
    // this.datas=result;
    // console.log(result)
    if (result) {
      this.loading = false;
      if(this.view_flag == 1){
        this.result_pop(result, false);
      }else{
        this.result_pop(result, true);
      }
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


  result_pop(item, edit_res) {
    const activeModal = this.activeModal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.componentInstance.edit_res = edit_res;
    activeModal.result.then((data) => {

    });
  }

  editvalid() {
    if (this.role.getroleid() < 775) {
      this.EditSubsForm.get('bus_id').clearValidators();
      this.EditSubsForm.get('bus_id').updateValueAndValidity();

      this.EditSubsForm.get('groupid').clearValidators();
      this.EditSubsForm.get('groupid').updateValueAndValidity();

      this.EditSubsForm.get('reseller').clearValidators();
      this.EditSubsForm.get('reseller').updateValueAndValidity();

    }
  }

  cafvalid() {
    if (this.EditSubsForm.value['demo_accnt'] == 3) {
      this.EditSubsForm.get('CAF').clearValidators();
      this.EditSubsForm.get('CAF').updateValueAndValidity();

      // this.EditSubsForm.get('addr_proof').clearValidators();
      // this.EditSubsForm.get('addr_proof').updateValueAndValidity();

      // this.EditSubsForm.get('addr_up_proof').clearValidators();
      // this.EditSubsForm.get('addr_up_proof').updateValueAndValidity();

      // this.EditSubsForm.get('upproof').clearValidators();
      // this.EditSubsForm.get('upproof').updateValueAndValidity();

      // this.EditSubsForm.get('ProofID').clearValidators();
      // this.EditSubsForm.get('ProofID').updateValueAndValidity();
    } else {
      this.EditSubsForm.get('CAF').setValidators([Validators.required]);
      this.EditSubsForm.get('CAF').updateValueAndValidity();
    }
  }


  substypechange() {
    this.EditSubsForm.get('Company').setValue('');
    this.EditSubsForm.get('GST').setValue('');
    this.EditSubsForm.get('cont_id').setValue('');
    this.EditSubsForm.get('cont_from_date').setValue('');
    this.EditSubsForm.get('cont_to_date').setValue('');
  }

  substypevalid() {
    if (this.EditSubsForm.value['subs_type'] != 1) {
      this.EditSubsForm.get('Company').setValidators([Validators.required]);
      this.EditSubsForm.get('GST').setValidators([Validators.required]);
      this.EditSubsForm.get('cont_id').setValidators([Validators.required]);
      this.EditSubsForm.get('cont_from_date').setValidators([Validators.required]);
      this.EditSubsForm.get('cont_to_date').setValidators([Validators.required]);
    } else {
      this.EditSubsForm.get('Company').clearValidators();
      this.EditSubsForm.get('Company').updateValueAndValidity();

      this.EditSubsForm.get('GST').clearValidators();
      this.EditSubsForm.get('GST').updateValueAndValidity();

      this.EditSubsForm.get('cont_id').clearValidators();
      this.EditSubsForm.get('cont_id').updateValueAndValidity();

      this.EditSubsForm.get('cont_from_date').clearValidators();
      this.EditSubsForm.get('cont_from_date').updateValueAndValidity();

      this.EditSubsForm.get('cont_to_date').clearValidators();
      this.EditSubsForm.get('cont_to_date').updateValueAndValidity();
    }
  }

  async ngOnInit() {
    this.createForm();
    await this.business();
    await this.editvalid();
    if (this.role.getroleid() <= 777) {
      this.EditSubsForm.get('bus_id').setValue(this.role.getispid());
      await this.GroupName();
      await this.servicetype();
    }
    if (this.role.getroleid() < 775) {
      this.EditSubsForm.get('groupid').setValue(this.role.getgrupid());
      this.EditSubsForm.get('reseller').setValue(this.role.getresellerid());

      this.EditSubsForm.get('groupid').clearValidators();
      this.EditSubsForm.get('groupid').updateValueAndValidity();

      this.EditSubsForm.get('reseller').clearValidators();
      this.EditSubsForm.get('reseller').updateValueAndValidity();

      // this.EditSubsForm.get('serv_type').clearValidators();
      // this.EditSubsForm.get('serv_type').updateValueAndValidity();

    }
    if (this.role.getroleid() >= 775) {
      this.EditSubsForm.get('sim_use').clearValidators();
      this.EditSubsForm.get('sim_use').updateValueAndValidity();

      this.EditSubsForm.get('Expiry').clearValidators();
      this.EditSubsForm.get('Expiry').updateValueAndValidity();
    }
    await this.edit();
    await this.stateshow();
    await this.staticip();
  }

  acnttype() {
    this.account_type = this.editdatas['acctype'];
  }

  async edit() {
    let result = await this.ser.getSubscriberEdit({ id: this.id })
    // console.log("getedit",result);
    if (result) {
      this.editdatas = result[0];
      let acctype = this.editdatas['acctype'];
      this.acnt_type = acctype;
      // console.log("acntype",this.acnt_type)
      this.editdatas['cont_from_date'] = this.editdatas['cont_from_date'] != null ? this.editdatas['cont_from_date'].slice(0, 10) : '';
      this.editdatas['cont_valid_date'] = this.editdatas['cont_valid_date'] != null ? this.editdatas['cont_valid_date'].slice(0, 10) : '';
      this.edititems = result[1];
      // console.log(result)
    }
    this.createForm();
    await this.starter();
    await this.acnttype();
  }

  async starter() {
    this.cafvalid();
    await this.servicetype();
    await this.GroupName();
    await this.showReseller();
    await this.reselbranch();
    await this.Service();
    await this.modelshow();
    await this.PoolName();
    await this.cityshow();
    await this.substypevalid();
    let matitems = this.edititems;
    // console.log(matitems)
    for (var i = 0; i < matitems.length; i++) {
      this.materialDetails.push(this.createMaterial(matitems[i]['model'], matitems[i]['quantity'], matitems[i]['amount'], matitems[i]['total']));
    }
  }

  cancel() {
    if(this.view_flag == 1){
      localStorage.setItem('details', JSON.stringify(this.id));
      this.router.navigate(['/pages/cust/viewcust']);
    }else{
      this.router.navigate(['/pages/cust/custList']);
    }

  }

  get materialDetails(): FormArray {
    return this.EditSubsForm.get('materialDetails') as FormArray;
  }

  addMaterial() {
    this.materialDetails.push(this.createMaterial());
  }

  deleteMatField(index: number) {
    this.materialDetails.removeAt(index);
  }

  createMaterial(model = '', qty = '', price = '', total = ''): FormGroup {
    return this._fb.group({
      model: [model],
      qty: [qty],
      price: [price],
      total: [total]
    });
  }

  createForm() {
    this.EditSubsForm = new FormGroup({
      bus_id: new FormControl(this.editdatas ? this.editdatas['isp_id'] : '', Validators.required),
      groupid: new FormControl(this.editdatas ? this.editdatas['groupid'] : '', Validators.required),
      reseller: new FormControl(this.editdatas ? this.editdatas['reseller_id'] : '', Validators.required),
      CAF: new FormControl(this.editdatas ? this.editdatas['caf_no'] : ''),
      loc: new FormControl(this.editdatas ? this.editdatas['location_id'] : '', Validators.required),
      ID: new FormControl(this.editdatas ? this.editdatas['username'] : '', Validators.required),
      First: new FormControl(this.editdatas ? this.editdatas['firstname'] : '', Validators.required),
      // Last: new FormControl(this.editdatas ? this.editdatas['lastname'] : '', Validators.required),
      mobnum: new FormControl(this.editdatas ? this.editdatas['mobile'] : '', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      phonenum: new FormControl(this.editdatas ? this.editdatas['phone'] : '', [Validators.pattern('^[0-9]{10}$')]),
      state: new FormControl(this.editdatas ? this.editdatas['state'] : '', Validators.required),
      city: new FormControl(this.editdatas ? this.editdatas['city'] : '', Validators.required),
      latitude: new FormControl(this.editdatas ? this.editdatas['gpslat'] : ''),
      longitude: new FormControl(this.editdatas ? this.editdatas['gpslong'] : ''),
      email: new FormControl(this.editdatas ? this.editdatas['email'] : '', [Validators.required, Validators.pattern("[0-9 A-Z a-z ,.`!@#$%^&*_]*[@]{1}[a-z A-Z]*[.]{1}[a-z A-Z]{2,3}([.]{1}[a-z A-Z]{2,3})?")]),
      locality: new FormControl(this.editdatas ? this.editdatas['area'] : '', Validators.required),
      Installation: new FormControl(this.editdatas ? this.editdatas['address'] : '', Validators.required),
      Billing: new FormControl(this.editdatas ? this.editdatas['billing_addr'] : '', Validators.required),
      checkaddr: new FormControl(this.editdatas ? this.editdatas['address_flag'] : ''),
      addr_up_proof: new FormControl(''),
      subs_type: new FormControl(this.editdatas ? this.editdatas['subs_type'] : '', Validators.required),
      descr: new FormControl(this.editdatas ? this.editdatas['descr'] : ''),
      Company: new FormControl(this.editdatas ? this.editdatas['company'] : ''),
      ProofID: new FormControl(this.editdatas ? this.editdatas['ProofID'] : ''),
      GST: new FormControl(this.editdatas ? this.editdatas['gst'] : ''),
      cont_id: new FormControl(this.editdatas ? this.editdatas['contractid'] : ''),
      cont_from_date: new FormControl(this.editdatas ? this.editdatas['cont_from_date'] : ''),
      cont_to_date: new FormControl(this.editdatas ? this.editdatas['cont_valid_date'] : ''),
      demo_accnt: new FormControl(this.editdatas ? this.editdatas['acc_type'] : ''),
      status: new FormControl(this.editdatas ? this.editdatas['status'] : ''),
      pack_mode: new FormControl(this.editdatas ? JSON.stringify(this.editdatas['srvmode']) : ''),
      package: new FormControl(this.editdatas ? this.editdatas['srvid'] : ''),
      Expiry: new FormControl(this.editdatas ? this.editdatas['expiration']=='0000-00-00 00:00:00'? '':this.editdatas['expiration']: ''),
      sim_use: new FormControl(this.editdatas ? this.editdatas['simultaneous_use'] : ''),
      onu_mac: new FormControl(''),
      mac_addr: new FormControl(this.editdatas ? this.editdatas['usemacauth'] : ''),
      amac: new FormControl(this.editdatas ? this.editdatas['mac'] : ''),
      ipmode: new FormControl(this.editdatas ? this.editdatas['ipmodecpe'] : ''),
      conntype: new FormControl(this.editdatas ? this.editdatas['conntype'] : '', Validators.required),
      statip_type: new FormControl(this.editdatas ? this.editdatas['staticip_flag'] : ''),
      public_ip: new FormControl(this.editdatas ? this.editdatas['staticip_flag'] == 1 ? this.editdatas['pipid'] : '': ''),
      staticip: new FormControl(this.editdatas ? this.editdatas['staticip_flag'] == 0 ? this.editdatas['staticipcpe'] : '': ''),
      // public_ip: new FormControl(this.editdatas ? this.pip_address : ''),
      // staticip: new FormControl(this.editdatas ? this.sip_address : ''),
      ippool: new FormControl(this.editdatas ? this.editdatas['poolidcpe'] : ''),
      resel_renewal: new FormControl(this.editdatas ? this.editdatas['auto_renewal_resel'] == 0 ? false : true : ''),
      cust_renewal: new FormControl(this.editdatas ? this.editdatas['auto_renewal_cust'] == 0 ? false : true : ''),
      upproof: new FormControl(''),
      pan_no: new FormControl(this.editdatas ? this.editdatas['pan'] : ''),
      attributes: new FormControl(this.editdatas ? this.editdatas['attributes'] : ''),
      mat_from: new FormControl(this.editdatas ? this.editdatas['mat_from'] : ''),
      pincode: new FormControl(this.editdatas? this.editdatas['zip']:''),
      materialDetails: new FormArray([
        // this.createMaterial()
      ]),
    });
    // this.addMaterial();
  }

  onkeyupQty(event: any, index: number) { // without type info
    //console.log(index, test);
    if (event.target.value != "") {
      // console.log(this.EditSubsForm.value["materialDetails"][index]["qty"], this.EditSubsForm.value["materialDetails"][index]["price"])
      var total = Number(this.EditSubsForm.value["materialDetails"][index]["qty"]) * Number(this.EditSubsForm.value["materialDetails"][index]["price"]);
      const controlArray = <FormArray>this.EditSubsForm.get('materialDetails');
      controlArray.controls[index].get('total').setValue(total);
    }

  }
}

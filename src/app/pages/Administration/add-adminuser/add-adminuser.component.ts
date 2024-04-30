import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';
import { AddSuccessComponent } from './../success/add-success.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as FileSaver from 'file-saver';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { RoleService, ResellerService, AdminuserService, GroupService, BusinessService, SelectService } from '../../_service/indexService';
import {Location } from '@angular/common'

@Component({
  selector: 'add-adminuser',
  templateUrl: './add-adminuser.component.html',

})

export class AddAdminuserComponent implements OnInit {
  submit: boolean = false; AddAdminForm; item; data = ''; grup; busname; pro; resell
  editdatas; id; groups; arrayBuffer: any; file: any[]; bulk = []; s = 0; f = 0; failure: any[];
  bulkAdminuser = []; bulkdata = []; dist; states; resel; deptdata; showman; showbranch; manids; bids;
  searchresell = ''; reseldata;
  constructor(

    private alert: ToasterService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private adminuser: AdminuserService,
    private select: SelectService,
    public role: RoleService,
    public activeModal: NgbModal,
    private groupser: GroupService,
    private busser: BusinessService,
    private reselser: ResellerService,
    private location : Location
  ) {

  }

  async business() {
    this.busname = await this.busser.showBusName({})
    // console.log(this.busname)
  }

  async department() {
    if (this.role.getroleid() >= 777) {
      this.deptdata = await this.adminuser.showDepartment({ bus_id: this.AddAdminForm.value['bus_id'] });
      // console.log(res)
    } else {
      this.deptdata = await this.adminuser.showDepartment({});
    }
  }

  async GroupName() {
    this.grup = await this.groupser.showGroupName({ bus_id: this.AddAdminForm.value['bus_id'] });
  }

  async profile() {
    if (this.role.getroleid() <= 777) {
      this.pro = await this.adminuser.showProfileAdmin({})
    }
    if (this.role.getroleid() > 777) {
      this.pro = await this.adminuser.showProfileAdmin({ bus_id: this.AddAdminForm.value['bus_id'], emp_role: 1 });
    }
  }

  async showReseller($event = '') {
    this.resell = await this.reselser.showResellerName({ admin_role: 1, bus_id: this.AddAdminForm.value['bus_id'], Role: this.AddAdminForm.value['Role'], like: $event });
    // console.log(this.resell);

  }

  async cityshow($event = '') {
    this.dist = await this.select.showDistrict({ state_id: this.AddAdminForm.value['State'], like: $event, index: 0, limit: 15 });
  }

  async stateshow($event = '') {
    this.states = await this.select.showState({ like: $event })
  }

  async showallowman($event = '') {
    if (this.AddAdminForm.value['reseller']) {
      this.showman = await this.adminuser.showAllowMan({ bus_id: this.AddAdminForm.value['bus_id'], resel_id: this.AddAdminForm.value['reseller'], role: this.AddAdminForm.value['Role'], like: $event });
    }
    // console.log('Allow Reseller Result----', this.showman);

    await this.reselmap();
  }

  async reselmap() {
    // console.log('editdata',this.editdatas['allowman'])
    if (this.manids) {
      let resid = this.manids;
      // console.log('Reseller ID', resid)
      //  let resp =await this.showman.filter(item => item.data = resid.includes(item.id));
      let resp = await this.showman.filter(item => item.data = resid.includes(item.id));
    }
    //  console.log('Resp',resp)
    this.checkedreselitems();
  }

  async resellcheck(check) {
    // console.log('resellcheck', check)
    await this.showman.forEach(x => x.data = check)
  }
  async checkedreselitems() {   // After check value from html calls

    let checkedresell = await this.showman.filter(item => item.data).map(item => item.id)
    this.reseldata = checkedresell;
    // console.log(this.reseldata);
    // await this.fallbackser();
  }

  async showallowbranch($event = '') {
    if (this.AddAdminForm.value['reseller']) {
      this.showbranch = await this.adminuser.showAllowBranch({ bus_id: this.AddAdminForm.value['bus_id'], resel_id: this.AddAdminForm.value['reseller'], like: $event });
    }
    // console.log('Allow Branch Result----', this.showbranch);
  }

  async manvalid() {
    // console.log('Man', this.AddAdminForm.value.man_flag)
    // this.AddAdminForm.value.man_flag == '2' ? this.AddAdminForm.controls.show_man.setValidators([Validators.required]) : this.AddAdminForm.controls.show_man.clearValidators()
    // this.AddAdminForm.controls.show_man.updateValueAndValidity();
  }
  async branchvalid() {
    this.AddAdminForm.value.branch_flag == '2' ? this.AddAdminForm.controls.show_branch.setValidators([Validators.required]) : this.AddAdminForm.controls.show_branch.clearValidators()
    this.AddAdminForm.controls.show_branch.updateValueAndValidity();
  }
  manchange() {
    this.AddAdminForm.controls.show_man.setValue('');
  }
  branchchange() {
    this.AddAdminForm.controls.show_branch.setValue('');
  }

  infovalid() {
    if (this.AddAdminForm.value['create_type'] == '1') {
      this.AddAdminForm.get('Role').clearValidators();
      this.AddAdminForm.get('Role').updateValueAndValidity();

      this.AddAdminForm.get('FName').clearValidators();
      this.AddAdminForm.get('FName').updateValueAndValidity();

      // this.AddAdminForm.get('LName').clearValidators();
      // this.AddAdminForm.get('LName').updateValueAndValidity();

      this.AddAdminForm.get('gender').clearValidators();
      this.AddAdminForm.get('gender').updateValueAndValidity();

      this.AddAdminForm.get('email').clearValidators();
      this.AddAdminForm.get('email').updateValueAndValidity();



      this.AddAdminForm.get('Mobile').clearValidators();
      this.AddAdminForm.get('Mobile').updateValueAndValidity();

      this.AddAdminForm.get('Address').clearValidators();
      this.AddAdminForm.get('Address').updateValueAndValidity();

      this.AddAdminForm.get('UserName').clearValidators();
      this.AddAdminForm.get('UserName').updateValueAndValidity();

      this.AddAdminForm.get('Password').clearValidators();
      this.AddAdminForm.get('Password').updateValueAndValidity();

      this.AddAdminForm.get('CPassword').clearValidators();
      this.AddAdminForm.get('CPassword').updateValueAndValidity();

      this.AddAdminForm.get('brname').clearValidators();
      this.AddAdminForm.get('brname').updateValueAndValidity();


      this.AddAdminForm.get('State').clearValidators();
      this.AddAdminForm.get('State').updateValueAndValidity();

      this.AddAdminForm.get('City').clearValidators();
      this.AddAdminForm.get('City').updateValueAndValidity();

      this.AddAdminForm.get('man_flag').clearValidators();
      this.AddAdminForm.get('man_flag').updateValueAndValidity();

      this.AddAdminForm.get('branch_flag').clearValidators();
      this.AddAdminForm.get('branch_flag').updateValueAndValidity();

      // this.AddAdminForm.get('show_man').clearValidators();
      // this.AddAdminForm.get('show_man').updateValueAndValidity();

      this.AddAdminForm.get('show_branch').clearValidators();
      this.AddAdminForm.get('show_branch').updateValueAndValidity();

    }
  }

  changeListener(file) {
    this.file = file;
    this.filereader(this.file, result => {
      this.bulk = result;
      // console.log("inside file", this.bulk)
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

  async addAdminuser() {
    this.submit = true;
    let usertype = this.role.getusertype()
    this.AddAdminForm.value['user_type'] = usertype;
    let val = this.AddAdminForm.value;
    // this.filereader(this.file, res => {
    // this.bulk = res;
    // console.log("inside addNas", this.bulk);
    let bulkvald: boolean = false;
    for (var i = 0; i < this.bulk.length; i++) {
      if (!this.bulk[i].hasOwnProperty('Full Name')) {
        this.toastalert('Please fill the Full Name in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let fname = this.bulk[i]['Full Name']
        this.bulk[i].FName = fname;
      }
      // if (!this.bulk[i].hasOwnProperty('Last Name')) {
      //   this.toastalert('Please fill the Last Name in Excel Sheet');
      //   bulkvald = true;
      //   break;
      // }
      // else {
      //   let lname = this.bulk[i]['Last Name']
      //   this.bulk[i].LName = lname;
      // }

      if (!this.bulk[i].hasOwnProperty('Gender')) {
        this.toastalert('Please fill the Gender in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let gender = this.bulk[i]['Gender'] == 'Female' ? 1 : this.bulk[i]['Gender'] == 'Male' ? 2 : 3;
        this.bulk[i].gender = gender;
      }
      if (!this.bulk[i].hasOwnProperty('Email')) {
        this.toastalert('Please fill the Email in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let mail = this.bulk[i]['Email']
        this.bulk[i].email = mail;
      }
      if (this.bulk[i].hasOwnProperty('Alternate Email')) {
        let amail = this.bulk[i]['Alternate Email']
        this.bulk[i].Aemail = amail;
      }
      else {
        this.bulk[i].Aemail = this.AddAdminForm.value['Aemail']
      }
      if (!this.bulk[i].hasOwnProperty('Mobile Number')) {
        this.toastalert('Please fill the Mobile Number in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let mobnum = this.bulk[i]['Mobile Number']
        this.bulk[i].Mobile = mobnum;
      }
      if (!this.bulk[i].hasOwnProperty('Telephone Number')) {
        let phonenum = this.bulk[i]['Telephone Number']
        this.bulk[i].Telephone = phonenum;
      }
      else {
        let phonenum = this.bulk[i]['Telephone Number']
        this.bulk[i].Telephone = phonenum;
      }
      if (!this.bulk[i].hasOwnProperty('Residential Address')) {
        this.toastalert('Please fill the Residential Address in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let readdr = this.bulk[i]['Residential Address']
        this.bulk[i].Address = readdr;
      }
      if (!this.bulk[i].hasOwnProperty('Login Id')) {
        this.toastalert('Please fill the Admin User Login ID in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let adminlogin = this.bulk[i]['Login Id']
        this.bulk[i].UserName = adminlogin;
      }
      if (!this.bulk[i].hasOwnProperty('Password')) {
        this.toastalert('Please fill the Password in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        const md = new Md5
        let password = this.bulk[i].Password
        this.bulk[i].password_en = md.appendStr(password).end();
        this.bulk[i].CPassword = this.bulk[i].Password
      }
      if (!this.bulk[i].hasOwnProperty('Branch')) {
        this.toastalert('Please fill the Branch Name in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let branch = this.bulk[i]['Branch']
        this.bulk[i].brname = branch;
      }
      if (!this.bulk[i].hasOwnProperty('State')) {
        this.toastalert('Please fill the State in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let stat = this.bulk[i]['State']
        this.bulk[i].State = stat;
      }
      if (!this.bulk[i].hasOwnProperty('City')) {
        this.toastalert('Please fill the City in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let cit = this.bulk[i]['City']
        this.bulk[i].City = cit;
      }
      if (!this.bulk[i].hasOwnProperty('Status')) {
        this.toastalert('Please fill the City in Excel Sheet');
        bulkvald = true;
        break;
      }
      else {
        let status = this.bulk[i]['Status'] == 'Active' ? true : false;
        this.bulk[i].status = status;
      }
      this.bulk[i].bus_id = this.AddAdminForm.value['bus_id']
      this.bulk[i].groupid = this.AddAdminForm.value['groupid']
      // this.bulk[i].status = (this.AddAdminForm.value['status'] == 'true' ? 1 : 0)
      this.bulk[i].Role = this.AddAdminForm.value['Role']
      this.bulk[i].user_dept = this.AddAdminForm.value['user_dept']
      this.bulk[i].reseller = this.AddAdminForm.value['reseller'];
      // this.bulk[i].hasOwnProperty('Description')
      // let descrp = this.bulk[i]['Description']
      // this.bulk[i].descp = descrp;
    }
    this.s = 0; this.f = 0;
    let s = 0;
    this.failure = [];
    // this.AddAdminForm.value['status']==true ? 1 : 0 ;
    // console.log("statusss: " , this.AddAdminForm.value['status'])
    // this.infovalid();
    const invalid = [];
    const controls = this.AddAdminForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name)
      }
    };
    if (this.AddAdminForm.invalid) {
      console.log("wrong", invalid)
      this.submit = true;
      return;
    }

    if (this.AddAdminForm.value['create_type'] == '0' || this.id) {
      const md5 = new Md5;
      this.AddAdminForm.value['password_en'] = md5.appendStr(this.AddAdminForm.value['Password']).end();
      this.AddAdminForm.value['show_man'] = this.reseldata;
      // console.log('show man data', this.reseldata)
      let admindata = [this.AddAdminForm.value];
      let method = 'addAdminuser';
      if (this.id) {
        method = 'editAdminuser'
        this.AddAdminForm.value['id'] = this.id;
      }
      let result = await this.adminuser[method]({ bulkAdminuser: admindata })
      // this.datas=result;
      // console.log(this.AddAdminForm.value)
      if (result) {
        this.reseult_pop(result);
      }
      // this.createForm();

    }
    if (this.AddAdminForm.value['create_type'] == '1') {
      // this.AddAdminForm.value['reselbulk'] = this.bulk;
      // console.log(this.AddAdminForm.value)
      let method = 'addAdminuser';
      let result = await this.adminuser[method]({ bulkAdminuser: this.bulk });
      // this.datas=result;
      if (result) {
        this.reseult_pop(result);
      }
      // this.createForm();
    }
    // })
  }

  async edit() {
    let result = await this.adminuser.getAdminuseredit({ id: this.id });
    if (result) {
      this.editdatas = result;
      // console.log("res", result)
      if (this.editdatas['allowman'] != null) {
        // var manid = this.editdatas['ott_platform'].slice(1, -1),
        let manid = this.editdatas['allowman'].split(',')
        // man_id = manid.split(',')
        this.manids = manid.map((i) => Number(i));
        // console.log("IDs", this.manids);
      }

      if (this.editdatas['allowbranch'] != null) {
        let bid = this.editdatas['allowbranch'].split(',')
        this.bids = bid.map((i) => Number(i));
        console.log("IDs", this.bids);
      }
    }
    this.createForm();
    await this.GroupName();
    await this.profile();
    await this.department();
    await this.stateshow();
    await this.cityshow();
    await this.showReseller();
    await this.showallowman();
    await this.showallowbranch();
    await this.manvalid();
    await this.branchvalid();
  }

  async ngOnInit() {
    this.createForm();
    this.aRoute.queryParams.subscribe(param => {
      this.id = param.id || null;
    })
    if (this.id) {
      this.location.replaceState('/#/pages/administration/edit-adminuser')
      await this.edit();
      this.AddAdminForm.get('Password').clearValidators();
      this.AddAdminForm.get('Password').updateValueAndValidity();

      this.AddAdminForm.get('CPassword').clearValidators();
      this.AddAdminForm.get('CPassword').updateValueAndValidity();

      this.AddAdminForm.get('create_type').clearValidators();
      this.AddAdminForm.get('create_type').updateValueAndValidity();
    }
    await this.main();
  }

  async main() {
    await this.business();
    await this.stateshow();
    if (this.role.getroleid() >= 775) {
      this.AddAdminForm.get('groupid').clearValidators();
      this.AddAdminForm.get('groupid').updateValueAndValidity();
    }
    if (this.role.getroleid() <= 777) {
      this.AddAdminForm.controls['bus_id'].setValue(this.role.getispid())
      await this.GroupName();
      await this.department();
      await this.profile();
      this.AddAdminForm.get('bus_id').clearValidators();
      this.AddAdminForm.get('bus_id').updateValueAndValidity();

      this.AddAdminForm.get('groupid').clearValidators();
      this.AddAdminForm.get('groupid').updateValueAndValidity();

      this.AddAdminForm.get('Role').clearValidators();
      this.AddAdminForm.get('Role').updateValueAndValidity();

    }
    if (this.role.getroleid() < 775) {
      this.AddAdminForm.get('create_type').setValue('0');

      this.AddAdminForm.controls['groupid'].setValue(this.role.getgrupid());

      this.AddAdminForm.get('Role').clearValidators();
      this.AddAdminForm.get('Role').updateValueAndValidity();
      // console.log('Role value',this.AddAdminForm.value['Role'])

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

  reseult_pop(item) {
    Object.assign(item, { admin: "1" });
    const activeModal = this.activeModal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.result.then((data) => {

    });
  }

  createForm() {
    this.AddAdminForm = new FormGroup({
      create_type: new FormControl('', Validators.required),
      bus_id: new FormControl(this.editdatas ? this.editdatas['busname'] : '', Validators.required),
      groupid: new FormControl(this.editdatas ? this.editdatas['groupid'] : '', Validators.required),
      Role: new FormControl(this.editdatas ? (this.editdatas['role']) : '', Validators.required),
      reseller: new FormControl(this.editdatas ? this.editdatas['managers_id'] : ''),
      user_dept: new FormControl(this.editdatas ? this.editdatas['ispdepid'] : ''),
      // resell: new FormControl(''),
      FName: new FormControl(this.editdatas ? this.editdatas['firstname'] : '', Validators.required),
      // LName: new FormControl(this.editdatas ? this.editdatas['lastname'] : '', Validators.required),
      gender: new FormControl(this.editdatas ? this.editdatas['gender'] : '', Validators.required),
      email: new FormControl(this.editdatas ? this.editdatas['email'] : '', [Validators.required, Validators.pattern("[0-9 A-Z a-z ,.`!@#$%^&*_]*[@]{1}[a-z A-Z]*[.]{1}[a-z A-Z]{2,3}([.]{1}[a-z A-Z]{2,3})?")]),
      Aemail: new FormControl(this.editdatas ? this.editdatas['altr_email'] : '', [Validators.pattern("[0-9 A-Z a-z ,.`!@#$%^&*_]*[@]{1}[a-z A-Z]*[.]{1}[a-z A-Z]{2,3}([.]{1}[a-z A-Z]{2,3})?")]),
      Mobile: new FormControl(this.editdatas ? this.editdatas['mobile'] : '', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      Telephone: new FormControl(this.editdatas ? this.editdatas['phone'] : ''),
      Address: new FormControl(this.editdatas ? this.editdatas['address'] : '', Validators.required),
      UserName: new FormControl(this.editdatas ? this.editdatas['managername'] : '', Validators.required),
      Password: new FormControl('', Validators.required),
      CPassword: new FormControl('', Validators.required),
      // locname: new FormControl(this.editdatas? this.editdatas['phone']:'', Validators.required),
      brname: new FormControl(this.editdatas ? this.editdatas['branch_address'] : ''),
      // State: new FormControl(this.editdatas? this.editdatas['state']:'', Validators.required),
      // City: new FormControl(this.editdatas? this.editdatas['city']:'', Validators.required),
      City: new FormControl(this.editdatas ? this.editdatas['city'] : '', Validators.required),
      State: new FormControl(this.editdatas ? this.editdatas['state'] : '', Validators.required),
      man_flag: new FormControl(this.editdatas ? this.editdatas['amflag'] : 1, Validators.required),
      branch_flag: new FormControl(this.editdatas ? this.editdatas['abflag'] : 1, Validators.required),
      // show_man: new FormControl(this.editdatas ? this.editdatas['allowman'] : ''),
      show_branch: new FormControl(this.editdatas ? this.bids : ''),

      // Pin: new FormControl(this.editdatas? this.editdatas['zip']:'', [Validators.required, Validators.pattern('^[0-9]{6}$')]),
      // user_role:new FormControl(this.editdatas?this.editdatas['menu_name']:'',Validators.required),
      status: new FormControl(this.editdatas ? (this.editdatas['status'] == 0 ? this.editdatas['status'] = false : this.editdatas['status'] = true) : true, Validators.required),
    });
  }
}


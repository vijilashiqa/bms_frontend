import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { S_Service, BusinessService, GroupService, RoleService, NasService, ResellerService } from '../../_service/indexService';
@Component({
  selector: 'addtopup',
  templateUrl: './add-topup.component.html',
  styleUrls: ['./add-topup.component.scss'],
})

export class AddTopupComponent implements OnInit {
  submit: boolean = false; AddTopupForm; id; editdatas; resell; busname; grup; pack; alnas: any = []; nasresel: any = []; buresellitems;
  nas; searchresell = ''; reseldata = []; resid; state = ''; data = ''; mapdata;
  resdata;
  config;
  constructor(
    private router: Router,
    private alert: ToasterService,
    private ser: S_Service,
    private busser: BusinessService,
    private grupser: GroupService,
    private nasser: NasService,
    public role: RoleService,
    private resser: ResellerService,

  ) { this.id = JSON.parse(localStorage.getItem('array')); }

  async business() {
    this.busname = await this.busser.showBusName({});
  }

  async GroupName() {
    this.grup = await this.grupser.showGroupName({ bus_id: this.AddTopupForm.value['bus_id'] });
    // console.log(res)
  }

  async reseller($event = '') {
    this.resdata = await this.resser.showResellerName({ edit_flag: 1, except: 1, bus_id: this.AddTopupForm.value['bus_id'], groupid: this.AddTopupForm.value['groupid'], like: $event });
  }

  async resellcheck(check) {
    await this.resdata.forEach(x => x.data = check)
  }

  async checkedresel() {
    let reselcheck = await this.resdata.filter(item => item.data).map(item => item.id)
    this.reseldata = reselcheck;
  }

  async addtopup() {

    if (this.AddTopupForm.invalid || !this.reseldata.length) {
      window.alert('Please fill all mandatory fields or select any one reseller')
      this.submit = true;
      return;
    }
    this.AddTopupForm.value['resid'] = this.reseldata;
    let topupdata = [this.AddTopupForm.value]
    let result = await this.ser.addTopup({ topup: topupdata }
    );
    const toast: Toast = {
      type: result[0]['error_msg'] == 0 ? 'success' : 'warning',
      title: result[0]['error_msg'] == 0 ? 'Success' : 'Failure',
      body: result[0]['msg'],
      timeout: 3000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
    if (result[0]['error_msg'] == 0) {
      this.router.navigate(['/pages/service/list-topup'])
    }
  }

  async ngOnInit() {
    this.createForm();
    await this.business();
    if (this.role.getroleid() <= 777) {
      this.AddTopupForm.get('bus_id').setValue(this.role.getispid());
      await this.GroupName();
      await this.reseller();
    }
    if (this.role.getroleid() < 775) {
      this.AddTopupForm.get('groupid').setValue(this.role.getgrupid());
      await this.reseller();
    }
  }

  createForm() {
    this.AddTopupForm = new FormGroup({
      bus_id: new FormControl('', Validators.required),
      groupid: new FormControl(''),
      topup_name: new FormControl('', Validators.required),
      limit_size: new FormControl('', Validators.required),
      limit: new FormControl('', Validators.required),
      tax_type: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      status: new FormControl(true, Validators.required),
    });
  }
}
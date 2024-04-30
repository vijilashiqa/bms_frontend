import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { S_Service, BusinessService, GroupService, RoleService, NasService, ResellerService } from '../../_service/indexService';
@Component({
  selector: 'edit-topup',
  templateUrl: './edit-topup.component.html',
  styleUrls: ['./edit-topup.component.scss']
})

export class EditTopupComponent implements OnInit {
  submit: boolean = false; EditTopupForm; id; editdatas; resell; busname; grup; pack; alnas: any = []; nasresel: any = []; buresellitems;
  nas; searchresell = ''; reseldata=[]; resid; state = ''; data = ''; checkids;
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

  ) { this.id = JSON.parse(localStorage.getItem('topid')); }


  async ngOnInit() {
    this.createForm();
    await this.business();
    if (this.role.getroleid() <= 777) {
      this.EditTopupForm.get('bus_id').setValue(this.role.getispid());
      await this.GroupName();
    }
    if (this.role.getroleid() < 775) {
      this.EditTopupForm.get('groupid').setValue(this.role.getgrupid());
      await this.reseller();
    }
    if (this.id) {
      await this.edit();
    }
  }

  async business() {
    this.busname = await this.busser.showBusName({});
  }

  async GroupName() {
    this.grup = await this.grupser.showGroupName({ bus_id: this.EditTopupForm.value['bus_id'] });
    // console.log(res)
  }

  async reseller($event = '') {
    this.resdata = await this.resser.showResellerName({ edit_flag: 1, except: 1, bus_id: this.EditTopupForm.value['bus_id'], groupid: this.EditTopupForm.value['groupid'], like: $event });

    if (this.resdata) {
      await this.editcheck();
    }
  }

  async resellcheck(check) {
    await this.resdata.forEach(x => x.data = check)
  }

  async checkedresel() {
    let reselcheck = await this.resdata.filter(item => item.data).map(item => item.id)
    this.reseldata = reselcheck;
  }

  async edittopup() {
    if (this.EditTopupForm.invalid || !this.reseldata.length) {
      this.submit = true;
      window.alert('Please Fill all mandatory fields or Select any one Reseller')
      return;
    }
    this.EditTopupForm.value['id'] = this.id;
    this.EditTopupForm.value['resid'] = this.reseldata;
    let topupdata = [this.EditTopupForm.value]
    let result = await this.ser.editTopup({ topup: topupdata }
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

  editcheck() {
    if (this.checkids) {
      this.resdata.filter(item => item.data = this.checkids.includes(item.id));
    }
    this.checkedresel();
  }

  async edit() {
    this.editdatas = await this.ser.getEditTopup({ id: this.id });
     let ids = this.editdatas['reseller_id'];
    let IDS = ids.split(',');
    this.checkids = IDS.map((i) => Number(i));
    this.createForm();
    await this.GroupName();
    await this.reseller();
  }

  createForm() {
    this.EditTopupForm = new FormGroup({
      bus_id: new FormControl(this.editdatas ? this.editdatas['isp_id'] : '', Validators.required),
      groupid: new FormControl(this.editdatas ? this.editdatas['group_id'] : ''),
      topup_name: new FormControl(this.editdatas ? this.editdatas['top_name'] : '', Validators.required),
      limit_size: new FormControl(this.editdatas ? this.editdatas['limit_size'] : '', Validators.required),
      limit: new FormControl(this.editdatas ? this.editdatas['limit'] : '', Validators.required),
      tax_type: new FormControl(this.editdatas ? this.editdatas['tax_type'] : '', Validators.required),
      price: new FormControl(this.editdatas ? this.editdatas['price'] : '', Validators.required),
      status: new FormControl(this.editdatas ? (this.editdatas['status'] == 0 ? this.editdatas['status'] = false : this.editdatas['status'] = true) : ''),

    });
  }
}
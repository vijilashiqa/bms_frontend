import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Netmask } from 'netmask';
import { getIPRange } from 'get-ip-range';
import { AddSuccessComponent } from '../success/add-success.component';
import { GroupService, RoleService, BusinessService, ResellerService, IppoolService } from '../../_service/indexService';

@Component({
  selector: 'add-staticip',
  templateUrl: './addstaticip.component.html',
  // styleUrls:['./custstyle.scss'],
})

export class AddStaticIPComponent implements OnInit {
  submit: boolean = false; AddstaticIPForm; item; datas; editdatas; ip; items; busname; grup; anas; pro;
  modalHeader;
  ippool = []; config; reseldata;
  constructor(
    private alert: ToasterService,
    private router: Router,
    private aRouter: ActivatedRoute,
    private busser: BusinessService,
    private groupser: GroupService,
    private resser: ResellerService,
    public activeModal: NgbActiveModal,
    public role: RoleService,
    private pool: IppoolService,
    // public iprange:etmask,

  ) { }

  closeModal() {
    this.activeModal.close();
    // this.router.navigate(['/pages/Accounts/listreceipt']);
  }

  async business() {
    this.busname = await this.busser.showBusName({});
    // console.log(this.busname)
  }

  async profile() {
    this.pro = await this.resser.showProfileReseller({ rec_role: 1, bus_id: this.AddstaticIPForm.value['bus_id'] });
    // console.log(res)
  }

  async resellername() {
    if (this.role.getroleid() >= 775) {
      this.reseldata = await this.resser.showResellerName({ role: this.AddstaticIPForm.value['Role'] });
      // console.log(res)
    }
    if (this.role.getroleid() < 775) {
      this.reseldata = await this.resser.showResellerName({ role: this.role.getroleid() });
      // console.log(res)
    }
  }

  async ngOnInit() {
    this.createForm();
    if (this.item) {
      await this.edit();
    }
    await this.main();
  }

  async main() {
    await this.business();
    if (this.role.getroleid() <= 777) {
      // console.log('jdh')
      this.AddstaticIPForm.get('bus_id').setValue(this.role.getispid());
      await this.profile()
    }
    if(this.role.getroleid()<775){
      this.AddstaticIPForm.get('Role').setValue(this.role.getroleid());
      this.AddstaticIPForm.get('reseller').setValue(this.role.getresellerid());
    }
  }

  async addstaticIP() {
    // console.log(this.AddstaticIPForm.value)
    if (this.AddstaticIPForm.invalid) {
      this.submit = true;
      return;
    }
    let method = 'addStaticIp';
    if (this.item) {
      method = 'editStaticIp';
      this.AddstaticIPForm.value['id'] = this.item;
    }
    // console.log("ip",this.AddstaticIPForm.value);
    let ip = [this.AddstaticIPForm.value]
    let result = await this.pool[method]({ staticip: ip })
    // console.log(result)
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
      this.closeModal();
    }

  }

  async edit() {
    let result = await this.pool.getStaticIp({ id: this.item });
    if (result) {
      this.editdatas = result;
      // console.log(result)
    }
    this.createForm();
    await this.profile();
    await this.resellername();
  }

  GenerateIppool() {
    let iprang = this.AddstaticIPForm.value['ip_add']
    const range = new Netmask(iprang)
    const ipv4CIDR = getIPRange(iprang);
    this.AddstaticIPForm.controls['FirstIp'].setValue(ipv4CIDR[2])
    this.AddstaticIPForm.controls['LastIp'].setValue(range.last)
    // console.log(range)
  }

  createForm() {
    this.AddstaticIPForm = new FormGroup({
      bus_id: new FormControl(this.editdatas ? this.editdatas['isp_id'] : '', Validators.required),
      Role: new FormControl(this.editdatas ? this.editdatas['role'] : '', Validators.required),
      reseller: new FormControl(this.editdatas ? this.editdatas['reseller_id'] : '', Validators.required),
      FirstIp: new FormControl(''),
      LastIp: new FormControl(''),
      ip_add: new FormControl(this.editdatas ? this.editdatas['ipaddress'] : '', Validators.required),
      start_date: new FormControl(this.editdatas ? this.editdatas['start_date'].slice(0, 10) : '', Validators.required),
      end_date: new FormControl(this.editdatas ? this.editdatas['expiration'].slice(0, 10) : '', Validators.required),
      unit_type: new FormControl(this.editdatas ? this.editdatas['unit_type'] : '', Validators.required),
      unit: new FormControl(this.editdatas ? this.editdatas['units'] : '', Validators.required),
      tax_type: new FormControl(this.editdatas ? this.editdatas['tax_type'] : '', Validators.required),
      amount: new FormControl(this.editdatas ? this.editdatas['amount'] : '', Validators.required)
    });
  }
}
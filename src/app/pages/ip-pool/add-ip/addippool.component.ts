import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Netmask } from 'netmask';
import { getIPRange } from 'get-ip-range';
import { AddSuccessComponent } from './../success/add-success.component';
import { GroupService, RoleService, BusinessService, SelectService, IppoolService, NasService } from '../../_service/indexService';

@Component({
  selector: 'add-ip',
  templateUrl: './addippool.component.html',
  // styleUrls:['./custstyle.scss'],
})

export class AddIPpoolComponent implements OnInit {
  submit: boolean = false; AddIPForm; item; datas; editdatas; ip; items; busname; grup; anas;
  ippool = []; config;
  constructor(
    private alert: ToasterService,
    private router: Router,
    private aRouter: ActivatedRoute,
    private pool: IppoolService,
    private select: SelectService,
    private busser: BusinessService,
    private groupser: GroupService,
    private nasser: NasService,
    public activeModal: NgbModal,
    public role: RoleService,
    // public iprange:etmask,

  ) { }

  async business() {
    this.busname = await this.busser.showBusName({});
    // console.log(this.busname)
  }

  async GroupName() {
    this.grup = await this.groupser.showGroupName({ bus_id: this.AddIPForm.value['bus_id'] });
    // console.log("group",res)
  }

  async Nas($event='') {
    this.anas = await this.nasser.showGroupNas({ like:$event,groupid: this.AddIPForm.value['groupid'], bus_id: this.AddIPForm.value['bus_id'],edit_flag:1 });
    // console.log(this.anas)
  }

  async ngOnInit() {
    this.createForm();
    this.aRouter.queryParams.subscribe(param => {
      this.item = param.id || null;
    })
    if (this.item) {
      await this.edit();
    }
    await this.main();
  }

  async main() {
    await this.business();
    if (this.role.getroleid() <= 777) {
      // console.log('jdh')
      this.AddIPForm.controls['bus_id'].setValue(this.role.getispid())
      await this.GroupName();
      // this.Nas()
    }
  }

  async addIPPool() {
    // console.log(this.AddIPForm.value)
    if (this.AddIPForm.invalid) {
      this.submit = true;
      return;
    }
    let method = 'addIppool';
    if (this.item) {
      method = 'editIppool';
      this.AddIPForm.value['id'] = this.item;
    }
    // console.log("ip",this.AddIPForm.value);
    let ippool1 = this.AddIPForm.value
    let result = await this.pool[method]({ ippool: [ippool1] })
    // console.log(result)
    if (result) {
      this.result_pop(result);
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

  result_pop(item) {
    const activeModal = this.activeModal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.result.then((data) => {

    });
  }

  async edit() {
    let result = await this.pool.getIppooledit({ id: this.item })
    if (result) {
      this.editdatas = result;
      // console.log(result)
    }
    this.createForm();
    await this.GroupName();
    await this.Nas();
  }

  GenerateIppool() {
    let iprang = this.AddIPForm.value['ip_add']
    const range = new Netmask(iprang)
    const ipv4CIDR = getIPRange(iprang);

    this.AddIPForm.controls['FirstIp'].setValue(ipv4CIDR[2])
    this.AddIPForm.controls['LastIp'].setValue(range.last)
    // console.log(range)
  }

  createForm() {

    this.AddIPForm = new FormGroup({
      bus_id: new FormControl(this.editdatas ? this.editdatas['isp_id'] : '', Validators.required),
      groupid: new FormControl(this.editdatas ? this.editdatas['group_id'] : '', Validators.required),
      nasname: new FormControl(this.editdatas ? this.editdatas['nas_id'] : '', Validators.required),
      PoolName: new FormControl(this.editdatas ? this.editdatas['name'] : '', Validators.required),
      FirstIp: new FormControl(this.editdatas ? this.editdatas['fromip'] : ''),
      LastIp: new FormControl(this.editdatas ? this.editdatas['toip'] : ''),
      NextPool: new FormControl(this.editdatas ? this.editdatas['nextpoolid'] : '0'),
      Description: new FormControl(this.editdatas ? this.editdatas['descr'] : ''),
      type: new FormControl(this.editdatas ? JSON.stringify(this.editdatas['type']) : '1', Validators.required),
      ip_add: new FormControl(this.editdatas ? this.editdatas['ip_netmask'] : '', Validators.required),
      // net_mask :new FormControl(this.editdatas?this.editdatas['']:''),
      // gate:new FormControl(this.editdatas?this.editdatas['']:''),

    });
  }
}
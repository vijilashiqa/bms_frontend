import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { S_Service, BusinessService, GroupService, RoleService, NasService, ResellerService } from '../../_service/indexService';
import { AddSuccessComponent } from './../success/add-success.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngx-servicemap',
  templateUrl: './servicemap.component.html',
  styleUrls: ['./servicemap.component.scss']
})
export class ServicemapComponent implements OnInit {

  submit: boolean = false; AddServiceMapForm; busname; grup; pack; srvmanitems; srvnas: any = []; resid; nasid;
  id; editdatas; resell; nasresel: any = [];
  nas; searchresell = ''; searchnas = ''; reseldata; serassigndata; state = ''; data = ''; mapdata; falback
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
    public activeModal: NgbModal,

  ) { }

  async ngOnInit() {
    this.createForm();
    await this.business();
    if (this.role.getroleid() <= 777) {
      this.AddServiceMapForm.get('bus_id').setValue(this.role.getispid());
      await this.GroupName();
      await this.service();
    }
    if (this.role.getroleid() < 775) {
      this.AddServiceMapForm.get('groupid').setValue(this.role.getgrupid());
      await this.service();
    }
  }

  async business() {
    this.busname = await this.busser.showBusName({});
  }

  async GroupName() {
    this.grup = await this.grupser.showGroupName({ bus_id: this.AddServiceMapForm.value['bus_id'] });
  }

  async service($event = '') {
    if (this.role.getroleid() >= 775) {
      this.pack = await this.ser.showService({ bus_id: this.AddServiceMapForm.value['bus_id'], groupid: this.AddServiceMapForm.value['groupid'], like: $event });
    }
    if (this.role.getroleid() < 775) {
      this.pack = await this.ser.showService({ res_flag: 1, like: $event });
    }
  }

  // Check All----------------
  async resellcheck(check) {
    if (this.AddServiceMapForm.value['serassign_type'] == '1') {
      await this.srvnas.forEach(x => x.data = check)
      // this.busresell()
    }
    if (this.AddServiceMapForm.value['serassign_type'] == '2') {
      await this.srvmanitems.forEach(x => x.data = check)
    }
  }
  async showServiceNas() {           // Nas Wise
    if (this.AddServiceMapForm.value['package'] != null && this.AddServiceMapForm.value['package'] != '' && this.AddServiceMapForm.value['serassign_type'] == '1') {
      let result = await this.ser.showAssignNas({ srvid: this.AddServiceMapForm.value['package'], groupid: this.AddServiceMapForm.value['groupid'], bus_id: this.AddServiceMapForm.value['bus_id'] });
      this.srvnas = result;
      this.nasid = this.srvnas.filter(item => item.astatus == 1).map(item => item.id)
      await this.reselmap();
    }

  }

  async showManService() {           // Reseller Wise
    if (this.AddServiceMapForm.value['package'] != null && this.AddServiceMapForm.value['package'] != '' && this.AddServiceMapForm.value['serassign_type'] == '2') {
      let result = await this.ser.showAssignService({ srvid: this.AddServiceMapForm.value['package'], groupid: this.AddServiceMapForm.value['groupid'], bus_id: this.AddServiceMapForm.value['bus_id'] });
      this.srvmanitems = result;
      this.resid = this.srvmanitems.filter(item => item.astatus == 1).map(item => item.manid)
      await this.reselmap();
    }

  }

  async reselmap() {
    if (this.nasid && this.AddServiceMapForm.value['serassign_type'] == '1') {    // Nas Wise
      await this.srvnas.filter(item => item.data = this.nasid.includes(item.id));
    }
    if (this.resid && this.AddServiceMapForm.value['serassign_type'] == '2') {    // Reseller Wise
      await this.srvmanitems.filter(item => item.data = this.resid.includes(item.manid));
    }
    this.checkedreselitems();
  }

  async checkedreselitems() {   // After check value from html
    if (this.AddServiceMapForm.value['serassign_type'] == '1') {   // Nas Wise
      let checkedresell = await this.srvnas.filter(item => item.data).map(item => item.id)
      this.reseldata = checkedresell;
      // await this.fallbackser();
    }
    if (this.AddServiceMapForm.value['serassign_type'] == '2') {    // Reseller Wise
      let checkedresell = await this.srvmanitems.filter(item => item.data).map(item => item.manid)
      this.reseldata = checkedresell;
      // await this.fallbackser();
    }
  }

  async addServiceMap() {
    if (this.AddServiceMapForm.invalid) {
      this.submit = true;
      return;
    }
    this.AddServiceMapForm.value['resid'] = this.reseldata;
    let sermapdata = [this.AddServiceMapForm.value]
    let result = await this.ser.serviceMapping({ mapService: sermapdata }
    );
    // const toast: Toast = {
    //   type: result[0]['error_msg'] == 0 ? 'success' : 'warning',
    //   title: result[0]['error_msg'] == 0 ? 'Success' : 'Failure',
    //   body: result[0]['msg'],
    //   timeout: 3000,
    //   showCloseButton: true,
    //   bodyOutputType: BodyOutputType.TrustedHtml,
    // };
    // this.alert.popAsync(toast);

    // if (result[0]['error_msg'] == 0) {
    //   this.AddServiceMapForm.controls.package.setValue('')
    // }
    let res = result[0]
    if (res['error_msg'] == 0) this.AddServiceMapForm.controls.package.setValue('');
    if (result) {
      this.result_pop(result, true);
    }

    // if (result[0]['error_msg'] == 0) {
    // this.router.navigate(['/pages/service/service-list'])
    // this.router.navigate(['/pages/service/servicemap'])
    //   .then(() => {
    //     window.location.reload();
    //   });
    // }
  }

  result_pop(item, servicemap) {
    const activeModal = this.activeModal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.componentInstance.servicemap = servicemap;
    activeModal.result.then((data) => {
    });
  }


  // async fallbackser() {
  //   if (this.AddServiceMapForm.value['serassign_type'] == '1') {
  //     this.falback = await this.ser.showFallback({ nas_id: this.nas, resel_id: this.reseldata, serassign_type: this.AddServiceMapForm.value['serassign_type'] });
  //   }
  //   if (this.AddServiceMapForm.value['serassign_type'] == '2') {
  //     this.falback = await this.ser.showFallback({ resel_id: this.reseldata, serassign_type: this.AddServiceMapForm.value['serassign_type'] });
  //   }
  // }


  createForm() {
    this.AddServiceMapForm = new FormGroup({
      bus_id: new FormControl('', Validators.required),
      groupid: new FormControl(''),
      package: new FormControl('', Validators.required),
      serassign_type: new FormControl('', Validators.required),

    });
  }
}

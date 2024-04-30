import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { S_Service, BusinessService, GroupService, RoleService, NasService, ResellerService } from '../../_service/indexService';
import { AddSuccessComponent } from './../success/add-success.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'add-service-map',
  templateUrl: './add-service-map.component.html',
  styleUrls: ['./add-service-map.component.scss']
})

export class AddServiceMapComponent implements OnInit {
  submit: boolean = false; AddServicemapForm; id; editdatas; resell; busname; grup; pack; alnas: any = []; nasresel: any = []; buresellitems;
  nas; searchresell = ''; reseldata; serassigndata; resid; state = ''; data = ''; mapdata;
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


  ) { this.id = JSON.parse(localStorage.getItem('array')); }

  async business() {
    this.busname = await this.busser.showBusName({});
  }

  async GroupName() {
    this.grup = await this.grupser.showGroupName({ bus_id: this.AddServicemapForm.value['bus_id'] });
    // console.log(res)
  }

  async service($event = '') {
    if (this.role.getroleid() >= 777) {
      this.pack = await this.ser.showService({ bus_id: this.AddServicemapForm.value['bus_id'], groupid: this.AddServicemapForm.value['groupid'], like: $event });
      // console.log('pack', res)
    }
    if (this.role.getroleid() <= 775) {
      this.pack = await this.ser.showService({ res_flag: 1, like: $event });
      // console.log(this.pack)
    }
  }

  async sernasresel() {
    if (this.AddServicemapForm.value['package'] != null) {
      let result = await this.ser.showAssignService({ srvid: this.AddServicemapForm.value['package'], groupid: this.AddServicemapForm.value['groupid'], bus_id: this.AddServicemapForm.value['bus_id'] });
      this.serassigndata = result;
      this.resid = this.serassigndata.filter(item => item.astatus == 1).map(item => item.manid)
      await this.reselmap();
    }

  }

  async resellcheck(check) {
    await this.serassigndata.forEach(x => x.data = check)
    // this.busresell()
  }

  async reselmap() {
    if (this.resid) {
      await this.serassigndata.filter(item => item.data = this.resid.includes(item.manid));
    }
    this.checkedresel();
  }

  async checkedresel() {
    let reselcheck = await this.serassigndata.filter(item => item.data).map(item => item.manid)
    this.reseldata = reselcheck;
  }

  async addNas() {
    if (this.AddServicemapForm.invalid) {
      this.submit = true;
      return;
    }
    this.AddServicemapForm.value['resid'] = this.reseldata;
    let sermapdata = [this.AddServicemapForm.value]
    let result = await this.ser.serviceMap({ mapService: sermapdata }
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
    //   // this.router.navigate(['/pages/service/service-list'])
    //   this.AddServicemapForm.controls.package.setValue('')
    // }
    let res = result[0]
    if (res['error_msg'] == 0) this.AddServicemapForm.controls.package.setValue('');
    if (result) {
      this.result_pop(result, true);
    }
  }

  result_pop(item, servicemap) {
    const activeModal = this.activeModal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.componentInstance.servicemap = servicemap;
    activeModal.result.then((data) => {
     });
  }



  async ngOnInit() {
    this.createForm();
    await this.business();
    if (this.role.getroleid() <= 777) {
      this.AddServicemapForm.get('bus_id').setValue(this.role.getispid());
      await this.GroupName();
      await this.service();
    }
    if (this.role.getroleid() < 775) {
      this.AddServicemapForm.get('groupid').setValue(this.role.getgrupid());
      await this.service();
    }
  }

  createForm() {
    this.AddServicemapForm = new FormGroup({
      bus_id: new FormControl('', Validators.required),
      groupid: new FormControl(''),
      package: new FormControl('', Validators.required),
    });
  }
}
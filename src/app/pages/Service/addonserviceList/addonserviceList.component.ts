import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpecialAddComponent } from '../specialAdd/specialadd.component';
import { dynamicAddComponent } from '../dynamicAdd/dynamicadd.component';
import { S_Service } from '../../_service/indexService';
@Component({
  selector: 'addonserviceList',
  templateUrl: './addonserviceList.component.html',
})
export class addonserviceListComponent implements OnInit {
  addon; dyn; data;
  total; total1; config;
  constructor(
    private nasmodel: NgbModal,
    private ser: S_Service
  ) { }

  ngOnInit() {
    this.listaddon();
    this.listdynamic();
  }
  async listaddon() {
    let result = await this.ser.listaddon();
    // console.log(result);
    this.data = result[0];
    this.total = result[1]["count"];
  }

  async listdynamic() {
    let result = await this.ser.listdynamic();
    // console.log(result);
    this.dyn = result[0];
    this.total1 = result[1]["count"];
    for (var l = 0; l < this.dyn.length; l++) {
      this.dyn[l].dl = this.dyn[l].dlrate == 0 ? this.dyn[l].dl = 0 : this.bytefunc(this.dyn[l].dlrate);
      this.dyn[l].ul = this.dyn[l].ulrate == 0 ? this.dyn[l].ul = 0 : this.bytefunc(this.dyn[l].ulrate);

    }
  }

  bytefunc(datam) {
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(datam) / Math.log(k));
    return (parseFloat((datam / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i])
  }

  Add_nas() {
    const activeModal = this.nasmodel.open(SpecialAddComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Add Special Accounting';
    activeModal.result.then((data) => {
      this.listaddon();
    }, (reason) => {
      return;
    });

  }
  Add_dynamic() {
    const activeModal = this.nasmodel.open(dynamicAddComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Add  Dynamic Data Rate';
    activeModal.result.then((dyn) => {
      this.listdynamic();
    }, (reason) => {
      return;
    });

  }

  Edit_nas(item) {
    const activeModal = this.nasmodel.open(SpecialAddComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Edit Special Accounting';
    activeModal.componentInstance.item = item;
    activeModal.result.then((data) => {
      this.listaddon();
    }, (reason) => {
      return;
    });

  }
  Edit_dynamic(item) {
    const activeModal = this.nasmodel.open(dynamicAddComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Edit Dynamic Data Rate';
    activeModal.componentInstance.item = item;
    activeModal.result.then((dyn) => {
      this.listdynamic();
    }, (reason) => {
      return;
    });
  }
}

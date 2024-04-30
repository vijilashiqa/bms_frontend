import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RoleService, BusinessService, SelectService } from '../../_service/indexService';


@Component({
  selector: 'list-bustaxlog',
  templateUrl: './list-bustaxlog.component.html',
})
export class ListBusinessTaxlogComponent implements OnInit {
  bus; bus_name; buslisttax; count; search;
  constructor(
    private router: Router,
    private ser: BusinessService,
    public role: RoleService

  ) { }
  async showBusName($event = '') {
    this.bus = await this.ser.showBusName({ like: $event })

  }

  async ngOnInit() {
    localStorage.removeItem('array');
    await this.initiallist();
    if (this.role.getroleid() > 777) {
      await this.showBusName();
    }
  }
  async initiallist() {
    let result = await this.ser.listbusinesstax(
      {
        bus_id: this.bus_name,
      })
    if (result) {
      this.buslisttax = result[0];
      this.count = result[1]['count']
      // console.log("buslist : ", result)
    }
  }
}
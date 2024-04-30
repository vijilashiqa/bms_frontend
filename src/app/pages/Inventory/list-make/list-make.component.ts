import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MakeComponent } from '../add-make/add-make.component';
import { RoleService, InventoryService, ResellerService, BusinessService, GroupService,PagerService } from '../../_service/indexService';

@Component({
  selector: 'list-make',
  templateUrl: './list-make.component.html',
})

export class ListMakeComponent implements OnInit {
   data; total;bus;group1;profile;res1;make;search;
  bus_name='';resel_type='';res_name='';group_name='';make_name='';

   pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;
  constructor(
    private router: Router,
    private nasmodel: NgbModal,
    private inventser: InventoryService,
    public role: RoleService,
    private resser : ResellerService,
    private busser : BusinessService,
    private grupser : GroupService,
    public pageservice: PagerService,

  ) { }

  async ngOnInit() {
    await this.initiallist();
  }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event })
    // console.log(result)
  }

  async showGroupName($event = '') {
    this.group1 = await this.grupser.showGroupName({ bus_id: this.bus_name, like: $event })
    // console.log("group:", result)
  }

  async showProfileReseller($event = '') {
    this.profile = await this.resser.showProfileReseller({ bus_id: this.bus_name, like: $event })
    // console.log("prof:", result)
  }

  async showResellerName($event = '') {
    // console.log('inside', this)
    this.res1 = await this.resser.showResellerName({ role: this.resel_type, like: $event })
    // console.log("resname",result)
  }

  async showmake($event='') {
    this.make = await this.inventser.showMake({like:$event,role:this.resel_type,bus_id:this.bus_name,groupid:this.group_name,resel_id:this.res_name})
    // console.log(res)
  }

  async initiallist() {
    let result = await this.inventser.listMake({})
    if (result) {
      this.data = result[0];
      this.total = result[1]["count"]
      // console.log(result)
    }
  }

  Addmake() {
    const activeModal = this.nasmodel.open(MakeComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Create Make';

    activeModal.result.then((result) => {
      if (result) {
        this.initiallist();
      }
    }, (reason) => {
      return;
    });

  }

  Editmake(item) {
    const activeModal = this.nasmodel.open(MakeComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Update Make';
    activeModal.componentInstance.item = item;
    // console.log(item)
    activeModal.result.then((result) => {
      // console.log(result)
      if (result) {
        this.initiallist();
      }
    });

  }
}

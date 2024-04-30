import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService, SelectService, RoleService } from '../../_service/indexService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddTypeComponent } from '../add-type/add-type.component'

@Component({
  selector: 'list-type',
  templateUrl: './list-type.component.html',
})
export class ListTypeComponent implements OnInit {
  data; page: any = 1; totalpage = 10; pages = [1, 2, 3, 4, 5]; count;
  datas; tot;
  constructor(
    private router: Router,
    private ser: InventoryService,
    private select: SelectService,
    private nasmodel: NgbModal,
    public role: RoleService
  ) { }

  async ngOnInit() {
    localStorage.removeItem('array');
    await this.initiallist();

  }

  async initiallist() {
    // console.log("inside list")
    let result = await this.ser.listType(
      {});
    // console.log(result)
    if (result) {
      this.datas = result[0];
      this.tot = result[1]["count"];
    }
  }

  Addtype() {
    const activeModal = this.nasmodel.open(AddTypeComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Create Type';

    activeModal.result.then((result) => {
      if (result) {
        this.initiallist();
      }
    });
  }

  Edittype(item) {
    const activeModal = this.nasmodel.open(AddTypeComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Update Type';

    activeModal.componentInstance.item = item;

    activeModal.result.then((result) => {
      if (result) {
        this.initiallist();
      }
    });

  }
}
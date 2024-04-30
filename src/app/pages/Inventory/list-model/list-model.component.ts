import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModelComponent } from '../add-model/add-model.component';
import { InventoryService, RoleService } from '../../_service/indexService';

@Component({
  selector: 'list-model',
  templateUrl: './list-model.component.html',
})
export class ListModelComponent {
  cas; make; stb_type; data; total;
  pager: any = {};
  pagedItems: any = [];
  page: number = 1;
  constructor(
    private router: Router,
    private nasmodel: NgbModal,
    private inventser: InventoryService,
    public role: RoleService
  ) { }

  async ngOnInit() {
    await this.initiallist();
  }

  async initiallist() {
    let result = await this.inventser.listModel({})
    if (result) {
      this.data = result[0];
      this.total = result[1]['count']
      // console.log(result)
    }
  }

  Addmodel() {
    const activeModal = this.nasmodel.open(ModelComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Create Model';
    activeModal.componentInstance.cas = this.cas;
    activeModal.componentInstance.make = this.make;
    activeModal.componentInstance.stb_type = this.stb_type;

    activeModal.result.then((result) => {
      if (result) {
        this.initiallist();
      }
    }, (reason) => {
      return;
    });
  }

  Editmodel(item) {
    const activeModal = this.nasmodel.open(ModelComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Update Model';
    activeModal.componentInstance.cas = this.cas;
    activeModal.componentInstance.make = this.make;
    activeModal.componentInstance.stb_type = this.stb_type;

    activeModal.componentInstance.item = item;
    // console.log(item)
    activeModal.result.then((result) => {
      if (result) {
        this.initiallist();
      }
    }, (reason) => {
      return;
    });
  }

}
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HsnComponent } from '../add-hsn/add-hsn.component';
import { RoleService} from '../../_service/indexService';

@Component({
  selector: 'list-hsn',
  templateUrl: './list-hsn.component.html',
})

export class HsnListComponent implements OnInit {
  data;
  pager: any = {}; page: number = 1;
  pagedItems: any = [];
  constructor(
    private nasmodel: NgbModal,
    // public pageservice: PagerService,
    public role: RoleService
  ) { }

  ngOnInit() {
    this.initiallist();
  }
  initiallist() {
    // this.stb.listHsn({ index: (this.page - 1) * 10, limit: 10 }).subscribe(result => {
    //   if (result) {
    //     this.data = result;
    //     this.setPage();
    //   }
    // });
  }

  getHsnList(page) {
    // // console.log(this.page)
    // var total = Math.ceil(this.data[1]['count'] / 10);
    // let result = this.pageservice.pageValidator(this.page, page, total);
    // this.page = result['value'];
    // if (result['result']) {
    //   this.initiallist();
    // }
  }
  setPage() {
    // this.pager = this.pageservice.getPager(this.data[1]['count'], this.page, 10);
    // this.pagedItems = this.data[0];
  }
  addHsn() {
    const activeModal = this.nasmodel.open(HsnComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Create HSN Number';

    activeModal.result.then((result) => {
      if (result) {
        this.initiallist();
      }
    }, (reason) => {
      return;
    });
  }

  editHsn(item) {
    const activeModal = this.nasmodel.open(HsnComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Update HSN Number';
    activeModal.componentInstance.item = item;

    activeModal.result.then((result) => {
      if (result) {
        this.initiallist();
      }
    }, (reason) => {
      return;
    });
  }
}

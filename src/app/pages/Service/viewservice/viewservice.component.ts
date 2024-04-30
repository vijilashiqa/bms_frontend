import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { S_Service } from '../../_service/indexService';


@Component({
  selector: 'viewservice',
  templateUrl: './viewservice.component.html',
  styleUrls: ['./styles.scss'],
})

export class ViewServiceComponent implements OnInit {
  data: any = []; page: any = 1; totalpage = 10; pages = [1, 2, 3, 4, 5]; datas; item;
  pack; priceshow; index = -1; length1;

  constructor(
    private router: Router,
    private nasmodel: NgbModal,
    private ser: S_Service,
    // private activeModal: NgbActiveModal,

  ) { this.datas = JSON.parse(localStorage.getItem('details')); }

  async ngOnInit() {
    // localStorage.removeItem('array');
    await this.view();
    await this.serivceshow()
  }
  cancel() {
    this.router.navigate(['/pages/service/service-list']);
  }

  async serivceshow() {
    this.pack = await this.ser.viewSerResel({ srvid: this.datas });
  }

  async packprice(index) {
    this.index = index == this.index ? -1 : index;
    if (this.index == -1)
      return;
    let serid = this.pack[index].srvid;
    let resid = this.pack[index].reseller_id;
    let result = await this.ser.viewPrice({ reseller: resid, srvid: serid });
    if (result) {
      this.priceshow = result;
      this.length1 = this.priceshow.length ? this.priceshow.length : 0
    }
  }

  async view() {
    let result = await this.ser.getService({ srvid: this.datas });
    this.data = result[0][0] || [];
    this.item = result[1];
  }

}
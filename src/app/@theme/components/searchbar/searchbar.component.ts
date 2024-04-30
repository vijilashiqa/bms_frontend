import 'style-loader!angular2-toaster/toaster.css';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardService } from '../../../pages/_service/indexService';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})

export class searchbarcomponent implements OnInit {
  submit: boolean = false; AddNasForm; datas; id; sflag = '1';
  search = ''; limit: number = 10;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private dash: DashboardService,
    private cdr: ChangeDetectorRef
  ) { this.id = JSON.parse(localStorage.getItem('details')); }

  closeModal() {
    this.activeModal.close();
  }

  async ngOnInit() {
    await this.searchresult('');
  }

  async searchresult($event = '') {
    this.cdr.detectChanges();
    let result = await this.dash.search({ sflag: this.sflag, like: $event })
    this.datas = result;
  }

  searchclick() {
    if (this.search) {
      localStorage.setItem('details', JSON.stringify(this.search));
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(['/pages/cust/viewcust']));
      this.closeModal();

    }
  }
}
import { Component } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { SolarData } from '../../../../@core/data/solar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DashboardService } from '../../../_service/dashboardservice';
import { RoleService } from '../../../_service/roleservice';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { TopupComponent } from '../../topup/topup.component'

// interface CardSettings {
//     title: string;
//     iconClass: string;
//     type: string;
//     value:any;
//   }


@Component({
  selector: 'ngx-stats-card-front',
  styleUrls: ['./stats-card-front.component.scss'],
  templateUrl: './stats-card-front.component.html',
})
export class StatsCardFrontComponent {
  balance;

  constructor(
    public dash: DashboardService,
    public activeModal: NgbModal,
    public role: RoleService,
  ) {

  }

  recharge(item) {
    const activeModal = this.activeModal.open(TopupComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Top UP';
    activeModal.componentInstance.item = { res_flag: item };
    activeModal.result.then((data) => {
    });
  }

  async getBalance() {
    let result = await this.dash.getBalance({})
    this.balance = result['balance']
  }

  async ngOnInit() {
    await this.getBalance();
  }
}
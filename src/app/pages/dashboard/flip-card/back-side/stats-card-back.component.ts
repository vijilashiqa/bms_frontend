import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { SolarData } from '../../../../@core/data/solar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TopupComponent } from '../../topup/topup.component'
import { DashboardService, RoleService } from '../../../_service/indexService';

@Component({
  selector: 'ngx-stats-card-back',
  styleUrls: ['./stats-card-back.component.scss'],
  templateUrl: './stats-card-back.component.html',
})
export class StatsCardBackComponent {
  lmMDeposit;lmODeposit
  
  constructor(
    public activeModal: NgbModal,
    public role: RoleService,
    private dashser : DashboardService,

  ) { }

  async ngOnInit(){
    await this.lastmnthMD();
    await this.lastmnthOD();
  }
  
  async lastmnthMD(){
    let res = await this.dashser.getLMD({});
    if(res==null||res==''){
      this.lmMDeposit = 0;
    }else{
    this.lmMDeposit = res['amt']
    }
  }

  async lastmnthOD(){
    let res = await this.dashser.getLMO({});
    if(res==null||res==''){
      this.lmODeposit = 0;
    }else{
      this.lmODeposit = res['amt']
    }
    
  }

}

import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { SolarData } from '../../../../@core/data/solar';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleService } from '../../../_service/indexService';


@Component({
  selector: 'ngx-stats-card-back',
  styleUrls: ['./stats-card-back.component.scss'],
  templateUrl: './stats-card-back.component.html',
})
export class StatsCardBackComponent {
  
  constructor(
    public activeModal: NgbActiveModal,
    public role: RoleService,

  ) {
   
  }
  
 closeModal() {
    this.activeModal.close();
  }
   print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('main_cont1').innerHTML;
    popupWin = window.open();
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>CAF Form</title>
          
          <style>
        
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

}

import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ReportsRoutingModule,routedComponents } from './reports.routing';
import { ToasterModule } from 'angular2-toaster';
import { RoleService,AccountService, BusinessService, GroupService, ResellerService, CustService, ReportService } from './../_service/indexService';
import { ShareModule } from './../sharemodule/share.module';
import { NgxLoadingModule } from 'ngx-loading';
import { DatePipe } from '@angular/common';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
    
@NgModule({
  imports: [
    ShareModule,
    ThemeModule,
    ToasterModule.forRoot(),
  	ReportsRoutingModule,
    NgxLoadingModule.forRoot({}),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  declarations: [
   routedComponents,
  ],
   entryComponents : [
   
  ],
  providers:[RoleService,AccountService,BusinessService,ReportService,
    CustService,GroupService,ResellerService,DatePipe]
  
})
export class ReportsModule { }
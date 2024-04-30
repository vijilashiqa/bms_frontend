import { NgModule ,Directive, Input} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ThemeModule } from '../../@theme/theme.module';
import { ResellerRoutingModule,routedComponents } from './reseller.routing';
import { AddSuccessComponent } from './success/add-success.component';
import { ResellLogoUpdateComponent } from './resellerlogo/resel-logo.component';
import { ToasterModule } from 'angular2-toaster';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { PasswordComponent } from './Password/profilepass.component';
import { UsernameComponent } from './username/username.component';
import { AutoCompleteNModule } from '../auto-complete-module/auto-completen-module';
import {  NgxLoadingModule } from 'ngx-loading';
import { NasService,GroupService,BusinessService ,RoleService, IppoolService,SelectService,ResellerService } from '../_service/indexService';
import { Ng2SmartTableModule } from 'ngx-smart-table';
import { filterModule } from './../filter/filter-module';
import { SmartTableDatepickerComponent, SmartTableDatepickerRenderComponent } from './smart-table-datepicker/smart-table-datepicker.component'
import { EditNasComponent } from './editnas/editnas.component';

@NgModule({
  imports: [
    ThemeModule,
    ToasterModule.forRoot(),
    ResellerRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AutoCompleteNModule,
    NgxLoadingModule.forRoot({}),
    Ng2SmartTableModule,
    filterModule

  ],
  declarations: [
   routedComponents,
   AddSuccessComponent,
   PasswordComponent,
   UsernameComponent,
   ResellLogoUpdateComponent,
   SmartTableDatepickerComponent,
   SmartTableDatepickerRenderComponent,
   EditNasComponent 
   
  ],
   entryComponents : [ 
    AddSuccessComponent,
    PasswordComponent,
    UsernameComponent,
    ResellLogoUpdateComponent,
    SmartTableDatepickerComponent,
    SmartTableDatepickerRenderComponent,
    EditNasComponent 
  ],
  providers:[ResellerService,SelectService,RoleService,BusinessService,GroupService,NasService,IppoolService],
})
export class ResellerModule { }
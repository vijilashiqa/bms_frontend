import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ServiceRoutingModule,routedComponents } from './service.routing';
import { ToasterModule } from 'angular2-toaster';
import { AddServiceComponent } from './addService/addService.component';
import { EditServiceComponent } from './editService/editService.component';
import { addonserviceListComponent } from './addonserviceList/addonserviceList.component';
import { SpecialAddComponent } from './specialAdd/specialadd.component';
import { dynamicAddComponent } from './dynamicAdd/dynamicadd.component';
import { dynamicEditComponent } from './dynamicEdit/dynamicedit.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { filterModule } from './../filter/filter-module';
import{ AddSuccessComponent } from './success/add-success.component';
import { AutoCompleteNModule } from '../auto-complete-module/auto-completen-module';
import { S_Service,SelectService,RoleService,BusinessService,
  CustService,GroupService,ResellerService,NasService } from './../_service/indexService';
import { ResellercountComponent } from './resellercount/resell-count.component';
import { TopupReselcountComponent } from './topupresount/resel-count.component';
import { NascountComponent} from './nascount/nas-count.component';
import { CustomercountComponent } from './customercount/cust-count.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {  NgxLoadingModule } from 'ngx-loading';
import { ServicemapComponent } from './servicemap/servicemap.component';
// import {GrdFilterPipe} from './../filter/grd-filterpipe';


@NgModule({
  imports: [
    ThemeModule,
    ToasterModule.forRoot(),
  	ServiceRoutingModule,
    NgMultiSelectDropDownModule,
    filterModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AutoCompleteNModule,
    NgxLoadingModule.forRoot({}),
     // GrdFilterPipe
  ],
  declarations:[
  routedComponents,
  AddServiceComponent,
  EditServiceComponent,
  addonserviceListComponent,
  SpecialAddComponent,
  dynamicAddComponent,
  dynamicEditComponent,
  AddSuccessComponent,
  ResellercountComponent,
  NascountComponent,
  CustomercountComponent,
  TopupReselcountComponent,
  ServicemapComponent
  ],
   entryComponents : [
    SpecialAddComponent,
    dynamicAddComponent,
    dynamicEditComponent,
    AddSuccessComponent,
    ResellercountComponent,
    NascountComponent,
    CustomercountComponent,
    TopupReselcountComponent
  ],
  providers: [S_Service,SelectService,RoleService,BusinessService,
  ResellerService,GroupService,NasService,CustService]
})
export class ServiceModule { }
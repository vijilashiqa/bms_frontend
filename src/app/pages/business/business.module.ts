import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { BusinessRoutingModule,routedComponents } from './business.routing';
import { ToasterModule } from 'angular2-toaster';
import { AddSuccessComponent } from './success/add-success.component';
import { from } from 'rxjs';
import { AutoCompleteNModule } from '../auto-complete-module/auto-completen-module';
import { RoleService,BusinessService, SelectService  } from './../_service/indexService';
import { ISPLogoUpdateComponent } from './isplogo/isplogo.component';

@NgModule({
  imports: [
    ThemeModule,
    ToasterModule.forRoot(),
  	BusinessRoutingModule,
    // NgxLoadingModule.forRoot(),
    AutoCompleteNModule,
  ],
  declarations: [
   routedComponents,
   AddSuccessComponent,
   ISPLogoUpdateComponent,
  
  ],
   entryComponents : [
   AddSuccessComponent,
   ISPLogoUpdateComponent
  ],
  providers: [BusinessService,SelectService,RoleService]
})
export class BusinessModule { }
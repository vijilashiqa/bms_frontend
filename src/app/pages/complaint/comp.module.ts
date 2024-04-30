import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { CompRoutingModule,routedComponents } from './comp.routing';
import { ToasterModule } from 'angular2-toaster';
import { ComplaintService ,RoleService, BusinessService, ResellerService  } from './../_service/indexService';
import { AutoCompleteNModule } from '../auto-complete-module/auto-completen-module';
import { ShareModule } from '../sharemodule/share.module';

@NgModule({
  imports: [
    ThemeModule,
    ToasterModule.forRoot(),
  	CompRoutingModule,
    AutoCompleteNModule,
    ShareModule
  ],
  declarations: [
   routedComponents,
  ],
   entryComponents : [

  ],
  providers:[ComplaintService,RoleService,BusinessService,ResellerService]
})
export class CompModule { }
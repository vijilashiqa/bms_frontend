import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { APRoutingModule,routedComponents } from './ap.routing';
import { ToasterModule } from 'angular2-toaster';
import { AutoCompleteNModule } from '../auto-complete-module/auto-completen-module';
import { APService,RoleService,BusinessService,GroupService,ResellerService} from './../_service/indexService';

@NgModule({
  imports: [
    ThemeModule,
    ToasterModule.forRoot(),
  	APRoutingModule,
    AutoCompleteNModule,
  ],
  declarations: [
   routedComponents,
  
  ],
   entryComponents : [
   
  ],
  providers: [APService,RoleService,BusinessService,GroupService,ResellerService]
})
export class APModule { }
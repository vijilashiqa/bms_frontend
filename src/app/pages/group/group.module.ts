import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import{GroupRoutingModule,routedComponents} from './group.routing';
import { ToasterModule } from 'angular2-toaster';
import { AddSuccessComponent } from './success/add-success.component';
import { AutoCompleteNModule } from '../auto-complete-module/auto-completen-module';
import { GroupService,BusinessService, SelectService  } from '../_service/indexService';

@NgModule({
  imports: [
    ThemeModule,
    ToasterModule.forRoot(),
    GroupRoutingModule,
     AutoCompleteNModule
  
  ],
  declarations: [
  ...routedComponents,
  AddSuccessComponent
  
     
  ],
  entryComponents : [AddSuccessComponent
   
  ],
  providers: [GroupService,SelectService,BusinessService]
})
export class GroupModule { }
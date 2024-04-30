import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { EnqRoutingModule,routedComponents } from './enquiry.routing';
import { ToasterModule } from 'angular2-toaster';
import {EnquiryService,S_Service, RoleService} from './../_service/indexService';




@NgModule({
  imports: [
    ThemeModule,
    ToasterModule.forRoot(),
  	EnqRoutingModule
  ],
  declarations: [
   routedComponents,
  
  ],
   entryComponents : [],
     providers:[EnquiryService,S_Service,RoleService],

    
  
})
export class EnquiryModule { }
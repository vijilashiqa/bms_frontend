import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { NasRoutingModule,routedComponents } from './nas.routing';
import { ToasterModule } from 'angular2-toaster';
import { AddNasComponent } from './Add-nas/add-nas.component';
import { editNasComponent } from './Edit-nas/edit-nas.component';
import { AutoCompleteNModule } from '../auto-complete-module/auto-completen-module';
import { GroupService,RoleService,BusinessService,SelectService,NasService } from './../_service/indexService';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    ThemeModule,
    ToasterModule.forRoot(),
  	NasRoutingModule,
    AutoCompleteNModule,
    NgxLoadingModule.forRoot({})
   
  ],
  declarations: [
  routedComponents,
  AddNasComponent,
  editNasComponent
  ],
  entryComponents : [
  	AddNasComponent,
    editNasComponent
  ],
  providers: [NasService,SelectService,RoleService,BusinessService,GroupService]
})
export class NasModule { }
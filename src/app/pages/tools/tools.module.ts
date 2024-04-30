import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ToolsRoutingModule,routedComponents } from './tools.routing';
import { ToasterModule } from 'angular2-toaster';
import { AutoCompleteNModule } from '../auto-complete-module/auto-completen-module';
import { APService,RoleService,BusinessService,GroupService,ResellerService,ToolService} from './../_service/indexService';
import { AddSuccessComponent } from './success/add-success.component';
import { ConfirmationDialogService } from '../../confirmation-dialog/confrimation-dialog.service';
import {  NgxLoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    ThemeModule,
    ToasterModule.forRoot(),
  	ToolsRoutingModule,
    AutoCompleteNModule,
    NgxLoadingModule.forRoot({}),
  ],
  declarations: [
   routedComponents,
   AddSuccessComponent,
  ],
   entryComponents : [
    AddSuccessComponent,
  ],
  providers: [APService,RoleService,BusinessService,GroupService,ResellerService,ToolService,ConfirmationDialogService]
})
export class ToolsModule { }
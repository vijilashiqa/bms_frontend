import { NgModule } from '@angular/core';
import { InventRoutingModule, routedComponents } from './invent.routing';
import { ToasterModule } from 'angular2-toaster';
import { ThemeModule } from '../../@theme/theme.module';
import { HsnComponent } from './add-hsn/add-hsn.component';
import { MakeComponent } from './add-make/add-make.component';
import { ModelComponent } from './add-model/add-model.component';
import { AddTypeComponent } from './add-type/add-type.component';
import {  S_Service,  RoleService,  BusinessService, GroupService, ResellerService,InventoryService } from './../_service/indexService';
import { AutoCompleteNModule } from '../auto-complete-module/auto-completen-module';

@NgModule({
  imports: [
    ThemeModule,
    ToasterModule.forRoot(),
    InventRoutingModule,
    AutoCompleteNModule
  ],
  declarations: [
    routedComponents,
    HsnComponent,
    MakeComponent,
    ModelComponent,
    AddTypeComponent
  ],
  entryComponents: [
    HsnComponent,
    MakeComponent,
    ModelComponent,
    AddTypeComponent,
  ],
  providers: [ S_Service, RoleService,InventoryService,
    BusinessService, GroupService, ResellerService]
})
export class InventModule { }
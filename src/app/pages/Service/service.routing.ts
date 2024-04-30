import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceListComponent } from './serviceList/serviceListComponent';
import { AddServiceComponent } from './addService/addService.component';
import { EditServiceComponent } from './editService/editService.component';
import { ViewServiceComponent } from './viewservice/viewservice.component';
import { addonserviceListComponent } from './addonserviceList/addonserviceList.component';
import { ServiceComponent } from './service.component';
import { addService1Component } from './addService1/addservice1.component';
import { ListPriceComponent } from './list-price/list-price.component';
import { AddPriceComponent } from './add-price/add-price.component';
import { EditPriceComponent } from './edit-price/edit-price.component';
import { AllowNasComponent } from './allownas/allow-nas.component';
import { ListAllownasComponent } from './listalwnas/list-alwnas.component';
import { AddServiceMapComponent } from './add-service-map/add-service-map.component';
import { ListServiceMapComponent } from './list-service-map/list-service-map.component';
import { AddTopupComponent } from './addtopup/add-topup.component';
import { ListTopupComponent } from './list-topup/list-topup.component';
import { EditTopupComponent } from './edit-topup/edit-topup.component';
import { AuthGuard } from '../../pages/_service/guard';
import { ServicemapComponent } from './servicemap/servicemap.component'

const routes: Routes = [{
  path: '',
  component: ServiceComponent,
  children: [
    { path: 'service-list', component: ServiceListComponent, canActivate: [AuthGuard] },
    { path: 'add-service', component: AddServiceComponent, },
    { path: 'edit-service', component: EditServiceComponent, canActivate: [AuthGuard] },
    { path: 'viewservice', component: ViewServiceComponent, canActivate: [AuthGuard] },
    { path: 'addonserviceList', component: addonserviceListComponent, },
    { path: 'addservice1', component: addService1Component, canActivate: [AuthGuard] },
    { path: 'add-price', component: AddPriceComponent, canActivate: [AuthGuard] },
    { path: 'list-price', component: ListPriceComponent, canActivate: [AuthGuard] },
    { path: 'edit-price', component: EditPriceComponent, canActivate: [AuthGuard] },
    { path: 'allow-nas', component: AllowNasComponent, },
    { path: 'editalw-nas', component: AllowNasComponent, },
    { path: 'list-alwnas', component: ListAllownasComponent, },
    { path: 'add-service-map', component: AddServiceMapComponent, },
    { path: 'list-service-map', component: ListServiceMapComponent, },
    { path: 'edit-service-map', component: AddServiceMapComponent, },
    { path: 'addtopup', component: AddTopupComponent },
    { path: 'list-topup', component: ListTopupComponent },
    { path: 'edit-topup', component: EditTopupComponent },
    { path: 'servicemap', component:ServicemapComponent },
  ],
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceRoutingModule { }

export const routedComponents = [
  ServiceComponent,
  ServiceListComponent,
  addService1Component,
  ViewServiceComponent,
  ListPriceComponent,
  AddPriceComponent,
  EditPriceComponent,
  AllowNasComponent,
  ListAllownasComponent,
  AddServiceMapComponent,
  ListServiceMapComponent,
  AddTopupComponent,
  ListTopupComponent,
  EditTopupComponent,
  ServicemapComponent,
];
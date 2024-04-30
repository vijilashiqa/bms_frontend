import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { AuthGuard } from './_service/guard';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: 'dashboard',
    component: ECommerceComponent, canActivate: [AuthGuard],
  },
  {
    path: 'iot-dashboard',
    component: DashboardComponent, canActivate: [AuthGuard]
  },
  {
    path: 'business',
    loadChildren: './business/business.module#BusinessModule',
  },
  {
    path: 'nas',
    loadChildren: './nas/nas.module#NasModule',
  },
  {
    path: 'group',
    loadChildren: './group/group.module#GroupModule',
  },
  {
    path: 'ippool',
    loadChildren: './ip-pool/ippool.module#IpPoolModule',
  },
  {
    path: 'service',
    loadChildren: './Service/service.module#ServiceModule',
  },
  {
    path: 'cust',
    loadChildren: './customer/cust.module#CustModule',
  },
  {
    path: 'reseller',
    loadChildren: './Reseller/reseller.module#ResellerModule',
  },

  {
    path: 'administration',
    loadChildren: './Administration/administration.module#AdminModule',
  },
  {
    path: 'reports',
    loadChildren: './reports/reports.module#ReportsModule',
  },
  {
    path: 'enquiry',
    loadChildren: './enquiry/enquiry.module#EnquiryModule',
  },
  {
    path: 'complaint',
    loadChildren: './complaint/comp.module#CompModule',
  },
  {
    path: 'AP',
    loadChildren: './AP/ap.module#APModule',
  },
  {
    path: 'Accounts',
    loadChildren: './Accounts/accounts.module#AccountsModule',
  },
  {
    path: 'Inventory',
    loadChildren: './Inventory/invent.module#InventModule',
  },
  {
    path: 'tools',
    loadChildren: './tools/tools.module#ToolsModule',
  },
  {
    path: 'hotel',
    loadChildren: './hotel/hotel.module#HotelModule'
  },
  {
    path: '',
    redirectTo: 'iot-dashboard',
    pathMatch: 'full',
  }, {
    path: '**',
    component: NotFoundComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}

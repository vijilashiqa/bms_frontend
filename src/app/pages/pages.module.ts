import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { NasModule } from './nas/nas.module';
import { ServiceModule } from './Service/service.module';
import { CustModule } from './customer/cust.module';
import { CompModule } from './complaint/comp.module';
import { IpPoolModule } from './ip-pool/ippool.module';

 
 
const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    NasModule,
    ServiceModule,
    CustModule,
    IpPoolModule,
   ],
  declarations: [
    ...PAGES_COMPONENTS,
    
   
  ],
})
export class PagesModule {
}

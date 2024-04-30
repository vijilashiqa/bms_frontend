import { ReportsComponent } from './reports.component';
import { ConnectionDataComponent } from './ConnectiondataReports/connectiondata.component';
import { DepositReportsComponent } from './DepositReports/depositreport.component';
import { ResellerPaymentReportComponent } from './ResellerPaymentReport/resellerpaymentreport.component';
import { DuesReportComponent } from './DuesReport/duesreport.component';
import { CollectionReportComponent } from './CollectionReport/collectionreport.component';
import { DepositPaymentReportComponent } from './depositpaymentreport/depositpayment_report.component';
import { SubscriberReportComponent } from './subscriberReport/subscriberReport.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailySubsCountComponent } from './dailysubs-count/dailysubs-count.component';
import { AuthGuard } from '../../pages/_service/guard';
import { OttInvoiceListComponent } from './ottinvoicelist/ottinvoice-list.component';
import { ResellerRevenueShareComponent } from './reseller-revenue-share/reseller-revenue-share.component';
import { RenewalReportComponent } from './renewal-report/renewal-report.component';
import { TopupreportComponent } from './topupreport/topupreport.component';
import { TrafficReportComponent } from './traffic-report/traffic-report.component';



const routes: Routes = [{
  path: '',
  component: ReportsComponent,
  children: [
    { path: 'connectiondata', component: ConnectionDataComponent, },
    { path: 'depositreport', component: DepositReportsComponent, },
    { path: 'resellerpaymentreport', component: ResellerPaymentReportComponent, },
    { path: 'duesreport', component: DuesReportComponent, },
    { path: 'collectionreport', component: CollectionReportComponent, },
    { path: 'renewal_report', component: RenewalReportComponent, },
    { path: 'depositpayment_report', component: DepositPaymentReportComponent, },
    { path: 'subscriberReport', component: SubscriberReportComponent },
    { path: 'dailysubs-count', component: DailySubsCountComponent },
    { path: 'ottinvoicelist', component: OttInvoiceListComponent },
    { path: 'reseller-revenue-share', component: ResellerRevenueShareComponent },
    { path: 'renewalReport', component: RenewalReportComponent },
    { path: 'topupreport', component: TopupreportComponent },
    { path: 'trafficreport', component: TrafficReportComponent }
  ],

}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule { }

export const routedComponents = [
  ReportsComponent,
  ConnectionDataComponent,
  DepositReportsComponent,
  ResellerPaymentReportComponent,
  DuesReportComponent,
  CollectionReportComponent,
  RenewalReportComponent,
  DepositPaymentReportComponent,
  SubscriberReportComponent,
  DailySubsCountComponent,
  OttInvoiceListComponent,
  ResellerRevenueShareComponent,
  TopupreportComponent,
  TrafficReportComponent
];
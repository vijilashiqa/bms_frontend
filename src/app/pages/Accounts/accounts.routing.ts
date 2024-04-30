import { AccountsComponent } from './accounts.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddDepositComponent } from './Adddeposit/adddeposit.component';
import { DepositpaylistComponent } from './Depositpaylist/depositpayList.component';
import { InvoicelistComponent } from './invoicelist/invoicelist.component';
import { pivotlistComponent } from './pivotlist/pivotlist.component';
import { AuthGuard } from '../../pages/_service/guard';
import { ListReceiptComponent } from './listreceipt/listreceipt.component';
import { ListReseloutstandComponent } from './listreseloustand/listresel-outstand.component';
import { InvoicebalanceListComponent } from './invoicebalancelist/invoicebal-list.component';
import { OpenClosebalanceListComponent } from './openclose-balancelist/openclose-balancelist.component';
import { ListUsedReceiptComponent } from './listusedreceipt/listusedreceipt.component'
import { GstInvoicelistComponent } from './gstinvoicelist/gstinvoicelist.component';
import { CancelInvoiceComponent } from './cancelinvreport/cancelinvreportcomponent';
import { CancelGSTInvoiceComponent } from './cancelgstinvreport/cancelgstinvreport.component';
import { OnlinePaylistComponent } from './onlinepaylist/onlinepaylist.component';
import { TransactionStatusComponent } from './trascn-status/trascn-status.component';
import { CustOnlinePaylistComponent } from './custonlinepaylist/custonlinepaylist.component';
import { ListInvoiceAckComponent } from './ackowledg-list/acknowledg-list.component';
import { WalletShareComponent } from './wallet-share/wallet-share.component';
import { ListWalletShareComponent } from './list-wallet-share/list-wallet-share.component';
import { OnlinePaymentReportComponent } from './online-payment-report/online-payment-report.component';

const routes: Routes = [{
  path: '',
  component: AccountsComponent,
  children: [
    { path: 'adddeposit', component: AddDepositComponent, canActivate: [AuthGuard] },
    { path: 'editdeposit', component: AddDepositComponent, canActivate: [AuthGuard] },
    { path: 'depositlist', component: DepositpaylistComponent, canActivate: [AuthGuard] },
    { path: 'invoicelist', component: InvoicelistComponent, canActivate: [AuthGuard] },
    { path: 'pivotlist', component: pivotlistComponent, canActivate: [AuthGuard] },
    { path: 'listreceipt', component: ListReceiptComponent, canActivate: [AuthGuard] },
    { path: 'listresel-outstand', component: ListReseloutstandComponent },
    { path: 'invoicebal-list', component: InvoicebalanceListComponent },
    { path: 'openclose-balancelist', component: OpenClosebalanceListComponent },
    { path: 'listusedreceipt', component: ListUsedReceiptComponent },
    { path: 'gstinvoicelist', component: GstInvoicelistComponent },
    { path: 'cancelinvreport', component: CancelInvoiceComponent },
    { path: 'cancelgstinvreport', component: CancelGSTInvoiceComponent },
    { path: 'onlinepaylist', component: OnlinePaylistComponent },
    { path: 'trascn-status', component: TransactionStatusComponent },
    { path: 'custonlinepaylist', component: CustOnlinePaylistComponent },
    { path: 'acknowledg-list', component: ListInvoiceAckComponent },
    { path: 'wallet-share', component: WalletShareComponent },
    { path: 'list-wallet', component: ListWalletShareComponent },
    { path: 'list-online-report', component: OnlinePaymentReportComponent }
  ],
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsRoutingModule { }

export const routedComponents = [
  AccountsComponent,
  AddDepositComponent,
  DepositpaylistComponent,
  InvoicelistComponent,
  pivotlistComponent,
  ListReceiptComponent,
  ListReseloutstandComponent,
  InvoicebalanceListComponent,
  OpenClosebalanceListComponent,
  ListUsedReceiptComponent,
  GstInvoicelistComponent,
  CancelInvoiceComponent,
  CancelGSTInvoiceComponent,
  OnlinePaylistComponent,
  TransactionStatusComponent,
  CustOnlinePaylistComponent,
  ListInvoiceAckComponent,
  WalletShareComponent,
  ListWalletShareComponent,
  OnlinePaymentReportComponent
];
import { NgModule } from '@angular/core';
import { NgbModule,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from '../../@theme/theme.module';
import { AccountsRoutingModule, routedComponents } from './accounts.routing';
import { ToasterModule } from 'angular2-toaster';
import { OwlDateTimeModule, OwlNativeDateTimeModule, } from 'ng-pick-datetime';
import { AutoCompleteNModule } from '../auto-complete-module/auto-completen-module';
import { ResellerService, BusinessService,PaymentService,
   GroupService, AccountService, RoleService } from '../_service/indexService';
import { AddSuccessComponent } from './success/add-success.component';
import { PaymentReceivedComponent } from './PaymentReceived/payment_received.component';
import { FailedDepositComponent } from './FailedDeposit/faileddeposit.component';
import { ViewDepositComponent } from './ViewDeposit/view_deposit.component';
import { CancelPaymentComponent } from './CancelPayment/cancel_payment.component';
import { InvoicelistComponent } from './invoicelist/invoicelist.component';
import { AddreceiptComponent } from './addreceipt/addreceipt.component';
import { NgxLoadingModule } from 'ngx-loading';
import { ShareModule} from '../sharemodule/share.module';
import { DatePipe } from '@angular/common';
import { DepositCancelComponent } from './depositcancel/dep-cancel.component';
import { PaystatusCheckComponent } from './paystatus/paystatus.component';
import { InvoiceAcknowlodgeComponent } from './inv-acknowledge/inv-acknowledge.component';
import { ViewAckInvoiceComponent } from './viewackinvoice/viewackinvoice.component';
import { ViewQrCodeComponent } from './viewqrcode/viewqrcode.component';
import { DepositProofComponent } from './depositproof/depositproof.component';
import { ServiceShareComponent } from './serviceshare/service-share.component';
import { ConfirmationDialogService } from '../../confirmation-dialog/confrimation-dialog.service';
import { ChangedateComponent } from './changedate/changedate.component';
import { WalletShareComponent } from './wallet-share/wallet-share.component';
import { ListWalletShareComponent } from './list-wallet-share/list-wallet-share.component';
import { OnlinePaymentReportComponent } from './online-payment-report/online-payment-report.component';


@NgModule({
  imports: [
    ThemeModule,
    ToasterModule.forRoot(),
    AccountsRoutingModule,
    // NgSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AutoCompleteNModule,
    NgxLoadingModule.forRoot({}),
    ShareModule,
    NgbModule.forRoot(),
  ],
  declarations: [
    routedComponents,
    AddSuccessComponent,
    PaymentReceivedComponent,
    FailedDepositComponent,
    ViewDepositComponent,
    CancelPaymentComponent,
    InvoicelistComponent,
    AddreceiptComponent,
    DepositCancelComponent,
    PaystatusCheckComponent,
    InvoiceAcknowlodgeComponent,
    ViewAckInvoiceComponent,
    ViewQrCodeComponent,
    DepositProofComponent,
    ChangedateComponent,
    WalletShareComponent,
    ListWalletShareComponent,
    OnlinePaymentReportComponent,
  ],
  entryComponents: [
    AddSuccessComponent,
    PaymentReceivedComponent,
    FailedDepositComponent,
    ViewDepositComponent,
    CancelPaymentComponent,
    InvoicelistComponent,
    AddreceiptComponent,
    DepositCancelComponent,
    PaystatusCheckComponent,
    InvoiceAcknowlodgeComponent,
    ViewAckInvoiceComponent,
    ViewQrCodeComponent,
    DepositProofComponent,
    ChangedateComponent,
  ],
  providers: [BusinessService, GroupService, ResellerService,PaymentService,
    AccountService, RoleService,DatePipe,ConfirmationDialogService,NgbActiveModal]
})
export class AccountsModule { }
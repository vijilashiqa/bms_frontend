import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import  { RenewCustComponent} from '../customer/RenewCustomer/renewCust.component'
import { CommonModule } from '@angular/common';
import { AutoCompleteNModule } from '../auto-complete-module/auto-completen-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewInvoiceComponent } from '../Accounts/viewinvoice/viewinvoice.component';
import { ViewReceiptComponent } from '../Accounts/viewreceipt/viewreceipt.component';
import { CompliantHistoryComponent } from '../complaint/comphistory/comp-history.component';
import { BalancePayComponent } from '../customer/paybalance/paybalance.component';
import { InvoiceReceiptComponent } from '../Accounts/invreceipt/invreceipt.component';
import { InvTransactionComponent } from '../Accounts/transaction/transaction.component';
import { ServiceShareComponent } from '../Accounts/serviceshare/service-share.component';
import { OTPComponent } from '../dashboard/otp/add-otp.component';
import { DocpopComponent } from '../customer/add-documents/add-documents.component';
import { CafFormComponent } from '../customer/caf-form/caf-form.component';
// import { FlipCardComponent } from '../dashboard/flip-card/flip-card.component';
import { OttcountComponent } from '../Administration/ottcount/ottcount.component';
 

@NgModule({
    imports: [
        CommonModule,
        AutoCompleteNModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        // RenewCustComponent,
        ViewInvoiceComponent,
        ViewReceiptComponent,
        CompliantHistoryComponent,
        BalancePayComponent,
        InvoiceReceiptComponent,
        InvTransactionComponent,
        ServiceShareComponent,
        OTPComponent,
        DocpopComponent,
        CafFormComponent,
        OttcountComponent,
        // FlipCardComponent,
    ],
    entryComponents: [
        // RenewCustComponent,
        ViewInvoiceComponent,
        ViewReceiptComponent,
        CompliantHistoryComponent,
        BalancePayComponent,
        InvoiceReceiptComponent,
        InvTransactionComponent,
        ServiceShareComponent,
        OTPComponent,
        DocpopComponent,
        CafFormComponent,
        OttcountComponent,
        // FlipCardComponent,

    ],
    schemas : [
      NO_ERRORS_SCHEMA,
      CUSTOM_ELEMENTS_SCHEMA
    ],
    exports: [
        // RenewCustComponent,
        AutoCompleteNModule
    ]
})
export class ShareModule { }
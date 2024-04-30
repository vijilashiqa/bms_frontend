import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { CustRoutingModule, routedComponents } from './cust.routing';
import { ToasterModule } from 'angular2-toaster';
import { MacComponent } from './MacManagment/mac.component';
import { AuthpassComponent } from './ChangeauthPassword/authpass.component';
import { ProfilePasswordComponent } from './ProfilePassword/profilepass.component';
import { UpdateUsernameComponent } from './UpdateUsername/updateusername.component';
import { LogOffComponent } from './Logoff/logoff.component';
import { ViewCustComponent } from './viewCust/viewcust.component';
import { CloseComponent } from './Closesession/close.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { TreeModule } from 'angular-tree-component';
import { AddSuccessComponent } from './success/add-success.component';
import { AutoCompleteNModule } from '../auto-complete-module/auto-completen-module';
import { ShowAuthpassComponent } from './showauthpassword/showauthpass.component';
import { ChangeServiceComponent } from './changeservice/changeservice.component';
import { ChangeValidityComponent } from './changevalidity/changevalidity.component';
import { CancelScheduleCustComponent } from './schedulecancel/schedulecancel.component';
import { ScheduleChangeComponent } from './schedulechange/schedulechange.component';
import {
  CustService, S_Service, SelectService, RoleService, BusinessService, GroupService,
  ResellerService, IppoolService, InventoryService, OperationService, AccountService, ComplaintService,UserLogService,ReportService
} from './../_service/indexService';
import { NgxLoadingModule } from 'ngx-loading';
import { ShareModule } from '../sharemodule/share.module';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MacBindingComponent } from './macbinding/macbinding.component';
import { DatePipe } from '@angular/common';
import { GraphpopComponent } from './graphpop/graphpop.component';
import { WebcamModule } from 'ngx-webcam';
import { FlipCardComponent } from './caf-flip/flip-card.component';
import { StatsCardFrontComponent } from './caf-flip/front-side/stats-card-front.component';
import { StatsCardBackComponent } from './caf-flip/back-side/stats-card-back.component';
import { AddCafNumComponent } from './addcafnum/addcafnum.component';
import { FlipModule } from 'ngx-flip';
import { ConfirmationDialogService } from './../../confirmation-dialog/confrimation-dialog.service';
import { CancelInvoiceComponent } from './cancelinvoice/cancelinvoice.component';
import { CustComplaintAddComponent } from './addcomplaint/addcomplaint.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { LiveGraphComponent } from './livegraph/livegraph.component';
import { ReasonComponent } from './reason/reason.component';
import { AddVoiceNumComponent } from './add-voicenum/add-voicenum.component';
import { AssigneVoiceComponent } from './assignevoice/assignevoice.component';
import { UnAssignedVoiceComponent } from './unassignevoice/unassignevoice.component';
import { VoicePasswordComponent } from './voicepassword/voicepassword.component';
import { LimitUpdateComponent } from './updatelimit/updatelimit.component';
import { RenewCustComponent } from './RenewCustomer/renewCust.component';
import { BulkupdateComponent } from './bulkupdate/bulkupdate.component';
import { DataUsageComponent } from './data-usage/data-usage.component';
import { TopuprenewalComponent } from './topuprenewal/topuprenewal.component';
import { MessageComponent } from './message/message.component';
import { ChangeSimUseComponent } from './change-sim-use/change-sim-use.component';
import { RefreshScheduleComponent } from './refresh-schedule/refresh-schedule.component';

// import { SubsServiceAssignComponent } from './subs-packmapping/subs-packmapping.component';
export const MY_NATIVE_FORMATS = {
  fullPickerInput: { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' },
  datePickerInput: { year: 'numeric', month: 'numeric', day: 'numeric' },
}
@NgModule({
  imports: [
    ThemeModule,
    ToasterModule.forRoot(),
    CustRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AutoCompleteNModule,
    NgxLoadingModule.forRoot({}),
    ShareModule,
    WebcamModule,
    FlipModule,
    TreeModule,
    // FormsModule,
    // ReactiveFormsModule
  ],
  declarations: [
    routedComponents,
    MacComponent,
    AuthpassComponent,
    ProfilePasswordComponent,
    UpdateUsernameComponent,
    ViewCustComponent,
    LogOffComponent,
    CloseComponent,
    AddSuccessComponent,
    ShowAuthpassComponent,
    MacBindingComponent,
    ChangeServiceComponent,
    ChangeValidityComponent,
    GraphpopComponent,
    StatsCardBackComponent,
    StatsCardFrontComponent,
    FlipCardComponent,
    AddCafNumComponent,
    CancelInvoiceComponent,
    CustComplaintAddComponent,
    CancelScheduleCustComponent,
    LiveGraphComponent,
    ReasonComponent,
    AddVoiceNumComponent,
    AssigneVoiceComponent,
    UnAssignedVoiceComponent,
    VoicePasswordComponent,
    ScheduleChangeComponent,
    LimitUpdateComponent,
    RenewCustComponent,
    BulkupdateComponent,
    DataUsageComponent,
    TopuprenewalComponent,
    MessageComponent,
    ChangeSimUseComponent,
    RefreshScheduleComponent,
    // SubsServiceAssignComponent,
  ],
  entryComponents: [
    MacComponent,
    AuthpassComponent,
    ProfilePasswordComponent,
    UpdateUsernameComponent,
    LogOffComponent,
    CloseComponent,
    AddSuccessComponent,
    ShowAuthpassComponent,
    MacBindingComponent,
    ChangeServiceComponent,
    ChangeValidityComponent,
    GraphpopComponent,
    FlipCardComponent,
    AddCafNumComponent,
    CancelInvoiceComponent,
    CustComplaintAddComponent,
    CancelScheduleCustComponent,
    LiveGraphComponent,
    ReasonComponent,
    AddVoiceNumComponent,
    AssigneVoiceComponent,
    UnAssignedVoiceComponent,
    VoicePasswordComponent,
    ScheduleChangeComponent,
    LimitUpdateComponent,
    RenewCustComponent,
    TopuprenewalComponent,
    // SubsServiceAssignComponent,
    MessageComponent,
    ChangeSimUseComponent,
    RefreshScheduleComponent
  ],
  providers: [CustService, S_Service, SelectService, RoleService, BusinessService, AccountService,ConfirmationDialogService,
    GroupService, ResellerService, IppoolService, InventoryService, OperationService,NgxImageCompressService, ComplaintService,DatePipe,UserLogService,ReportService]
})
export class CustModule { }
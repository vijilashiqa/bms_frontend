import { CustComponent } from './cust.component';
import { CustListComponent } from './custList/custList.component';
import { AddCustComponent } from './add-cust/add-Cust.component';
import { EditCustComponent } from './edit-cust/edit-Cust.component';
import { ViewCustComponent } from './viewCust/viewcust.component';
// import { RenewCustComponent } from './RenewCustomer/renewCust.component';
import { OnlineCustomerComponent } from './OnlineCustomer/onlinecust.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../pages/_service/guard';
import { SubscriberPicComponent } from './add-custpic/add-custpic.component'
import { ListCafNumComponent } from './listcafnum/listcafnum.component';
import { ListSubsDocPendingomponent } from './listdocpending/listdocpending.component';
import { ListScheduledCustComponent } from './listscheduled/listscheduled.component';
import { SubsRenewalComponent } from './subsrenewal/subsrenewal.component';
import { SubsServiceAssignComponent } from './subs-packmapping/subs-packmapping.component';
import { ListVoiceNumComponent } from './list-voicenum/list-voicenum.component';
import { BulkUpdateLimitComponent } from './bulk-updatelimit/bulk-updatelimit.component';
import { BulkupdateComponent } from './bulkupdate/bulkupdate.component';
import { DataUsageComponent } from './data-usage/data-usage.component';
import { RegisterCardUserComponent } from './register-card-user/register-card-user.component';
import { ListCardUserComponent } from './list-card-user/list-card-user.component';
import { AddCardUserComponent } from './add-card-user/add-card-user.component';


const routes: Routes = [{
  path: '',
  component: CustComponent,
  children: [
    { path: 'custList', component: CustListComponent, canActivate: [AuthGuard] },
    { path: 'add-cust', component: AddCustComponent, canActivate: [AuthGuard] },
    { path: 'edit-cust', component: EditCustComponent, canActivate: [AuthGuard] },
    { path: 'viewcust', component: ViewCustComponent, canActivate: [AuthGuard] },
    // {path:'renewcust',component: RenewCustComponent,canActivate:[AuthGuard]},
    { path: 'onlinecust', component: OnlineCustomerComponent, canActivate: [AuthGuard] },
    { path: 'add-custpic', component: SubscriberPicComponent },
    { path: 'listcafnum', component: ListCafNumComponent },
    { path: 'listdocpending', component: ListSubsDocPendingomponent },
    { path: 'listscheduled', component: ListScheduledCustComponent },
    { path: 'subsrenewal', component: SubsRenewalComponent },
    { path: 'subs-packmapping', component: SubsServiceAssignComponent },
    { path: 'list-voicenum', component: ListVoiceNumComponent },
    { path: 'bulk-updatelimit', component: BulkUpdateLimitComponent },
    { path: 'bulkupdate', component: BulkupdateComponent },
    { path: 'data-usage', component: DataUsageComponent },
    { path: 'register-card-user', component: RegisterCardUserComponent },
    { path: 'list-card-user', component: ListCardUserComponent },
    { path: 'add-card-user', component: AddCardUserComponent },
    { path: 'update-card-user', component: AddCardUserComponent }

  ],
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustRoutingModule { }

export const routedComponents = [
  CustComponent,
  CustListComponent,
  AddCustComponent,
  EditCustComponent,
  ViewCustComponent,
  // RenewCustComponent,
  OnlineCustomerComponent,
  SubscriberPicComponent,
  ListCafNumComponent,
  ListSubsDocPendingomponent,
  ListScheduledCustComponent,
  SubsRenewalComponent,
  SubsServiceAssignComponent,
  ListVoiceNumComponent,
  BulkUpdateLimitComponent,
  BulkupdateComponent,
  DataUsageComponent,
  RegisterCardUserComponent,
  ListCardUserComponent,
  AddCardUserComponent
];
import { AdminComponent } from './administration.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddAdminuserComponent } from './add-adminuser/add-adminuser.component';
import { ListAdminuserComponent } from './list-adminuser/list-adminuser.component';
import { AddSuccessComponent } from './success/add-success.component';
import { AddprofileComponent } from './AddProfile/addprofile.component';
import { AddUserprofileComponent } from './userprofile/adduserprofile.component';
import { ProfileListComponent } from './Profilelist/listprofile.component';
import { UserProfileListComponent } from './userprofilelist/listuserprofile.component';
import { ListStaticIPComponent } from './liststaticip/liststaticip.component';
import { ListCustProfileLogComponent } from './list-custprofilelog/list-custprofilelog.component';
import { AuthGuard } from '../../pages/_service/guard';
import { ListStateComponent } from './liststate/liststate.component';
import { ListDistrictComponent } from './listdistrict/listdistrict.component';
import { ListActivityLogComponent } from './listactivitylog/listactivitylog.component';
import { ListBalanceLogComponent } from './listbalancelog/listbalancelog.component';
import { ListBandwidthLogComponent } from './listbandwidthlog/listbandwidthlog.component';
import { ListProfileEditLogComponent } from './listprofileeditlog/listprofileeditlog.component';
import { ListResellerShareLogComponent } from './listresellersharelog/listresellersharelog.component';
import { ListNASmappingComponent } from './list-mappednas/list-mappednas.component';
import { ListNasLogComponent } from './listnaslog/listnaslog.component';
import { AddsmsgatewayComponent } from './add-smsgateway/add-smsgateway.component';
import { ListSMSgatewayComponent } from './list-smsgateway/list-smsgateway.component';
import { SmstemplatesComponent } from './smstemplates/smstemplates.component';
import { EmailTemplatesComponent } from './email-templates/email-templates.component';
import { SmstemplateIspComponent } from './smstemplate-isp/smstemplate-isp.component';
import { EmailtemplateIspComponent } from './emailtemplate-isp/emailtemplate-isp.component';
import { ListOTTComponent } from './list-ott/list-ott.component';
import { OTTAuthComponent } from './ott-auth/ott-auth.component';
import { ListOTTAuthComponent } from './list-ottauth/list-ottauth.component';
import { OTTPlanComponent } from './ott-plan/ott-plan.component';
import { ListOTTPlanComponent } from './list-ottplan/list-ottplan.component';
import { RevenueShareReportsComponent } from './revenue-share-reports/revenue-share-reports.component';
import { SmscreditsComponent } from './smscredits/smscredits.component';
import { OttMapComponent } from './ott-map/ott-map.component';
import { UpdateottmapComponent } from './updateottmap/updateottmap.component';
import { SendsmsComponent } from './sendsms/sendsms.component';
import { SendemailComponent } from './sendemail/sendemail.component';
import { SendsmsresellerComponent } from './sendsmsreseller/sendsmsreseller.component';
import { SendemailresellerComponent } from './sendemailreseller/sendemailreseller.component';
import { SendsmsothersComponent } from './sendsmsothers/sendsmsothers.component';
import { OttLogComponent } from './ott-log/ott-log.component';
import { ResellerOttPlanComponent } from './reseller-ott-plan/reseller-ott-plan.component';
import { InvoiceMailLogComponent } from './invoice-mail-log/invoice-mail-log.component';
import { GstinvoiceMailLogComponent } from './gstinvoice-mail-log/gstinvoice-mail-log.component';
import { MailLogComponent } from './mail-log/mail-log.component';
import { UpdateShareComponent } from './update-share/update-share.component';
import { ShareLogComponent } from './share-log/share-log.component';


const routes: Routes = [{
  path: '',
  component: AdminComponent,
  children: [
    { path: 'AddProfile', component: AddprofileComponent, },
    { path: 'Profilelist', component: ProfileListComponent, },
    { path: 'add-adminuser', component: AddAdminuserComponent, canActivate: [AuthGuard] },
    { path: 'list-adminuser', component: ListAdminuserComponent, canActivate: [AuthGuard] },
    { path: 'edit-adminuser', component: AddAdminuserComponent, },
    { path: 'add-success', component: AddSuccessComponent, canActivate: [AuthGuard] },
    { path: 'userprofilelist', component: UserProfileListComponent, canActivate: [AuthGuard] },
    { path: 'adduserprofile', component: AddUserprofileComponent, canActivate: [AuthGuard] },
    { path: 'edituserprofile', component: AddUserprofileComponent, },
    { path: 'liststaticip', component: ListStaticIPComponent },
    { path: 'list-custprofilelog', component: ListCustProfileLogComponent },
    { path: 'liststate', component: ListStateComponent },
    { path: 'listdistrict', component: ListDistrictComponent },
    { path: 'listactivitylog', component: ListActivityLogComponent },
    { path: 'listbalancelog', component: ListBalanceLogComponent },
    { path: 'listbandwidthlog', component: ListBandwidthLogComponent },
    { path: 'listprofileeditlog', component: ListProfileEditLogComponent },
    { path: 'listresellersharelog', component: ListResellerShareLogComponent },
    { path: 'list-mappednas', component: ListNASmappingComponent },
    { path: 'listnaslog', component: ListNasLogComponent },
    { path: 'add-smsgateway', component: AddsmsgatewayComponent },
    { path: 'list-smsgateway', component: ListSMSgatewayComponent },
    { path: 'edit-smsgateway', component: AddsmsgatewayComponent },
    { path: 'smstemplates', component: SmstemplatesComponent },
    { path: 'email-templates', component: EmailTemplatesComponent },
    { path: 'smstemplate-isp', component: SmstemplateIspComponent },
    { path: 'emailtemplate-isp', component: EmailtemplateIspComponent },
    { path: 'list-ott', component: ListOTTComponent },
    { path: 'ott-auth', component: OTTAuthComponent },
    { path: 'list-ottauth', component: ListOTTAuthComponent },
    { path: 'ott-plan', component: OTTPlanComponent },
    { path: 'list-ottplan', component: ListOTTPlanComponent },
    { path: 'revenue-share', component: RevenueShareReportsComponent },
    { path: 'list-sms-credit', component: SmscreditsComponent },
    { path: 'ott-map', component: OttMapComponent },
    { path: 'update-ott-map', component: UpdateottmapComponent },
    { path: 'send-sms', component: SendsmsComponent },
    { path: 'send-email', component: SendemailComponent },
    { path: 'send-sms-reseller', component: SendsmsresellerComponent },
    { path: 'send-email-reseller', component: SendemailresellerComponent },
    { path: 'send-sms-other', component: SendsmsothersComponent },
    { path: 'ott-log', component: OttLogComponent },
    { path: 'reseller-ott-plan', component: ResellerOttPlanComponent },
    { path: 'invoice-mail-log', component: InvoiceMailLogComponent },
    { path: 'gst-mail-log', component: GstinvoiceMailLogComponent },
    { path: 'user-mail-log', component: MailLogComponent },
    { path: 'update-share', component: UpdateShareComponent },
    { path: 'share-log', component: ShareLogComponent }
  ],
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }

export const routedComponents = [
  AdminComponent,
  AddprofileComponent,
  ProfileListComponent,
  AddAdminuserComponent,
  ListAdminuserComponent,
  AddSuccessComponent,
  AddUserprofileComponent,
  UserProfileListComponent,
  ListStaticIPComponent,
  ListCustProfileLogComponent,
  ListStateComponent,
  ListDistrictComponent,
  ListActivityLogComponent,
  ListBalanceLogComponent,
  ListBandwidthLogComponent,
  ListProfileEditLogComponent,
  ListResellerShareLogComponent,
  ListNASmappingComponent,
  ListNasLogComponent,
  AddsmsgatewayComponent,
  ListSMSgatewayComponent,
  ListOTTComponent,
  OTTAuthComponent,
  ListOTTAuthComponent,
  OTTPlanComponent,
  ListOTTPlanComponent,
  RevenueShareReportsComponent,
  SmscreditsComponent,
  SendsmsComponent,
  SendemailComponent,
  SendsmsresellerComponent,
  SendemailresellerComponent,
  SendsmsothersComponent,
  OttLogComponent,
  ResellerOttPlanComponent,
  InvoiceMailLogComponent,
  GstinvoiceMailLogComponent,
  MailLogComponent,
  UpdateShareComponent,
  SmstemplatesComponent,
  EmailTemplatesComponent,
  SmstemplateIspComponent,
  ShareLogComponent


];
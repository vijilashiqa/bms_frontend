import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { AdminRoutingModule, routedComponents } from './administration.routing';
import { ToasterModule } from 'angular2-toaster';
import { CompanyService } from './../_service/companyservice';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { AutoCompleteNModule } from '../auto-complete-module/auto-completen-module';
import {
  GroupService, BusinessService, ResellerService, RoleService, AdminuserService,
  UserLogService, ReportService, NasService, S_Service
} from '../_service/indexService';
import { TreeModule } from 'angular-tree-component';
import { AddStaticIPComponent } from './add-staticip/addstaticip.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { EmailTemplatesComponent } from './email-templates/email-templates.component';
// import { CKEditorModule} from 'ckeditor4-angular';
import { CKEditorModule } from 'ng2-ckeditor';
import { SmstemplatesComponent } from './smstemplates/smstemplates.component';
import { Ng2SmartTableModule } from 'ngx-smart-table';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SmstemplateIspComponent } from './smstemplate-isp/smstemplate-isp.component';
import { EmailtemplateIspComponent } from './emailtemplate-isp/emailtemplate-isp.component';
import { AddOTTComponent } from './add-ott/add-ott.component';
import { NgxLoadingModule } from 'ngx-loading';
 import { ShareModule } from '../sharemodule/share.module';
import { filterModule } from './../filter/filter-module';
import { RevenueShareReportsComponent } from './revenue-share-reports/revenue-share-reports.component';
import { SmscreditsComponent } from './smscredits/smscredits.component';
import { AddsmscreditsComponent } from './addsmscredits/addsmscredits.component';
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



@NgModule({
  imports: [
    ThemeModule,
    ToasterModule.forRoot(),
    AdminRoutingModule,
    AutoCompleteNModule,
    TreeModule,
    OwlDateTimeModule, OwlNativeDateTimeModule,
    Ng2SmartTableModule,
    CKEditorModule,
    NgxLoadingModule.forRoot({}),
    ShareModule,
    filterModule
  ],
  declarations: [
    routedComponents,
    ChangepasswordComponent,
    AddStaticIPComponent,
    EmailTemplatesComponent,
    SmstemplatesComponent,
    SmstemplateIspComponent,
    EmailtemplateIspComponent,
    AddOTTComponent,
    RevenueShareReportsComponent,
    SmscreditsComponent,
    AddsmscreditsComponent,
    OttMapComponent,
    UpdateottmapComponent,
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
  ],
  entryComponents: [
    ChangepasswordComponent,
    AddStaticIPComponent,
    AddOTTComponent,
    AddsmscreditsComponent,
   ],
  providers: [CompanyService, GroupService, AdminuserService, NasService, S_Service,
    RoleService, BusinessService, ResellerService, UserLogService, ReportService, NgbActiveModal],
})


export class AdminModule { }
/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CoreModule } from './@core/core.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ToasterModule,ToasterService } from 'angular2-toaster';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AppRoutingModule } from './app-routing.module';
import { ThemeModule } from './@theme/theme.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LogoutComponent } from './logout/logoutcomponent';
import { AdminComponent } from './pages/Administration/administration.component';
import { RoleService,LogService, AdminuserService,JwtInterceptor,ErrorInterceptor } from './pages/_service/indexService';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import * as io from 'ngx-socket-io';
import { AutofocusModule } from 'angular-autofocus-fix';
import { environment as env } from '../environments/environment';
// import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

const config:io.SocketIoConfig = { url:env.baseUrl, options:{} }  
 
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    ConfirmationDialogComponent,
      // AddSuccessComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ToasterModule.forRoot(),
    NgbModule,
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    DeviceDetectorModule.forRoot(),
    AutofocusModule,
    io.SocketIoModule.forRoot(config)
   ],
  entryComponents:[
    // AddSuccessComponent,
    ConfirmationDialogComponent
  ],
  bootstrap: [AppComponent],
  providers: [LogService,ToasterService,RoleService,AdminuserService,
// order we specify providers to use
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },  // order in which request intercepts (first goes to jwtinterceptors then errorinterceptors)
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },  
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
})
export class AppModule {
}

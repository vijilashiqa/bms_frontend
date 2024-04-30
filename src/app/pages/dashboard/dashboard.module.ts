import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { StatusCardComponent } from './status-card/status-card.component';
import { ContactsComponent } from './contacts/contacts.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomSelectorComponent } from './rooms/room-selector/room-selector.component';
import { TemperatureComponent } from './temperature/temperature.component';
import { TemperatureDraggerComponent } from './temperature/temperature-dragger/temperature-dragger.component';
import { TeamComponent } from './team/team.component';
import { KittenComponent } from './kitten/kitten.component';
import { SecurityCamerasComponent } from './security-cameras/security-cameras.component';
import { ElectricityComponent } from './electricity/electricity.component';
import { ElectricityChartComponent } from './electricity/electricity-chart/electricity-chart.component';
import { WeatherComponent } from './weather/weather.component';
import { SolarComponent } from './solar/solar.component';
import { PlayerComponent } from './rooms/player/player.component';
import { TrafficComponent } from './traffic/traffic.component';
import { TrafficChartComponent } from './traffic/traffic-chart.component';
import { BarchartsComponent } from './barcharts/barcharts.component';
import { FlipCardComponent } from './flip-card/flip-card.component'
import { StatsCardFrontComponent } from './flip-card/front-side/stats-card-front.component';
import { StatsCardBackComponent } from './flip-card/back-side/stats-card-back.component';
import  { CustService, DashboardService,PagerService, PaymentService, RoleService} from '../_service/indexService';
import { ShareModule} from '../sharemodule/share.module';
import { TopupComponent } from './topup/topup.component';
 import { NgxLoadingModule } from 'ngx-loading';
import { FlipModule } from 'ngx-flip';

// import {RenewCustComponent} from '../customer/RenewCustomer/renewCust.component';
@NgModule({
  imports: [
    ThemeModule,
    NgxEchartsModule,
    ShareModule,
    NgxLoadingModule.forRoot({}),
    FlipModule,

    // CustModule,
  ],
  declarations: [
    DashboardComponent,
    StatusCardComponent,
    TopupComponent,
    TemperatureDraggerComponent,
    ContactsComponent,
    RoomSelectorComponent,
    TemperatureComponent,
    RoomsComponent,
    TeamComponent,
    KittenComponent,
    SecurityCamerasComponent,
    ElectricityComponent,
    ElectricityChartComponent,
    WeatherComponent,
    PlayerComponent,
    SolarComponent,
    TrafficComponent,
    TrafficChartComponent,
    BarchartsComponent,
    FlipCardComponent,
    StatsCardFrontComponent,
    StatsCardBackComponent,
    // RenewCustComponent,
  ],
  entryComponents : [
    TopupComponent,
   
  ],
  providers: [DashboardService , PagerService,RoleService,CustService,PaymentService]
})
export class DashboardModule { }

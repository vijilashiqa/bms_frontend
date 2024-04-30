import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HotelRoutingModule } from './hotel-routing.module';
import { ListHotelComponent } from './list-hotel/list-hotel.component';

@NgModule({
  declarations: [ListHotelComponent],
  imports: [
    CommonModule,
    HotelRoutingModule
  ]
})
export class HotelModule { }

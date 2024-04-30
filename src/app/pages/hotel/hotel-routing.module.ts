import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListHotelComponent } from './list-hotel/list-hotel.component';

const routes: Routes = [
  {path:'list-hotel', component: ListHotelComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelRoutingModule { }

import { APComponent } from './ap.component';
import { AddAPComponent } from './add-ap/add-ap.component';
import { ListAPComponent } from './list-ap/list-ap.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from  '../../pages/_service/guard';  

const routes: Routes = [{
  path: '',
  component: APComponent,
  children: [
  {path: 'add-ap',component: AddAPComponent,canActivate:[AuthGuard] },
  {path: 'list-ap',component: ListAPComponent,canActivate:[AuthGuard] },
  {path:'edit-ap', component:AddAPComponent,}
],
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class APRoutingModule { }

export const routedComponents = [
  APComponent,
  AddAPComponent,
  ListAPComponent,

];
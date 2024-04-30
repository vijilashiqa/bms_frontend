import { IpPoolComponent } from './ippool.component';
import { AddIPpoolComponent } from './add-ip/addippool.component';
import { ListIpPoolComponent } from './list-ip/ippoolList.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../pages/_service/guard';
const routes: Routes = [{
  path: '',
  component: IpPoolComponent,
  children: [
  {path: 'addippool',component: AddIPpoolComponent, canActivate:[AuthGuard]},
  {path: 'ippoolList',component: ListIpPoolComponent, canActivate:[AuthGuard]},
  {path: 'editippool',component: AddIPpoolComponent, },
],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IpPoolRoutingModule { }

export const routedComponents = [
  IpPoolComponent,
  AddIPpoolComponent,
  ListIpPoolComponent,
];
import { ResellerComponent } from './reseller.component';
import { ResellerListComponent } from './Listreseller/resellerList.component';
import { AddResellerComponent } from './addreseller/add-reseller.component';
import { EditResellerComponent } from './editreseller/edit-reseller.component';
import { ViewResellerComponent } from './viewreseller/viewreseller.component';
import { AddBranchComponent } from './add-branch/add-branch.component';
import { ListBranchComponent } from './list-branch/list-branch.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../pages/_service/guard';
import { ListAgreementExpomponent } from './listagrement/listagrement.component';
import { ResServiceMapComponent } from './resel-packmapping/resel-packmapping.component';

const routes: Routes = [{
  path: '',
  component: ResellerComponent,
  children: [
  {path: 'resellerList',component: ResellerListComponent, canActivate:[AuthGuard]},
  {path:'add-reseller',component: AddResellerComponent, canActivate:[AuthGuard]},
  {path:'edit-reseller',component: EditResellerComponent, canActivate:[AuthGuard]},
  {path:'viewreseller',component: ViewResellerComponent},
  {path:'add-branch',component:AddBranchComponent, canActivate:[AuthGuard]},
  {path:'edit-branch',component:AddBranchComponent},
  {path:'list-branch',component:ListBranchComponent, canActivate:[AuthGuard]},
  {path:'listagrement',component:ListAgreementExpomponent},
  {path:'resel-packmapping',component:ResServiceMapComponent},
],
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResellerRoutingModule { }

export const routedComponents = [
ResellerComponent,
AddResellerComponent,
ResellerListComponent,
EditResellerComponent,
ViewResellerComponent,
AddBranchComponent,
ListBranchComponent,
ListAgreementExpomponent,
ResServiceMapComponent,
];
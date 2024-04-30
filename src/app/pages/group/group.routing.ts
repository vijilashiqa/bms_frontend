import { GroupComponent } from './group.component';
import { AddGroupComponent } from './add-group/add-group.component';
import { ListGroupComponent } from './list-group/list-group.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../pages/_service/guard';

const routes: Routes = [{
  path: '',
  component: GroupComponent,
  children: [ 

  {path:'add-group',component: AddGroupComponent, canActivate:[AuthGuard]},
  {path:'list-group',component: ListGroupComponent, canActivate:[AuthGuard]},
  {path:'edit-group',component: AddGroupComponent, }
  ]

}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupRoutingModule { }

export const routedComponents = [
  GroupComponent,
  AddGroupComponent,
  ListGroupComponent,
 
];
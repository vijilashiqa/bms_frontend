import { InventComponent } from './invent.component';
import { ListMakeComponent } from './list-make/list-make.component';
import { ListModelComponent } from './list-model/list-model.component';
import { ListTypeComponent } from './list-type/list-type.component';
import { HsnListComponent } from './list-hsn/list-hsn.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../pages/_service/guard';

const routes: Routes = [{
  path: '',
  component: InventComponent,
  children: [
    { path: 'list-make', component: ListMakeComponent,  canActivate:[AuthGuard]},
    { path: 'list-model', component: ListModelComponent,  canActivate:[AuthGuard]},
    { path: 'list-hsn', component:HsnListComponent,canActivate:[AuthGuard]},
    { path: 'list-type', component:ListTypeComponent, canActivate:[AuthGuard]},
  ],
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventRoutingModule { }

export const routedComponents = [
  InventComponent,
  ListMakeComponent,
  ListModelComponent,
  ListTypeComponent,
  HsnListComponent,
];
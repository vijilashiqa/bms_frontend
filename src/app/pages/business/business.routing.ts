import { BusinessComponent } from './business.component';
import { AddBusinessComponent } from './add-business/add-business.component';
import { EditBusinessComponent } from './edit-business/edit-business.component';
import { ListBusinessComponent } from './list-business/list-business.component';
import { ListBusinessTaxlogComponent } from './list-bustaxlog/list-bustaxlog.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from  '../../pages/_service/guard';  

const routes: Routes = [{
  path: '',
  component: BusinessComponent,
  children: [
  {path: 'add-business',component: AddBusinessComponent,canActivate:[AuthGuard]},
  {path:'list-business',component: ListBusinessComponent,canActivate:[AuthGuard]},
  {path:'edit-business',component: EditBusinessComponent,canActivate:[AuthGuard]},
  {path:'list-bustaxlog',component: ListBusinessTaxlogComponent,canActivate:[AuthGuard]},
],
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessRoutingModule { }

export const routedComponents = [
  BusinessComponent,
  AddBusinessComponent,
  EditBusinessComponent,
  ListBusinessComponent,
  ListBusinessTaxlogComponent

];
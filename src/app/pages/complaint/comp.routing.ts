import { AddCompComponent } from './addcomplaints/add-comp.component';
import { ListCompComponent } from './listcomplaints/list-comp.component';
import { AddComplaintTypeComponent } from './addcomptype/add-comptype.component';
import { ListComplaintTypeComponent } from './listcomptype/list-comptype.component';
import{ CompComponent } from './comp.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from  '../../pages/_service/guard';  
const routes: Routes = [{
  path: '',
  component: CompComponent,
  children: [
 
  {path:'add-comp',component: AddCompComponent,},
  {path:'list-comp',component: ListCompComponent,},
  {path:'edit-comp',component: AddCompComponent,},
  {path:'add-comptype',component:AddComplaintTypeComponent,},
  {path:'list-comptype',component:ListComplaintTypeComponent,},
  {path:'edit-comptype',component:AddComplaintTypeComponent,}
 ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompRoutingModule { }

export const routedComponents = [

  AddCompComponent,
  ListCompComponent,
  CompComponent,
  AddComplaintTypeComponent,
  ListComplaintTypeComponent

 
];
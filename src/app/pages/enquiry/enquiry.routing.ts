import { EnquiryComponent } from './enquiry.component';
import { AddEnquiryComponent } from './add_enquiry/add_enquiry.component';
import { ListEnquiryComponent } from './list_enquiry/list_enquiry.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../pages/_service/guard'
const routes: Routes = [{
  path: '',
  component: EnquiryComponent,
  children: [
  {path: 'add_enquiry',component: AddEnquiryComponent,},
  {path: 'edit_enquiry',component: AddEnquiryComponent,},
  {path: 'list_enquiry',component: ListEnquiryComponent,},

 ],
  
  
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnqRoutingModule { }

export const routedComponents = [
EnquiryComponent,
AddEnquiryComponent,
ListEnquiryComponent,
 
];
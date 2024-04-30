import { ToolsComponent } from './tools.component';
import { AddToolsComponent } from './add-tools/add-tools.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from  '../_service/guard';  

const routes: Routes = [{
  path: '',
  component: ToolsComponent,
  children: [
  {path: 'add-tools', component: AddToolsComponent },
],
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToolsRoutingModule { }

export const routedComponents = [
    ToolsComponent,
    AddToolsComponent,

];
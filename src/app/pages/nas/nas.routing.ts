import { NasComponent } from './nas.component';
import { NasListComponent } from './nasList/nasListComponent';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../pages/_service/guard';

const routes: Routes = [{
  path: '',
  component: NasComponent,
  children: [
  {path: 'nas-list',component: NasListComponent,canActivate:[AuthGuard] },
  ],
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NasRoutingModule { }

export const routedComponents = [
  NasComponent,
  NasListComponent,
];
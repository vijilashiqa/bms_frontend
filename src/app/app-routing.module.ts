import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {NbAuthComponent} from '@nebular/auth';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logoutcomponent';
const routes: Routes = [

  { path: 'pages', loadChildren: 'app/pages/pages.module#PagesModule' },
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
     {  path: 'login',
        component:LoginComponent,
      },
      {
        path: 'logout',
        component:LogoutComponent,
      },
    ],
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },//auth/login
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}

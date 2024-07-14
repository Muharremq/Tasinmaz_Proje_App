import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';  // DashboardComponent'i import edin
import { UserComponent } from './user/user.component';  // UserComponent'i import edin
import { LogComponent } from './log/log.component';  // LogComponent'i import edin


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'user', component: UserComponent },
  { path: 'log', component: LogComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Varsayılan rota, opsiyonel
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
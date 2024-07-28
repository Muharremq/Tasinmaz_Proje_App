import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';  // DashboardComponent'i import edin
import { UserComponent } from './user/user.component';  // UserComponent'i import edin
import { LogComponent } from './log/log.component';  // LogComponent'i import edin
import { AddComponent } from './add/add.component';
import { LoginGuardService } from './services/login-guard.service';
import { MapComponent } from './map/map.component';
import { AdminGuardService } from './services/admin-guard.service';
import { LogDetailsComponent } from './log/log-details/log-details.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add' , component: AddComponent, canActivate: [LoginGuardService] },
  { path: 'user', component: UserComponent, data: { title: 'Kullanıcı İşlemleri'}, canActivate: [LoginGuardService, AdminGuardService] },
  { path: 'map', component: MapComponent, data: { title: 'Anasayfa'}, canActivate: [LoginGuardService] },
  { path: 'log', component: LogComponent, data: { title: 'Log İşlemleri'}, canActivate: [LoginGuardService, AdminGuardService] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Varsayılan rota, opsiyonel
  { path: 'log/log-details', component: LogDetailsComponent, data: { title: 'Log Detayları'}, canActivate: [LoginGuardService, AdminGuardService] },
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
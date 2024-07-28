import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { UpdateComponent } from './update/update.component';
import { AddComponent } from './add/add.component';
import { DeleteComponent } from './delete/delete.component';
import { MapComponent } from './map/map.component';
import { LogComponent } from './log/log.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserComponent } from './user/user.component';
import { UserAddComponent } from './user/user-add/user-add.component';
import { UserUpdateComponent } from './user/user-update/user-update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './services/auth.service';
import { TasinmazService } from './services/tasinmaz.service';
import { AdminGuardService } from './services/admin-guard.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertifyService } from './services/alertify.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { LogDetailsComponent } from './log/log-details/log-details.component';
import { CommonModule } from '@angular/common';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    UpdateComponent,
    AddComponent,
    DeleteComponent,
    MapComponent,
    LogComponent,
    NavbarComponent,
    UserComponent,
    UserAddComponent,
    UserUpdateComponent,
    LogDetailsComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    JwtModule,
    BrowserAnimationsModule, 
    NgxPaginationModule,
    CommonModule
    

  ],
  providers: [ TasinmazService, AuthService, AdminGuardService, AlertifyService],
  bootstrap: [AppComponent],
  entryComponents: [UserAddComponent, UserUpdateComponent, UpdateComponent, AddComponent]
})
export class AppModule { }

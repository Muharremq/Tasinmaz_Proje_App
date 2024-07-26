import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

  constructor( 
    private authService: AuthService,
    private router: Router) { }

  canActivate(): boolean {
    if (this.authService.isAdmin()){
      return true;
    }else{
      this.router.navigate(['/dashboard'])
      return false;
    }
  }
}

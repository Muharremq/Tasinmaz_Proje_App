// auth.service.ts
import { Injectable } from '@angular/core';
import { LoginUser } from '../models/loginUser';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt'; // Import JwtHelperService
import { Router } from '@angular/router';
import { RegisterUser } from '../models/registerUser';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( 
    private httpClient: HttpClient,
    private router: Router,
    private alertifyService: AlertifyService) { }

  path = "https://localhost:44348/api/Auth/";

  userToken: any;
  decodedToken: any;
  jwtHelper: JwtHelperService = new JwtHelperService();
  TOKEN_KEY = "token"
  private ROLE_KEY = "role";

  login(LoginUser: LoginUser) {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    this.httpClient.post(this.path + "login", LoginUser, { headers: headers })
      .subscribe((data: any) => {
        if (data && data.token) { // Check if token exists
          this.saveToken(data.token); 
          const decodedToken = this.jwtHelper.decodeToken(data.token);
          localStorage.setItem(this.ROLE_KEY, decodedToken.role);
          console.log(decodedToken); 
          this.router.navigateByUrl("/dashboard");
          this.alertifyService.success("Logged in successfully");
        } else {
          this.alertifyService.warning("Incorrect email or password");
        }
      }, error => {
        if (error.status === 401) {
          this.alertifyService.warning("Incorrect email or password");
        } else {
          this.alertifyService.error("Login failed");
        }
        console.error("Login error: ", error);
      });
  }
  
  saveToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  register(RegisterUser: RegisterUser): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post(this.path + "register", RegisterUser, { headers: headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Registration error', error);
        return throwError(error);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logOut(){
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.ROLE_KEY)
  }

  loggedIn(){
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);  
  }

  get token(){
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUserId(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.nameid;
    }
    return null;
  }

  getRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  isAdmin(): boolean {
    return this.getRole() === "admin";
  }
}

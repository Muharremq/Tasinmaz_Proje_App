import { Injectable } from '@angular/core';
import { LoginUser } from '../models/loginUser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt'; // Import JwtHelperService
import { Router } from '@angular/router';
import { RegisterUser } from '../models/registerUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( 
    private httpClient: HttpClient,
    private router:Router) { }

  path ="https://localhost:44348/api/Auth/";

  userToken: any;
  decodedToken: any;
  jwtHelper: JwtHelperService = new JwtHelperService();
  TOKEN_KEY="token"
  private ROLE_KEY = "role";

  login(LoginUser: LoginUser) {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    this.httpClient.post(this.path + "login", LoginUser, { headers: headers })
      .subscribe((data: any) => {
        this.saveToken(data.token); 
        const decodedToken = this.jwtHelper.decodeToken(data.token);
        localStorage.setItem(this.ROLE_KEY, decodedToken.role);
        console.log(decodedToken); 
        this.router.navigateByUrl("/dashboard");
    }, error => {
        console.error("Login error: ", error);
    });
}

    saveToken(token: string) {
    localStorage.setItem('token', token);
    }

    register(RegisterUser: RegisterUser) {
      let headers = new HttpHeaders();
      headers = headers.append("Content-Type", "application/json");
      return this.httpClient.post(this.path + "register", RegisterUser, { headers: headers });
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
    return !!token && !this.jwtHelper.isTokenExpired(token);  }
  
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

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

  login(LoginUser: LoginUser) {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    this.httpClient.post(this.path + "login", LoginUser, { headers: headers })
      .subscribe((data: any) => {
        this.saveToken(data.token); 
        const decodedToken = this.jwtHelper.decodeToken(data.token);
        console.log(decodedToken); 
        this.router.navigateByUrl("/table-list");
    }, error => {
        console.error("Login error: ", error);
    });
}

    saveToken(token: string) {
    localStorage.setItem('token', token);
    }

    register(RegisterUser:RegisterUser){
      let headers = new HttpHeaders();
      headers = headers.append("Content-Type", "application/json")
      this.httpClient.post(this.path+"register",RegisterUser,{headers:headers})
      .subscribe(data => {
  
      });
    }

    getToken(): string | null {
      return localStorage.getItem(this.TOKEN_KEY);
    }
  
    logOut(){
      localStorage.removeItem(this.TOKEN_KEY)
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
}

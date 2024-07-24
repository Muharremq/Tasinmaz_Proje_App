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
    private http: HttpClient,
    private router:Router) { }

  path ="https://localhost:44348/api/Auth/";

  TOKEN_KEY = "token";
  userToken: any;
  decoderToken: any;
  jwtHelper: JwtHelperService = new JwtHelperService();

  login(LoginUser: LoginUser) {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    this.http.post(this.path + "login", LoginUser, { headers: headers })
    .subscribe((data: any) => {
        this.saveToken(data.token);
        const decodedToken = this.jwtHelper.decodeToken(data.token);
        console.log(decodedToken);
        this.router.navigateByUrl('/dashboard');
    },error => {
      console.error("Login error: ", error);
    });
  }
  saveToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  register(RegisterUser: RegisterUser){
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    this.http.post(this.path + 'register', RegisterUser, { headers: headers })
    .subscribe(data => {
    
    });
  }

  logOut(){
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string| null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  loggedIn(){
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);  
  }
  get token(){
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUserId(){
    return localStorage.getItem(this.TOKEN_KEY);
  }


}

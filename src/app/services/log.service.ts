import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class LogService {

  private apiUrl = 'https://localhost:44348/api/Log'; // API URL

  constructor(
    private http: HttpClient,
    private authService: AuthService  ) { }

    private getAuthHeaders(): HttpHeaders {
      return new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    }

    getAllLogs() {
      const headers = this.getAuthHeaders();
      return this.http.get(this.apiUrl, { headers });
    }
}

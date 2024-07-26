import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tasinmaz } from '../models/tasinmaz';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TasinmazService {
  private apiUrl = 'https://localhost:44348/api/TasinmazBilgi'; // API URL

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
  }

  getTasinmazlar(): Observable<Tasinmaz[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Tasinmaz[]>(this.apiUrl, { headers });
  }

  getTasinmazById(id: number): Observable<Tasinmaz> {
    const headers = this.getAuthHeaders();
    return this.http.get<Tasinmaz>(`${this.apiUrl}/${id}`, { headers });
  }
  
  addTasinmaz(tasinmaz: Tasinmaz): Observable<Tasinmaz> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Tasinmaz>(this.apiUrl, tasinmaz, { headers });
  }

  deleteTasinmaz(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  updateTasinmaz(id: number, tasinmaz: any): Observable<any> {
    const headers = this.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.put(`${this.apiUrl}/${id}`, tasinmaz, { headers });
  }
  
  getTasinmazlarByUserId(userId: number): Observable<Tasinmaz[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Tasinmaz[]>(`${this.apiUrl}/user/${userId}`, { headers });
  }

  getAllTasinmazlar(): Observable<Tasinmaz[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Tasinmaz[]>(this.apiUrl, { headers });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tasinmaz } from '../models/tasinmaz';

@Injectable({
  providedIn: 'root'
})
export class TasinmazService {
  private apiUrl = 'https://localhost:44348/api/TasinmazBilgi'; // API URL

  constructor(private http: HttpClient) {}

  getTasinmazById(id: number): Observable<Tasinmaz> {
    return this.http.get<Tasinmaz>(`${this.apiUrl}/${id}`);
  }
  
  addTasinmaz(tasinmaz: Tasinmaz): Observable<Tasinmaz> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<Tasinmaz>(this.apiUrl, tasinmaz, { headers });
  }

  deleteTasinmaz(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateTasinmaz(id: number, tasinmaz: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put(`${this.apiUrl}/${id}`, tasinmaz, { headers });
  }
  
}
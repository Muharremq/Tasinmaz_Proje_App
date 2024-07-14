import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tasinmaz } from './models/tasinmaz';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://localhost:44348/api/TasinmazBilgi'; // Buraya gerçek API URL'inizi ekleyin.

  constructor(private http: HttpClient) { }

  getTasinmazlar(): Observable<Tasinmaz[]> {
    return this.http.get<Tasinmaz[]>(this.apiUrl);
  }

  getTasinmazById(id: number): Observable<Tasinmaz> {
    return this.http.get<Tasinmaz>(`${this.apiUrl}/${id}`);
  }
}

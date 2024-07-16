// services/tasinmaz.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tasinmaz } from '../models/tasinmaz';
@Injectable({
  providedIn: 'root'
})
export class TasinmazService {
  private apiUrl = 'https://localhost:44348/api/TasinmazBilgi/'; // API URL'inizi burada belirleyin

  constructor(private http: HttpClient) {}

  getTasinmazById(id: number): Observable<Tasinmaz> {
    return this.http.get<Tasinmaz>(this.apiUrl + id);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IlService {

  private apiUrl = 'https://localhost:44348/api/Il';  // Backend API URL'nizi buraya ekleyin

  constructor(private http: HttpClient) { }

  getIller(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
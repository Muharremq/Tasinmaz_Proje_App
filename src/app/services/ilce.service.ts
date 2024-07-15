import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IlceService {

  private apiUrl = 'https://localhost:44348/api/Ilce';  // Backend API URL'nizi buraya ekleyin

  constructor(private http: HttpClient) { }

  getIlcelerByIlId(ilId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?ilId=${ilId}`);
  }
}

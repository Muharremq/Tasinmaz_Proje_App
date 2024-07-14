import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://localhost:44348/api/User'; // Gerçek API URL'inizi buraya ekleyin

  constructor(private http: HttpClient) { }

getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/${id}`);
  }

  // Diğer CRUD işlemleri için metodlar eklenebilir
}

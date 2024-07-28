import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://localhost:44348/api/User'; // Gerçek API URL'inizi buraya ekleyin

  constructor(
    private http: HttpClient,
    private authService: AuthService) { }

    private getAuthHeaders(): HttpHeaders {
      return new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    }

    getUserById(id: number): Observable<User> {
      const headers = this.getAuthHeaders();
      return this.http.get<User>(`${this.apiUrl}/${id}`, { headers });
    }

  addUser(user: User): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json' // Make sure the Content-Type is 'application/json'
    });
    return this.http.post<User>(this.apiUrl, user, { headers });
  }
  
  deleteUser(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
  updateUser(id: number, user: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}` // Yetkilendirme başlığı eklendi
    });
    return this.http.put<User>(`${this.apiUrl}/${id}`, user, { headers });
  }

  getUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<User[]>(this.apiUrl, { headers });
  }

  getAllUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<User[]>(this.apiUrl, { headers });

}
}

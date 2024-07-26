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
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  addUser(user: User): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json' // Make sure the Content-Type is 'application/json'
    });
    return this.http.post<User>(this.apiUrl, user, { headers });
  }
  
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: number, user: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<User>(`${this.apiUrl}/${id}`, user, { headers });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getAllUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<User[]>(this.apiUrl, { headers });

}
}

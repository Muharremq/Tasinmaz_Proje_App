import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  users: User[] = [];

  constructor( private http: HttpClient ) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(){
    return this.http.get<User[]>("https://localhost:44348/api/User").subscribe((data) => {
      this.users = data;
    });
  }

}

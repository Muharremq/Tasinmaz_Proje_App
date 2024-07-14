import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  login() {
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    if (username === 'admin' && password === 'admin') {
      alert('Giriş başarılı!');
    } else {
      alert('Kullanıcı adı veya şifre yanlış.');
    }
  }
}

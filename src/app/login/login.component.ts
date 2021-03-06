import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string;
  password: string;

  constructor(private http: HttpClient, private router: Router, private alertService: AlertService) { }

  submit() {
    let endpoint: string = "http://localhost:3000/login";
    let body = { username: this.username, password: this.password };

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };

    this.http.post(endpoint, body, options).subscribe(
      res => {
        if (res) {
          this.router.navigate(["/uks"]);
        } else {
          this.alertService.error("Login failed");
        }
      },
      err => console.log(err)
    );
  }
}
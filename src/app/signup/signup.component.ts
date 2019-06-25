import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  ngOnInit() {
  }

  username: string;
  password: string;

  constructor(private http: HttpClient, private router: Router, private alertService: AlertService) { }

  submit() {
    let endpoint: string = "http://localhost:3000/signup";
    let body = { username: this.username, password: this.password };

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };

    this.http.post(endpoint, body, options).subscribe(
      res => {
        if (res) this.router.navigate(["/uks"]);
        else this.alertService.error("User already exists");
      },
      err => console.log(err)
    );
  }


}

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  name: string;
  uks: { id: string, name: string, grade: string }[] = [];

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    let endpoint = "http://localhost:3000/profile";

    let studentId;
    this.route.params.subscribe((student) => {
      studentId = student;
    });

    let body = { id: studentId };

    console.log(JSON.stringify(body));

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };

    this.http.post(endpoint, body, options).subscribe(
      res => {
        console.log(res);
        let realRes: any = res;
        this.name = realRes.name;
        if (realRes.uks) this.uks = realRes.uks;
        console.log(this.name);
      },
      err => {
        console.log(err);
        let realRes: any = err;
        this.name = realRes.error.text;
        if (realRes.uks) this.uks = realRes.uks;
        console.log(this.name);
      }
    );
  }

  goToUk(uk: { name: string, _id: string }) {
    this.router.navigate([`/uks/${uk.name}`, { _id: uk._id }]);
  }

}

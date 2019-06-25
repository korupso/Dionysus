import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedService } from '../services/SharedService';

@Component({
  selector: 'app-uk',
  templateUrl: './uk.component.html',
  styleUrls: ['./uk.component.css']
})
export class UkComponent implements OnInit {
  uks: any = [];

  constructor(private http: HttpClient, private router: Router, private sharedService: SharedService) { }

  ngOnInit() {
    let endpoint: string = "http://localhost:3000/api/uks";

    this.http.get(endpoint).subscribe(
      res => this.uks = res,
      err => console.log(err)
    );
  }

  goToUk(uk: { _id: string, name: string }) {
    let endpoint: string = "http://localhost:3000/api/uks/specific";
    let body = { _id: uk._id };

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };

    console.log(body);

    this.http.post(endpoint, body, options).subscribe(
      res => {
        console.log(res);
        this.sharedService.setUKData(res);
        this.router.navigate([`/uks/${uk.name}`, { _id: uk._id }]);
      },
      err => console.log(err)
    );
  }

}

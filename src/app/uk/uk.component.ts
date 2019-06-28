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
    this.router.navigate([`/uks/${uk.name}`, { _id: uk._id }]);
  }

}

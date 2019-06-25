import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SharedService } from '../services/SharedService';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  students: any = [];
  ukName: string = "";
  ukId: string = "";

  constructor(private router: Router, private route: ActivatedRoute, private sharedService: SharedService, private http: HttpClient) {
  }

  ngOnInit() {
    if (this.sharedService.getUKData() != null) {
      this.students = this.sharedService.getUKData().studentsFromUk;
      console.log(this.sharedService.getUKData());
    }
    else {
      console.log(this.sharedService.getUKData());
      this.route.params.subscribe(params => {
        console.log(this.route.params);
        this.ukId = params.ukId;
        this.ukName = params.ukName;
      })

      let endpoint: string = "http://localhost:3000/api/uks/specific";
      let body = { _id: this.ukId };

      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };

      console.log(body);

      this.http.post(endpoint, body, options).subscribe(
        res => {
          console.log(res);
          this.sharedService.setUKData(res);
          this.router.navigate([`/uks/${this.ukName}`]);
        },
        err => console.log(err)
      );
    }
    this.route.params.subscribe((uk) => {
      this.ukName = uk.ukName;
      this.ukId = uk._id;
    });
  }

  save() {
    let endpoint: string = "http://localhost:3000/api/uks/grades";
    let body = { _id: this.ukId, students: this.students };

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };

    console.log(body);

    this.http.post(endpoint, body, options).subscribe(
      res => console.log(res),
      err => console.log(err)
    );
  }

}

import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SharedService } from '../services/SharedService';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  gradesHTML: NodeListOf<HTMLElement> = document.getElementsByName("grades");
  grades: string[] = [];
  students: { id: string, name: string, grade: string }[] = [];
  allStudents: { id: string, name: string }[] = [];
  ukName: string = "";
  ukId: string = "";
  myControl = new FormControl();
  newStudent: string = "";

  constructor(private router: Router, private route: ActivatedRoute, private sharedService: SharedService, private http: HttpClient) {
  }

  ngOnInit() {
    let endpoint = "http://localhost:3000/api/uks/specific";
    let endpointAllStudents = "http://localhost:3000/api/students";

    this.route.params.subscribe(params => {
      this.ukId = params._id;
      this.ukName = params.ukName;
      console.log(this.ukId, this.ukName)
    })

    let body = { _id: this.ukId };

    console.log(JSON.stringify(body));

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };

    this.http.post(endpoint, body, options).subscribe(
      res => {
        let realRes: any = res;
        this.students = realRes.studentsFromUk;
        console.log(this.students);

        this.http.get(endpointAllStudents).subscribe(
          res => {
            (<any>res).forEach(student => {
              let valid = true;
              this.students.forEach(lstudent => {
                if (student._id == lstudent.id) valid = false;
              });
              if (valid) this.allStudents.push({ id: student._id, name: student.fname + " " + student.lname });
            });
          },
          err => console.log(err)
        );
      },
      err => console.log(err)
    );
  }

  save() {
    this.gradesHTML.forEach(gradeHTML => this.grades.push(gradeHTML.innerText));
    console.log(this.grades);
    let endpoint: string = "http://localhost:3000/api/uks/grades";
    let localStudents = [];
    for (let i = 0; i < this.students.length; i++) {
      localStudents.push({ id: this.students[i].id, grade: this.grades[i] })
    }
    let body = { _id: this.ukId, students: localStudents, newStudent: { id: this.newStudent, grade: this.grades[this.grades.length - 1] } };

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };

    console.log(this.grades);

    for (let i = 0; i < this.students.length; i++) {
      console.log(this.students[i].name + " " + this.grades[i]);
    }

    console.log(JSON.stringify(body));

    this.http.post(endpoint, body, options).subscribe(
      res => {
        console.log(res);
        this.grades = [];
        this.goToUk();
      },
      err => console.log(err)
    );
  }

  goToUk() {
    let endpoint: string = "http://localhost:3000/api/uks/specific";
    let body = { _id: this.ukId };

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };

    console.log(body);

    this.http.post(endpoint, body, options).subscribe(
      res => {
        console.log(res);
        this.router.navigate([`/uks/${this.ukName}`, { _id: this.ukId }]);
      },
      err => console.log(err)
    );
  }

  goToProfile(studentId: string) {
    this.router.navigate([`/profile/${studentId}`]);
  }

}

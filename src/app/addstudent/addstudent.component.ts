import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addstudent',
  templateUrl: './addstudent.component.html',
  styleUrls: ['./addstudent.component.scss']
})
export class AddstudentComponent implements OnInit {

  students: { id: string, name: string }[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Get all the data at the beginning
   */
  ngOnInit() {
    this.http.get("http://localhost:3000/api/students").subscribe(
      res => {
        let realRes: any = res;
        realRes.forEach(student => this.students.push({ id: student._id, name: student.fname + " " + student.lname }));
        console.log(this.students);
      },
      err => console.error(err)
    );
  }

  /**
   * Navigates the router to the profile page of a student.
   *
   * @param studentId The ID of the student to go to.
   */
  goToProfile(studentId: string) {
    this.router.navigate([`/profile/${studentId}`]);
  }

  /**
   * Deletes a specific student.
   * 
   * @param id The ID of the student to be deleted.
   */
  deleteStudent(id: string) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };

    let body = { id: id };

    this.http.post("http://localhost:3000/rem/students", body, options).subscribe(
      res => {
        this.students = [];
        this.ngOnInit();
      },
      err => {
        this.students = [];
        this.ngOnInit();
      }
    )
  }

  /**
   * Send the data to the backend for it to save it.
   */
  save() {
    let newStudent = (<HTMLInputElement>document.getElementById("newStudent")).value;

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };

    let body = { name: newStudent };

    this.http.post("http://localhost:3000/api/students", body, options).subscribe(
      res => {
        this.students = [];
        this.ngOnInit()
      },
      err => console.error(err)
    )
  }

}

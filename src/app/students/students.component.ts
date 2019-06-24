import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SharedService } from '../services/SharedService';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  students: any = [];
  ukName: string = "";

  constructor(private router: Router, private route: ActivatedRoute, private sharedService: SharedService) {
    this.sharedService.getUserData().studentsFromUk.forEach(student => {
      this.students.push(student);
    });
  }

  ngOnInit() {
    this.route.params.subscribe((ukName) => {
      this.ukName = ukName.ukName;
    });
  }

}

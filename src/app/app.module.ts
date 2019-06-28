import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UkComponent } from './uk/uk.component';
import { StudentsComponent } from './students/students.component';
import { SharedService } from './services/SharedService';
import { SignupComponent } from './signup/signup.component';
import { AlertComponent } from './directives/alert.component';
import { AlertService } from './services/alert.service';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent },
      { path: 'uks', component: UkComponent },
      { path: 'uks/:ukName', component: StudentsComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'profile/:studentId', component: ProfileComponent }
    ])
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    UkComponent,
    StudentsComponent,
    SignupComponent,
    AlertComponent,
    ProfileComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    SharedService,
    AlertService
  ]
})
export class AppModule { }


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
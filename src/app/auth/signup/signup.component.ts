import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { SignupRequestPayload } from './signup-request-payload';
import { AuthService } from '../shared/auth.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUpRequestPayload: SignupRequestPayload;
  signupForm: FormGroup;

  constructor(
    private authService: AuthService,
     private notif: NotifierService,
     private router: Router
    ) {
  }

  ngOnInit() {
    this.signupForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  signup(){
    this.signUpRequestPayload = this.signupForm.value;
    this.authService.signup(this.signUpRequestPayload).subscribe( response => {
      response.data ? this.router.navigate(
        ['/login'], 
        {
          queryParams: 
          {
            registred: true, 
            email: response.data.email,
            message: response.message
          }
        })
      : this.notif.notify('error', response.message);
    })
  }
}

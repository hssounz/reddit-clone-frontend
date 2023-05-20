import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { SignupRequestPayload } from './signup-request-payload';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUpRequestPayload: SignupRequestPayload = { username: '', email: '', password: '' };
  signupForm: FormGroup;

  constructor() {
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
    console.log(this.signUpRequestPayload);
  }
}

import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { LoginRequestPayload } from 'src/app/interface/login-request-payload';
import { AuthService } from '../shared/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginRequestPayload: LoginRequestPayload;
  loginForm: FormGroup;


  constructor(
    private authService: AuthService,
    private router: Router,
    private notif: NotifierService,
    private activatedRoute: ActivatedRoute
    ){}



  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['registred'] !== undefined && params['registred'] === 'true') {
        this.notif.notify('success', `${params['message']}: ${params['email']}`);
      }
      
    })
  }

  login(){
    this.loginRequestPayload = this.loginForm.value;
    this.authService.login(this.loginRequestPayload).subscribe(data => console.log('Logged in successfully'));
  }

}

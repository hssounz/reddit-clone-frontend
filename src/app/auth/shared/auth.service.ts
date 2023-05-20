import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignupRequestPayload } from '../signup/signup-request-payload';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CustomResponse } from 'src/app/interface/custom-response';
import { SignupResponse } from 'src/app/interface/signup-response';
import { LoginRequestPayload } from 'src/app/interface/login-request-payload';
import { LoginResponse } from 'src/app/interface/login-response';
import { LocalStorageService, SessionStorageService, LocalStorage, SessionStorage } from 'angular-web-storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl: string = 'http://localhost:8088/api/auth';


  constructor(private http: HttpClient, private localStorageService: LocalStorageService) { }

  // signup$ = (input: SignupRequestPayload) => <Observable<CustomResponse<SignupResponse>>>this.http
  //   .post<CustomResponse<SignupResponse>>(`${this.apiUrl}/signup`, input)
  //   .pipe(
  //     tap(console.log),
  //     catchError(this.handleError)
  //   )

  signup(input: SignupRequestPayload) {
   return this.http.post<CustomResponse<SignupResponse>>(`${this.apiUrl}/signup`, input);
  }

  login(input: LoginRequestPayload) {
    return this.http.post<CustomResponse<LoginResponse>>(`${this.apiUrl}/login`, input)
        .pipe(
          map(res => {
            this.localStorageService.set('accessToken', res.data?.User.accessToken);
            this.localStorageService.set('username', res.data?.User.username);
            this.localStorageService.set('refreshToken', res.data?.User.refreshToken);
            this.localStorageService.set('expiresAt', res.data?.User.expiresAt);
            return res;
          })
        );
  }

}

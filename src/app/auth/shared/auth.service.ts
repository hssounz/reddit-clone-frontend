import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignupRequestPayload } from '../../interface/signup-request-payload';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CustomResponse } from 'src/app/interface/custom-response';
import { SignupResponse } from 'src/app/interface/signup-response';
import { LoginRequestPayload } from 'src/app/interface/login-request-payload';
import { LoginResponse } from 'src/app/interface/login-response';
import { LocalStorageService } from 'angular-web-storage';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl: string = 'http://localhost:8088/api/auth';


  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
    ) { }



  signup(input: SignupRequestPayload) {
    return this.http.post<CustomResponse<SignupResponse>>(`${this.apiUrl}/signup`, input);
  }

  login(input: LoginRequestPayload) {
    return this.http
      .post<CustomResponse<LoginResponse>>(
        `${this.apiUrl}/login`,
        input
      )
      .pipe(
        map(response => {
          if (response.data?.User == null) {
            return response;
          } else {
            const {accessToken, refreshToken, expiresAt, username} = response.data.User
            this.localStorageService.set("accessToken", accessToken);
            this.localStorageService.set("refreshToken", refreshToken);
            this.localStorageService.set("expiresAt", expiresAt);
            this.localStorageService.set("username", username);
            return response;
          }
        }),
        catchError(this.handleError)
      );
  }

  refreshToken(){
    return this.http.post<CustomResponse<LoginResponse>>(
      `${this.apiUrl}/refresh/token`, 
        {
          refreshToken: this.localStorageService.get('refreshToken'),
          username: this.localStorageService.get('username')
        }
      );
  }

  getRefreshToken(){
    return this.localStorageService.get('refreshToken');
  }
  getJwtToken(){
    return this.localStorageService.get('accessToken');
  }
  getAuthorizationToken() {
    return this.localStorageService.get('accessToken')
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`Error occured - Error code: ${error.status}`);
  }
}


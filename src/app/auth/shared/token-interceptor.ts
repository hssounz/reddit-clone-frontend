import { Injectable } from "@angular/core"
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Observable,catchError, throwError, BehaviorSubject } from 'rxjs';
import {switchMap, filter, take} from 'rxjs/operators'
import { LoginResponse } from "src/app/interface/login-response";


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    isTokenRefreshing: boolean = false;
    refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null)

    constructor(
        private authService: AuthService
    ){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
        const loginUri = "/auth/login";
        const signupUri = "/auth/signup"
        if (req.url.search(loginUri) === -1 && req.url.search(signupUri) === -1) {
            const authRequest = req.clone({
                setHeaders: {
                Authorization: `Bearer ${this.authService.getAuthorizationToken()}`
                }
              });
              return next.handle(authRequest).pipe(
                  catchError(error => {
                      if(error instanceof HttpErrorResponse && error.status === 403) {
                          return this.handleAuthErrors(req, next);
                      } else {
                          return throwError(error)
                      }
                  })
              );
        }
        return next.handle(req);
      }

      private handleAuthErrors(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isTokenRefreshing) {
            this.isTokenRefreshing = true;
            this.refreshTokenSubject.next(null);

                return this.authService.refreshToken().pipe(
                    switchMap((refreshTokenResponse: LoginResponse) => {
                        this.isTokenRefreshing = false;
                        this.refreshTokenSubject.next(refreshTokenResponse.User.accessToken);
                        const authRequest = req.clone({
                            setHeaders: {
                              Authorization: `Bearer ${this.authService.getAuthorizationToken()}`
                            }
                          });
                        return next.handle(authRequest);
                    })
                )
        }  else {
            return this.refreshTokenSubject.pipe(
                filter(result => result !== null),
                take(1),
                switchMap((res) => {
                    return next.handle(req.clone({
                        headers: req.headers.set('Authorization',  `Bearer ${this.authService.getJwtToken()}`)
                    }));
                })
            )
        
        }
    }

}

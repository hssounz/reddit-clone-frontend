import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomResponse } from '../interface/custom-response';
import { PostModel } from '../interface/post-model';
import { Observable, throwError } from 'rxjs'
import { map, catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private readonly apiUrl: string = 'http://localhost:8088/api/posts';

  constructor(
    private http: HttpClient
  ) { }

  getAllPosts(): Observable<CustomResponse<{Posts: PostModel[]}>> {
    return this.http.get<CustomResponse<{Posts: PostModel[]}>>("http://localhost:8088/api/posts/all").pipe(

      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError({
      error: `Error occured - Error code: ${error.status}`,
      message: error.message
    });
  }
}

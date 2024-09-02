import { Injectable } from '@angular/core';
import { Users } from './types';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

const HttpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
  ) { }

  getUsers(): Observable<Users[]> {
    return this.http.get<Users[]>('/api/users');
  }

  getUserById(id: string): Observable<Users> {
    return this.http.get<Users>(`http://localhost:8000/api/users/${id}`);
  }

  updateUser(user: Partial<Users>): Observable<Users> {
  return this.http.put<Users>(`http://localhost:8000/api/users/${user.id}`, user, HttpOptions)
    .pipe(
      catchError(this.handleError)
    );
}


  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(() => new Error('Something went wrong with the update; please try again later.'));
  }
}

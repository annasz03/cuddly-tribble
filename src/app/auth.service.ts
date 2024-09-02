import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { UserInterface } from './user.interface';
import * as jwt_decode from 'jwt-decode';

interface CheckUserExistsResponse {
  exists: boolean;
}

interface DecodedToken {
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUserSig = signal<UserInterface | null>(null);
  private userSubject = new BehaviorSubject<UserInterface | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = this.getStoredUser();
    if (storedUser) {
      this.currentUserSig.set(storedUser);
    }
  }

  register(email: string, username: string, password: string): Observable<void> {
    return this.checkUserExists(username).pipe(
      switchMap(exists => {
        if (exists) {
          throw new Error('User already exists');
        }

        const userDetails: Partial<UserInterface> = {
          name: username,
          email: email,
          username: username,
          profilePic: null,
          followers: 0,
          password: password,
        };

        return this.http.post<UserInterface>('/api/users', userDetails).pipe(
          switchMap(user => {
            this.setCurrentUser(user);
            return from(Promise.resolve());
          })
        );
      }),
      catchError(error => {
        console.error('Registration error:', error.message);
        return from(Promise.reject(error));
      })
    );
  }

  login(email: string, password: string): Observable<UserInterface> {
    return this.http.post<UserInterface>('/api/login', { email, password }).pipe(
      map(user => {
        console.log('Received user data:', user);
        this.setCurrentUser(user);
        return user;
      }),
      catchError(err => {
        console.error('Login failed:', err);
        throw err;
      })
    );
  }

  logout(): Observable<void> {
    localStorage.removeItem('currentUser');
    this.currentUserSig.set(null);
    return from(Promise.resolve());
  }

  setUser(user: UserInterface): void {
    this.userSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  clearUser(): void {
    this.userSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSig();
  }

  checkUserExists(username: string): Observable<boolean> {
    return this.http.get<CheckUserExistsResponse>(`/api/check-user-exists?username=${username}`)
      .pipe(
        map(response => response.exists)
      );
  }

  public setCurrentUser(user: UserInterface): void {
    console.log('Setting current user:', user);
    this.currentUserSig.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }  

  getCurrentUser(): UserInterface | null {
    const user = this.currentUserSig();
    return user;
  }
  
  
  private getStoredUser(): UserInterface | null {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const user = JSON.parse(userJson) as UserInterface;
      if (user.token) {  
        try {
          const decodedToken = parseJwt(user.token);
          const currentTime = Math.floor(Date.now() / 1000);
          
          if (decodedToken.exp < currentTime) {
            console.warn('Token has expired');
            localStorage.removeItem('currentUser');
            return null;
          }
          return user;
        } catch (error) {
          console.error('Token decoding failed:', error);
          localStorage.removeItem('currentUser');
          return null;
        }
      } else {
        console.warn('Token is missing');
        localStorage.removeItem('currentUser');
        return null;
      }
    }
    return null;
  }
  

}

function parseJwt(token: string): any {
  const base64Url = token.split('.')[1];
  const base64 = decodeURIComponent(atob(base64Url).replace(/(.)/g, function (m, p) {
      return '%' + ('00' + p.charCodeAt(0).toString(16)).slice(-2);
  }));
  return JSON.parse(base64);
}
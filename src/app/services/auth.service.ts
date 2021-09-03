import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
console.log(environment.APIEndpoint)
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authRoute = `${environment.APIEndpoint}/api/auth`;

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<User>;
  handleError: any;

  public sub: Subscription;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  get getIsAuth(): User {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    console.log(this.authRoute);
    return this.http.post<any>(`${this.authRoute}/login`, { email, password })
      .pipe(
        map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          console.log(this.currentUserSubject);
          return user;
        }
        return user;
        }
      ));
  }

  logout(email: string) {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
    return this.http.post<any>(`${this.authRoute}/logout`, {email});
  }

  unconnect(email: string) {
    return this.http.post<any>(`${this.authRoute}/unconnect`, {email});
  }

  admin() {
    this.router.navigate(['/adminpanel']);
  }
}

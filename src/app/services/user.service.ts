import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {


  constructor(private http: HttpClient) { }

  usersGet(): Observable<User[]> {
    return this.http.get<any>(`${environment.APIEndpoint}/api/users`)
    .pipe(
      map(result => result['users']),
      shareReplay());
  }

  userGet(id: string) {
    return this.http.get<any>(`/${id}`);
  }

  userAdd(user: User) {
    console.log('register')
    const userData = {
      'email': user.email,
      'password': user.password,
      'pseudo': user.pseudo,
      'newsletter': user.newsletter,
      'coloCount': user.coloCount
    };
    return this.http.post(`${environment.APIEndpoint}/api/auth/register`, userData);
  }

  isTokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    const currentTime = Math.floor(new Date().getTime() / 1000);
    return currentTime >= expiry;
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  usersUrl: 'https://calm-waters-91692.herokuapp.com/api/users';

  constructor(private http: HttpClient) { }

  usersGet(): Observable<User[]> {
    return this.http.get<any>(`https://calm-waters-91692.herokuapp.com/api/users`)
    .pipe(
      map(result => result['users']),
      shareReplay());
  }

  userGet(id: string) {
    return this.http.get<any>(`/${id}`);
  }

  userAdd(user: User) {
    const userData = {
      'email': user.email,
      'password': user.password,
      'pseudo': user.pseudo,
      'newsletter': user.newsletter,
      'coloCount': user.coloCount
    };
    return this.http.post(`https://calm-waters-91692.herokuapp.com/api/auth/register`, userData);
  }

  userColoAdd() {
    console.log('user colo add !');
    return this.http.post<User>(`${this.usersUrl}/inc`, 'inc')
    .pipe(
      shareReplay()
    );
  }

  userColoSub() {
    return this.http.post<User>(`${this.usersUrl}`, {flag: 'dec'})
    .pipe(
      shareReplay()
    );
  }
  // userDelete(id: string) {
  //   return this.http.delete(`http://localhost:3000/users/${id}`);
  // }

  // userUpdate(user: any) {
  //   return this.http.put(`http://localhost:3000/${user._id}`, user);
  // }
}

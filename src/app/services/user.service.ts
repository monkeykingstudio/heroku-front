import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  // getAll(): Observable<User[]> {
  //   return this.http.get<User[]>(`http://localhost:3000/users`);
  // }

  userGet(id: string) {
    return this.http.get<any>(`https://calm-waters-91692.herokuapp.com/api/users/${id}`);
  }

  userAdd(user: User) {
    const userData = {
      'email': user.email,
      'password': user.password,
      'pseudo': user.pseudo
    };
    // userData.append('email', user.email);
    // userData.append('password', user.password);
    // if (user.picture !== '') {
    //   userData.append('picture', user.picture, user.pseudo);
    // }
    // userData.append('pseudo', user.pseudo);
    return this.http.post(`https://calm-waters-91692.herokuapp.com/api/auth/register`, userData);
  }

  // userDelete(id: string) {
  //   return this.http.delete(`http://localhost:3000/users/${id}`);
  // }

  // userUpdate(user: any) {
  //   return this.http.put(`http://localhost:3000/${user._id}`, user);
  // }
}

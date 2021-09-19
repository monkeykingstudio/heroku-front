import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

// import { Concours } from '../models/concours.model';

@Injectable({
  providedIn: 'root'
})
export class ConcoursService {

  constructor(private http: HttpClient) { }

  usersGet(): Observable<any[]> {
    return this.http.get<any>(`${environment.APIEndpoint}/api/concours`)
    .pipe(
      map(result => result['users']),
      shareReplay());
  }

  userAdd(email: string) {
    console.log('from service', email);
    return this.http.post(`${environment.APIEndpoint}/api/concours/add`, {email})
    .pipe(
      map(result => result['message']),
      shareReplay()
    );
  }
}

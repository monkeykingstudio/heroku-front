import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  constructor(private http: HttpClient) {}

  sendEmail(url, data) {
    return this.http.post(url, data);
  }

  sendBreedEmail(url, data) {
    return this.http.post(url, data);
  }

activateMail(token) {
  let headers = new HttpHeaders()
  .set('Authorization', `JWT ${token}`);
  return this.http.get(`${environment.APIEndpoint}/mail/activate`, {
    observe: 'body',
    params: new HttpParams().append('token', token),
    'headers': headers
  });
  }
}

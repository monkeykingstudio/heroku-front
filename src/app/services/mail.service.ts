import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  constructor(private http: HttpClient) {}

  sendEmail(url, data) {
    return this.http.post(url, data);
  }

activateMail(token) {
  let headers = new HttpHeaders()
  .set('Authorization', `JWT ${token}`);
  return this.http.get('https://calm-waters-91692.herokuapp.com/api/mail/activate', {
    observe: 'body',
    params: new HttpParams().append('token', token),
    'headers': headers
  });
  }
}

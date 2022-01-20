import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Notification } from './../models/notification.model';
import { map, filter, shareReplay } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationUrl = `${environment.APIEndpoint}/api/notifications`;

  constructor(private http: HttpClient) {
  }

  getAllNotifs(userId: string) {
    return this.http.get<Notification[]>(`${this.notificationUrl}`)
    .pipe(
      map(result => result['notifs']
      .filter(notifs => notifs?.senderId !== userId))
    );
  }

  markAsRead(id: string) {
    return this.http.post<any>(`${this.notificationUrl}/read/${id}`, {});
  }

  markSocketAsRead(id: string) {
    // this.markAsRead(id);
    return this.http.post<any>(`${this.notificationUrl}/socketread/${id}`, {});
  }

}

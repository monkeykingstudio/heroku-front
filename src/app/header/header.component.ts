import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuthService } from './../services/auth.service';
import { Router } from '@angular/router';
// import { WebSocketService } from '../services/web-socket.service';

import { io } from 'socket.io-client';


const socket: any = io('ws://calm-waters-91692.herokuapp.com', {
  path: '/notification/'
});

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authStatusSubscription: Subscription;
  user$: Observable<User>;

  isShown = false;
  currentUser: User;

  notification: Number;
  notifications = [];

  constructor(
    public authService: AuthService,
    private router: Router,
    // private webSocketService: WebSocketService
    ) {
      socket.on('connection', () => {
        console.log('connected from client');
      });

      const params = {
        sender: sessionStorage.getItem('user_id')
      };

      socket.emit('joinNotifications', params, () => {
      });

      socket.on('recieveNotifications', request => {
        this.notifications.push(request);
        this.notification = this.notifications.length;
      });
  }

  ngOnInit(): void {
    // this.webSocketService.listen('test event').subscribe((data) => {
    //   console.log(data);
    // });
    this.authStatusSubscription = this.authService.currentUser.pipe(
      map(user => {
        if (user) {
          this.currentUser = user;
          // this.webSocketService.emit('test emit', this.currentUser.pseudo);
        }
      })
      ).subscribe();
  }

  toggleShow() {
    this.isShown = !this.isShown;
  }

  onLogout() {
    this.authService.logout(this.currentUser?.email)
    .subscribe(() => {
      this.router.navigate(['/login']);
      this.ngOnInit();
    });
    this.toggleShow();
  }

  goToAdmin() {
    this.authService.admin();
    this.toggleShow();
  }

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }

  actionOnRequest(button) {
    socket.emit('sendNotifications', {
      message: `You clicked on ${button}.`,
      sender: sessionStorage.getItem('user_id'),
      reciever: sessionStorage.getItem('user_id')
    }, () => {

    });
  }
}

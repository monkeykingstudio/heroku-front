import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuthService } from './../services/auth.service';
import { Router } from '@angular/router';

import { io } from 'socket.io-client';


const notificationSocket: any = io('ws://calm-waters-91692.herokuapp.com', {
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

  storage;

  constructor(
    public authService: AuthService,
    private router: Router,
    // private webSocketService: WebSocketService
    ) {
      notificationSocket.on('connect', () => {
        console.log('connected from client');
        // notificationSocket.emit('userAuth', this.currentUser);
      });

      const params = {
        sender: JSON.parse(localStorage.getItem('currentUser'))?._id
      };

      notificationSocket.emit('joinNotifications', params, () => {
      });

      notificationSocket.on('recieveNotifications', request => {
        this.notifications.push(request);
        console.log(this.notifications);
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
    notificationSocket.emit('sendNotifications', {
      message: `${button} from ${JSON.parse(localStorage.getItem('currentUser')).pseudo}`,
      senderId: JSON.parse(localStorage.getItem('currentUser'))._id,
      senderPseudo: JSON.parse(localStorage.getItem('currentUser')).pseudo,
      reciever: '6131e7c597f50700160703fe' // User raphael
    }, () => {

    });
    console.log(JSON.parse(localStorage.getItem('currentUser'))._id);
  }
}
/**
 Créé en backend le model notification
  id
  text
  date
  time
  read
  url (opt)

 */

  /* Rooms
   1 room pour tout le monde
   1 pour les admins
   */

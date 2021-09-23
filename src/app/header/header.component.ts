import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, pipe, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuthService } from './../services/auth.service';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';

// Notifications
import { io } from 'socket.io-client';
import { NotificationService } from './../services/notification.service';
import { Notification } from '../models/notification.model';

const notificationSocket: any = io(`${environment.APIEndpoint}`, {
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

  public notifSub: Subscription;
  allNotifs$: Observable<Notification[]>;

  isShown = false;
  currentUser: User;

  notification: Number;
  socketNotifications = [];
  databaseNotifications = [];

  userNotifications = [];

  // storage;

  constructor(
    public authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
    ) {
      notificationSocket.on('connect', (socket) => {
        console.log('socket.io connected from client, with id -->', notificationSocket.id);
        // notificationSocket.emit('userAuth', this.currentUser);
      });



      // const params = {
      //   sender: JSON.parse(localStorage.getItem('currentUser'))?._id
      // };

      // notificationSocket.emit('joinNotifications', params, () => {
      // });

      // notificationSocket.on('recieveNotifications', request => {
      //   this.notifications.push(request);
      //   console.log(this.notifications);
      //   this.notification = this.notifications.length;
      // });
  }

  ngOnInit(): void {
    // this.webSocketService.listen('test event').subscribe((data) => {
    //   console.log(data);
    // });

    this.reloadNotifs();
    this.getAllNotifications();

    this.authStatusSubscription = this.authService.currentUser.pipe(
      map(user => {
        if (user) {
          this.currentUser = user;
        }
      })
      ).subscribe();
  }

  // actionOnRequest(button) {
  //   notificationSocket.emit('sendNotifications', {
  //     message: `${button} from ${JSON.parse(localStorage.getItem('currentUser')).pseudo}`,
  //     senderId: JSON.parse(localStorage.getItem('currentUser'))._id,
  //     senderPseudo: JSON.parse(localStorage.getItem('currentUser')).pseudo,
  //     reciever: '6131e7c597f50700160703fe' // User raphael
  //   }, () => {

  //   });
  //   console.log(JSON.parse(localStorage.getItem('currentUser'))._id);
  // }

  toggleShow() {
    this.isShown = !this.isShown;
  }

  onLogout() {
    this.authService.logout(this.currentUser?.email)
    .then((m) => {
      console.log(m);
      this.router.navigate(['/login']);
      this.ngOnInit();
    }).catch(err => console.error(err));
    this.toggleShow();
  }

  goToAdmin() {
    this.authService.admin();
    this.toggleShow();
  }

  getAllNotifications() {
    // Getting all notifications
    this.notifSub = this.allNotifs$
    .pipe(
      map(notifs => notifs
        // .map(sheet => sheet)
      )
    )
    .subscribe((notifs) => {
      console.log('userNotifications', notifs);
      this.databaseNotifications.push(notifs);

      // Merge mongoDB & socket.io notifications in one array
      this.userNotifications = [...this.databaseNotifications, ...this.socketNotifications];
      this.notification = this.userNotifications[0].length;
    });
  }

  reloadNotifs(): void {
    const notifs$ = this.notificationService.getAllNotifs();
    this.allNotifs$ = notifs$;
  }

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, pipe, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuthService } from './../services/auth.service';
import { Router } from '@angular/router';

// Notifications
// import { io } from 'socket.io-client';
import { NotificationService } from './../services/notification.service';
import { Notification } from '../models/notification.model';
import { SocketioService } from '../services/socketio.service';

// const notificationSocket: any = io(`${environment.APIEndpoint}`, {
//   path: '/notification/'
// });

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  showNotif = false;
  markRead = false;

  private authStatusSubscription: Subscription;
  user$: Observable<User>;

  public notifSub: Subscription;
  private currentNotifsSubject: Subject<Notification[]>;

  allNotifs$: Observable<Notification[]>;

  isShown = false;
  currentUser: User;

  notification: Number;
  socketNotifications = [
    // {
    //   id: 'toto',
    //   type: 'global',
    //   senderId: '60b968dc5150a20015d6fcae',
    //   senderPseudo: 'Sikarak',
    //   message: 'socket notification test',
    //   created_at: new Date('2021-09-22T00:54:54.976+00:00'),
    //   url: '/test',
    //   read_by: []
    // },
    // {
    //   id: 'tata',
    //   type: 'admin',
    //   senderId: 'qs5d4fqsd4fsqd54fqsd5fqsdf',
    //   senderPseudo: 'raphael',
    //   message: 'socket notification 2',
    //   created_at: new Date('2021-09-22T00:54:54.976+00:00'),
    //   url: '/titi',
    //   read_by: []
    // }
  ];
  databaseNotifications = [];

  userNotifications = [];

  // socket.io send message to specific client, and remove item from array.

  // client.on('disconnect', function (data) {
  //   var key = room.indexOf(client.id);
  //   room.splice(key, 1);
  //   io.sockets.socket(adminId).emit('query-room-list', room);
  //  });

  constructor(
    public authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private socketService: SocketioService
    ) {
    this.currentNotifsSubject = new Subject<Notification[]>();
    this.allNotifs$ = this.currentNotifsSubject.asObservable();

    // const params = {
    //   sender: JSON.parse(localStorage.getItem('currentUser'))?._id
    // };

    // notificationSocket.on('connect', (socket) => {
    //   console.log('socket.io connected from client, with id -->', notificationSocket.id);
    // });

    // notificationSocket.emit('joinNotifications', params, () => {
    // });

    // notificationSocket.on('recieveNotifications', request => {
    //   this.socketNotifications.push(request);
    //   console.log(this.socketNotifications);
    //   this.notification = this.socketNotifications.length;
    // });
  }

  ngOnInit(): void {
    // this.webSocketService.listen('test event').subscribe((data) => {
    //   console.log(data);
    // });

    this.reloadNotifs();
    // this.getAllNotifications();

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

  // getAllNotifications() {
  //   // Getting all notifications
  //   this.notifSub = this.allNotifs$
  //   .pipe(
  //     map(notifs => notifs
  //     )
  //   )
  //   .subscribe((notifs) => {
  //     this.databaseNotifications.push(notifs);

  //     // Merge mongoDB & socket.io notifications in one array
  //     this.userNotifications = [...this.databaseNotifications, ...this.socketNotifications];
  //     this.notification = this.userNotifications[0].length;
  //   });
  // }

  reloadNotifs(): void {
    const notifs$ = this.notificationService.getAllNotifs();
    this.allNotifs$ = notifs$;
  }

  showNotifs() {
    this.showNotif = !this.showNotif;
    event.stopPropagation();
  }

  close() {
    if (this.markRead) {
      setTimeout(() => {
        this.showNotif = false;
        this.reloadNotifs();

        this.markRead = false;
      }, 500);
    } else {
      this.showNotif = false;
    }
  }

  markAsRead(id: string) {
    var value = document.getElementById(id);
    value.classList.toggle('animate__zoomOut');
    setTimeout(() => {
      value.style.display = 'none';
    }, 500);
    this.notificationService.markAsRead(id)
    .subscribe(() => {
      this.markRead = true;
      setTimeout(() => {
        this.reloadNotifs();
      }, 500);
    });
  }

  confirm() {
    this.socketService.actionOnRequest('CONFIRM');
  }

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }

}

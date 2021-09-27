import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, pipe, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuthService } from './../services/auth.service';
import { Router } from '@angular/router';

// Notifications
import { NotificationService } from './../services/notification.service';
import { Notification } from '../models/notification.model';
import { SocketioService } from '../services/socketio.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  showNotif = false;
  markRead = false;

  private authStatusSubscription: Subscription;
  user$: Observable<User>;

  public notifSub: Subscription;
  private databaseNotifsSubject: Subject<Notification[]>;

  databaseNotifs$: Observable<Notification[]>;
  socketNotifs: Notification[] = [];

  isShown = false;
  currentUser: User;

  socketNotifications: Notification[] = [];

  constructor(
    public authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private socketService: SocketioService
    ) {
    this.databaseNotifsSubject = new Subject<Notification[]>();
    this.databaseNotifs$ = this.databaseNotifsSubject.asObservable();
  }

  ngOnInit(): void {
    this.authStatusSubscription = this.authService.currentUser.pipe(
      map(user => {
        if (user) {
          this.currentUser = user;
        }
      })
      ).subscribe();
    this.reloadSocketNotifs();
    this.reloadDatabaseNotifs();
  }


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

// NOTIFICATIONS

  reloadDatabaseNotifs(): void {
    console.log('ID DE LUSER', this.currentUser?._id);
    const notifs$ = this.notificationService.getAllNotifs(this.currentUser?._id);
    this.databaseNotifs$ = notifs$;
  }

  reloadSocketNotifs(): void {
    const notifs = this.socketService.socketNotifications;
    this.socketNotifs = notifs;
  }

  showNotifs() {
    this.showNotif = !this.showNotif;
    event.stopPropagation();
  }

  close() {
    if (this.markRead) {
      setTimeout(() => {
        this.showNotif = false;
        this.reloadSocketNotifs();
        this.reloadDatabaseNotifs();

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
        this.reloadSocketNotifs();
        this.reloadDatabaseNotifs();
      }, 500);
    });
  }

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }

}

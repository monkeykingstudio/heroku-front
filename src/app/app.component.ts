import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from './services/auth.service';
import { User } from './models/user.model';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, RoutesRecognized } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersService } from './services/user.service';
import { environment } from 'src/environments/environment';

import { io } from 'socket.io-client';
import { WebSocketService } from './services/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public currentRoute: string;
  public visitorMode = false;
  public authStatusSubscription: Subscription;
  userSub: Subscription;

  title = 'fourmislabs';
  hover = false;
  isVerified = false;

  user$: Observable<User>;
  currentUser: User;

  constructor(
    private router: Router,
    public usersService: UsersService,
    public authService: AuthService,
    private webSocketService: WebSocketService
    ) {}

  ngOnInit(): void {

    this.router.events
    .subscribe(event => {
      if (event instanceof RoutesRecognized ) {
        if (event.url === '/login') {
          this.currentRoute = event.url;
          console.log('CURRENT', this.currentRoute);
          this.visitorMode = true;
        } else if (event.url === '/signup') {
          this.currentRoute = event.url;
          console.log('CURRENT', this.currentRoute);
          this.visitorMode = true;
        } else {
          this.visitorMode = false;
        }
      }
    });
    this.authStatusSubscription = this.authService.currentUser
    .pipe(
      map(user => {
        if (user) {
          this.currentUser = user;
        }
      })
      ).subscribe(() => {
        this.hover = false;
      });

    // interval(1000).subscribe(() => {
    //   const user = this.authService.getIsAuth;
    //   if (user && this.usersService.isTokenExpired(user.token)) {
    //     this.authService.logout(user.email).subscribe();
    //   }
    // });
  }

  // @HostListener('window:beforeunload', ['$event'])
  // async logout ($event) {
  //   await this.authService.unconnect(this.currentUser.email).subscribe();
  //   $event.stopPropagation();
  //   $event.preventDefault();
  //   $event.returnValue = false;
  // }

  // @HostListener('window:unload', ['$event'])
  // async unloadHandler(event) {
  //   await this.authService.logout(this.currentUser.email).subscribe();
  //   event.returnValue = false;

  // }




  // @HostListener('window:beforeunload')
  async ngOnDestroy() {
    // await this.authService.logout(this.currentUser.email)
    // .subscribe();
  }
}



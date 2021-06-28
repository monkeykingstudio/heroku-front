import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from './services/auth.service';
import { User } from './models/user.model';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersService } from './services/user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public authStatusSubscription: Subscription;
  userSub: Subscription;

  title = 'antslab';
  hover = false;
  isVerified = false;

  user$: Observable<User>;
  currentUser: User;

  constructor(
    private router: Router,
    public usersService: UsersService,
    public authService: AuthService
    ) {}

  ngOnInit(): void {
    this.authStatusSubscription = this.authService.currentUser
    .pipe(
      map(user => {
        if (user) {
          this.currentUser = user;
        }
      })
      ).subscribe();

    interval(1000).subscribe(() => {
      const user = this.authService.getIsAuth;
      if (user && this.usersService.isTokenExpired(user.token)) {
        this.authService.logout(user.email).subscribe();
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  async logout ($event) {
    await this.authService.unconnect(this.currentUser.email).subscribe();
    $event.preventDefault();
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    this.authService.logout(this.currentUser.email).subscribe();
  }


  async ngOnDestroy() {
    this.authStatusSubscription.unsubscribe();
  }
}



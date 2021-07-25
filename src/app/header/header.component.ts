import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuthService } from './../services/auth.service';
import { Router } from '@angular/router';

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

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
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
}

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { User } from './../models/user.model';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-lateral-menu',
  templateUrl: './lateral-menu.component.html',
  styleUrls: ['./lateral-menu.component.scss']
})
export class LateralMenuComponent implements OnInit, OnDestroy {

  private authStatusSubscription: Subscription;
  user$: Observable<User>;

  isShown = false;
  currentUser: User;
  @Input()
  hoverStatus;
  @Input()
  isUser;

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

  onLogout() {
    this.authService.logout(this.currentUser?.email)
    .subscribe(() => {
      this.router.navigate(['/login']);
      this.currentUser = undefined;
    });
  }

  hoverStatusChange() {
    this.hoverStatus = false;
  }


  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }

}

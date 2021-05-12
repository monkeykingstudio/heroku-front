import { Component, OnInit } from '@angular/core';
// import { AuthService } from './services/auth.service';
// import { User } from './models/user.model';
// import { Subscription } from 'rxjs';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // public authStatusSubscription: Subscription;

  title = 'antslab';
  hover = false;
  isVerified = false;

  // user$: Observable<User>;
  // currentUser: User;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // this.authStatusSubscription = this.authService.currentUser.pipe(
    //   map(user => {
    //     if (user) {
    //       this.currentUser = user;
    //     }
    //   })
    //   ).subscribe();

  }
}

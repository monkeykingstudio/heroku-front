import { Component, OnInit } from '@angular/core';
// import { AuthService } from './services/auth.service';
// import { User } from './models/user.model';
// import { Subscription } from 'rxjs';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersService } from './services/user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // public authStatusSubscription: Subscription;
  testUser: String;
  userSub: Subscription;


  title = 'antslab';
  hover = false;
  isVerified = false;

  // user$: Observable<User>;
  // currentUser: User;

  constructor(private router: Router, public usersService: UsersService) {}

  ngOnInit(): void {
    // this.authStatusSubscription = this.authService.currentUser.pipe(
    //   map(user => {
    //     if (user) {
    //       this.currentUser = user;
    //     }
    //   })
    //   ).subscribe();

    this.userSub = this.usersService.userGet('6091b24b1b29132a8036c970')
    .subscribe((user) => {
      this.testUser = user.email;
      console.log(user.user.email);
    });

  }
}

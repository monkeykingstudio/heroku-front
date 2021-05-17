import { Subscription } from 'rxjs';
import { User } from './../models/user.model';
import { UsersService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  testUser: String;
  userSub: Subscription;

  constructor(public usersService: UsersService) { }

  ngOnInit(): void {
    this.userSub = this.usersService.userGet('6091b24b1b29132a8036c970')
    .subscribe((user) => {
      this.testUser = user.email;
      console.log(this.testUser);
    });
  }

}

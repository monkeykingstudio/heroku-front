import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from './../services/user.service';
import { User } from './../models/user.model';
import { BreedingSheetsService } from './../services/breedingSheetsService';
import { ColoniesService } from './../services/colonies.service';

import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  allUsers$: Observable<User[]>;


  constructor(public usersService: UsersService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.reloadUsers();

    this.spinner.show();

    // setTimeout(() => {
    //   this.spinner.hide();
    // }, 5000);
  }

  reloadUsers(): void {
    const users$ = this.usersService.usersGet();
    this.allUsers$ = users$;
  }

}

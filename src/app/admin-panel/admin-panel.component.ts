import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from './../services/user.service';
import { User } from './../models/user.model';
import { BreedingSheetsService } from './../services/breedingSheetsService';
import { ColoniesService } from './../services/colonies.service';
import { BreedingSheet } from './../models/breedingSheet.model';
import { map } from 'rxjs/operators';
import { Colony } from '../colonies/colony.model';


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  allUsers$: Observable<User[]>;
  pendingUsers$: Observable<User[]>;
  allColonies$: Observable<Colony[]>;
  breedingSheet$: Observable<BreedingSheet[]>;
  userColonies$: Observable<Colony[]>;

  constructor(
    public usersService: UsersService,
    public colonyService: ColoniesService,
    public breedingSheetsService: BreedingSheetsService
    ) { }

  ngOnInit(): void {
    this.reloadUsers();
    this.reloadColonies();
    this.reloadBreedingSheets();

    this.pendingUsers$ = this.allUsers$
    .pipe(
      map(users => users
        .filter(user => user.is_verified === false))
    );
  }

  reloadUsers(): void {
    const users$ = this.usersService.usersGet();
    this.allUsers$ = users$;
  }

  reloadColonies(): void {
    const colonies$ = this.colonyService.loadAllUsersColonies();
    this.allColonies$ = colonies$;
  }

  getUserColonies(id: string) {
    return this.colonyService.loadUserColonies(id);
  }

  reloadBreedingSheets(): void {
    const breedingSheets$ = this.breedingSheetsService.getAll();
    this.breedingSheet$ = breedingSheets$;
  }
}

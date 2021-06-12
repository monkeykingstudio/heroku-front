import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from './../services/user.service';
import { User } from './../models/user.model';
import { BreedingSheetsService } from './../services/breedingSheetsService';
import { ColoniesService } from './../services/colonies.service';
import { BreedingSheet } from './../models/breedingSheet.model';
import { map } from 'rxjs/operators';
import { Colony } from '../colonies/colony.model';

import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { Label } from 'ng2-charts';


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



  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public chartData = [];
  public barChartData: ChartDataset[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];


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

import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from './../services/user.service';
import { User } from './../models/user.model';
import { BreedingSheetsService } from './../services/breedingSheetsService';
import { ColoniesService } from './../services/colonies.service';
import { BreedingSheet } from './../models/breedingSheet.model';
import { map } from 'rxjs/operators';
import { Colony } from '../colonies/colony.model';

import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';



@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

    myArray = [
    {date: '2017-01-01', num: '2'},
    {date: '2017-01-02', num: '3'},
    {date: '2017-02-04', num: '6'},
    {date: '2017-02-05', num: '15'}
    ];

    groupKey = 0;

  userData = [];

  lineChartData: ChartDataSets[] = [
    {
      data: [0, 0, 0, 0, 2, 9, 0, 0, 0, 0, 0, 0],
      label: 'User registrations'
    },
  ];

  lineChartLabels: Label[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'rgb(31 31 31)',
      backgroundColor: 'rgb(99 215 69)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

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
    this.computeData();
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

  computeData() {
    const groups = this.myArray.reduce((r, o) => {
      const m = o.date.split(('-'))[1];
      (r[m]) ? r[m].data.push(o) : r[m] = {group: String(this.groupKey++), data: [o]};
      return r;
    }, {});
    const result = Object.keys(groups).map((k) => groups[k]);
    console.log(result);
  }
}

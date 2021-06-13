import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UsersService } from './../services/user.service';
import { User } from './../models/user.model';
import { BreedingSheetsService } from './../services/breedingSheetsService';
import { ColoniesService } from './../services/colonies.service';
import { BreedingSheet } from './../models/breedingSheet.model';
import { map } from 'rxjs/operators';
import { Colony } from '../colonies/colony.model';

import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  public chartSub: Subscription;

  private userData = [];


  myArray = [
  {date: '30-05-2021'},
  {date: '30-05-2021'},
  {date: '01-06-2021'},
  {date: '01-06-2021'},
  {date: '01-06-2021'},
  {date: '01-06-2021'},
  {date: '01-06-2021'},
  {date: '09-06-2021'},
  {date: '09-06-2021'}
  ];

  groupKey = 0;

  userSampleData = [
    {month: 5},
    {month: 5},
    {month: 5},
    {month: 6},
    {month: 6},
    {month: 6},
    {month: 6},
    {month: 6},
    {month: 6},
    {month: 6}
  ];

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
  chartUsers$: Observable<User[]>;
  allColonies$: Observable<Colony[]>;
  breedingSheet$: Observable<BreedingSheet[]>;
  userColonies$: Observable<Colony[]>;

  constructor(
    public usersService: UsersService,
    public colonyService: ColoniesService,
    public breedingSheetsService: BreedingSheetsService,
    private datePipe: DatePipe

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

    this.chartSub = this.allUsers$
    .pipe(
      map(users => users
        .map(user => user.created))
    ).subscribe((res) => {
      console.log(res);
      // for (const element of res) {
      //   console.log(element);
      // }
      this.userData.push(res);
    }
    );

    // this.computeData();
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
    const groups = this.myArray
    .reduce((r, o) => {
      const m = o.date.split(('-'))[1];
      (r[m])
      ? r[m].data.push(o)
      : r[m] = {group: String(this.groupKey++), data: [o]};
      return r;
    }, {});
    const result = Object.keys(groups)
    .map((k) => groups[k]);

    console.log(result);
  }
}

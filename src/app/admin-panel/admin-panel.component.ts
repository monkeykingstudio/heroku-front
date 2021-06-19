import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UsersService } from './../services/user.service';
import { User } from './../models/user.model';
import { BreedingSheetsService } from './../services/breedingSheetsService';
import { ColoniesService } from './../services/colonies.service';
import { BreedingSheet } from './../models/breedingSheet.model';
import { filter, map, tap } from 'rxjs/operators';
import { Colony } from '../colonies/colony.model';

import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  private chartSub: Subscription;

  private userData = [];
  private chartUserData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  groupKey = 0;

  lineChartData: ChartDataSets[] = [
    {
      data: this.chartUserData,
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
  allBreedingSheets$: Observable<BreedingSheet[]>;
  pendingBreedingSheet$: Observable<BreedingSheet[]>;
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

    this.pendingBreedingSheet$ = this.allBreedingSheets$
    .pipe(
      map(sheets => sheets
        .filter(sheet => sheet.status === 'pending'))
    );

    this.chartSub = this.allUsers$
    .pipe(
      map(users => users
        .map(user => user.created))
    )
    .subscribe((res) => {
      for (const item of res) {
        this.userData.push({month: this.datePipe.transform(item, 'dd-MM-YYY')});
      }
      this.computeData();
      this.dispatchData();
    });
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
    this.allBreedingSheets$ = this.breedingSheetsService.getAll();
    const breedingSheets$ = this.breedingSheetsService.getAll()
    .pipe(
      map(breedsheets => breedsheets
        .filter(sheets => sheets.status === 'approved')
    ));
    this.breedingSheet$ = breedingSheets$;
  }

  // Charts logic
  computeData() {
    const groups = this.userData
    .reduce((r, o) => {
      const m = o.month.split(('-'))[1];
      (r[m])
      ? r[m].data.push(o)
      : r[m] = {group: Number(m), data: [o]};
      return r;
    }, {});
    const result = Object.keys(groups)
    .map((k) => groups[k]);
    this.userData = result;
    console.log('Computed Data', this.userData);
  }

  dispatchData() {
    this.userData.forEach((group, index) => {
      this.chartUserData.splice(group.group - 1, 1, group.data.length);
    });
    console.log(this.chartUserData);
  }

  ngOnDestroy(): void {
    this.chartSub.unsubscribe();
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ColoniesService } from './../../services/colonies.service';
import { Colony } from './../colony.model';
import { CounterService } from '../../services/counter.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BreedingSheet } from '../../models/breedingSheet.model';
import { BreedingSheetsService } from './../../services/breedingSheetsService';
import { map } from 'rxjs/operators';

import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Counter } from 'src/app/models/counter.model';


@Component({
  selector: 'app-colony',
  templateUrl: './colony.component.html',
  styleUrls: ['./colony.component.scss']
})
export class ColonyComponent implements OnInit, OnDestroy {
  colony$: Observable<Colony>;
  chartCounter$: Observable<Counter[]>;
  private colonyId: string;

  breedSheet: BreedingSheet;
  private breedingSheetSub: Subscription;
  private chartSub: Subscription;

  private counterData = [];
  private chartPolyMinorData = [];
  private chartPolyMediumData = [];
  private chartPolyMajorData = [];

  diapauseStatus = false;

  groupKey = 0;

  public barChartData: ChartDataSets[] = [
    {
      data: this.chartPolyMinorData,
      label: 'Minor'
    },
    {
      data: this.chartPolyMediumData,
      label: 'Media'
    },
    {
      data: this.chartPolyMajorData,
      label: 'Major'
    }
  ];

  barChartLabels: Label[] = [
    'Population'
  ];

  barChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
      display: true,
        scaleLabel: {
          display: true,
          labelString: ''
        }
      }],
      yAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'Amount'
      },
      ticks: {
        beginAtZero: true,
        steps: 5,
        stepValue: 100,
      }
  }] }
  };

  public colors = [
  {
    borderColor: 'black',
    backgroundColor: '#62d744'
  },
  {
    borderColor: 'black',
    backgroundColor: '#44a4d7'
  },
  {
    borderColor: 'black',
    backgroundColor: '#d74444'
  }
  ];

  barChartLegend = true;
  barChartPlugins = [];
  barChartType = 'bar';

  constructor(
    public coloniesService: ColoniesService,
    public breedingSheetsService: BreedingSheetsService,
    public counterService: CounterService,
    public route: ActivatedRoute)
    { }

  ngOnInit(): void {
    console.log('onInit',this.diapauseStatus);
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('colonyId')) {
        this.colonyId = paramMap.get('colonyId');
        this.loadColony(this.colonyId);
      }
    });

    this.colony$
    .pipe(
      map((colony) => {
      this.breedingSheetSub = this.breedingSheetsService.getSheet(colony.species)
      .subscribe((sheet) => {
        this.breedSheet = sheet;
      });
    })).subscribe();

    this.chartSub = this.colony$
    .pipe(
      map(colony => colony)
    )
    .subscribe((res) => {
      this.chartPolyMinorData.push(res.counter.minorCount);
      this.chartPolyMediumData.push(res.counter.mediumCount);
      this.chartPolyMajorData.push(res.counter.majorCount);
    });
  }

  loadColony(id: string): Observable<Colony> {
    console.log(`loading colony with ID: ${id}`);
    return this.colony$ = this.coloniesService.loadColony(id);
  }

  turnStatus($event) {
    this.diapauseStatus = true;
  }

  ngOnDestroy(): void {
    this.breedingSheetSub.unsubscribe();
    this.chartSub.unsubscribe();
  }
}

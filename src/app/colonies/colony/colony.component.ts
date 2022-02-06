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
// import { Counter } from 'src/app/models/counter.model';


@Component({
  selector: 'app-colony',
  templateUrl: './colony.component.html',
  styleUrls: ['./colony.component.scss']
})
export class ColonyComponent implements OnInit, OnDestroy {
  colony$: Observable<Colony>;
  private colonyId: string;

  breedSheet: BreedingSheet;
  private breedingSheetSub: Subscription;
  private chartSub: Subscription;

  public chartMonoData = [];
  public chartPolyMinorData = [];
  public chartPolyMediumData = [];
  public chartPolyMajorData = [];

  diapauseStatus = 'innactive';

  groupKey = 0;


  constructor(
    public coloniesService: ColoniesService,
    public breedingSheetsService: BreedingSheetsService,
    public counterService: CounterService,
    public route: ActivatedRoute)
    { }

  ngOnInit(): void {
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

    this.reloadChartPopulation();
  }

  reloadChartPopulation(): void {
    console.log('event graph population');
    this.chartSub = this.colony$
    .pipe(
      map(colony => colony)
    )
    .subscribe((res) => {
      this.chartPolyMinorData.push(res.counter.minorCount);
      this.chartPolyMediumData.push(res.counter.mediumCount);
      this.chartPolyMajorData.push(res.counter.majorCount);
      this.chartMonoData.push(res.counter.polyCount);
    });
  }

  refreshChart(): void {
    console.log('refreshstats');
    this.chartSub = this.colony$
    .pipe(
      map(colony => colony)
    )
    .subscribe((res) => {
      this.chartPolyMinorData = [];
      this.chartPolyMinorData.push(res.counter.minorCount);

      this.chartPolyMediumData = [];
      this.chartPolyMediumData.push(res.counter.mediumCount);

      this.chartPolyMajorData = [];
      this.chartPolyMajorData.push(res.counter.majorCount);

      this.chartMonoData = [];
      this.chartMonoData.push(res.counter.polyCount);
    });
  }

  loadColony(id: string): Observable<Colony> {
    return this.colony$ = this.coloniesService.loadColony(id);
  }

  changeStatus($event): void {
    this.diapauseStatus = $event;
  }

  ngOnDestroy(): void {
    this.breedingSheetSub.unsubscribe();
    this.chartSub.unsubscribe();
  }
}

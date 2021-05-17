import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ColoniesService } from './../../services/colonies.service';
import { Colony } from './../colony.model';
import { CounterService } from '../../services/counter.service';
import { Counter } from '../../models/counter.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BreedingSheet } from '../../models/breedingSheet.model';
import { BreedingSheetsService } from './../../services/breedingSheetsService';
import { map } from 'rxjs/operators';


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

    // methode youssef
    this.colony$
    .pipe(map((colony) => {
    this.breedingSheetSub = this.breedingSheetsService.getSheet(colony.species)
    .subscribe((sheet) => {
      this.breedSheet = sheet;
      // console.log(this.breedSheet);
    });
    })).subscribe();

  }

  loadColony(id: string): Observable<Colony> {
    console.log(`loading colony with ID: ${id}`);
    return this.colony$ = this.coloniesService.loadColony(id);
  }

  ngOnDestroy(): void {
    this.breedingSheetSub.unsubscribe();
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BreedingSheet } from '../models/breedingSheet.model';
import { BreedingSheetsService } from '../services/breedingSheetsService';

@Component({
  selector: 'app-breed-sheet-list',
  templateUrl: './breed-sheet-list.component.html',
  styleUrls: ['./breed-sheet-list.component.scss']
})
export class BreedSheetListComponent implements OnInit, OnDestroy {

  allBreedingSheets$: Observable<BreedingSheet[]>;

  species = [];

  private sheetSub: Subscription;

  sortedSpecies: Array<object> = [];

  constructor(
    public breedingSheetsService: BreedingSheetsService
  ) { }

  ngOnInit(): void {
    const compareFn = (a, b) => {
    if (a.species < b.species) {
      return -1;
    }
    if (a.species > b.species) {
      return 1;
    }
    return 0;
    };
    this.reloadBreedingSheets();

    this.sheetSub = this.allBreedingSheets$
    .pipe(
      map(breedsheets => breedsheets
        .filter(sheets => sheets.status === 'approved')
        .map(sheet => sheet)
        ),
        tap(res => {
          res.sort(compareFn);
        })
    )
    .subscribe((res) => {
      for (const item of res) {
        this.sortedSpecies.push(item);
      }
    });

    console.group(this.sortedSpecies);

  }

  reloadBreedingSheets(): void {
    const sheets$ = this.breedingSheetsService.getAll();
    this.allBreedingSheets$ = sheets$;
  }

  ngOnDestroy() {
    this.sheetSub.unsubscribe();
  }

}


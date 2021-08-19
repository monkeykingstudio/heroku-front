import { Component, OnInit, OnDestroy, Pipe } from '@angular/core';
import { of } from 'rxjs';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BreedingSheet } from '../models/breedingSheet.model';
import { BreedingSheetsService } from '../services/breedingSheetsService';

@Component({
  selector: 'app-breed-sheet-list',
  templateUrl: './breed-sheet-list.component.html',
  styleUrls: ['./breed-sheet-list.component.scss']
})
export class BreedSheetListComponent implements OnInit, OnDestroy {

  private allBreedingSheetsSubject: BehaviorSubject<any>;
  allSheets$: Observable<BreedingSheet[]>;

  species: string[] = [];
  sortedSpecies: Array<object> = [];

  allFamilies: string[] = [];
  sortedFamilies: string[] = [];

  allSubFamilies: string[] = [];
  sortedSubFamilies: string[] = [];

  private sheetSub: Subscription;
  private familySub: Subscription;
  private subFamilySub: Subscription;

  constructor(
    public breedingSheetsService: BreedingSheetsService
  ) {
    this.allBreedingSheetsSubject =  new BehaviorSubject<BreedingSheet[]>(null);
    this.allSheets$ = this.allBreedingSheetsSubject.asObservable();
  }

  ngOnInit(): void {

    this.reloadBreedingSheets();

    // All breedingSheets
    this.sheetSub = this.allSheets$
    .pipe(
      map(breedsheets => breedsheets
        .filter(sheets => sheets.status === 'approved')
        .map(sheet => sheet)
      ),
      tap(res => {
        res.sort(this.compareFn);
      })
    )
    .subscribe((res) => {
      for (const item of res) {
        this.sortedSpecies.push(item);
      }
    });

    // All families
    this.familySub = this.allSheets$
    .pipe(
      map(breedsheets => breedsheets
        .filter(sheets => sheets.status === 'approved')
        .map(sheet => sheet.family)
      ),
      tap(res => {
        res.sort(this.compareFn);
      })
    )
    .subscribe((res) => {
      for (const item of res) {
        this.allFamilies.push(item);
      }
      this.familyStore(this.allFamilies);
    });

    // All sub-families
    this.subFamilySub = this.allSheets$
    .pipe(
      map(breedsheets => breedsheets
        .filter(sheets => sheets.status === 'approved')
        .map(sheet => sheet.subfamily)
      ),
      tap(res => {
        res.sort(this.compareFn);
      })
    )
    .subscribe((res) => {
      for (const item of res) {
        this.allSubFamilies.push(item);
      }
      this.subFamilyStore(this.allSubFamilies);
    });
  }

  familyStore(array) {
    for (const item of array) {
      if (!this.sortedFamilies.includes(item.toLowerCase())) {
        this.sortedFamilies.push(item.toLowerCase());
        this.sortedFamilies.sort();
      }
    }
    return this.sortedFamilies;
  }

  subFamilyStore(array) {
    for (const item of array) {
      if (!this.sortedSubFamilies.includes(item.toLowerCase())) {
        this.sortedSubFamilies.push(item.toLowerCase());
        this.sortedSubFamilies.sort();
      }
    }
    return this.sortedFamilies;
  }

  familySelect(value) {
    // LOAD ALL
    if (value === 'all') {
      this.sheetSub = this.allSheets$
      .pipe(
        map(
          breedingSheet => breedingSheet
          .filter(sheets => sheets.status === 'approved')
        ),
        tap(res => {
          res.sort(this.compareFn);
        })
      )
      .subscribe((res) => {
        this.sortedSpecies = [];
        res.forEach((value) => {
          this.sortedSpecies.push(value);
        });
      });
    } else {
      // LOAD SELECTED
      this.sheetSub = this.allSheets$
      .pipe(
        map(
          breedingSheet => breedingSheet
          .filter(sheets => sheets.status === 'approved')
          .filter(sheet => sheet.family === value)
        ),
        tap(res => {
          res.sort(this.compareFn);
        })
      )
      .subscribe((res) => {
        this.sortedSpecies = [];
        res.forEach((value) => {
          this.sortedSpecies.push(value);
        });
      });
    }
  }

  subFamilySelect(value) {
    // LOAD ALL
    if (value === 'all') {
      this.sheetSub = this.allSheets$
      .pipe(
        map(
          breedingSheet => breedingSheet
          .filter(sheets => sheets.status === 'approved')
        ),
        tap(res => {
          res.sort(this.compareFn);
        })
      )
      .subscribe((res) => {
        this.sortedSpecies = [];
        res.forEach((value) => {
          this.sortedSpecies.push(value);
        });
      });
    } else {
      // LOAD SELECTED
      this.sheetSub = this.allSheets$
      .pipe(
        map(
          breedingSheet => breedingSheet
          .filter(sheets => sheets.status === 'approved')
          .filter(sheet => sheet.subfamily === value)
        ),
        tap(res => {
          res.sort(this.compareFn);
        })
      )
      .subscribe((res) => {
        this.sortedSpecies = [];
        res.forEach((value) => {
          this.sortedSpecies.push(value);
        });
      });
    }
  }

  reloadBreedingSheets(): void {
    const sheets$ = this.breedingSheetsService.getAll();
    this.allSheets$ = sheets$;
  }

  compareFn = (a, b) => {
    if (a.species < b.species) {
      return -1;
    }
    if (a.species > b.species) {
      return 1;
    }
    return 0;
  }

  ngOnDestroy() {
    this.sheetSub.unsubscribe();
    this.familySub.unsubscribe();
    this.subFamilySub.unsubscribe();
  }

}


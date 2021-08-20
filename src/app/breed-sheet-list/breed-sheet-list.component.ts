import { Component, OnInit, OnDestroy, Pipe } from '@angular/core';
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

  filters: string[] = ['all', 'all', 'all', 'all', 'all', 'all']; // Family, SubFamily, Genre, Tribu, Difficulty, Region

  species: string[] = [];
  // sortedSpecies: Array<object> = [];

  allFamilies: string[] = [];
  sortedFamilies: string[] = [];

  allSubFamilies: string[] = [];
  sortedSubFamilies: string[] = [];

  allGenres: string[] = [];
  sortedGenres: string[] = [];

  allTribus: string[] = [];
  sortedTribus: string[] = [];

  allDifficulties: number[] = [];
  sortedDifficulties: number[] = [];

  allRegions: string[] = [];
  sortedRegions: string[] = [];

  private sheetSub: Subscription;
  private familySub: Subscription;
  private subFamilySub: Subscription;
  private genreSub: Subscription;
  private tribuSub: Subscription;
  private difficultySub: Subscription;
  private regionSub: Subscription;

  constructor(
    public breedingSheetsService: BreedingSheetsService
  ) {
    this.allBreedingSheetsSubject =  new BehaviorSubject<BreedingSheet[]>(null);
    this.allSheets$ = this.allBreedingSheetsSubject.asObservable();
  }

  ngOnInit(): void {

    // ################## \\
    // # INITIALISATION # \\
    // ################## \\

    this.reloadBreedingSheets();

    // Getting all breedingSheets
    this.sheetSub = this.allSheets$
    .pipe(
      map(breedsheets => breedsheets
        .filter(sheets => sheets.status === 'approved')
        .map(sheet => sheet)
      )
    )
    .subscribe((res) => {
      // for (const item of res) {
      //   this.sortedSpecies.push(item);
      // }
    });

    // Getting all families
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

    // Getting all sub-families
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

    // Getting all genres
    this.genreSub = this.allSheets$
    .pipe(
      map(breedsheets => breedsheets
        .filter(sheets => sheets.status === 'approved')
        .map(sheet => sheet.genre)
      ),
      tap(res => {
        res.sort(this.compareFn);
      })
    )
    .subscribe((res) => {
      for (const item of res) {
        this.allGenres.push(item);
      }
      this.genreStore(this.allGenres);
    });

    // Getting all tribus
    this.tribuSub = this.allSheets$
    .pipe(
      map(breedsheets => breedsheets
        .filter(sheets => sheets.status === 'approved')
        .map(sheet => sheet.tribu)
      ),
      tap(res => {
        res.sort(this.compareFn);
      })
    )
    .subscribe((res) => {
      for (const item of res) {
        this.allTribus.push(item);
      }
      this.tribuStore(this.allTribus);
    });

    // Getting all difficulties
    this.difficultySub = this.allSheets$
    .pipe(
      map(breedsheets => breedsheets
        .filter(sheets => sheets.status === 'approved')
        .map(sheet => sheet.difficulty)
      ),
      tap(res => {
        res.sort(this.compareFn);
      })
    )
    .subscribe((res) => {
      for (const item of res) {
        this.allDifficulties.push(item);
      }
      this.difficultyStore(this.allDifficulties);
    });
  }

  // Store each unique occurences for re use in taxonomy filters
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
  genreStore(array) {
    for (const item of array) {
      if (!this.sortedGenres.includes(item.toLowerCase())) {
        this.sortedGenres.push(item.toLowerCase());
        this.sortedGenres.sort();
      }
    }
    return this.sortedGenres;
  }
  tribuStore(array) {
    for (const item of array) {
      if (!this.sortedTribus.includes(item.toLowerCase())) {
        this.sortedTribus.push(item.toLowerCase());
        this.sortedTribus.sort();
      }
    }
    return this.sortedTribus;
  }
  difficultyStore(array) {
    for (const item of array) {
      if (!this.sortedDifficulties.includes(item)) {
        this.sortedDifficulties.push(item);
        this.sortedDifficulties.sort();
      }
    }
    return this.sortedDifficulties;
  }

  flattenRegions(array) {
    for (const item of array) {
      this.sortedRegions.push(item);
    }
    console.log('sorted regions: ',  this.sortedRegions);
  }

  // ############# \\
  // # FILTERING # \\
  // ############# \\

  updateFamilyFilter(family) {
    console.log('family filter: ', family);
    this.filters.splice(0, 1, family);
    console.log('spliced array filter: ', this.filters);
  }

  updateSubFamilyFilter(subfamily) {
    console.log('sub-family filter: ', subfamily);
    this.filters.splice(1, 1, subfamily);
    console.log('spliced array filter: ', this.filters);
  }

  updateGenreFilter(genre) {
    console.log('genre filter: ', genre);
    this.filters.splice(2, 1, genre);
    console.log('spliced array filter: ', this.filters);
  }

  updateTribuFilter(tribu) {
    console.log('tribu filter: ', tribu);
    this.filters.splice(3, 1, tribu);
    console.log('spliced array filter: ', this.filters);
  }

  updateDifficultyFilter(difficulty) {
    console.log('difficulty filter: ', difficulty);
    this.filters.splice(4, 1, difficulty);
    console.log('spliced array filter: ', this.filters);
  }

  // filterSheets() {
  //   console.log(this.filters);
  // }

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


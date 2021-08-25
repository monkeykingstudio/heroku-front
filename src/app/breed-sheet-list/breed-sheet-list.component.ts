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

  allSheets$: Observable<BreedingSheet[]>;

  showFilter = true;
  filters: string[] = [ // Family, SubFamily, Genre, Tribu, Difficulty, Region, Polygyne, Diapause
    'all',
    'all',
    'all',
    'all',
    '0',
    'all',
    'all',
    'all'
  ];

  filteredSheets: BreedingSheet[];

  species: string[] = [];

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

  sortedRegions: string[] = [];

  regionList: Array<string> = [
    'europa (tempered)',
    'europa',
    'europa (north)',
    'europa (south)',
    'europa (east)',
    'europa (west)',
    'asia',
    'asia (north)',
    'asia (south)',
    'asia (east)',
    'asia (west)',
    'africa',
    'africa (north)',
    'africa (south)',
    'africa (east)',
    'africa (west)',
    'india',
    'india (north)',
    'india (south)',
    'india (east)',
    'india (west)',
    'america',
    'america (north)',
    'america (south)',
    'america (east)',
    'america (west)',
    'australia',
    'mediterranean basin',
  ];

  public sheetSub: Subscription;
  private familySub: Subscription;
  private subFamilySub: Subscription;
  private genreSub: Subscription;
  private tribuSub: Subscription;
  private difficultySub: Subscription;
  private regionSub: Subscription;

  constructor(
    public breedingSheetsService: BreedingSheetsService
  ) {

  }

  ngOnInit(): void {

    // ################## \\
    // # INITIALISATION # \\
    // ################## \\

    if (window.screen.width <= 414) {
      this.showFilter = false;
    }

    if (window.screen.width >= 415) {
      this.showFilter = true;
    }

    this.reloadBreedingSheets();

    this.sortedRegions = this.regionList.sort();

    // Getting all breedingSheets
    this.sheetSub = this.allSheets$
    .pipe(
      map(breedsheets => breedsheets
        .map(sheet => sheet)
      )
    )
    .subscribe();

    // Getting all families
    this.familySub = this.allSheets$
    .pipe(
      map(breedsheets => breedsheets

        .map(sheet => sheet.family)
      )
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
        .map(sheet => sheet.subfamily)
      )
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
        .map(sheet => sheet.genre)
      )
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
        .map(sheet => sheet.tribu)
      )
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
        .map(sheet => sheet.difficulty)
      )
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
      if ((!this.sortedFamilies.includes(item)) && item !== undefined) {
        this.sortedFamilies.push(item.toLowerCase());
        this.sortedFamilies.sort();
      }
    }
    return this.sortedFamilies;
  }
  subFamilyStore(array) {
    for (const item of array) {
      if ((!this.sortedSubFamilies.includes(item)) && item !== undefined) {
        this.sortedSubFamilies.push(item.toLowerCase());
        this.sortedSubFamilies.sort();
      }
    }
    return this.sortedFamilies;
  }
  genreStore(array) {
    for (const item of array) {
      if ((!this.sortedGenres.includes(item)) && item !== undefined) {
        this.sortedGenres.push(item.toLowerCase());
        this.sortedGenres.sort();
      }
    }
    return this.sortedGenres;
  }
  tribuStore(array) {
    for (const item of array) {
      if ((!this.sortedTribus.includes(item)) && item !== undefined) {
        this.sortedTribus.push(item.toLowerCase());
        this.sortedTribus.sort();
      }
    }
    return this.sortedTribus;
  }
  difficultyStore(array) {
    for (const item of array) {
      if ((!this.sortedDifficulties.includes(item)) && item !== undefined) {
        this.sortedDifficulties.push(item);
        this.sortedDifficulties.sort();
      }
    }
    return this.sortedDifficulties;
  }

  // ############# \\
  // # FILTERING # \\
  // ############# \\

  showFilters(): void {
    this.showFilter = !this.showFilter;
  }

  updateFamilyFilter(family) {
    this.filters.splice(0, 1, family);
    this.allSheets$ = this.breedingSheetsService.getFiltered(this.filters);
  }

  updateSubFamilyFilter(subfamily) {
    this.filters.splice(1, 1, subfamily);
    this.allSheets$ = this.breedingSheetsService.getFiltered(this.filters);

  }

  updateGenreFilter(genre) {
    this.filters.splice(2, 1, genre);
    this.allSheets$ = this.breedingSheetsService.getFiltered(this.filters);

  }

  updateTribuFilter(tribu) {
    this.filters.splice(3, 1, tribu);
    this.allSheets$ = this.breedingSheetsService.getFiltered(this.filters);

  }

  updateDifficultyFilter(difficulty) {
    this.filters.splice(4, 1, difficulty);
    this.allSheets$ = this.breedingSheetsService.getFiltered(this.filters);
  }

  updateRegionFilter(region) {
    this.filters.splice(5, 1, region);
    this.allSheets$ = this.breedingSheetsService.getFiltered(this.filters);
  }

  updatPolygyneFilter(polygyne) {
    this.filters.splice(6, 1, polygyne);
    this.allSheets$ = this.breedingSheetsService.getFiltered(this.filters);
  }

  updateDiapauseFilter(diapause) {
    this.filters.splice(7, 1, diapause);
    this.allSheets$ = this.breedingSheetsService.getFiltered(this.filters);
  }

  reloadBreedingSheets(): void {
    const sheets$ = this.breedingSheetsService.getAll();
    this.allSheets$ = sheets$;
  }

  ngOnDestroy() {
    this.sheetSub.unsubscribe();
    this.familySub.unsubscribe();
    this.subFamilySub.unsubscribe();
    this.genreSub.unsubscribe();
    this.tribuSub.unsubscribe();
    this.difficultySub.unsubscribe();
  }

}


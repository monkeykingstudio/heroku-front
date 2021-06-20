import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BreedingSheet } from './../models/breedingSheet.model';
import { BreedingSheetsService } from './../services/breedingSheetsService';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-breed-sheet-viewer',
  templateUrl: './breed-sheet-viewer.component.html',
  styleUrls: ['./breed-sheet-viewer.component.scss']
})
export class BreedSheetViewerComponent implements OnInit, OnDestroy {
  breedingSheet$: Observable<BreedingSheet>;
  private sheetId: string;
  private breedingSheetSub: Subscription;
  breedSheet: BreedingSheet;

  constructor(
    public breedingSheetsService: BreedingSheetsService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('sheetId')) {
        this.sheetId = paramMap.get('sheetId');
        this.loadSheet(this.sheetId);
      }
    });

    this.breedingSheet$
    .pipe(
      map((sheet) => {
      this.breedingSheetSub = this.breedingSheetsService.getSheet(sheet.species)
      .subscribe((sheet) => {
        this.breedSheet = sheet;
      });
    })).subscribe();
  }

  loadSheet(species: string): Observable<BreedingSheet> {
    console.log(`loading breedingsheet with species: ${species}`);
    return this.breedingSheet$ = this.breedingSheetsService.getSheet(species);
  }


  ngOnDestroy() {
    // this.breedingSheetSub.unsubscribe();
  }

}

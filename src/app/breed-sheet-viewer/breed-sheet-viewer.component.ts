import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreedingSheet } from './../models/breedingSheet.model';
import { BreedingSheetsService } from './../services/breedingSheetsService';

@Component({
  selector: 'app-breed-sheet-viewer',
  templateUrl: './breed-sheet-viewer.component.html',
  styleUrls: ['./breed-sheet-viewer.component.scss']
})
export class BreedSheetViewerComponent implements OnInit {
  breedingSheet$: Observable<BreedingSheet>;

  constructor(
    public breedingSheetsService: BreedingSheetsService
  ) { }

  ngOnInit(): void {
    // this.reloadBreedingSheet();
  }

  // reloadBreedingSheet(): void {
  //   const sheet$ = this.breedingSheetsService.getSheet();
  //   this.breedingSheet$ = sheet$;
  // }


}

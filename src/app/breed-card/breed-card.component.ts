import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BreedingSheet } from 'src/app/models/breedingSheet.model';
import { BreedingSheetsService } from './../services/breedingSheetsService';

@Component({
  selector: 'app-breed-card',
  templateUrl: './breed-card.component.html',
  styleUrls: ['./breed-card.component.scss']
})
export class BreedCardComponent implements OnInit {

  @Input()
  breedingSheet: BreedingSheet;
  bubbleTools = false;

  @Output()
  breedingSheetChange = new EventEmitter();

  constructor(
    public breedingSheetsService: BreedingSheetsService,
    public router: Router
    ) { }

  ngOnInit(): void {
  }

  switchBubbles() {
    this.bubbleTools = !this.bubbleTools;
  }

  openBreedingSheet(breedingSheet): void {
    const breedingSheetSpecies = breedingSheet.species;
    this.router.navigate (['breedsheetviewer', breedingSheetSpecies]);
  }

}

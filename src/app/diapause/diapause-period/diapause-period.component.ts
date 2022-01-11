import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { BreedingSheet } from 'src/app/models/breedingSheet.model';

@Component({
  selector: 'app-diapause-period',
  templateUrl: './diapause-period.component.html',
  styleUrls: ['./diapause-period.component.scss']
})
export class DiapausePeriodComponent implements OnInit {
  @Input()
  sheet: BreedingSheet;
  constructor() { }

  ngOnInit(): void {
  }

}

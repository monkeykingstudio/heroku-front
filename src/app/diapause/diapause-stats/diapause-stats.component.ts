import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { BreedingSheet } from 'src/app/models/breedingSheet.model';

@Component({
  selector: 'app-diapause-stats',
  templateUrl: './diapause-stats.component.html',
  styleUrls: ['./diapause-stats.component.scss']
})
export class DiapauseStatsComponent implements OnInit {
  @Input()
  sheet: BreedingSheet;

  @Input()
  chartDataStart: any;

  @Input()
  chartDataEnd: any;

  constructor() { }

  ngOnInit(): void {
    console.log('from stat module', this.chartDataStart);
  }

}

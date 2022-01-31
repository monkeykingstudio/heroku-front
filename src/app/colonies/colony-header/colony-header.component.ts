import { Component, OnInit, OnDestroy, Input, Output } from '@angular/core';
import * as moment from 'moment';

import { BreedingSheetsService } from './../../services/breedingSheetsService';
import { BreedingSheet } from '../../models/breedingSheet.model';
import { Colony } from '../colony.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-colony-header',
  templateUrl: './colony-header.component.html',
  styleUrls: ['./colony-header.component.scss']
})
export class ColonyHeaderComponent implements OnInit, OnDestroy {
  difficulties;

  @Input()
  colony: Colony;

  @Input()
  diapauseStatus: string;

  breedSheet: BreedingSheet;
  private breedingSheetsub: Subscription;

  DATE_RFC2822 = 'ddd, DD MMM YYYY HH:mm:ss ZZ';
  currentDate: moment.Moment;
  creationDate: moment.Moment;
  birthday: string;
  diffDuration;
  age: Array<number> = [];

  constructor(public breedingSheetsService: BreedingSheetsService) { }

  ngOnInit(): void {
    this.difficulties = Array(5).fill(1).map((x, i) => i + 1);
    this.breedingSheetsub = this.breedingSheetsService.getSheet(this.colony.species)
    .subscribe((sheet) => {
      this.breedSheet = sheet;
    });

    this.currentDate = moment(new Date());
    this.creationDate = moment(this.colony.creationDate);
    this.birthday = moment(this.creationDate).format('LL');
    this.diffDuration  = moment.duration(this.currentDate.diff(this.creationDate));
    this.age.push(this.diffDuration.days(), this.diffDuration.months(), this.diffDuration.years());
  }

  ngOnDestroy() {
    this.breedingSheetsub.unsubscribe();
  }

}

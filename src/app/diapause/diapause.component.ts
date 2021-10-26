import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { BreedingSheet } from 'src/app/models/breedingSheet.model';
import { DatePipe } from '@angular/common';
import { FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import { DiapauseService } from '../services/diapause.service';
import { Diapause } from './../models/diapause.model';
import { DateTime, Interval } from 'luxon';


@Component({
  selector: 'app-diapause',
  templateUrl: './diapause.component.html',
  styleUrls: ['./diapause.component.scss']
})
export class DiapauseComponent implements OnInit, OnDestroy {

  @Input()
  sheet: BreedingSheet;

  @Input()
  colonyId: string;

  diapauseForm: FormGroup;
  autoStartCtrl: FormControl;
  scheduleCtrl: FormControl;
  schedule = false;
  diapauseStart: boolean;
  intervalDateIsValid = true;

  private subscription: Subscription;
  dateNow = DateTime.now();
  startOfDiapause = this.dateNow;
  endOfDiapause = DateTime.local(2021, 10, 10, 17, 36); // this time tomorrow;


  constructor(
    private fb: FormBuilder,
    public datepipe: DatePipe,
    public diapauseService: DiapauseService
  ) { }

  ngOnInit(): void {

    this.startOfDiapause = DateTime.now();
    this.diapauseStart = false;

    this.autoStartCtrl = this.fb.control(true);
    this.scheduleCtrl = this.fb.control(false);

    this.diapauseForm = this.fb.group({
      autoStart: this.autoStartCtrl,
      schedule: this.scheduleCtrl,
    });
  }

  saveDiapause(): object {
    if (this.checkDates()) {
      const diapause: Diapause = {
        period: {
          startDiapause: this.startOfDiapause,
          endDiapause: this.endOfDiapause
        },
        species: this.sheet.species,
        colonyId: this.colonyId,
      };
      this.diapauseStart = true;
      return this.diapauseService.diapauseAdd(diapause)
      .subscribe(() => {
      });
      // TODO : return un success ou une error de l'observable et pas l'object lui même
    } else {
      return { error: 'you cannot choose last date behind start date.'};
    }
  }

  public checkDates(): boolean {
    return Interval.fromDateTimes(this.startOfDiapause, this.endOfDiapause).isValid ? true : false;
  }

  getTimeDifference(): any {
    if (this.schedule) {
      const diffTime = this.endOfDiapause.diff(this.startOfDiapause, ['months', 'days', 'hours']).toObject();
      console.log(diffTime);
      return diffTime;
    }
    else {
      const diffTime = this.endOfDiapause.diffNow().toFormat("dd 'days, 'hh 'hours,' mm 'minutes,' ss 'sec'");
      console.log(diffTime);
      return diffTime;
    }
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

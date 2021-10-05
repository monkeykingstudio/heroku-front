import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { BreedingSheet } from 'src/app/models/breedingSheet.model';
import { DatePipe } from '@angular/common';
import { FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import { DiapauseService } from '../services/diapause.service';
import * as moment from 'moment';


@Component({
  selector: 'app-diapause',
  templateUrl: './diapause.component.html',
  styleUrls: ['./diapause.component.scss']
})
export class DiapauseComponent implements OnInit, OnDestroy {

  diapauseForm: FormGroup;
  autoStartCtrl: FormControl;
  scheduleCtrl: FormControl;

  schedule = false;

  diapauseStart = false;
  // TIMER
  private subscription: Subscription;

  public dateNow = new Date();

  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute  = 60;

  public timeDifference;
  public secondsToDday;
  public minutesToDday;
  public hoursToDday;
  public daysToDday;

  // Dates

  DATE_RFC2822 = 'ddd, DD MMM YYYY HH:mm:ss ZZ';

  startDate: Date;
  endDate: Date;

  dateCheck = true;

  @Input()
  sheet: BreedingSheet;

  @Input()
  colonyId: string;

  constructor(
    private fb: FormBuilder,
    public datepipe: DatePipe,
    public diapauseService: DiapauseService
  ) { }

  private getTimeDifference () {
    if (!this.schedule) {
      this.timeDifference = this.endDate.getTime() - new Date().getTime();
    }
    else {
      this.timeDifference =  new Date(this.endDate).getTime() - new Date(this.startDate).getTime();
    }

    const hour = new Date(this.endDate).getHours();
    const minutes = new Date(this.endDate).getMinutes();
    const seconds = new Date(this.endDate).getSeconds();

    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits (timeDifference) {
    this.secondsToDday = Math.floor(
      (timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute
      );
    this.minutesToDday = Math.floor(
      (timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute
    );
    this.hoursToDday = Math.floor(
      (timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay
      );
    this.daysToDday = Math.floor(
      (timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay)
      );
  }

  ngOnInit(): void {

    this.startDate = new Date();
    this.diapauseStart = false;

    this.autoStartCtrl = this.fb.control(true);
    this.scheduleCtrl = this.fb.control(false);

    this.diapauseForm = this.fb.group({
      autoStart: this.autoStartCtrl,
      schedule: this.scheduleCtrl,
    });
  }

  saveDiapause(): void {

    const startDate = moment(
      new Date(`${this.startDate.getMonth()}-${this.startDate.getDay()}-${this.startDate.getFullYear()}`)
    );

    const endDate = moment(
      new Date(`${this.endDate.getMonth()}-${this.endDate.getDay()}-${this.endDate.getFullYear()}`)
    );

    console.log(endDate.diff(startDate, 'days'));
    console.log(startDate.diff(endDate, 'days'));


    if ((endDate.diff(startDate, 'days') < 0) && startDate.diff(endDate, 'days') > 0) {
      this.dateCheck = false;
      this.diapauseStart = false;
    } else {
      this.dateCheck = true;

      this.subscription = interval(1000)
      .subscribe(x => { this.getTimeDifference(); });
      this.diapauseStart = true;
    }
  }

  parseDate(dateString: string): Date {
    if (dateString) {
        return new Date(dateString);
    }
    return null;
  }

  switchSchedule() {
    this.schedule = !this.schedule;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

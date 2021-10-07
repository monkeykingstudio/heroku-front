import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { BreedingSheet } from 'src/app/models/breedingSheet.model';
import { DatePipe } from '@angular/common';
import { FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import { DiapauseService } from '../services/diapause.service';
import * as moment from 'moment';
import { Diapause } from './../models/diapause.model';


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

  private subscription: Subscription;
  private loadedSubscription: Subscription;
  public dateNow = new Date();

  diapauseLoaded = false;
  loadedDiapause: Diapause;

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
    if (this.loadedDiapause) {
      this.timeDifference =
      new Date(this.loadedDiapause[0].period.endDate).getTime() - new Date(this.loadedDiapause[0].period.startDate).getTime();

      const hour = new Date(this.loadedDiapause[0].period.endDate).getHours();
      const minutes = new Date(this.loadedDiapause[0].period.endDate).getMinutes();
      const seconds = new Date(this.loadedDiapause[0].period.endDate).getSeconds();

      this.allocateTimeUnits(this.timeDifference);
    }
    else {
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
  }

  private allocateTimeUnits (timeDifference: number) {
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
    this.loadDiapause();
    this.startDate = new Date();
    this.diapauseStart = false;

    this.autoStartCtrl = this.fb.control(true);
    this.scheduleCtrl = this.fb.control(false);

    this.diapauseForm = this.fb.group({
      autoStart: this.autoStartCtrl,
      schedule: this.scheduleCtrl,
    });
  }

  saveDiapause() {
    this.checkDates();
    const diapause: Diapause = {
      period: {
        startDate: this.startDate,
        endDate: this.endDate
      },
      species: this.sheet.species,
      colonyId: this.colonyId,
    };
    return this.diapauseService.diapauseAdd(diapause)
    .subscribe((newDiapause) => {
      console.log(newDiapause);
    });
  }

  loadDiapause() {
    return this.diapauseService.diapauseGet(this.colonyId)
    .subscribe((diapause) => {
      console.log(diapause);
      if (diapause.length === 0) {
        this.diapauseLoaded = false;
      }
      else {
        this.loadedDiapause = diapause;
        this.diapauseLoaded = true;
        this.subscription = interval(1000)
        .subscribe(x => { this.getTimeDifference(); });
        this.diapauseStart = true;
      }

    });
  }

  checkDates() {
    const diffInTime = this.endDate.getTime() - this.startDate.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    console.log(Math.floor(diffInDays));

    if (diffInDays < 0) {
      this.dateCheck = false;
      this.diapauseStart = false;
      return;
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

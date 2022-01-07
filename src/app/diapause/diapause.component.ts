import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { BreedingSheet } from 'src/app/models/breedingSheet.model';
import { DatePipe } from '@angular/common';
import { FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import { DiapauseService } from '../services/diapause.service';
import { Diapause } from './../models/diapause.model';
import { PopupService } from './../services/popup.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-diapause',
  templateUrl: './diapause.component.html',
  styleUrls: ['./diapause.component.scss']
})
export class DiapauseComponent implements OnInit, OnDestroy {
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

  startDate: Date;
  endDate: Date;

  dateCheck = true;

  showCountdown = false;
  ended;
  started;

  activeEmited = false;
  innactiveEmited = false;

  diapauseForm: FormGroup;
  autoStartCtrl: FormControl;
  scheduleCtrl: FormControl;
  currentTemperatureCtrl: FormControl;

  schedule = false;
  diapauseStart = false;
  diapauseLoaded = false;
  loadedDiapause: Diapause;

  temperatureList: Array<object> = [
    {id: 0, valeur: 3},
    {id: 1, valeur: 5},
    {id: 2, valeur: 6},
    {id: 3, valeur: 7},
    {id: 4, valeur: 8},
    {id: 5, valeur: 9},
    {id: 6, valeur: 10},
    {id: 7, valeur: 11},
    {id: 8, valeur: 12},
    {id: 9, valeur: 13},
    {id: 10, valeur: 14},
    {id: 11, valeur: 15},
    {id: 12, valeur: 16},
    {id: 13, valeur: 17},
    {id: 14, valeur: 18},
    {id: 15, valeur: 19},
    {id: 16, valeur: 20},
    {id: 17, valeur: 21},
    {id: 18, valeur: 22},
    {id: 19, valeur: 23},
    {id: 20, valeur: 24},
    {id: 21, valeur: 25},
    {id: 22, valeur: 26},
    {id: 23, valeur: 27},
    {id: 24, valeur: 28},
    {id: 25, valeur: 29},
    {id: 26, valeur: 30},
  ];

  @Input()
  sheet: BreedingSheet;

  @Input()
  colonyId: string;

  @Output()
  diapauseChanged = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    public datepipe: DatePipe,
    public diapauseService: DiapauseService,
    public popupService: PopupService
  ) { }

  public getTimeDifference () {
    if (this.loadedDiapause) {
      this.timeDifference = new Date(this.loadedDiapause[0].period.endDate).getTime() - new Date().getTime();

      const hour = new Date(this.loadedDiapause[0].period.endDate).getHours();
      const minutes = new Date(this.loadedDiapause[0].period.endDate).getMinutes();
      const seconds = new Date(this.loadedDiapause[0].period.endDate).getSeconds();
    }
    else {
      this.timeDifference = this.endDate.getTime() - new Date().getTime();
      const hour = new Date(this.endDate).getHours();
      const minutes = new Date(this.endDate).getMinutes();
      const seconds = new Date(this.endDate).getSeconds();
    }
    this.allocateTimeUnits(this.timeDifference);
    return this.timeDifference;
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
    this.startDate = new Date();
    this.diapauseStart = false;

    this.autoStartCtrl = this.fb.control(true);
    this.scheduleCtrl = this.fb.control(false);
    this.currentTemperatureCtrl = this.fb.control(0);


    this.diapauseForm = this.fb.group({
      autoStart: this.autoStartCtrl,
      schedule: this.scheduleCtrl,
      currentTemperature: this.currentTemperatureCtrl
    });
    this.loadDiapause();
  }

  checkIfCountdown() {
    let startDiff = 0;
    let endDiff = 0;

    if (this.diapauseLoaded) {
      startDiff = new Date(this.loadedDiapause[0].period.startDate).getTime() - new Date().getTime();
      endDiff = new Date(this.loadedDiapause[0].period.endDate).getTime() - new Date().getTime();
    }
    else {
      startDiff = new Date(this.startDate).getTime() - new Date().getTime();
      endDiff = new Date(this.endDate).getTime() - new Date().getTime();
    }
    if (endDiff < 0 && startDiff < 0) {
      this.ended = true;
      if (!this.innactiveEmited) {
        this.emitInnactiveEvent();
        console.log('Inannictvated endDiff < 0');
        this.innactiveEmited = true;
      }

    }
    else {
      this.ended = false;
    }

    if (startDiff >= 0 && endDiff >= 0) {
      this.started = false;
      this.showCountdown = false;

    }
    else {
      this.started = true;
      this.showCountdown = true;
      if (!this.activeEmited) {
        this.emitActiveEvent();
        this.activeEmited = true;
      }
    }
  }

  saveDiapause() {

    const formChanges = this.diapauseForm.value;

    this.checkValidDates();
    const diapause: Diapause = {
      period: {
        startDate: this.startDate,
        endDate: this.endDate
      },
      species: this.sheet.species,
      colonyId: this.colonyId,
      currentTemperature: formChanges.currentTemperature

    };

    if (this.dateCheck) {
      return this.diapauseService.diapauseAdd(diapause)
      .subscribe((newDiapause) => {
        if (this.getTimeDifference() >= 0 ) {
          this.subscription = interval(1000)
          .subscribe(x => {
            this.checkIfCountdown();
            this.getTimeDifference();
          });
        }
      });
    } else {
      return;
    }
  }

  //TODO refacoriser afin que la condition if (diapause.length === 0) devienne diapause.active === true

  loadDiapause() {
    return this.diapauseService.diapauseGet(this.colonyId)
    .subscribe((diapause) => {
      if (diapause.length === 0) {
        this.diapauseLoaded = false;
      }
      else {
        console.log('Diapause Loaded', diapause);
        this.diapauseChanged.emit(true);
        this.loadedDiapause = diapause;
        this.diapauseLoaded = true;

        if (this.getTimeDifference() >= 0 ) {
          this.subscription = interval(1000)
          .subscribe(x => {
            this.checkIfCountdown();
            this.getTimeDifference();
          });
          this.diapauseStart = true;
        }
        else {
          this.ended = true;
          this.emitInnactiveEvent();
          console.log(this.ended);
        }
      }
    });
  }

  deleteDiapause() {
    return this.diapauseService.diapauseDelete(this.colonyId)
    .subscribe((res) => {
      this.emitInnactiveEvent();
      this.ngOnInit();
    });
  }

  //TODO faire en sorte que la diapause change au statut 'innactive' si le compteur est caché.

  archiveDiapause() {
    return this.diapauseService.diapauseArchive(this.colonyId)
    .subscribe((res) => {
      // this.emitInnactiveEvent();
      this.ngOnInit();
    });
  }

  checkValidDates() {
    const start = DateTime.fromISO(this.startDate.toISOString());
    const end = DateTime.fromISO(this.endDate.toISOString());
    const diffInDays = end.diff(start, ['days']);

    if (diffInDays < 0) {
      this.dateCheck = false;
      this.diapauseStart = false;
      return;
    } else {
      this.dateCheck = true;
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

  saveOptions(counter) {
    console.log('save options diapause');
  }

  openPopup(id: string) {
    this.popupService.open(id);
  }

  closePopup(id: string) {
    this.popupService.close(id);
  }

  emitActiveEvent() {
    this.diapauseChanged.emit(true);
  }

  emitInnactiveEvent() {
    this.diapauseChanged.emit(false);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

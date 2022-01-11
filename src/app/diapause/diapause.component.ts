import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription, interval, Subject, Observable } from 'rxjs';
// import { Subject } from 'rxjs';
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
  private diapauseSubject: Subject<Diapause>;
  diapauseLoaded$: Observable<Diapause>;



  public validDiapauseSub: Subscription;


  // startDate: Date;
  // endDate: Date;

  // dateCheck = true;

  // showCountdown = false;
  // ended;
  // started;

  // activeEmited = false;
  // endedEmited = false;
  // innactiveEmited = false;
  // archiveEmited = false;


  // diapauseForm: FormGroup;
  // autoStartCtrl: FormControl;
  // scheduleCtrl: FormControl;
  // currentTemperatureCtrl: FormControl;

  // schedule = false;
  // diapauseStart = false;
  // diapauseLoaded = false;
  // loadedDiapause: Diapause;

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

  @Output()
  diapauseChangeStatus = new EventEmitter<string>();

  constructor(
    public datepipe: DatePipe,
    public diapauseService: DiapauseService
  ) {
    this.diapauseSubject = new Subject<Diapause>();
    this.diapauseLoaded$ = this.diapauseSubject.asObservable();
  }


  ngOnInit(): void {
    // this.startDate = new Date();
    // this.diapauseStart = false;

    this.reloadDiapause();
  }

    // loadDiapause() {
  //   return this.diapauseService.diapauseGet(this.colonyId)
  //   .subscribe((diapause) => {
  //     console.log('debug diapause -->', diapause[0]?.status);

  //     // On peux se permettre de tester sur la length() car il ne peut jamais y avoir plus d'une diapause active ou schedulée !
  //     if (diapause.length === 0) {
  //       this.diapauseLoaded = false;
  //     }
  //     else {
  //       console.log('Diapause Loaded', diapause[0]);
  //       this.loadedDiapause = diapause;
  //       this.diapauseLoaded = true;

  //       if (this.getTimeDifference() >= 0 ) {
  //         this.subscription = interval(1000)
  //         .subscribe(x => {
  //           this.checkIfCountdown();
  //           this.getTimeDifference();
  //         });
  //         this.diapauseStart = true;
  //         this.emitActiveEvent();
  //       }
  //       else {
  //         this.ended = true;
  //         this.emitEndedEvent();
  //       }
  //     }
  //   });
  // }

  reloadDiapause(): void {
    const diapause$ = this.diapauseService.diapauseGet(this.colonyId)
    .subscribe((diapause) => {
      console.log('debug diapause -->', diapause[0]?.status);
    });
  }

  // deleteDiapause() {
  //   return this.diapauseService.diapauseDelete(this.colonyId)
  //   .subscribe((res) => {
  //     this.ngOnInit();
  //     this.switchSchedule();
  //     this.schedule = false;
  //     this.emitInnactiveEvent();
  //   });
  // }


  // archiveDiapause() {
  //   return this.diapauseService.diapauseArchive(this.colonyId, 'archived')
  //   .subscribe((res) => {
  //     this.ngOnInit();
  //     this.emitInnactiveEvent();
  //   });
  // }

  checkIfCountdown() {
    // let startDiff = 0;
    // let endDiff = 0;

    // if (this.diapauseLoaded) {
    //   startDiff = new Date(this.loadedDiapause[0].period.startDate).getTime() - new Date().getTime();
    //   endDiff = new Date(this.loadedDiapause[0].period.endDate).getTime() - new Date().getTime();
    // }
    // else {
    //   startDiff = new Date(this.startDate).getTime() - new Date().getTime();
    //   endDiff = new Date(this.endDate).getTime() - new Date().getTime();
    // }

    // SCHEDULE
    // if (startDiff > 0 && endDiff > 0) {
    //   this.started = false;
    //   this.ended = false;
    //   this.showCountdown = false;
    //   this.emitScheduleEvent();
    // }

    // ACTIVE
    // else if (startDiff <= 0 && endDiff > 0) {
    //   this.started = true;
    //   this.ended = false;
    //   this.showCountdown = true;

    //   if (!this.activeEmited) {
    //     console.log('diapause need to be changed status active please');
    //     this.emitActiveEvent();
    //     this.activeEmited = true;
    //   }
    // }

    // ENDED
    // else if (endDiff < 0 && startDiff < 0) {
    //   this.started = true;
    //   this.ended = true;
    //   this.showCountdown = false;

    //   if (!this.endedEmited) {
    //     console.log('diapause need to be changed status ended please');
    //     this.emitEndedEvent();
    //     this.innactiveEmited = true;
    //   }
    // }
  }

  // saveDiapause() {

  //   const formChanges = this.diapauseForm.value;
  //   let currentStatus: string;
  //   this.checkValidDates();

  //   if (this.schedule) {
  //     currentStatus = 'scheduled';
  //   } else {
  //     currentStatus = 'active';
  //   }

  //   const diapause: Diapause = {
  //     period: {
  //       startDate: this.startDate,
  //       endDate: this.endDate
  //     },
  //     species: this.sheet.species,
  //     colonyId: this.colonyId,
  //     currentTemperature: formChanges.currentTemperature,
  //     status: currentStatus
  //   };

  //   if (this.dateCheck) {
  //     return this.diapauseService.diapauseAdd(diapause)
  //     .subscribe((newDiapause) => {
  //       if (this.getTimeDifference() >= 0 ) {
  //         this.subscription = interval(1000)
  //         .subscribe(x => {
  //           this.checkIfCountdown();
  //           this.getTimeDifference();
  //         });
  //       }
  //     });
  //   } else {
  //     return;
  //   }
  // }

  // loadDiapause() {
  //   return this.diapauseService.diapauseGet(this.colonyId)
  //   .subscribe((diapause) => {
  //     console.log('debug diapause -->', diapause[0]?.status);

  //     // On peux se permettre de tester sur la length() car il ne peut jamais y avoir plus d'une diapause active ou schedulée !
  //     if (diapause.length === 0) {
  //       this.diapauseLoaded = false;
  //     }
  //     else {
  //       console.log('Diapause Loaded', diapause[0]);
  //       this.loadedDiapause = diapause;
  //       this.diapauseLoaded = true;

  //       if (this.getTimeDifference() >= 0 ) {
  //         this.subscription = interval(1000)
  //         .subscribe(x => {
  //           this.checkIfCountdown();
  //           this.getTimeDifference();
  //         });
  //         this.diapauseStart = true;
  //         this.emitActiveEvent();
  //         console.log('from loadDiapuse: diapause status est', this.loadedDiapause[0].status, 'et devrait être au status active ou scheduled');

  //       }
  //       else {
  //         this.ended = true;
  //         this.emitEndedEvent();
  //         console.log('diapause status est', this.loadedDiapause[0].status, 'et devrait être au status ended');
  //       }
  //     }
  //   });
  // }

  // deleteDiapause() {
  //   return this.diapauseService.diapauseDelete(this.colonyId)
  //   .subscribe((res) => {
  //     this.ngOnInit();
  //     this.switchSchedule();
  //     this.schedule = false;
  //     this.emitInnactiveEvent();
  //   });
  // }

  //TODO faire en sorte que la diapause change au statut 'ended' en base a la fin de la diapause.
  // La solution privilegiée etant un job toutes les heures pour verifier si une diapause a une fin de date antérieure à Date.now()
  //TODO faire en sorte que la diapause change au statut 'archived' en base une fois archivée.


  // archiveDiapause() {
  //   return this.diapauseService.diapauseArchive(this.colonyId, 'archived')
  //   .subscribe((res) => {
  //     this.ngOnInit();
  //     this.emitInnactiveEvent();
  //   });
  // }

  // checkValidDates() {
  //   const start = DateTime.fromISO(this.startDate.toISOString());
  //   const end = DateTime.fromISO(this.endDate.toISOString());
  //   const diffInDays = end.diff(start, ['days']);

  //   if (diffInDays < 0) {
  //     this.dateCheck = false;
  //     this.diapauseStart = false;
  //     return;
  //   } else {
  //     this.dateCheck = true;
  //     this.diapauseStart = true;
  //   }
  // }

  parseDate(dateString: string): Date {
    if (dateString) {
        return new Date(dateString);
    }
    return null;
  }

  // switchSchedule() {
  //   this.schedule = !this.schedule;
  // }

  // saveOptions(counter) {
  //   console.log('save options diapause');
  // }


  // emitActiveEvent() {
  //   this.diapauseChangeStatus.emit('active');
  //   this.activeEmited = true;
  // }

  // emitInnactiveEvent() {
  //   this.diapauseChangeStatus.emit('innactive');
  //   this.innactiveEmited = true;
  // }

  // emitEndedEvent() {
  //   this.diapauseChangeStatus.emit('ended');
  //   this.endedEmited = true;
  // }

  // emitScheduleEvent() {
  //   this.diapauseChangeStatus.emit('scheduled');
  // }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

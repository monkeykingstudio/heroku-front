import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Subscription, interval, Subject, Observable } from 'rxjs';
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
export class DiapauseComponent implements OnInit, OnDestroy, AfterViewInit {
  private subscription: Subscription;
  private diapauseSubject: Subject<Diapause>;
  diapauseLoaded: Observable<Diapause[]>;
  diapauseFound: boolean;

  @Input()
  sheet: BreedingSheet;

  @Input()
  colonyId: string;

  @Output()
  diapauseChangeStatus = new EventEmitter<string>();

  status = 'innactive';

  outputStartDate: Date;
  outputEndDate: Date;

  constructor(
    public datepipe: DatePipe,
    public diapauseService: DiapauseService
  ) {}

  ngOnInit(): void {
    this.reloadDiapause();
  }
  ngAfterViewInit(): void {
  }
  changeStatus($event): any {
    console.log('event: ', $event);
    this.status = $event;
    if (this.status === 'archived') {
      this.diapauseChangeStatus.emit('archived');
    }
    console.log('string event', this.status);
    return this.diapauseService.changeStatus(this.colonyId, this.status)
      .subscribe((res) => {
        this.reloadDiapause();
      });
  }
  reloadDiapause(): void {
    const diapause$ = this.diapauseService.diapauseGet(this.colonyId)
    .subscribe((diapause) => {
      if (diapause.length === 0) {
          this.diapauseFound = false;
          this.status = 'innactive';
          console.log('%c status set to innactive: ', 'background: #222; color: #bada55', this.status);
          return;
        }
        else {
          console.log('a diapause is found!', diapause[0]);
          this.diapauseFound = true;
          this.diapauseLoaded = diapause;
          this.status = diapause[0].status;
          if (this.status === 'active') {
            this.diapauseChangeStatus.emit('active');
          }
          else if (this.status === 'scheduled') {
            this.diapauseChangeStatus.emit('scheduled');
          }
          else if (this.status === 'ended') {
            this.diapauseChangeStatus.emit('ended');
          }
        }
    });
  }
  deleteDiapause(): any{
    return this.diapauseService.diapauseDelete(this.colonyId)
    .subscribe((res) => {
      this.reloadDiapause();
      this.diapauseChangeStatus.emit('innactive');
    });
  }

  getEndDate(date: Date): void {
    console.log('from parent endDate: ', date);
    this.outputEndDate = date;
  }

  getStartDate(date: Date): void {
    console.log('from parent StartDate: ', date);
    this.outputStartDate = date;
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

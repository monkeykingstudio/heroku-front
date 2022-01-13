import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Subscription, interval, Observable } from 'rxjs';
import { BreedingSheet } from 'src/app/models/breedingSheet.model';
import { DatePipe } from '@angular/common';
import { DiapauseService } from '../services/diapause.service';
import { Diapause } from './../models/diapause.model';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-diapause',
  templateUrl: './diapause.component.html',
  styleUrls: ['./diapause.component.scss']
})
export class DiapauseComponent implements OnInit, OnDestroy, AfterViewInit {
  private subscription: Subscription;

  diapauseLoaded: Observable<Diapause[]>;
  diapauseFound: boolean;

  @Input()
  sheet: BreedingSheet;

  @Input()
  colonyId: string;

  @Output()
  diapauseChangeStatus = new EventEmitter<string>();

  status = 'innactive';

  // output $event status recuperes depuis les children
  outputStartDate: Date;
  outputEndDate: Date;
  outputSchedule: boolean;

  constructor(
    public datepipe: DatePipe,
    public diapauseService: DiapauseService
  ) {}

  ngOnInit(): void {
    this.reloadDiapause();
  }
  ngAfterViewInit(): void {
  }
  diapauseStart(): void {
    this.checkValidDates();
    let currentStatus: string;
    if (this.getSchedule) {
      console.log('scheduled diapause');
      currentStatus = 'scheduled';
    } else {
      console.log('active diapause');
      currentStatus = 'active';
    }
  }
    checkValidDates(): void {
      // const start = DateTime.fromISO(this.getStartDate.toISOString());
      const start = DateTime.fromISO(this.getStartDate);
      const end = DateTime.fromISO(this.getEndDate);
      const diffInDays = end.diff(start, ['days']);
      console.log('checkValidDates', start, end);
      if (diffInDays < 0) {
        // this.dateCheck = false;
        // this.diapauseStart = false;
        console.log('diff days < 0', diffInDays);
        return;
      } else {
        console.log('diff days > 0', diffInDays);
        // this.dateCheck = true;
        // this.diapauseStart = true;
      }
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

  getSchedule(schedule: boolean): void {
    console.log('from parent schedule: ', schedule);
    this.outputSchedule = schedule;
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


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Subscription, interval, Observable } from 'rxjs';
import { BreedingSheet } from 'src/app/models/breedingSheet.model';
import { DatePipe } from '@angular/common';
import { DiapauseService } from '../services/diapause.service';
import { Diapause } from './../models/diapause.model';
import { DateTime } from 'luxon';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { map } from 'rxjs/operators';
import { SocketioService } from '../services/socketio.service';
import { Notification } from '../models/notification.model';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../services/mail.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-diapause',
  templateUrl: './diapause.component.html',
  styleUrls: ['./diapause.component.scss']
})
export class DiapauseComponent implements OnInit, OnDestroy, AfterViewInit {
  private subscription: Subscription;
  private authStatusSubscription: Subscription;

  user$: Observable<User>;
  currentUser: User;
  diapauseLoaded: Observable<Diapause[]>;
  diapauseFound: boolean;

  @Input()
  sheet: BreedingSheet;

  @Input()
  colonyId: string;

  @Output()
  diapauseChangeStatus = new EventEmitter<string>();

  status = 'innactive';
  checkTemperature = true;

  // output $event status recuperes depuis les children
  outputStartDate: Date;
  outputEndDate: Date;
  outputSchedule: boolean;
  outputStartTemperature: number;
  outputCurrentTemperature: number;

  dateCheck = true;

  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute  = 60;

  public timeDifference;
  public secondsToDday;
  public minutesToDday;
  public hoursToDday;
  public daysToDday;

  // empêcher l'execution dans checkIfCountDown()
  scheduleTriggered = false;
  activeTriggered = false;
  endedTriggered = false;

  constructor(
    public datepipe: DatePipe,
    public diapauseService: DiapauseService,
    public authService: AuthService,
    private socketService: SocketioService,
    private mailService: MailService
  ) {}

  public getTimeDifference(): number {
    if (this.diapauseFound) {
      this.timeDifference = new Date(this.diapauseLoaded[0].period.endDate)?.getTime() - new Date().getTime();

      const hour = new Date(this.diapauseLoaded[0].period.endDate)?.getHours();
      const minutes = new Date(this.diapauseLoaded[0].period.endDate)?.getMinutes();
      const seconds = new Date(this.diapauseLoaded[0].period.endDate)?.getSeconds();
    }
    else {
      this.timeDifference = new Date(this.outputEndDate)?.getTime() - new Date().getTime();
      const hour = new Date(this.outputEndDate)?.getHours();
      const minutes = new Date(this.outputEndDate)?.getMinutes();
      const seconds = new Date(this.outputEndDate)?.getSeconds();
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

  checkIfCountdown() {
    let startDiff = 0;
    let endDiff = 0;

    if (this.diapauseLoaded) {
      startDiff = new Date(this.diapauseLoaded[0].period.startDate).getTime() - new Date().getTime();
      endDiff = new Date(this.diapauseLoaded[0].period.endDate).getTime() - new Date().getTime();
    }
    else {
      startDiff = new Date(this.outputStartDate).getTime() - new Date().getTime();
      endDiff = new Date(this.outputEndDate).getTime() - new Date().getTime();
    }

    // SCHEDULE
    if (startDiff > 0 && endDiff > 0 && !this.scheduleTriggered) {
      console.log('schedule!!!!');
      this.scheduleTriggered = true;
    }

    // ACTIVE
    else if (startDiff <= 0 && endDiff > 0 && !this.activeTriggered) {
      console.log('active!!!!');
      this.changeStatus('active');
      this.activeTriggered = true;
    }

    // ENDED
    else if (endDiff <= 0 && startDiff <= 0 && !this.endedTriggered) {
      console.log('ended!!!!');
      this.changeStatus('ended');
      this.endedTriggered = true;
      // On re initialise pour ne pas empêcher une autre diapause sans refresh de la page
      this.scheduleTriggered = false;
      this.activeTriggered = false;
    }
  }

  ngOnInit(): void {
    this.authStatusSubscription = this.authService.currentUser.pipe(
      map(user => {
        if (user) {
          this.currentUser = user;
        }
      })
      ).subscribe();
    this.reloadDiapause();
  }

  ngAfterViewInit(): void {

  }

  closeEndedSaw(): void {
    this.diapauseService.endedSaw(this.colonyId, true)
    .subscribe(() => {
      this.reloadDiapause();
    });
  }

  diapauseStart(): any {
    this.checkValidDates();
    let currentStatus: string;

    if (this.outputStartTemperature === undefined) {
      this.outputStartTemperature = this.sheet?.diapauseTemperature[0]?.diapauseTemperatureStart;
    }

    if (this.outputSchedule) {
      console.log('scheduled diapause');
      currentStatus = 'scheduled';
    } else {
      console.log('active diapause');
      currentStatus = 'active';
    }

    const dataNotification: Notification = {
      senderId: this.currentUser?._id,
      senderPseudo: this.currentUser?.pseudo,
      message: `a diapause for species ${this.sheet.species} have been created by ${this.currentUser?.pseudo}`,
      createdAt: new Date(),
      type: 'admin',
      subType: 'diapause',
      url: `/colonies/${this.colonyId}`,
      socketRef: uuidv4()
    };

    const newDiapause: Diapause = {
      period: {
        startDate: this.outputStartDate,
        endDate: this.outputEndDate
      },
      species: this.sheet.species,
      colonyId: this.colonyId,
      startTemperature: this.outputStartTemperature,
      currentTemperature: [
        {
          date: this.outputStartDate,
          temperature: this.outputStartTemperature
        }
      ],
      status: currentStatus,
      creatorId: this.currentUser?._id,
      creatorPseudo: this.currentUser?.pseudo,
      creatorEmail: this.currentUser?.email,
      socketRef: dataNotification.socketRef
    };
    if (this.dateCheck) {
      return this.diapauseService.diapauseAdd(newDiapause)
      .subscribe((diapause) => {
        if (this.getTimeDifference() >= 0 ) {
          this.subscription = interval(1000)
          .subscribe(x => {
            this.checkIfCountdown();
            this.getTimeDifference();
          });
        }
        this.socketService.sendNotification(dataNotification);
        this.reloadDiapause();
        // On démarre un nouvelle diapause donc on dévérouille la désactivation du boolean
        this.endedTriggered = false;
      });
    }
  }
  checkValidDates(): void {
    if (this.outputSchedule) {
      const start = DateTime.fromISO(this.outputStartDate);
      const end = DateTime.fromISO(this.outputEndDate);
      const diffInDays = end.diff(start, ['days']);

      if (diffInDays < 0) {
        this.dateCheck = false;
        console.log('diff < 0', diffInDays);
        return;
      } else {
        this.dateCheck = true;
        console.log('diff > 0', diffInDays);
      }
    }
  }
  changeStatus($event): any {
    console.log('event: ', $event);
    this.status = $event;
    if (this.status === 'archived') {
      this.diapauseChangeStatus.emit('archived');
    }
    else if (this.status === 'active') {
      this.diapauseChangeStatus.emit('active');
    }
    else if (this.status === 'ended') {
      this.diapauseChangeStatus.emit('ended');
      const userEmail = this.diapauseLoaded[0]?.creatorEmail;
      const userPseudo = this.diapauseLoaded[0]?.creatorPseudo;
      const species = this.diapauseLoaded[0]?.species;

      this.mailService.sendDiapauseEmail(`${environment.APIEndpoint}/api/mail/diapauseend`, {userEmail, userPseudo, species})
      .subscribe(data => {
        console.log(`mail is sent for diapause status ended`);
        const dataNotification: Notification = {
          senderId: '007',
          senderPseudo: 'fourmislabs bot',
          createdAt: new Date(Date.now()),
          recieverId: this.diapauseLoaded[0]?.creatorId,
          message: `a diapause for species ${this.diapauseLoaded[0]?.species} has come to an end at:  ${this.diapauseLoaded[0]?.period.endDate}`,
          type: 'private',
          subType: 'diapause',
          socketRef: this.diapauseLoaded[0]?.socketRef,
          url: `/${ this.diapauseLoaded[0]?.colonyId}/${ this.diapauseLoaded[0]?.species?.toLowerCase()}`
        };
        this.socketService.sendNotification(dataNotification);
        console.log('a notif socket has been sent', dataNotification);
      },
      err => {
        console.log('error mail: ', err);
      }, () => {
        console.log('mail is sent!');
      });
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

      if (this.getTimeDifference() >= 0 ) {
        this.subscription = interval(1000)
        .subscribe(x => {
          this.checkIfCountdown();
          this.getTimeDifference();
        });
        // this.emitActiveEvent();
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

  getStartTemperature(temperature: number): void {
    console.log('from parent start temperature: ', temperature);
    this.outputStartTemperature = temperature;
  }

  getCurrentTemperature(temperature: number): void {
    console.log('from parent current temperature: ', temperature);
    this.outputCurrentTemperature = temperature;
  }

  updateCurrentTemperature() {
    if (this.outputCurrentTemperature === undefined) {
      this.outputCurrentTemperature = this.sheet?.diapauseTemperature[0]?.diapauseTemperatureStart;
    }
    if (Number(this.outputCurrentTemperature) === Number(this.diapauseLoaded[0].startTemperature)) {
      console.log('no ok', Number(this.outputCurrentTemperature), Number(this.diapauseLoaded[0].startTemperature));
      this.checkTemperature = false;
    }
    else {
      this.diapauseService.diapauseUpdate(this.colonyId, this.outputCurrentTemperature)
      .subscribe(() => {
        console.log('ok');
        this.checkTemperature = true;
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.authStatusSubscription.unsubscribe();
  }
}

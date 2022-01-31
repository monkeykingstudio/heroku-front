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
import {Chart} from 'chart.js';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-diapause',
  templateUrl: './diapause.component.html',
  styleUrls: ['./diapause.component.scss']
})
export class DiapauseComponent implements OnInit, OnDestroy, AfterViewInit {
  public diapauseData = [];
  public diapauseDataStart = [];
  public diapauseDataEnd = [];

  public chartDataStart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  public chartDataEnd =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  barChartData: ChartDataSets[] = [
    {
      data: this.chartDataStart,
      label: 'Start month'
    },
    {
      data: this.chartDataEnd,
      label: 'End month'
    }
  ];
  barChartLabels: Label[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  barChartOptions = {
    responsive: true,
  };
  barChartColors: Color[] = [
    {
      borderColor: 'rgb(31 31 31)',
      backgroundColor: 'rgb(99 215 69)',
    },
    {
      borderColor: 'rgb(31 31 31)',
      backgroundColor: 'rgb(170 43 30)',
    },
  ];
  barChartLegend = true;
  barChartPlugins = [];
  barChartType = 'horizontalBar';
  // end stats
  allDiapauses: Observable<Diapause[]>;


  private subscription: Subscription;
  private authStatusSubscription: Subscription;
  private chartStartSub: Subscription;
  private chartEndSub: Subscription;

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

  tempIndex;

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
    public diapauseService: DiapauseService,
    public authService: AuthService,
    private socketService: SocketioService,
    private mailService: MailService,
    private datePipe: DatePipe,
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
      this.scheduleTriggered = true;
    }

    // ACTIVE
    else if (startDiff <= 0 && endDiff > 0 && !this.activeTriggered) {
      this.changeStatus('active');
      this.activeTriggered = true;
    }

    // ENDED
    else if (endDiff <= 0 && startDiff <= 0 && !this.endedTriggered) {
      this.changeStatus('ended');
      this.endedTriggered = true;
      // On re initialise pour ne pas empêcher une autre diapause sans refresh de la page
      this.scheduleTriggered = false;
      this.activeTriggered = false;
    }
  }

  ngOnInit(): void {
    this.reloadAllDiapauses();
    this.reloadDiapause();
    // current user
    this.authStatusSubscription = this.authService.currentUser.pipe(
      map(user => {
        if (user) {
          this.currentUser = user;
        }
      })
      ).subscribe();
    // this.initDiapauseChart();

  }

  ngAfterViewInit(): void {
    this.initStartChart();
    this.initEndChart();
  }

  // CHARTS LOGIC
  initStartChart(): void {
    this.chartStartSub = this.allDiapauses
    .pipe(
      map(diapauses => diapauses
        .map((diapause: any) => diapause.period.startDate))
    )
    .subscribe((res) => {
      for (const item of res) {
        this.diapauseDataStart.push({
          start: {month: this.datePipe.transform(item, 'dd-MM-YYY')}
        });
      }
      console.log('start inited', this.diapauseDataStart);
      this.computeStartData();
      this.dispatchStartData();
    });
  }

  initEndChart(): void {
    this.chartEndSub = this.allDiapauses
    .pipe(
      map(diapauses => diapauses
        .map((diapause: any) => diapause.period.endDate))
    )
    .subscribe((res) => {
      for (const item of res) {
        this.diapauseDataEnd.push({
          end: {month: this.datePipe.transform(item, 'dd-MM-YYY')}
        });
      }
      console.log('end inited', this.diapauseDataEnd);
      this.computeEndData();
      this.dispatchEndData();
    });
  }

  computeStartData(): void{
    const startgroups = this.diapauseDataStart
    .reduce((r, o) => {
      const m = o.start.month.split(('-'))[1];
      (r[m])
      ? r[m].data.push(o.start)
      : r[m] = {group: Number(m), data: [o.start]};
      return r;
    }, {});
    const startResult = Object.keys(startgroups)
    .map((k) => startgroups[k]);
    this.diapauseDataStart = startResult;
    console.log('computed start', this.diapauseDataStart);
  }

  computeEndData(): void {
    const endgroups = this.diapauseDataEnd
    .reduce((r, o) => {
      const m = o.end.month.split(('-'))[1];
      (r[m])
      ? r[m].data.push(o.end)
      : r[m] = {group: Number(m), data: [o.end]};
      return r;
    }, {});
    const endResult = Object.keys(endgroups)
    .map((k) => endgroups[k]);
    this.diapauseDataEnd = endResult;
    console.log('computed end', this.diapauseDataEnd);
  }


  dispatchStartData() {
    this.diapauseDataStart.forEach((group, index) => {
      this.chartDataStart.splice(group.group - 1, 1, group.data.length);
    });
    console.log('dispatched start data: ', this.chartDataStart);
  }

  dispatchEndData() {
    this.diapauseDataEnd.forEach((group, index) => {
      this.chartDataEnd.splice(group.group - 1, 1, group.data.length);
    });
    console.log('dispatched end data: ', this.chartDataEnd);
  }

// END CHARTS LOGIC

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
      // console.log('scheduled diapause');
      currentStatus = 'scheduled';
    } else {
      // console.log('active diapause');
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
        // console.log('diff < 0', diffInDays);
        return;
      } else {
        this.dateCheck = true;
        // console.log('diff > 0', diffInDays);
      }
    }
  }
  changeStatus($event): any {
    // console.log('event: ', $event);
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
        // console.log(`mail is sent for diapause status ended`);
        const dataNotification: Notification = {
          senderId: 'frontend',
          senderPseudo: 'fourmislabs bot',
          createdAt: new Date(Date.now()),
          recieverId: this.diapauseLoaded[0]?.creatorId,
          message: `a diapause for species ${this.diapauseLoaded[0]?.species} has come to an end at:  ${this.diapauseLoaded[0]?.period.endDate}`,
          type: 'private',
          subType: 'diapause',
          socketRef: `${this.diapauseLoaded[0]?.socketRef}end`,
          url: `/${ this.diapauseLoaded[0]?.colonyId}/${ this.diapauseLoaded[0]?.species?.toLowerCase()}`
        };
        this.socketService.sendNotification(dataNotification);
        // console.log('a notif socket has been sent', dataNotification);
      },
      err => {
        console.log('error mail: ', err);
      }, () => {
        console.log('mail is sent!');
      });
    }
    // console.log('string event', this.status);
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
          // console.log('a diapause is found!', diapause[0]);
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

  reloadAllDiapauses(): void {
    const diapauses$ = this.diapauseService.getDiapauses(this.sheet.species);
    this.allDiapauses = diapauses$;
  }
  deleteDiapause(): any{
    return this.diapauseService.diapauseDelete(this.colonyId)
    .subscribe((res) => {
      this.reloadDiapause();
      this.diapauseChangeStatus.emit('innactive');
    });
  }

  getEndDate(date: Date): void {
    this.outputEndDate = date;
  }

  getStartDate(date: Date): void {
    this.outputStartDate = date;
  }

  getSchedule(schedule: boolean): void {
    this.outputSchedule = schedule;
  }

  getStartTemperature(temperature: number): void {
    this.outputStartTemperature = temperature;
  }

  getCurrentTemperature(temperature: number): void {
    this.outputCurrentTemperature = temperature;
  }
  updateCurrentTemperature(): void {
    this.tempIndex = this.diapauseLoaded[0].currentTemperature.length - 1;
    console.log('temp index', this.tempIndex);

    // Si undefinded et currentemperature chargee
    if (this.outputCurrentTemperature === undefined && this.tempIndex !== -1) {
      this.outputCurrentTemperature = this.sheet?.diapauseTemperature[0].diapauseTemperatureStart;
    }
    // Si undefinded et pas de currentemperature chargee
    else if (this.outputCurrentTemperature === undefined && this.tempIndex === -1) {
      // this.outputCurrentTemperature = this.diapauseLoaded[0].currentTemperature[this.tempIndex].temperature; faux!!!
      console.log('output after undefined: ', this.outputCurrentTemperature);
    }
    console.log('Output temperature', this.outputCurrentTemperature);
    console.log('loaded temperature', Number(this.diapauseLoaded[0].currentTemperature.length)); // si on a length 0 --> ??? ;)


    // this.diapauseService.diapauseUpdate(this.colonyId, this.outputCurrentTemperature)
    // .subscribe(() => {
    //   console.log('ok');
    //   this.checkTemperature = true;
    // });



  //   if (
  //   Number(this.outputCurrentTemperature)
  //   ===
  //   Number(this.diapauseLoaded[0].currentTemperature[this.tempIndex].temperature)) {
  //   console.log('no ok',
  //   Number(this.outputCurrentTemperature),
  //   Number(this.diapauseLoaded[0].currentTemperature[this.tempIndex].temperature));
  //   this.checkTemperature = false;
  // }

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.authStatusSubscription.unsubscribe();
  }
}

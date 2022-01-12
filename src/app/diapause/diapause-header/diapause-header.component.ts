import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { PopupService } from '../../services/popup.service';
import { DiapauseService } from '../../services/diapause.service';


@Component({
  selector: 'app-diapause-header',
  templateUrl: './diapause-header.component.html',
  styleUrls: ['./diapause-header.component.scss']
})
export class DiapauseHeaderComponent implements OnInit {
  @Input()
  status;

  @Input()
  colonyId: string;

  @Output()
  reloadDiapause: EventEmitter<any> = new EventEmitter();

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

  constructor(
    public popupService: PopupService,
    public diapauseService: DiapauseService
  ) { }

  ngOnInit(): void {
  }

  // changeDiapauseStatus(status: string) {
  //   return this.diapauseService.changeStatus(this.colonyId, status)
  //     .subscribe((res) => {
  //       this.reloadDiapause.emit();
  //     });
  // }
  // public getTimeDifference () {
  //   if (this.loadedDiapause) {
  //     this.timeDifference = new Date(this.loadedDiapause[0].period.endDate).getTime() - new Date().getTime();

  //     const hour = new Date(this.loadedDiapause[0].period.endDate).getHours();
  //     const minutes = new Date(this.loadedDiapause[0].period.endDate).getMinutes();
  //     const seconds = new Date(this.loadedDiapause[0].period.endDate).getSeconds();
  //   }
  //   else {
  //     this.timeDifference = this.endDate.getTime() - new Date().getTime();
  //     const hour = new Date(this.endDate).getHours();
  //     const minutes = new Date(this.endDate).getMinutes();
  //     const seconds = new Date(this.endDate).getSeconds();
  //   }
  //   this.allocateTimeUnits(this.timeDifference);
  //   return this.timeDifference;
  // }

  // private allocateTimeUnits (timeDifference: number) {
  //   this.secondsToDday = Math.floor(
  //     (timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute
  //     );
  //   this.minutesToDday = Math.floor(
  //     (timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute
  //   );
  //   this.hoursToDday = Math.floor(
  //     (timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay
  //     );
  //   this.daysToDday = Math.floor(
  //     (timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay)
  //     );
  // }


  openPopup(id: string) {
    this.popupService.open(id);
  }

  closePopup(id: string) {
    this.popupService.close(id);
  }

}

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
  secondsToDday;
  @Input()
  minutesToDday;
  @Input()
  hoursToDday;
  @Input()
  daysToDday;

  @Input()
  colonyId: string;

  @Output()
  reloadDiapause: EventEmitter<any> = new EventEmitter();

  public dateNow = new Date();

  constructor(
    public popupService: PopupService,
    public diapauseService: DiapauseService
  ) { }

  ngOnInit(): void {
  }

  openPopup(id: string) {
    this.popupService.open(id);
  }

  closePopup(id: string) {
    this.popupService.close(id);
  }

}

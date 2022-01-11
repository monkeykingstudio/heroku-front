import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { PopupService } from '../../services/popup.service';
import { DiapauseService } from '../../services/diapause.service';

@Component({
  selector: 'app-diapause-buttons',
  templateUrl: './diapause-buttons.component.html',
  styleUrls: ['./diapause-buttons.component.scss']
})
export class DiapauseButtonsComponent implements OnInit {
  @Output()
  reloadDiapause: EventEmitter<any> = new EventEmitter();

  @Input()
  colonyId: string;

  @Output()
  diapauseChangeStatus = new EventEmitter<string>();

  constructor(
    public popupService: PopupService,
    public diapauseService: DiapauseService
  ) { }

  ngOnInit(): void {

  }

  changeStatusArchived(): void {
    this.diapauseChangeStatus.emit('archived');
  }


  openPopup(id: string): void {
    this.popupService.open(id);
  }

  closePopup(id: string): void {
    this.popupService.close(id);
  }
}

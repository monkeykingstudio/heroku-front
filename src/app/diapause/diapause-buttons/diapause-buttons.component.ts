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

  @Input()
  endDate: Date;

  @Input()
  status: string;

  @Input()
  diapauseFound: string;

  @Input()
  outputStartDate: Date;

  @Input()
  outputEndDate: Date;

  @Output()
  diapauseChangeStatus = new EventEmitter<string>();

  @Output()
  deleteDiapause = new EventEmitter();

  constructor(
    public popupService: PopupService,
    public diapauseService: DiapauseService
  ) { }

  ngOnInit(): void {
  }

  changeStatusArchived(): void {
    this.diapauseChangeStatus.emit('archived');
  }

  deleteCurrentDiapause(): void {
    this.deleteDiapause.emit();
  }

  openPopup(id: string): void {
    this.popupService.open(id);
  }

  closePopup(id: string): void {
    this.popupService.close(id);
  }
}

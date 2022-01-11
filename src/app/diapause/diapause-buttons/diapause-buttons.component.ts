import { Component, OnInit } from '@angular/core';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-diapause-buttons',
  templateUrl: './diapause-buttons.component.html',
  styleUrls: ['./diapause-buttons.component.scss']
})
export class DiapauseButtonsComponent implements OnInit {

  constructor(
    public popupService: PopupService
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

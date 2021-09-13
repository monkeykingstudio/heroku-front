import { Component, OnInit } from '@angular/core';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  showYoutube: boolean = false;

  bigFirst = false;

  data: string;

  firstPrice: Array<string> = [
    '../icons/concours/honey-big.jpg',
    '../icons/concours/honey-1.jpg',
    '../icons/concours/honey-2.jpg',
    '../icons/concours/honey-3.jpg',
  ];

  secondPrice: Array<string> = [
    '../icons/concours/minora-big.jpg',
    '../icons/concours/minora-1.jpg',
    '../icons/concours/minora-2.jpg',
    '../icons/concours/minora-3.jpg',
  ];

  thirdPrice: Array<string> = [
    '../icons/concours/pack-big.jpg',
    '../icons/concours/pack-1.jpg',
    '../icons/concours/pack-2.jpg',
    '../icons/concours/pack-3.jpg',
  ];


  constructor(public popupService: PopupService) { }

  ngOnInit(): void {
  }

  scrollDown(): void {
    window.scrollTo(0, document.body.scrollHeight);
  }

  openPopup(id: string, img: string): void {
    this.popupService.open(id);
    this.data = img;
    console.log(this.data);
  }

  closePopup(id: string): void {
    this.popupService.close(id);
  }

}

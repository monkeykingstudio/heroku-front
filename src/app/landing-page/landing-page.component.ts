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
    '../../assets/concours/honey-big.jpg',
    '../../assets/concours/honey-1.jpg',
    '../../assets/concours/honey-2.jpg',
    '../../assets/concours/honey-3.jpg',
  ];

  secondPrice: Array<string> = [
    '../../assets/concours/minora-big.jpg',
    '../../assets/concours/minora-1.jpg',
    '../../assets/concours/minora-2.jpg',
    '../../assets/concours/minora-3.jpg',
  ];

  thirdPrice: Array<string> = [
    '../../assets/concours/pack-big.png',
    '../../assets/concours/pack-1.jpg',
    '../../assets/concours/pack-2.jpg',
    '../../assets/concours/pack-3.jpg',
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

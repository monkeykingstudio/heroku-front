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
    'honey-big.jpg',
    'honey-1.jpg',
    'honey-2.jpg',
    'honey-3.jpg',
  ];

  secondPrice: Array<string> = [
    'minora-big.jpg',
    'minora-1.jpg',
    'minora-2.jpg',
    'minora-3.jpg',
  ];

  thirdPrice: Array<string> = [
    'pack-big.jpg',
    'pack-1.jpg',
    'pack-2.jpg',
    'pack-3.jpg',
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

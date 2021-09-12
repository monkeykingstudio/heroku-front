import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  showYoutube: boolean = false;

  showFirstBigPopup: boolean = false;
  showFirstOnePopup: boolean = false;
  showFirstTwoPopup: boolean = false;
  showFirstThreePopup: boolean = false;

  showSecondBigPopup: boolean = false;
  showSecondOnePopup: boolean = false;
  showSecondTwoPopup: boolean = false;
  showSecondThreePopup: boolean = false;

  showThirdBigPopup: boolean = false;
  showThirdOnePopup: boolean = false;
  showThirdTwoPopup: boolean = false;
  showThirdThreePopup: boolean = false;


  constructor() { }

  ngOnInit(): void {
  }

  scrollDown(): void {
    window.scrollTo(0, document.body.scrollHeight);
  }

  // ONE

  displayFirstBigPopup() {

  }

  displayFirstOnePopup() {

  }

  displayFirstTwoPopup() {

  }

  displayFirstThreePopup() {

  }

 // SECOND

  displaySecondBigPopup() {

  }

  displaySecondOnePopup() {

  }

  displaySecondTwoPopup() {

  }

  displaySecondThreePopup() {

  }

 // THIRD

  displayThirdBigPopup() {

  }

  displayThirdOnePopup() {

  }

  displayThirdTwoPopup() {

  }

  displayThirdThreePopup() {

  }

}

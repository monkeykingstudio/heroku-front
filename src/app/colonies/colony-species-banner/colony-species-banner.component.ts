import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-colony-species-banner',
  templateUrl: './colony-species-banner.component.html',
  styleUrls: ['./colony-species-banner.component.scss']
})
export class ColonySpeciesBannerComponent implements OnInit {
  @Input()
  breedSheet;
  constructor() { }

  ngOnInit(): void {
    console.log(this.breedSheet);
  }

}

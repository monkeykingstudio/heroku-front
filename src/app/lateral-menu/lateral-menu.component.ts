import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-lateral-menu',
  templateUrl: './lateral-menu.component.html',
  styleUrls: ['./lateral-menu.component.scss']
})
export class LateralMenuComponent implements OnInit {
  @Input()
  hoverStatus;

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from './../services/auth.service';

@Component({
  selector: 'app-lateral-menu',
  templateUrl: './lateral-menu.component.html',
  styleUrls: ['./lateral-menu.component.scss']
})
export class LateralMenuComponent implements OnInit {
  @Input()
  hoverStatus;
  @Input()
  isUser;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  onLogout() {
    this.authService.logout();
  }

}

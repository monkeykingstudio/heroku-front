import { UsersService } from './../services/user.service';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  allUsers$: Observable<User[]>;
  onlineUsers$: Observable<User[]>;

  height: number;
  width: number;
  @ViewChild('element', {read: ElementRef, static: false}) elementView: ElementRef;
  @ViewChild('same', {read: ElementRef, static: false}) elementSameView: ElementRef;
  @ViewChild('secondsame', {read: ElementRef, static: false}) elementSecondSameView: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resize();
  }


  constructor(
    public usersService: UsersService,
    public router: Router
    ) { }

  ngOnInit(): void {
    this.reloadUsers();
    this.reloadOnlineUsers();
  }

  reloadUsers(): void {
    const users$ = this.usersService.usersGet();
    this.allUsers$ = users$;
  }

  reloadOnlineUsers() {
    this.onlineUsers$ = this.allUsers$
    .pipe(
      map(users => users
        .filter(user => user.isConnected === true))
    );
  }

  ngAfterViewInit() {
    this.resize();
  }

  resize() {
    this.width = this.elementView.nativeElement.offsetWidth;
    if (this.width < 200) {
      return;
    } else {
      this.height = this.elementView.nativeElement.offsetHeight;
      this.elementSameView.nativeElement.style.height = this.height + 'px';
      this.elementSecondSameView.nativeElement.style.height = this.height + 'px';
    }
  }

  goBreedSheet() {
    this.router.navigate(['/breedsheetcreator']);
  }

  goDiscord() {
    window.open('https://discord.gg/yT3349Xt6v', '_blank');
  }
}

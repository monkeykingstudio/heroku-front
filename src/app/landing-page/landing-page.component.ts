import { Component, OnInit, OnDestroy } from '@angular/core';
import { PopupService } from '../services/popup.service';
import { ConcoursService } from '../services/concours.service';
import { UsersService } from '../services/user.service';
import { Observable, Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, OnDestroy {
  allRegisteredUsers$: Observable<any[]>;
  usersList: any[] = [];

  facebookForm: FormGroup;


  private authStatusSubscription: Subscription;
  currentUser: User;
  registered: boolean = false;
  showYoutube: boolean = false;

  fb: boolean = false;

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

  constructor(
    public popupService: PopupService,
    public concoursService: ConcoursService,
    public usersService: UsersService,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    ) { }

  ngOnInit(): void {

    this.facebookForm = this.formBuilder.group({
      prenom: ['', [Validators.required]],
      nom: ['', Validators.required]
    });

    this.authStatusSubscription = this.authService.currentUser.pipe(
      map(user => {
        if (user) {
          this.currentUser = user;
        }
      })
      ).subscribe();
    this.reloadRegisteredUsers();
  }

  async reloadRegisteredUsers() {
    const users$ = await this.concoursService.usersGet()
    // this.allRegisteredUsers$ = users$
    .subscribe((users) => {
      console.log('registered', this.registered);
      this.usersList = users;
      if (this.userExists(this.currentUser.email)) {
        this.registered = true;
      }
    });
  }

  userExists(user: string) {
    return this.usersList.some((el) => {
      return el.email === user;
    });
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

  registerConcours(): void {
    console.log(this.usersList);
    this.concoursService.userAdd(this.currentUser.email)
    .subscribe(() => {
      this.ngOnInit();
    });
  }

  facebook(): void {
    console.log(this.usersList);
    console.log('component', this.formControls.prenom.value, this.formControls.nom.value);
    this.concoursService.facebookAdd(this.formControls.prenom.value, this.formControls.nom.value)
    .subscribe(() => {
      this.ngOnInit();
    });
  }

  facebookOk() {
    this.fb = true;
  }

  get formControls() { return this.facebookForm.controls; }


  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, Validators, FormControl, Form } from '@angular/forms';
import { BreedingSheet } from './../models/breedingSheet.model';
import { BreedingSheetsService } from './../services/breedingSheetsService';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs/operators';
// import { PopupService } from '../services/popup.service';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-breed-sheet-viewer',
  templateUrl: './breed-sheet-viewer.component.html',
  styleUrls: ['./breed-sheet-viewer.component.scss']
})
export class BreedSheetViewerComponent implements OnInit, OnDestroy {
  public authStatusSubscription: Subscription;
  currentUser: User;

  foodForm: FormGroup;

  breedingSheet$: Observable<BreedingSheet>;
  private sheetId: string;
  private breedingSheetSub: Subscription;
  breedSheet: BreedingSheet;

  public gynePictures = [];
  public actualGynePicture;
  changeGyneCounter = 0;

  public pictures = [];
  public actualPicture;
  changeCounter = 0;

  private interval;

  popupOpen = false;
  errorFood = false;

  foodList: Array<object> = [
    {id: 0, valeur: 'insects'},
    {id: 1, valeur: 'meat'},
    {id: 2, valeur: 'sugar water'},
    {id: 3, valeur: 'fruits'},
    {id: 4, valeur: 'seeds'},
    {id: 5, valeur: 'honeydew'},
    {id: 6, valeur: 'ant bread'},
    {id: 7, valeur: 'mushrooms'},
  ];

  get formControls() { return this.foodForm.controls; }
  get foodOne() { return this.foodForm.controls['foodOne']; }
  get foodTwo() { return this.foodForm.controls['foodTwo']; }
  get foodThree() { return this.foodForm.controls['foodThree']; }


  constructor(
    public breedingSheetsService: BreedingSheetsService,
    public route: ActivatedRoute,
    // public popupService: PopupService,
    public authService: AuthService
  )
  {
    this.prepareFood();
  }

  ngOnInit(): void {
    this.authStatusSubscription = this.authService.currentUser
    .pipe(
      map(user => {
        if (user) {
          this.currentUser = user;
        }
      })
      ).subscribe();

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('sheetId')) {
        this.sheetId = paramMap.get('sheetId');
        this.loadSheet(this.sheetId);
      }
    });

    this.breedingSheet$.pipe(
      map((sheet) => {
      this.breedingSheetSub = this.breedingSheetsService.getSheet(sheet.species)
      .subscribe((sheet) => {
        this.breedSheet = sheet;
        this.loadGynePictures();
        this.loadPictures();
        this.switchGynePicture();
        this.switchPicture();
      });
    })).subscribe();
  }

  loadSheet(species: string): Observable<BreedingSheet> {
    console.log(`loading breedingsheet with species: ${species}`);
    return this.breedingSheet$ = this.breedingSheetsService.getSheet(species);
  }

  loadGynePictures() {
    for (const pic of this.breedSheet?.gynePictures) {
      this.gynePictures.push(pic);
    }
  }

  switchGynePicture() {
    this.actualGynePicture = this.gynePictures[0];
    this.interval = setInterval(() => {
      console.log(this.actualGynePicture);
      this.changeGyneCounter++;
      if (this.changeGyneCounter > this.gynePictures.length - 1) {
        this.changeGyneCounter = 0;
      }
      this.actualGynePicture = this.gynePictures[this.changeGyneCounter];
    }, 5000);
  }

  switchPicture() {
    this.actualPicture = this.pictures[0];
    this.interval = setInterval(() => {
      console.log(this.actualPicture);
      this.changeCounter++;
      if (this.changeCounter > this.pictures.length - 1) {
        this.changeCounter = 0;
      }
      this.actualPicture = this.pictures[this.changeCounter];
    }, 5000);
  }

  loadPictures() {
    for (const pic of this.breedSheet?.pictures) {
      this.pictures.push(pic);
    }
  }

  edit() {
    console.log('test');
  }

  saveFood(food: Form) {
    if (
      this.foodOne.value === this.foodTwo.value ||
      this.foodOne.value === this.foodThree.value ||
      this.foodTwo.value === this.foodThree.value
      ) {
      this.errorFood = true;
    } else {
      console.log(this.foodForm);
      this.popupOpen = false;
    }

  }

  private prepareFood() {
    this.foodForm = new FormGroup({
      foodOne: new FormControl(this.breedSheet?.foods[0], {validators: [Validators.required]}),
      foodTwo: new FormControl(this.breedSheet?.foods[1], {validators: [Validators.required]}),
      foodThree: new FormControl(this.breedSheet?.foods[2], {validators: [Validators.required]})
    });


    console.log(this.foodForm);
  }

  // Popup control
  openPopup() {
    this.popupOpen = true;
  }

  closePopup() {
    this.popupOpen = false;
  }

  ngOnDestroy() {
    this.breedingSheetSub.unsubscribe();
    clearInterval(this.interval);
  }

}

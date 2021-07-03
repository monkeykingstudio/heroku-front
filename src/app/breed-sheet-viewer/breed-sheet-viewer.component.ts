import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, Validators, FormControl, Form } from '@angular/forms';
import { BreedingSheet } from './../models/breedingSheet.model';
import { BreedingSheetsService } from './../services/breedingSheetsService';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs/operators';
import { PopupService } from '../services/popup.service';
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

  foodList: Array<object> = [
    {id: 0, valeur: 'insects'},
    {id: 1, valeur: 'meat'},
    {id: 2, valeur: 'sugar water'},
    {id: 3, valeur: 'fruits'},
    {id: 4, valeur: 'seeds'}
  ];

  get formControls() { return this.foodForm.controls; }

  constructor(
    public breedingSheetsService: BreedingSheetsService,
    public route: ActivatedRoute,
    public popupService: PopupService,
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
    console.log(this.foodForm);
  }

  private prepareFood() {
    this.foodForm = new FormGroup({
      genre: new FormControl(null, {validators: [Validators.required]}),
    });


    console.log(this.foodForm);
  }

  // Popup control
  openPopup(id: string) {
    this.popupService.open(id);
  }

  closePopup(id: string) {
    this.popupService.close(id);
  }

  ngOnDestroy() {
    this.breedingSheetSub.unsubscribe();
    clearInterval(this.interval);
  }

}

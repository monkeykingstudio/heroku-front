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
  diapauseForm: FormGroup;
  geographyForm: FormGroup;
  behaviorForm: FormGroup;
  morphismForm: FormGroup;
  characteristicsForm: FormGroup;

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

  foodPopupOpen = false;
  diapausePopupOpen = false;
  geographyPopupOpen = false;
  behaviorPopupOpen = false;
  morphismPopupOpen = false;
  characteristicsPopupOpen = false;

  errorFood = false;
  errorDiapause = false;
  errorGeography = false;
  errorBehavior = false;
  errorMorphism = false;
  errorCharacteristics = false;

  private foods = [];
  foodList: Array<object> = [
    {id: 0, valeur: ''},
    {id: 1, valeur: 'insects'},
    {id: 2, valeur: 'meat'},
    {id: 3, valeur: 'sugar water'},
    {id: 4, valeur: 'fruits'},
    {id: 5, valeur: 'seeds'},
    {id: 6, valeur: 'honeydew'},
    {id: 7, valeur: 'ant bread'},
    {id: 8, valeur: 'mushrooms'},
  ];

  private months = [];
  monthList: Array<object> = [
    {id: 0, valeur: 'january'},
    {id: 1, valeur: 'february'},
    {id: 2, valeur: 'march'},
    {id: 3, valeur: 'april'},
    {id: 4, valeur: 'may'},
    {id: 5, valeur: 'june'},
    {id: 6, valeur: 'july'},
    {id: 7, valeur: 'august'},
    {id: 8, valeur: 'september'},
    {id: 9, valeur: 'october'},
    {id: 10, valeur: 'november'},
    {id: 11, valeur: 'december'},
  ];

  private temperatures = [];
  temperatureList: Array<object> = [
    {id: 0, valeur: 3},
    {id: 1, valeur: 5},
    {id: 2, valeur: 6},
    {id: 3, valeur: 7},
    {id: 4, valeur: 8},
    {id: 5, valeur: 9},
    {id: 6, valeur: 10},
    {id: 7, valeur: 11},
    {id: 8, valeur: 12},
    {id: 9, valeur: 13},
    {id: 10, valeur: 14},
    {id: 11, valeur: 15},
    {id: 12, valeur: 16},
    {id: 13, valeur: 17},
    {id: 14, valeur: 18},
    {id: 15, valeur: 19},
    {id: 16, valeur: 20},
    {id: 17, valeur: 21},
    {id: 18, valeur: 22},
    {id: 19, valeur: 23},
    {id: 20, valeur: 24},
    {id: 21, valeur: 25},
    {id: 22, valeur: 26},
    {id: 23, valeur: 27},
    {id: 24, valeur: 28},
    {id: 25, valeur: 29},
    {id: 26, valeur: 30},
  ];

  needDiapauseSwitch = false;

  get foodControls() { return this.foodForm.controls; }
  get foodOne() { return this.foodForm.controls['foodOne']; }
  get foodTwo() { return this.foodForm.controls['foodTwo']; }
  get foodThree() { return this.foodForm.controls['foodThree']; }

  get diapauseControls() { return this.diapauseForm.controls; }
  get needdiapause() { return this.diapauseForm.controls['needdiapause']; }
  get diapauseTemperatureStart() { return this.diapauseForm.controls['diapauseTemperatureStart']; }
  get diapauseTemperatureEnd() { return this.diapauseForm.controls['diapauseTemperatureEnd']; }
  get diapauseStart() { return this.diapauseForm.controls['diapauseStart']; }
  get diapauseEnd() { return this.diapauseForm.controls['diapauseEnd']; }


  constructor(
    public breedingSheetsService: BreedingSheetsService,
    public route: ActivatedRoute,
    public authService: AuthService
  ) {
    this.prepareFood();
    this.prepareDiapause();
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

    this.reloadSheet();
  }

  reloadSheet() {
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

  saveFood() {
    if (
      (this.foodOne.value === this.foodTwo.value
        ||
        this.foodOne.value === this.foodThree.value
        || (this.foodTwo.value === this.foodThree.value && (this.foodTwo.value !== '' && this.foodThree.value !== ''))
        )
      ||
      ((this.foodTwo.value !== '' && this.foodThree.value !== '') && (this.foodTwo.value === this.foodThree.value))
      )
      {
      this.errorFood = true;

      } else {
        const foods = [
          this.foodOne.value,
          this.foodTwo?.value,
          this.foodThree?.value
        ];
        this.breedingSheetsService.updateFood(this.breedSheet?.id, foods)
        .subscribe(() => {
          this.reloadSheet();
          this.loadSheet(this.breedSheet.species);
        });
        this.foodPopupOpen = false;
      }
  }

  saveDiapause() {
    const needs = this.needdiapause.value;
    const temperatures = {
      diapauseTemperatureStart : this.diapauseTemperatureStart.value,
      diapauseTemperatureEnd : this.diapauseTemperatureEnd.value
    };
    const months = {
      diapauseStart : this.diapauseStart.value,
      diapauseEnd : this.diapauseEnd.value
    };
    this.breedingSheetsService.updateDiapause(this.breedSheet?.id, needs, temperatures, months)
    .subscribe(data => {
      const res: any = data;
      console.log('res', res);
      this.reloadSheet();
      this.loadSheet(this.breedSheet.species);
    },
    err => {
      console.log('error: ', err.message);
    }, () => {
      console.log('ok!');
    });



      // .subscribe(() => {
      //   this.reloadSheet();
      //   this.loadSheet(this.breedSheet.species);
      // });
    // this.diapausePopupOpen = false;
  }

  private prepareFood() {
    this.foodForm = new FormGroup({
      foodOne: new FormControl(),
      foodTwo: new FormControl(),
      foodThree: new FormControl()
    });
  }

  private prepareDiapause() {
    this.diapauseForm = new FormGroup({
      needdiapause: new FormControl(this.breedSheet?.needDiapause),
      diapauseTemperatureStart: new FormControl(),
      diapauseTemperatureEnd: new FormControl(),
      diapauseStart: new FormControl(),
      diapauseEnd: new FormControl()
    });
  }

  public diapauseSwitch() {
    this.needDiapauseSwitch = !this.needDiapauseSwitch;
  }

  private prepareGeography() {
    this.geographyForm = new FormGroup({

    });
    console.log(this.geographyForm);
  }

  private prepareBehavior() {
    this.behaviorForm = new FormGroup({

    });
    console.log(this.behaviorForm);
  }

  private prepareMorphism() {
    this.morphismForm = new FormGroup({

    });
    console.log(this.morphismForm);
  }

  private prepareCharacteristics() {
    this.characteristicsForm = new FormGroup({

    });
    console.log(this.characteristicsForm);
  }

  // Popup control
  openFoodPopup() {
    this.foodPopupOpen = true;
  }

  closeFoodPopup() {
    this.foodPopupOpen = false;
    this.prepareFood();
  }

  openDiapausePopup() {
    this.diapausePopupOpen = true;
  }

  closeDiapausePopup() {
    this.diapausePopupOpen = false;
    this.prepareDiapause();
  }

  openGeographyPopup() {
    this.geographyPopupOpen = true;
  }

  closeGeogaphyPopup() {
    this.geographyPopupOpen = false;
    this.prepareGeography();
  }

  openBehaviorPopup() {
    this.behaviorPopupOpen = true;
  }

  closeBehaviorPopup() {
    this.behaviorPopupOpen = false;
    this.prepareBehavior();
  }

  openMorphismPopup() {
    this.morphismPopupOpen = true;
  }

  closeMorphismPopup() {
    this.morphismPopupOpen = false;
    this.prepareMorphism();
  }

  openCharacteristicsPopup() {
    this.characteristicsPopupOpen = true;
  }

  closeCharacteristicsPopup() {
    this.characteristicsPopupOpen = false;
    this.prepareCharacteristics();
  }

  ngOnDestroy() {
    this.breedingSheetSub.unsubscribe();
    clearInterval(this.interval);
  }

}

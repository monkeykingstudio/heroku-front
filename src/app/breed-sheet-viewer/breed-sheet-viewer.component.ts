import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, Validators, FormControl, Form } from '@angular/forms';
import { BreedingSheet } from './../models/breedingSheet.model';
import { BreedingSheetsService } from './../services/breedingSheetsService';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs/operators';
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
  gynePicturesForm: FormGroup;
  picturesForm: FormGroup;
  primaryForm: FormGroup;

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
  gynePicturesPopupOpen = false;
  picturesPopupOpen = false;
  primaryPopupOpen = false;

  errorFood = false;
  errorDiapause = false;
  errorGeography = false;
  errorBehavior = false;
  errorMorphism = false;
  errorCharacteristics = false;
  errorGynePictures = false;
  errorPictures = false;

  geographyList: Array<object> = [
    {id: 28, valeur: ''},
    {id: 0, valeur: 'europa (tempered)'},
    {id: 1, valeur: 'europa'},
    {id: 2, valeur: 'europa (north)'},
    {id: 3, valeur: 'europa (south)'},
    {id: 4, valeur: 'europa (east)'},
    {id: 5, valeur: 'europa (west)'},
    {id: 6, valeur: 'asia'},
    {id: 7, valeur: 'asia (north)'},
    {id: 8, valeur: 'asia (south)'},
    {id: 9, valeur: 'asia (east)'},
    {id: 10, valeur: 'asia (west)'},
    {id: 11, valeur: 'africa'},
    {id: 12, valeur: 'africa (north)'},
    {id: 13, valeur: 'africa (south)'},
    {id: 14, valeur: 'africa (east)'},
    {id: 15, valeur: 'africa (west)'},
    {id: 16, valeur: 'india'},
    {id: 17, valeur: 'india (north)'},
    {id: 18, valeur: 'india (south)'},
    {id: 19, valeur: 'india (east)'},
    {id: 20, valeur: 'india (west)'},
    {id: 21, valeur: 'america'},
    {id: 22, valeur: 'america (north)'},
    {id: 23, valeur: 'america (south)'},
    {id: 24, valeur: 'america (east)'},
    {id: 25, valeur: 'america (west)'},
    {id: 26, valeur: 'australia'},
    {id: 27, valeur: 'mediterranean basin'},
  ];

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

  hygrometryList: Array<object> = [
    {id: 0, valeur: 5},
    {id: 1, valeur: 10},
    {id: 2, valeur: 15},
    {id: 3, valeur: 20},
    {id: 4, valeur: 25},
    {id: 5, valeur: 30},
    {id: 6, valeur: 35},
    {id: 7, valeur: 40},
    {id: 8, valeur: 45},
    {id: 9, valeur: 50},
    {id: 10, valeur: 55},
    {id: 11, valeur: 60},
    {id: 12, valeur: 65},
    {id: 13, valeur: 70},
    {id: 14, valeur: 75},
    {id: 15, valeur: 80},
    {id: 16, valeur: 85},
    {id: 17, valeur: 90},
  ];

  difficultyList: Array<object> = [
    {id: 0, valeur: 1},
    {id: 1, valeur: 2},
    {id: 2, valeur: 3},
    {id: 3, valeur: 4},
    {id: 4, valeur: 5}
  ];

  needDiapauseSwitch;
  polySwitch;
  clausSwitch;
  drillSwitch;
  drinkSwitch;
  morphSwitch;

  get foodControls() { return this.foodForm.controls; }
  get foodOne() { return this.foodForm.controls['foodOne']; }
  get foodTwo() { return this.foodForm.controls['foodTwo']; }
  get foodThree() { return this.foodForm.controls['foodThree']; }

  get geographyControls() { return this.geographyForm.controls; }
  get geographyOne() { return this.geographyForm.controls['geographyOne']; }
  get geographyTwo() { return this.geographyForm.controls['geographyTwo']; }
  get geographyThree() { return this.geographyForm.controls['geographyThree']; }

  get diapauseControls() { return this.diapauseForm.controls; }
  get needdiapause() { return this.diapauseForm.controls['needdiapause']; }
  get diapauseTemperatureStart() { return this.diapauseForm.controls['diapauseTemperatureStart']; }
  get diapauseTemperatureEnd() { return this.diapauseForm.controls['diapauseTemperatureEnd']; }
  get diapauseStart() { return this.diapauseForm.controls['diapauseStart']; }
  get diapauseEnd() { return this.diapauseForm.controls['diapauseEnd']; }

  get behaviorControls() { return this.behaviorForm.controls; }
  get polyGyne() { return this.diapauseForm.controls['polyGyne']; }
  get semiClaustral() { return this.diapauseForm.controls['semiClaustral']; }
  get driller() { return this.diapauseForm.controls['driller']; }
  get drinker() { return this.diapauseForm.controls['drinker']; }

  get morphismControls() { return this.morphismForm.controls; }
  get polyMorphism() { return this.morphismForm.controls['polyMorphism']; }
  get gyneSize() { return this.morphismForm.controls['gyneSize']; }
  get maleSize() { return this.morphismForm.controls['maleSize']; }
  get workerSize() { return this.morphismForm.controls['workerSize']; }
  get majorSize() { return this.morphismForm.controls['majorSize']; }
  get gyneLives() { return this.morphismForm.controls['gyneLives']; }
  get workerLives() { return this.morphismForm.controls['workerLives']; }

  get characteristicsControls() { return this.characteristicsForm.controls; }
  get characteristics() { return this.characteristicsForm.controls['characteristics']; }

  get gynePicturesControls() { return this.gynePicturesForm.controls; }
  get gynePictureOne() { return this.gynePicturesForm.controls['gynePictureOne']; }
  get gynePictureTwo() { return this.gynePicturesForm.controls['gynePictureTwo']; }
  get gynePictureThree() { return this.gynePicturesForm.controls['gynePictureThree']; }

  get picturesControls() { return this.picturesForm.controls; }
  get pictureOne() { return this.picturesForm.controls['pictureOne']; }
  get pictureTwo() { return this.picturesForm.controls['pictureTwo']; }
  get pictureThree() { return this.picturesForm.controls['pictureThree']; }

  get primaryControls() { return this.primaryForm.controls; }
  get temperatureMin() { return this.primaryForm.controls['temperatureMin']; }
  get temperatureMax() { return this.primaryForm.controls['temperatureMax']; }
  get humidityMin() { return this.primaryForm.controls['humidityMin']; }
  get humidityMax() { return this.primaryForm.controls['humidityMax']; }
  get family() { return this.primaryForm.controls['family']; }
  get subfamily() { return this.primaryForm.controls['subfamily']; }
  get genre() { return this.primaryForm.controls['genre']; }
  get tribe() { return this.primaryForm.controls['tribe']; }
  get difficulty() { return this.primaryForm.controls['difficulty']; }


  constructor(
    public breedingSheetsService: BreedingSheetsService,
    public route: ActivatedRoute,
    public authService: AuthService
  ) {}

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
    this.prepareFood();
    this.prepareDiapause();
    this.prepareGeography();
    this.prepareBehavior();
    this.prepareMorphism();
    this.prepareCharacteristics();
    this.prepareGynePictures();
    this.preparePictures();
    this.preparePrimary();

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
      if ((pic !== '') && (pic !== null)) {
        this.gynePictures.push(pic);
      }
    }
  }

  switchGynePicture() {
    this.actualGynePicture = this.gynePictures[0];
    this.interval = setInterval(() => {
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
      this.changeCounter++;
      if (this.changeCounter > this.pictures.length - 1) {
        this.changeCounter = 0;
      }
      this.actualPicture = this.pictures[this.changeCounter];
    }, 5000);
  }

  loadPictures() {
    for (const pic of this.breedSheet?.pictures) {
      if ((pic !== '') && (pic !== null)) {
        this.pictures.push(pic);
      }
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

  saveGeography() {
    if (
      (this.geographyOne.value === this.geographyTwo.value) && (this.geographyTwo.value === '')
      ||
      (this.geographyTwo.value === this.geographyThree.value) && (this.geographyThree.value  === '')
      ||
      (this.geographyThree.value === this.geographyOne.value) && (this.geographyOne.value  === '')
      ) {
      this.errorGeography = true;
    } else {
      const geography = [
        this.geographyOne.value,
        this.geographyTwo?.value,
        this.geographyThree?.value
      ];
      this.breedingSheetsService.updateGeography(this.breedSheet?.id, geography)
      .subscribe(() => {
        this.reloadSheet();
        this.loadSheet(this.breedSheet.species);
      });
      this.geographyPopupOpen = false;
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
      this.reloadSheet();
      this.loadSheet(this.breedSheet.species);
    },
    err => {
      console.log('error: ', err.message);
    }, () => {
      console.log('ok!');
      this.reloadSheet();
      this.loadSheet(this.breedSheet.species);
      this.diapausePopupOpen = false;
    });
  }

  saveBehavior() {
    const polyGyne = this.polySwitch;
    const claustral = this.clausSwitch;
    const driller = this.drillSwitch;
    const drinker = this.drinkSwitch;

    this.breedingSheetsService.updateBehavior(this.breedSheet?.id, polyGyne, claustral, driller, drinker)
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
      this.reloadSheet();
      this.loadSheet(this.breedSheet.species);
      this.behaviorPopupOpen = false;
    });
  }

  saveMorphism() {
    const polyMorphism = this.morphSwitch;
    const gyneSize = this.gyneSize?.value;
    const maleSize = this.maleSize?.value;
    const majorSize = this.majorSize?.value;
    const workerSize = this.workerSize?.value;
    const gyneLives = this.gyneLives?.value;
    const workerLives = this.workerLives?.value;

    this.breedingSheetsService.updateMorphism(
      this.breedSheet?.id, polyMorphism, gyneSize, maleSize, majorSize, workerSize, gyneLives, workerLives
      )
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
        this.reloadSheet();
        this.loadSheet(this.breedSheet.species);
        this.morphismPopupOpen = false;
      });
  }

  saveCharacteristics() {
    const characteristics = this.characteristics?.value;

    this.breedingSheetsService.updateCharacteristics(this.breedSheet?.id, characteristics)
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
        this.reloadSheet();
        this.loadSheet(this.breedSheet.species);
        this.characteristicsPopupOpen = false;
      });
  }

  saveGynePictures() {
    if (
      (this.gynePictureOne.value === this.gynePictureTwo.value) && (this.gynePictureTwo.value === '')
      ||
      (this.gynePictureTwo.value === this.gynePictureThree.value) && (this.gynePictureThree.value === '')
      ||
      (this.gynePictureThree.value === this.gynePictureOne.value) && (this.gynePictureOne.value === '')
      ) {
      this.errorGynePictures = true;
    } else {
      const gynePictures = [
        this.gynePictureOne.value,
        this.gynePictureTwo?.value,
        this.gynePictureThree?.value
      ];
      this.breedingSheetsService.updateGynePictures(this.breedSheet?.id, gynePictures)
      .subscribe(() => {
        this.reloadSheet();
        this.loadSheet(this.breedSheet.species);
      });
      this.gynePicturesPopupOpen = false;
    }
  }

  savePictures() {
    if (
      (this.pictureOne.value === this.pictureTwo.value) && (this.pictureTwo.value === '')
      ||
      (this.pictureTwo.value === this.pictureThree.value) && (this.pictureThree.value === '')
      ||
      (this.pictureThree.value === this.pictureOne.value) && (this.pictureOne.value === '')
      ) {
        this.errorPictures = true;
    } else {
      const pictures = [
        this.pictureOne.value,
        this.pictureTwo?.value,
        this.pictureThree?.value
      ];
      this.breedingSheetsService.updatePictures(this.breedSheet?.id, pictures)
      .subscribe(() => {
        this.reloadSheet();
        this.loadSheet(this.breedSheet.species);
      });
      this.picturesPopupOpen = false;
    }
  }

  savePrimary() {
    const temperature = {
      temperatureStart : this.temperatureMin.value,
      temperatureEnd : this.temperatureMax.value
    };

    const hygrometry = {
      hygrometryStart : this.humidityMin.value,
      hygrometryEnd : this.humidityMax.value
    };

    const family = this.family.value;
    const subfamily = this.subfamily.value;
    const genre = this.genre.value;
    const tribu = this.tribe.value;
    const difficulty = this.difficulty.value;

    this.breedingSheetsService.updatePrimary(this.breedSheet?.id, temperature, hygrometry, family, subfamily, genre, tribu, difficulty)
    .subscribe(data => {
      const res: any = data;
      this.reloadSheet();
      this.loadSheet(this.breedSheet.species);
    },
    err => {
      console.log('error: ', err.message);
    }, () => {
      console.log('ok!');
      this.reloadSheet();
      this.loadSheet(this.breedSheet.species);
      this.primaryPopupOpen = false;
    });
  }

  public diapauseSwitch() {
    if (this.needDiapauseSwitch === undefined) {
      this.needDiapauseSwitch = !this.breedSheet?.needDiapause;
    } else {
      this.needDiapauseSwitch = !this.needDiapauseSwitch;
    }
  }

  public polyGyneSwitch() {
    if (this.polySwitch === undefined) {
      this.polySwitch = !this.breedSheet?.polygyne;
    } else {
      this.polySwitch = !this.polySwitch;
    }
  }

  public polyMorphismSwitch() {
    if (this.morphSwitch === undefined) {
      this.morphSwitch = !this.breedSheet?.polymorphism;
    } else {
      this.morphSwitch = !this.morphSwitch;
    }
  }

  public claustralSwitch() {
    if (this.clausSwitch === undefined) {
      this.clausSwitch = !this.breedSheet?.semiClaustral;
    } else {
      this.clausSwitch = !this.clausSwitch;
    }
  }

  public drillerSwitch() {
    if (this.drillSwitch === undefined) {
      this.drillSwitch = !this.breedSheet?.driller;
    } else {
      this.drillSwitch = !this.drillSwitch;
    }
  }

  public drinkerSwitch() {
    this.drinkSwitch = !this.breedSheet?.drinker;
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

  private prepareMorphism() {
    this.morphismForm = new FormGroup({
      polyMorphism: new FormControl(this.breedSheet?.polymorphism),
      gyneSize: new FormControl(this.breedSheet?.gyneSize),
      maleSize: new FormControl(this.breedSheet?.maleSize),
      workerSize: new FormControl(this.breedSheet?.workerSize),
      majorSize: new FormControl(this.breedSheet?.majorSize),
      gyneLives: new FormControl(this.breedSheet?.gyneLives),
      workerLives: new FormControl(this.breedSheet?.workerLives)
    });
  }

  private prepareGeography() {
    this.geographyForm = new FormGroup({
      geographyOne: new FormControl(),
      geographyTwo: new FormControl(),
      geographyThree: new FormControl()
    });
  }

  private prepareBehavior() {
    this.behaviorForm = new FormGroup({
      polyGyne: new FormControl(this.breedSheet?.polygyne),
      semiClaustral: new FormControl(this.breedSheet?.semiClaustral),
      driller: new FormControl(this.breedSheet?.driller),
      drinker: new FormControl(this.breedSheet?.drinker),
    });
  }

  private prepareCharacteristics() {
    this.characteristicsForm = new FormGroup({
      characteristics: new FormControl(this.breedSheet?.characteristics ? this.breedSheet?.characteristics : ''),
    });
  }

  private prepareGynePictures() {
    this.gynePicturesForm = new FormGroup({
      gynePictureOne: new FormControl(),
      gynePictureTwo: new FormControl(),
      gynePictureThree: new FormControl()
    });
  }

  private preparePictures() {
    this.picturesForm = new FormGroup({
      pictureOne: new FormControl(),
      pictureTwo: new FormControl(),
      pictureThree: new FormControl()
    });
  }

  private preparePrimary() {
    this.primaryForm = new FormGroup({
      temperatureMin: new FormControl(),
      temperatureMax: new FormControl(),
      humidityMin: new FormControl(),
      humidityMax: new FormControl(),
      family: new FormControl(),
      subfamily: new FormControl(),
      genre: new FormControl(),
      tribe: new FormControl(),
      difficulty: new FormControl()
    });
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
    if (this.needDiapauseSwitch === undefined) {
      this.needDiapauseSwitch = this.breedSheet?.needDiapause;
    }
    this.diapausePopupOpen = true;
  }

  closeDiapausePopup() {
    this.diapausePopupOpen = false;
    this.prepareDiapause();
  }

  openGeographyPopup() {
    this.geographyPopupOpen = true;
  }

  closeGeographyPopup() {
    this.geographyPopupOpen = false;
    this.prepareGeography();
  }

  openBehaviorPopup() {
    if (this.polySwitch === undefined) {
      this.polySwitch = this.breedSheet?.polygyne;
    }
    if (this.clausSwitch === undefined) {
    this.clausSwitch = this.breedSheet?.semiClaustral;
    }
    if (this.drillSwitch === undefined) {
      this.drillSwitch = this.breedSheet?.driller;
    }
    if (this.drinkSwitch === undefined) {
      this.drinkSwitch = this.breedSheet?.drinker;
    }
    this.behaviorPopupOpen = true;
  }

  closeBehaviorPopup() {
    this.behaviorPopupOpen = false;
    this.prepareBehavior();
  }

  openMorphismPopup() {
    if (this.morphSwitch === undefined) {
      this.morphSwitch = this.breedSheet?.polymorphism;
    }
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

  openGynePicturesPopup() {
    this.gynePicturesPopupOpen = true;
  }

  closeGynePicturesPopup() {
    this.gynePicturesPopupOpen = false;
    this.prepareGynePictures();
  }

  openPicturesPopup() {
    this.picturesPopupOpen = true;
  }

  closePicturesPopup() {
    this.picturesPopupOpen = false;
    this.preparePictures();
  }

  openPrimaryPopup() {
    this.primaryPopupOpen = true;
  }

  closePrimaryPopup() {
    this.primaryPopupOpen = false;
    this.preparePrimary();
  }

  ngOnDestroy() {
    this.breedingSheetSub.unsubscribe();
    clearInterval(this.interval);
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { BreedingSheet } from './../models/breedingSheet.model';
import { BreedingSheetsService } from './../services/breedingSheetsService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breed-sheet-creator',
  templateUrl: './breed-sheet-creator.component.html',
  styleUrls: ['./breed-sheet-creator.component.scss']
})
export class BreedSheetCreatorComponent implements OnInit, OnDestroy {
  breedSheetForm: FormGroup;
  DATE_RFC2822 = 'ddd, DD MMM YYYY HH:mm:ss ZZ';
  submitted = false;

  //TODO deplacer en base de donnée mongo et recuperer les listes avec un service

  defaultDifficultyList = 1;
  difficulties: Array<object> = [
    {id: 0, valeur: 1},
    {id: 1, valeur: 2},
    {id: 2, valeur: 3},
    {id: 3, valeur: 4},
    {id: 4, valeur: 5}
  ];

  existingSpecies = false;

  defaultNestType = 'all';
  nestTypeList: Array<object> = [
    {id: 0, valeur: 'Aerated concrete'},
    {id: 1, valeur: 'plexiglass'},
    {id: 2, valeur: 'all'},
    {id: 3, valeur: 'armored'},
  ];

  defaultSwarmStart = 'july';
  defaultSwarmEnd = 'july';
  defaultDiapauseStart = 'november';
  defaultDiapauseEnd = 'november';
  defaultTemperatureStart = 13;
  defaultTemperatureEnd = 17;
  defaultDiapauseTemperatureStart = 8;
  defaultDiapauseTemperatureEnd = 12;
  defaultHygrometryStart = 5;
  defaultHygrometryEnd = 10;

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
    {id: 0, valeur: 8},
    {id: 1, valeur: 9},
    {id: 2, valeur: 10},
    {id: 3, valeur: 11},
    {id: 4, valeur: 12},
    {id: 5, valeur: 13},
    {id: 6, valeur: 14},
    {id: 7, valeur: 15},
    {id: 8, valeur: 16},
    {id: 9, valeur: 17},
    {id: 10, valeur: 18},
    {id: 11, valeur: 19},
    {id: 12, valeur: 20},
    {id: 13, valeur: 21},
    {id: 14, valeur: 22},
    {id: 15, valeur: 23},
    {id: 16, valeur: 24},
    {id: 17, valeur: 25},
    {id: 18, valeur: 26},
    {id: 19, valeur: 27},
    {id: 20, valeur: 28},
    {id: 21, valeur: 29},
    {id: 22, valeur: 30},



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
    {id: 10, valeur: 50},
    {id: 11, valeur: 55},
    {id: 12, valeur: 60},
    {id: 13, valeur: 65},
    {id: 14, valeur: 70},
    {id: 15, valeur: 75},
    {id: 16, valeur: 80},
    {id: 17, valeur: 85},
    {id: 18, valeur: 90},
  ];

  public foods: any = [];
  defaultFoodList = 'insects';
  foodList: Array<object> = [
    {id: 0, valeur: 'insects'},
    {id: 1, valeur: 'meat'},
    {id: 2, valeur: 'sugar water'},
    {id: 3, valeur: 'fruits'},
    {id: 4, valeur: 'seeds'}
  ];

  public regions: any = [];
  defaultRegionList = 'europa (tempered)';
  regionList: Array<object> = [
    {id: 0, valeur: 'europa (tempered)'},
    {id: 1, valeur: 'usa'},
    {id: 1, valeur: 'north usa'},
    {id: 3, valeur: 'india'},
    {id: 4, valeur: 'asia'}
  ];

  polygyneSwitch = false;
  polymorphismSwitch = false;
  semiClaustralSwitch = false;
  needDiapauseSwitch = false;
  trophalaxySwitch = false;
  drinkerSwitch = false;
  drillerSwitch = false;

  public unvalidPictureUrl = false;
  public unvalidGynePictureUrl = false;

  public gynepictures: any = [];
  public pictures: any = [];
  // public sources = [];

  public breedData: BreedingSheet;
  optionsSpecies = [];
  private sheetSub: Subscription;
  allbreedingSheets$: Observable<BreedingSheet[]>;

  get formControls() { return this.breedSheetForm.controls; }

  get genre() { return this.breedSheetForm.controls['genre']; }
  get species() { return this.breedSheetForm.controls['species']; }
  get family() { return this.breedSheetForm.controls['family']; }
  get tribu() { return this.breedSheetForm.controls['tribu']; }
  get gynepicture() { return this.breedSheetForm.controls['gynepictures'];}
  get picture() { return this.breedSheetForm.controls['pictures'];}
  get food() { return this.breedSheetForm.controls['food']; }
  get region() { return this.breedSheetForm.controls['region']; }
  get difficulty() { return this.breedSheetForm.controls['difficulty']; }
  get polygyne() { return this.breedSheetForm.controls['polygyne']; }
  get polymorphism() { return this.breedSheetForm.controls['polymorphism']; }
  get semiclaustral() { return this.breedSheetForm.controls['semiclaustral']; }
  get needdiapause() { return this.breedSheetForm.controls['needdiapause']; }
  get trophalaxy() { return this.breedSheetForm.controls['needdiapause']; }
  get drinker() { return this.breedSheetForm.controls['drinker']; }
  get driller() { return this.breedSheetForm.controls['driller']; }
  get gynesize() { return this.breedSheetForm.controls['gynesize']; }
  get malesize() { return this.breedSheetForm.controls['malesize']; }
  get workersize() { return this.breedSheetForm.controls['workersize']; }
  get majorsize() { return this.breedSheetForm.controls['majorsize']; }
  get gynelives() { return this.breedSheetForm.controls['gynelives']; }
  get workerlives() { return this.breedSheetForm.controls['workerlives']; }
  get swarmstart() { return this.breedSheetForm.controls['swarmstart']; }
  get swarmend() { return this.breedSheetForm.controls['swarmend']; }
  get diapausestart() { return this.breedSheetForm.controls['diapausestart']; }
  get diapauseend() { return this.breedSheetForm.controls['diapauseend']; }
  get temperaturestart() { return this.breedSheetForm.controls['temperaturestart']; }
  get temperatureend() { return this.breedSheetForm.controls['temperatureend']; }
  get diapausetemperaturestart() { return this.breedSheetForm.controls['diapausetemperaturestart']; }
  get diapausetemperatureend() { return this.breedSheetForm.controls['diapausetemperatureend']; }
  get hygrometrystart() { return this.breedSheetForm.controls['hygrometrystart']; }
  get hygrometryend() { return this.breedSheetForm.controls['hygrometryend']; }
  get nesttype() { return this.breedSheetForm.controls['nesttype']; }
  get maxpopulation() { return this.breedSheetForm.controls['maxpopulation']; }
  // get sourcelink() { return this.breedSheetForm.controls['sourcelink']; }
  // get sourcetext() { return this.breedSheetForm.controls['sourcetext']; }

  constructor(
    public breedingSheetsService: BreedingSheetsService,
    private router: Router
    ) {
    this.prepareForm();
  }

  ngOnInit(): void {
    this.reloadSheets();
    this.sheetSub = this.allbreedingSheets$
    .pipe(
      map(breedsheets => breedsheets
        .filter(sheets => sheets.status === 'approved')
        .map(sheet => sheet.species))
    )
    .subscribe((res) => {
      for (const item of res) {
        this.optionsSpecies.push(item);
      }
      console.log(this.optionsSpecies);
    });
  }

  private prepareForm() {
    this.existingSpecies = false;
    this.breedSheetForm = new FormGroup({
      genre: new FormControl(null, {validators: [Validators.required]}),
      species: new FormControl(null, {validators: [Validators.required]}),
      family: new FormControl(null, {validators: [Validators.required]}),
      tribu: new FormControl(null),
      gynepicture: new FormControl(null),
      picture: new FormControl(null),
      region: new FormControl(null),
      food: new FormControl(null),
      difficulty: new FormControl(null, {validators: [Validators.required]}),
      polygyne: new FormControl(false, {validators: [Validators.required]}),
      polymorphism: new FormControl(false, {validators: [Validators.required]}),
      semiclaustral: new FormControl(false, {validators: [Validators.required]}),
      needdiapause: new FormControl(false, {validators: [Validators.required]}),
      trophalaxy: new FormControl(false),
      drinker: new FormControl(false),
      driller: new FormControl(false),
      gynesize: new FormControl(null, {validators: [Validators.required]}),
      malesize: new FormControl(null),
      workersize: new FormControl(null, {validators: [Validators.required]}),
      majorsize: new FormControl(null),
      gynelives: new FormControl(null, {validators: [Validators.required]}),
      workerlives: new FormControl(null, {validators: [Validators.required]}),
      swarmstart: new FormControl(null),
      swarmend: new FormControl(null),
      diapausestart: new FormControl(null),
      diapauseend: new FormControl(null),
      temperaturestart: new FormControl(null, {validators: [Validators.required]}),
      temperatureend: new FormControl(null, {validators: [Validators.required]}),
      diapausetemperaturestart: new FormControl(null, {validators: [Validators.required]}),
      diapausetemperatureend: new FormControl(null, {validators: [Validators.required]}),
      hygrometrystart: new FormControl(null, {validators: [Validators.required]}),
      hygrometryend: new FormControl(null, {validators: [Validators.required]}),
      nesttype: new FormControl(null),
      maxpopulation: new FormControl(null),
    });

    console.log(this.breedSheetForm);
  }

  reloadSheets(): void {
    const sheets$ = this.breedingSheetsService.getAll();
    this.allbreedingSheets$ = sheets$;
  }

  addGynePicture() {
    const entry = this.formControls.gynepicture.value;
    if (this.gynepictures.includes(entry)) {
      return;
    } else {
      if (entry.indexOf('http') === 0 ) {
        this.unvalidGynePictureUrl = false;
        this.gynepictures.push(entry);
        this.formControls.gynepicture.reset();
      }
      else {
        this.formControls.gynepicture.reset();
        this.unvalidGynePictureUrl = true;
        return;
      }
    }
  }

  addOtherPicture() {
    const entry = this.formControls.picture.value;
    if (this.pictures.includes(entry)) {
      return;
    } else {
      if (entry.indexOf('http') === 0 ) {
        this.unvalidPictureUrl = false;
        this.pictures.push(entry);
        this.formControls.picture.reset();
      }
      else {
        this.unvalidPictureUrl = true;
        this.formControls.picture.reset();
        return;
      }
    }
  }

  addRegion() {
    const entry = this.formControls.region.value;
    if (this.regions.includes(entry)) {
      return;
    } else {
      this.regions.push(entry);
    }
  }

  addFood() {
    const entry = this.formControls.food.value;
    if (this.foods.includes(entry)) {
      return;
    } else {
      this.foods.push(entry);
    }
  }

  polySwitch() {
    this.polygyneSwitch = !this.polygyneSwitch;
  }

  morphSwitch() {
    this.polymorphismSwitch = !this.polymorphismSwitch;
  }

  claustralSwitch() {
    this.semiClaustralSwitch = !this.semiClaustralSwitch;
  }

  diapauseSwitch() {
    this.needDiapauseSwitch = !this.needDiapauseSwitch;
  }

  trophaSwitch() {
    this.trophalaxySwitch = !this.trophalaxySwitch;
  }

  drinkSwitch() {
    this.drinkerSwitch = !this.drinkerSwitch;
  }

  drillSwitch() {
    this.drillerSwitch = !this.drillerSwitch;
  }

  add() {
    const inputs = this.formControls;
    this.breedData = {
      creator: null,
      creationDate: moment(new Date()).format(this.DATE_RFC2822),
      status: 'pending',
      genre: inputs.genre.value.toLowerCase(),
      species: inputs.species.value.toLowerCase(),
      family: inputs.family.value.toLowerCase(),
      tribu: inputs.tribu.value.toLowerCase(),
      gynePictures: this.gynepictures,
      pictures: this.pictures,
      regions: this.regions,
      foods: this.foods,
      difficulty: inputs.difficulty.value,
      polygyne: inputs.polygyne.value,
      polymorphism: inputs.polymorphism.value,
      semiClaustral: inputs.semiclaustral.value,
      needDiapause: inputs.semiclaustral.value,
      drinker: inputs.drinker.value,
      driller: inputs.driller.value,
      gyneSize: inputs.gynesize.value,
      maleSize: inputs.malesize.value,
      workerSize: inputs.workersize.value,
      majorSize: inputs.majorsize.value,
      gyneLives: inputs.gynelives.value,
      workerLives: inputs.workerlives.value,
      swarmingPeriod: [
        {
          swarmStart: inputs.swarmstart.value,
          swarmEnd: inputs.swarmend.value
        }
      ],
      diapausePeriod: [
        {
          diapauseStart: inputs.diapausestart.value,
          diapauseEnd: inputs.diapauseend.value
        }
      ],
      temperature: [
        {
          temperatureStart: inputs.temperaturestart.value,
          temperatureEnd: inputs.temperatureend.value
        }
      ],
      diapauseTemperature: [
        {
          diapauseTemperatureStart: inputs.diapausetemperaturestart.value,
          diapauseTemperatureEnd: inputs.diapausetemperatureend.value
        }
      ],
      hygrometry: [
        {
          hygrometryStart: inputs.hygrometrystart.value,
          hygrometryEnd: inputs.hygrometryend.value
        }
      ],
      nestType: inputs.nesttype.value,
      maxPopulation: inputs.maxpopulation.value
    };

    // check if species already exists, if true, proceed
    for (const species of this.optionsSpecies) {
      if (species === this.breedData.species) {
        window.scroll(0, 0);
        this.existingSpecies = true;
        return;
      }
    }

    this.breedingSheetsService.createSheet(this.breedData)
    .subscribe((res) => {
      console.log(res);
      this.submitted = true;
    });
  }

  createNew() {
    this.prepareForm();
    this.submitted = false;
  }

  ngOnDestroy() {
    this.sheetSub.unsubscribe();
  }

}

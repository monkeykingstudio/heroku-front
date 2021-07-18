import { Component, OnInit , OnDestroy} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Colony } from '../colony.model';
import { ColoniesService } from './../../services/colonies.service';
import { PopupService } from './../../services/popup.service';
import { FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import * as moment from 'moment';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { BreedingSheetsService } from './../../services/breedingSheetsService';
import { BreedingSheet } from 'src/app/models/breedingSheet.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-colonies-list',
  templateUrl: './colonies-list.component.html',
  styleUrls: ['./colonies-list.component.scss']
})

export class ColoniesListComponent implements OnInit,  OnDestroy {
  allColonies$: Observable<Colony[]>;
  allbreedingSheets$: Observable<BreedingSheet[]>;
  // species$: Observable<string[]>;
  species = [];

  private sheetSub: Subscription;

  DATE_RFC2822 = 'ddd, DD MMM YYYY HH:mm:ss ZZ';

  colonyForm: FormGroup;
  nameCtrl: FormControl;
  gyneNameCtrl: FormControl;
  speciesCtrl: FormControl;
  polyCtrl: FormControl;
  breedCtrl: FormControl;
  polyGyneCtrl: FormControl;
  polyGyneCountCtrl: FormControl;
  datePickerCtrl: FormControl;

  bubbleTools = false;
  creationDate;
  model: NgbDateStruct;

  dateCheck = true;
  switch = false;

  defaultSpecies = 'lasius niger';
  optionsSpecies: Array<object> = [];

  constructor(
    private fb: FormBuilder,
    public colonyService: ColoniesService,
    public popupService: PopupService,
    public breedingSheetsService: BreedingSheetsService
  ) {}

  ngOnInit(): void {
    this.nameCtrl = this.fb.control('', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]);
    this.gyneNameCtrl = this.fb.control('', [Validators.minLength(3), Validators.maxLength(15)]);
    this.speciesCtrl = this.fb.control(null);
    this.polyCtrl = this.fb.control(true);
    this.breedCtrl = this.fb.control(false);
    this.polyGyneCtrl = this.fb.control(false);
    this.polyGyneCountCtrl = this.fb.control(2);
    this.datePickerCtrl = this.fb.control('', Validators.required);

    this.colonyForm = this.fb.group({
      name: this.nameCtrl,
      gyneName: this.gyneNameCtrl,
      species: this.speciesCtrl,
      polymorph: this.polyCtrl,
      breed: this.breedCtrl,
      polyGyne: this.polyGyneCtrl,
      polyGyneCount: this.polyGyneCountCtrl,
      datePicker: this.datePickerCtrl
    });
    this.reloadSheets();
    this.reloadColonies();

    this.sheetSub = this.allbreedingSheets$
    .pipe(
      map(breedsheets => breedsheets
        .filter(sheets => sheets.status === 'approved')
        .map(sheet => sheet.species)
        )
    )
    .subscribe((res) => {
      for (const item of res) {
        this.optionsSpecies.push({species: item});
      }
    });

  }

  reloadColonies(): void {
    const colonies$ = this.colonyService.loadAllColonies();
    this.allColonies$ = colonies$;
  }

  reloadSheets(): void {
    const sheets$ = this.breedingSheetsService.getAll();
    this.allbreedingSheets$ = sheets$;
  }

  saveColony(): void {
    const formChanges = this.colonyForm.value;

    if (!formChanges.datePicker) {
      this.creationDate = moment(new Date()).format(this.DATE_RFC2822);
    } else {
      this.creationDate = moment(new Date(`
      ${formChanges.datePicker.month}-
      ${formChanges.datePicker.day}-
      ${formChanges.datePicker.year}`))
        .format(this.DATE_RFC2822);
    }

    const newColony = {
      creator: null,
      creationDate: this.creationDate,
      name: formChanges.name,
      gyneName: formChanges.gyneName,
      species: formChanges.species,
      polyGyne: formChanges.polyGyne,
      polyGyneCount: formChanges.polyGyneCount,
      counter: {
        minorCount: 0,
        mediumCount: 0,
        majorCount: 0,
        polymorph: formChanges.polymorph,
        breed: formChanges.breed,
        polyCount: 0,
        breedCount: 0,
      }
    };

    this.colonyService.createColony(newColony)
    .subscribe(() => { // subscribe pour reload le allcounter$ apres l'execution en BDD
      this.resetPopup();
      this.reloadColonies();
    });
  }

  onDateSelect() {
    const formDate = moment(new Date(`
    ${this.colonyForm.value.datePicker.month}-
    ${this.colonyForm.value.datePicker.day}-
    ${this.colonyForm.value.datePicker.year}`));

    const now = moment(new Date());
    if (formDate.diff(now, 'days') >= 1) {
      this.dateCheck = false;
    } else {
      this.dateCheck = true;
    }
  }

  openPopup(id: string): void {
    this.popupService.open(id);
  }

  closePopup(id: string): void {
    this.popupService.close(id);
  }

  polySwitch() {
    this.switch = !this.switch;
  }

  resetPopup() {
    this.colonyForm.reset();
    this.colonyForm.patchValue({name: ''});
    this.colonyForm.patchValue({species: 'unknown species'});
    this.colonyForm.patchValue({polymorph: true});
    this.colonyForm.patchValue({polyGyneCount: 2});
  }

  addGyne() {
   this.polyGyneCountCtrl.patchValue(this.polyGyneCountCtrl.value + 1);
  }

  subGyne() {
    if (this.polyGyneCountCtrl.value > 0)
    {
      this.polyGyneCountCtrl.patchValue(this.polyGyneCountCtrl.value - 1);
    }
  }

  ngOnDestroy() {
    this.sheetSub.unsubscribe();
  }
}

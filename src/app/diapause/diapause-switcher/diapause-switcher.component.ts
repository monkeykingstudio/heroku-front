import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import { BreedingSheet } from '../../models/breedingSheet.model';

@Component({
  selector: 'app-diapause-switcher',
  templateUrl: './diapause-switcher.component.html',
  styleUrls: ['./diapause-switcher.component.scss']
})
export class DiapauseSwitcherComponent implements OnInit {

  @Input()
  sheet: BreedingSheet;

  diapauseForm: FormGroup;
  autoStartCtrl: FormControl;
  scheduleCtrl: FormControl;
  currentTemperatureCtrl: FormControl;

  diapauseSchedule = false;
  diapauseStart = false;
  dateCheck = true;

  startDate: Date;
  endDate: Date;

  temperatureStart: number;
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

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.startDate = new Date();

    this.autoStartCtrl = this.fb.control(true);
    this.scheduleCtrl = this.fb.control(false);
    this.currentTemperatureCtrl = this.fb.control(0);

    this.diapauseForm = this.fb.group({
      autoStart: this.autoStartCtrl,
      schedule: this.scheduleCtrl,
      currentTemperature: this.currentTemperatureCtrl
    });
  }

  switchSchedule(): void {
    this.diapauseSchedule = !this.diapauseSchedule;
  }

  parseDate(dateString: string): Date {
    if (dateString) {
        return new Date(dateString);
    }
    return null;
  }

    saveDiapause() {

    // const formChanges = this.diapauseForm.value;
    // let currentStatus: string;
    // this.checkValidDates();

    // if (this.schedule) {
    //   currentStatus = 'scheduled';
    // } else {
    //   currentStatus = 'active';
    // }

    // const diapause: Diapause = {
    //   period: {
    //     startDate: this.startDate,
    //     endDate: this.endDate
    //   },
    //   species: this.sheet.species,
    //   colonyId: this.colonyId,
    //   currentTemperature: formChanges.currentTemperature,
    //   status: currentStatus
    // };

    // if (this.dateCheck) {
    //   return this.diapauseService.diapauseAdd(diapause)
    //   .subscribe((newDiapause) => {
    //     if (this.getTimeDifference() >= 0 ) {
    //       this.subscription = interval(1000)
    //       .subscribe(x => {
    //         this.checkIfCountdown();
    //         this.getTimeDifference();
    //       });
    //     }
    //   });
    // } else {
    //   return;
    // }
  }



}

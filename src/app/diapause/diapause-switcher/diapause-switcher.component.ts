import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';


@Component({
  selector: 'app-diapause-switcher',
  templateUrl: './diapause-switcher.component.html',
  styleUrls: ['./diapause-switcher.component.scss']
})
export class DiapauseSwitcherComponent implements OnInit {
  diapauseForm: FormGroup;
  autoStartCtrl: FormControl;
  scheduleCtrl: FormControl;
  currentTemperatureCtrl: FormControl;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.autoStartCtrl = this.fb.control(true);
    this.scheduleCtrl = this.fb.control(false);
    this.currentTemperatureCtrl = this.fb.control(0);


    this.diapauseForm = this.fb.group({
      autoStart: this.autoStartCtrl,
      schedule: this.scheduleCtrl,
      currentTemperature: this.currentTemperatureCtrl
    });
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

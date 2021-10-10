import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Diapause } from './../../models/diapause.model';
import { DiapauseService } from '../../services/diapause.service';


@Component({
  selector: 'app-diapause-form',
  templateUrl: './diapause-form.component.html',
  styleUrls: ['./diapause-form.component.scss']
})
export class DiapauseFormComponent implements OnInit {
  @Input()
  diapauseLoaded;

  @Input()
  dateCheck;

  @Input()
  endDate;

  @Input()
  startDate;

  @Input()
  colonyId: string;

  @Input()
  sheet;

  @Output()
  diapauseChanged = new EventEmitter<boolean>();

  schedule = false;

  diapauseForm: FormGroup;
  autoStartCtrl: FormControl;
  scheduleCtrl: FormControl;

  constructor(public diapauseService: DiapauseService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.autoStartCtrl = this.fb.control(true);
    this.scheduleCtrl = this.fb.control(false);

    this.diapauseForm = this.fb.group({
      autoStart: this.autoStartCtrl,
      schedule: this.scheduleCtrl,
    });
  }
  saveDiapause() {
    // this.checkDates();
    const diapause: Diapause = {
      period: {
        startDate: this.startDate,
        endDate: this.endDate
      },
      species: this.sheet.species,
      colonyId: this.colonyId,
    };
    return this.diapauseService.diapauseAdd(diapause)
    .subscribe((newDiapause) => {
      this.diapauseChanged.emit(true);
      console.log(newDiapause);
    });
  }

  switchSchedule() {
    this.schedule = !this.schedule;
  }

  parseDate(dateString: string): Date {
    if (dateString) {
      return new Date(dateString);
    }
    return null;
  }

}

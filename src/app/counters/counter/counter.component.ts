import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Counter } from '../../models/counter.model';
import { CounterService } from '../../services/counter.service';
import { PopupService } from './../../services/popup.service';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})

export class CounterComponent implements OnInit {
  @Input()
  counter: Counter;

  @Input()
  colonyId: string;

  optionsForm: FormGroup;
  counterForm: FormGroup;

  polyCtrl: FormControl;
  breedCtrl: FormControl;

  totalPopulationPolyMorph: number;
  totalPopulationMonoMorph: number;

  isLoading: boolean;

  multiValue = 0;
  powerMode = false;

  multiplicators: Array<object> = [
    {id: 0, valeur: 0},
    {id: 1, valeur: 10},
    {id: 2, valeur: 25},
    {id: 3, valeur: 50},
    {id: 4, valeur: 100}
  ];

  @ViewChild('minorRef', { static: true }) minor: ElementRef;
  @ViewChild('mediumRef', { static: true }) medium: ElementRef;
  @ViewChild('majorRef', { static: true }) major: ElementRef;
  @ViewChild('breedRef', { static: true }) breed: ElementRef;
  @ViewChild('polyRef', { static: true }) poly: ElementRef;

  constructor(
    private fb: FormBuilder,
    private counterService: CounterService,
    private popupService: PopupService
    ) {}

  ngOnInit(): void {
    this.polyCtrl = this.fb.control(this.counter.polymorph);
    this.breedCtrl = this.fb.control(this.counter.breed);

    this.isLoading = false;

    this.reloadPopulation();

    this.optionsForm = this.fb.group({
      polymorph: this.polyCtrl,
      breed: this.breedCtrl,
    });

    this.counterForm = this.fb.group({
      multiplicator: this.multiValue
    });
  }


  saveCount() {
    this.isLoading = true;
    this.counterService.updateCounter(
      this.counter.minorCount,
      this.counter.mediumCount,
      this.counter.majorCount,
      this.colonyId,
      this.counter.polymorph,
      this.counter.polyCount,
      this.counter.breed,
      this.counter.breedCount,
    );
    this.isLoading = false;
  }

  saveOptions(counter) {
    const changes = this.optionsForm.value;

    counter.polymorph = changes.polymorph;
    counter.breed = changes.breed;

    this.counterService.updateCounter(
      this.counter.minorCount,
      this.counter.mediumCount,
      this.counter.majorCount,
      this.colonyId,
      this.counter.polymorph,
      this.counter.polyCount,
      this.counter.breed,
      this.counter.breedCount
    );
  }

  reloadPopulation(): void {
    const polyMorph = this.counter.majorCount + this.counter.mediumCount + this.counter.minorCount;
    this.totalPopulationPolyMorph = polyMorph;

    const monoMorph = this.counter.polyCount;
    this.totalPopulationMonoMorph = monoMorph;
  }

  openPopup(id: string) {
    this.popupService.open(id);
  }

  changeMultiplicator(value) {
    this.multiValue = +value;
  }

  powerModeChange() {
    this.powerMode = !this.powerMode;
  }

  add(typeRef): void {
    console.log('multiplicator value:', this.multiValue);
    if (this.multiValue === 0 && !this.powerMode) {
      switch (typeRef) {
        case 'minorRef':
          this.counter.minorCount++;
          break;
        case 'mediumRef':
          this.counter.mediumCount++;
          break;
        case 'majorRef':
          this.counter.majorCount++;
          break;
        case 'breedRef':
          this.counter.breedCount++;
          break;
        case 'polyRef':
          this.counter.polyCount++;
          break;
        default:
          console.log(`Sorry, wrong type for counter ${typeRef}.`);
      }
    } else if (this.multiValue !== 0 && this.powerMode) {
      switch (typeRef) {
        case 'minorRef':
          this.counter.minorCount += this.multiValue;
          break;
        case 'mediumRef':
          this.counter.mediumCount += this.multiValue;
          break;
        case 'majorRef':
          this.counter.majorCount += this.multiValue;
          break;
        case 'breedRef':
          this.counter.breedCount += this.multiValue;
          break;
        case 'polyRef':
          this.counter.polyCount += this.multiValue;
          break;
        default:
          console.log(`Sorry, wrong type for counter ${typeRef}.`);
      }
    }

    this.reloadPopulation();
  }

  sub(typeRef): void {
    if (this.multiValue === 0 && !this.powerMode) {
      switch (typeRef) {
        case 'minorRef':
          this.counter.minorCount > 0 ? this.counter.minorCount -= this.multiValue : this.counter.minorCount = 0;
          break;
        case 'mediumRef':
          this.counter.mediumCount > 0 ? this.counter.mediumCount -= this.multiValue : this.counter.mediumCount = 0;
          break;
        case 'majorRef':
          this.counter.majorCount > 0 ? this.counter.majorCount -= this.multiValue : this.counter.majorCount = 0;
          break;
        case 'breedRef':
          this.counter.breedCount > 0 ? this.counter.breedCount -= this.multiValue : this.counter.breedCount = 0;
          break;
        case 'polyRef':
          this.counter.polyCount > 0 ? this.counter.polyCount -= this.multiValue : this.counter.polyCount = 0;
          break;
        default:
          console.log(`Sorry, wrong type for counter ${typeRef}.`);
      }
    } else if (this.multiValue !== 0 && this.powerMode) {
      switch (typeRef) {
        case 'minorRef':
          this.counter.minorCount > 0 ? this.counter.minorCount-- : this.counter.minorCount = 0;
          break;
        case 'mediumRef':
          this.counter.mediumCount > 0 ? this.counter.mediumCount-- : this.counter.mediumCount = 0;
          break;
        case 'majorRef':
          this.counter.majorCount > 0 ? this.counter.majorCount-- : this.counter.majorCount = 0;
          break;
        case 'breedRef':
          this.counter.breedCount > 0 ? this.counter.breedCount-- : this.counter.breedCount = 0;
          break;
        case 'polyRef':
          this.counter.polyCount > 0 ? this.counter.polyCount-- : this.counter.polyCount = 0;
          break;
        default:
          console.log(`Sorry, wrong type for counter ${typeRef}.`);
      }
    }

    this.reloadPopulation();
  }

  closePopup(id: string) {
    this.popupService.close(id);
  }
}

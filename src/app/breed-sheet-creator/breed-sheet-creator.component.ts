import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-breed-sheet-creator',
  templateUrl: './breed-sheet-creator.component.html',
  styleUrls: ['./breed-sheet-creator.component.scss']
})
export class BreedSheetCreatorComponent implements OnInit {
  breedSheetForm: FormGroup;

  get formControls() { return this.breedSheetForm.controls; }

  get species() { return this.breedSheetForm.controls['species']; }
  get subspecies() { return this.breedSheetForm.controls['subspecies']; }


  constructor() {
    this.prepareForm();
  }

  ngOnInit(): void {
  }

  private prepareForm() {
    this.breedSheetForm = new FormGroup({
      species: new FormControl(null, { validators: [Validators.required]}),
      subspecies: new FormControl(null ),
    });
  }

  add() {

  }

}

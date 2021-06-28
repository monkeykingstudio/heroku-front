import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreedSheetListComponent } from './breed-sheet-list.component';

describe('BreedSheetListComponent', () => {
  let component: BreedSheetListComponent;
  let fixture: ComponentFixture<BreedSheetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreedSheetListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreedSheetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiapauseFormComponent } from './diapause-form.component';

describe('DiapauseFormComponent', () => {
  let component: DiapauseFormComponent;
  let fixture: ComponentFixture<DiapauseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiapauseFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiapauseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

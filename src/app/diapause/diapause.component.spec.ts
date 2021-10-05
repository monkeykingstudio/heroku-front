import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiapauseComponent } from './diapause.component';

describe('DiapauseComponent', () => {
  let component: DiapauseComponent;
  let fixture: ComponentFixture<DiapauseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiapauseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiapauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

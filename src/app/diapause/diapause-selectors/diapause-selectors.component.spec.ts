import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiapauseSelectorsComponent } from './diapause-selectors.component';

describe('DiapauseSelectorsComponent', () => {
  let component: DiapauseSelectorsComponent;
  let fixture: ComponentFixture<DiapauseSelectorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiapauseSelectorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiapauseSelectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

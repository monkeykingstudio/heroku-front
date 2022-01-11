import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiapauseStatsComponent } from './diapause-stats.component';

describe('DiapauseStatsComponent', () => {
  let component: DiapauseStatsComponent;
  let fixture: ComponentFixture<DiapauseStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiapauseStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiapauseStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

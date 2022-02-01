import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopulationStatsComponent } from './population-stats.component';

describe('PopulationStatsComponent', () => {
  let component: PopulationStatsComponent;
  let fixture: ComponentFixture<PopulationStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopulationStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopulationStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

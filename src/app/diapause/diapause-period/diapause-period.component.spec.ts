import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiapausePeriodComponent } from './diapause-period.component';

describe('DiapausePeriodComponent', () => {
  let component: DiapausePeriodComponent;
  let fixture: ComponentFixture<DiapausePeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiapausePeriodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiapausePeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

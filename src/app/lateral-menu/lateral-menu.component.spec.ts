import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LateralMenuComponent } from './lateral-menu.component';

describe('LateralMenuComponent', () => {
  let component: LateralMenuComponent;
  let fixture: ComponentFixture<LateralMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LateralMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LateralMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ConcoursService } from './concours.service';

describe('ConcoursService', () => {
  let service: ConcoursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConcoursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { DiapauseService } from './diapause.service';

describe('DiapauseService', () => {
  let service: DiapauseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiapauseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

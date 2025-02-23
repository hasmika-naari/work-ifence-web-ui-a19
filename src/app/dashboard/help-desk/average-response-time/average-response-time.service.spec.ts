import { TestBed } from '@angular/core/testing';

import { AverageResponseTimeService } from './average-response-time.service';

describe('AverageResponseTimeService', () => {
  let service: AverageResponseTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AverageResponseTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

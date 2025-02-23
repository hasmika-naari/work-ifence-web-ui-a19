import { TestBed } from '@angular/core/testing';

import { AvgResponseTimeService } from './avg-response-time.service';

describe('AvgResponseTimeService', () => {
  let service: AvgResponseTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvgResponseTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

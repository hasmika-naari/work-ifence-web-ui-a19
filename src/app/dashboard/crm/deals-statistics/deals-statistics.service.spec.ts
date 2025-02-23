import { TestBed } from '@angular/core/testing';

import { DealsStatisticsService } from './deals-statistics.service';

describe('DealsStatisticsService', () => {
  let service: DealsStatisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DealsStatisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

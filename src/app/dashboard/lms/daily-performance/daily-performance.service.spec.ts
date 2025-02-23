import { TestBed } from '@angular/core/testing';

import { DailyPerformanceService } from './daily-performance.service';

describe('DailyPerformanceService', () => {
  let service: DailyPerformanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyPerformanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

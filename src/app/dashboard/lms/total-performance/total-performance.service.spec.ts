import { TestBed } from '@angular/core/testing';

import { TotalPerformanceService } from './total-performance.service';

describe('TotalPerformanceService', () => {
  let service: TotalPerformanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TotalPerformanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

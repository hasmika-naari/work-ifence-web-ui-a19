import { TestBed } from '@angular/core/testing';

import { RevenueOverviewService } from './revenue-overview.service';

describe('RevenueOverviewService', () => {
  let service: RevenueOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RevenueOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { BalanceOverviewService } from './balance-overview.service';

describe('BalanceOverviewService', () => {
  let service: BalanceOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BalanceOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { SellerOverviewService } from './seller-overview.service';

describe('SellerOverviewService', () => {
  let service: SellerOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SellerOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

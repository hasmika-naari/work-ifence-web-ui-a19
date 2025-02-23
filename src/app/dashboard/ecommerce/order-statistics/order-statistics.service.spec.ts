import { TestBed } from '@angular/core/testing';

import { OrderStatisticsService } from './order-statistics.service';

describe('OrderStatisticsService', () => {
  let service: OrderStatisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderStatisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

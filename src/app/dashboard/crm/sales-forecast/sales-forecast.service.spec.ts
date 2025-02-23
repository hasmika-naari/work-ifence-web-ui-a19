import { TestBed } from '@angular/core/testing';

import { SalesForecastService } from './sales-forecast.service';

describe('SalesForecastService', () => {
  let service: SalesForecastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesForecastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

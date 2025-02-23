import { TestBed } from '@angular/core/testing';

import { DailyAverageIncomeService } from './daily-average-income.service';

describe('DailyAverageIncomeService', () => {
  let service: DailyAverageIncomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyAverageIncomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

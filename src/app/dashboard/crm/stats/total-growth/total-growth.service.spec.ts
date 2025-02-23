import { TestBed } from '@angular/core/testing';

import { TotalGrowthService } from './total-growth.service';

describe('TotalGrowthService', () => {
  let service: TotalGrowthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TotalGrowthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

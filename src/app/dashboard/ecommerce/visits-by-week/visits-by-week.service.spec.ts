import { TestBed } from '@angular/core/testing';

import { VisitsByWeekService } from './visits-by-week.service';

describe('VisitsByWeekService', () => {
  let service: VisitsByWeekService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisitsByWeekService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { CoursesOverviewService } from './courses-overview.service';

describe('CoursesOverviewService', () => {
  let service: CoursesOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoursesOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

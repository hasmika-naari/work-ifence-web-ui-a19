import { TestBed } from '@angular/core/testing';

import { IssuesSummaryService } from './issues-summary.service';

describe('IssuesSummaryService', () => {
  let service: IssuesSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssuesSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

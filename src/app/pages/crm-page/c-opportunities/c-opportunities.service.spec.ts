import { TestBed } from '@angular/core/testing';

import { COpportunitiesService } from './c-opportunities.service';

describe('COpportunitiesService', () => {
  let service: COpportunitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(COpportunitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

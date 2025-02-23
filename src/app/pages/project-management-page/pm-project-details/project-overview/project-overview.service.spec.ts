import { TestBed } from '@angular/core/testing';

import { ProjectOverviewService } from './project-overview.service';

describe('ProjectOverviewService', () => {
  let service: ProjectOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

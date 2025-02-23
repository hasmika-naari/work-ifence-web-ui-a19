import { TestBed } from '@angular/core/testing';

import { OrganicSessionsService } from './organic-sessions.service';

describe('OrganicSessionsService', () => {
  let service: OrganicSessionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganicSessionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { LiveCallsService } from './live-calls.service';

describe('LiveCallsService', () => {
  let service: LiveCallsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveCallsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { TicketsStatusService } from './tickets-status.service';

describe('TicketsStatusService', () => {
  let service: TicketsStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketsStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

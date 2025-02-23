import { TestBed } from '@angular/core/testing';

import { LeadsStaticsService } from './leads-statics.service';

describe('LeadsStaticsService', () => {
  let service: LeadsStaticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadsStaticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

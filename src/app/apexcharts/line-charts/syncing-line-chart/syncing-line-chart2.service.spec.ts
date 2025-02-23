import { TestBed } from '@angular/core/testing';

import { SyncingLineChart2Service } from './syncing-line-chart2.service';

describe('SyncingLineChart2Service', () => {
  let service: SyncingLineChart2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncingLineChart2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

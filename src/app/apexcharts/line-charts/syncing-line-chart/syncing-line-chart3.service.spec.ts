import { TestBed } from '@angular/core/testing';

import { SyncingLineChart3Service } from './syncing-line-chart3.service';

describe('SyncingLineChart3Service', () => {
  let service: SyncingLineChart3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncingLineChart3Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

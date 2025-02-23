import { TestBed } from '@angular/core/testing';

import { GithubStyleAreaChart2Service } from './github-style-area-chart2.service';

describe('GithubStyleAreaChart2Service', () => {
  let service: GithubStyleAreaChart2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GithubStyleAreaChart2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

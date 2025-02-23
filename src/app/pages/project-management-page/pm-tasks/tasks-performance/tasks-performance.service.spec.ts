import { TestBed } from '@angular/core/testing';

import { TasksPerformanceService } from './tasks-performance.service';

describe('TasksPerformanceService', () => {
  let service: TasksPerformanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TasksPerformanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

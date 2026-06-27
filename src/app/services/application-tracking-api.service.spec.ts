import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationTrackingApiService } from './application-tracking-api.service';

describe('ApplicationTrackingApiService', () => {
  let service: ApplicationTrackingApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApplicationTrackingApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    service = TestBed.inject(ApplicationTrackingApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('GETs the paginated applications list', () => {
    service.list(0, 20).subscribe();
    const req = httpMock.expectOne(r => r.url === '/api/job-applications' && r.params.get('page') === '0');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('GETs the detail aggregate for an application', () => {
    service.getDetail(42).subscribe();
    const req = httpMock.expectOne('/api/ext/applications/42/detail');
    expect(req.request.method).toBe('GET');
    req.flush({ application: { id: 42 } });
  });

  it('POSTs a status change', () => {
    service.changeStatus(42, 3).subscribe();
    const req = httpMock.expectOne('/api/ext/applications/42/status');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ statusId: 3 });
    req.flush({ id: 42, statusId: 3 });
  });

  it('POSTs a communication entry', () => {
    service.addCommunication(42, { type: 'EMAIL', direction: 'OUTBOUND', subject: 'Follow-up' }).subscribe();
    const req = httpMock.expectOne('/api/ext/applications/42/communications');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.type).toBe('EMAIL');
    req.flush({ id: 1, applicationId: 42 });
  });
});

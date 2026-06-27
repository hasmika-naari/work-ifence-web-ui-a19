import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ResumeShareApiService } from './resume-share-api.service';

describe('ResumeShareApiService', () => {
  let service: ResumeShareApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ResumeShareApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    service = TestBed.inject(ResumeShareApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('GETs the owner resume', () => {
    service.getResume(5).subscribe();
    const req = httpMock.expectOne('/api/ext/job-resumes/5');
    expect(req.request.method).toBe('GET');
    req.flush({ id: 5, visibility: 'PRIVATE' });
  });

  it('PUTs a visibility change with the enum body', () => {
    service.setVisibility(5, 'PUBLIC').subscribe();
    const req = httpMock.expectOne('/api/ext/job-resumes/5/visibility');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ visibility: 'PUBLIC' });
    req.flush({});
  });

  it('POSTs to create a share link', () => {
    service.createShareLink(5).subscribe();
    const req = httpMock.expectOne('/api/ext/job-resumes/5/share');
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'abc', url: '/r/abc' });
  });

  it('DELETEs to revoke a share link (token url-encoded)', () => {
    service.revokeShareLink(5, 'a b/c').subscribe();
    const req = httpMock.expectOne('/api/ext/job-resumes/5/share/a%20b%2Fc');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('POSTs to duplicate', () => {
    service.duplicate(5).subscribe();
    const req = httpMock.expectOne('/api/ext/job-resumes/5/duplicate');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('DELETEs to soft-delete', () => {
    service.softDelete(5).subscribe();
    const req = httpMock.expectOne('/api/ext/job-resumes/5');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('GETs the public resume by token (no /ext prefix)', () => {
    service.getPublicResume('tok123').subscribe();
    const req = httpMock.expectOne('/api/public/resumes/tok123');
    expect(req.request.method).toBe('GET');
    req.flush({ id: 5, title: 'X' });
  });
});

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AiResumeApiService, AiResumeJob } from './ai-resume-api.service';

const DONE_JOB: AiResumeJob = { id: 7, mode: 'IMPROVE', status: 'SUCCEEDED', resultJson: '{}' };
const RUNNING_JOB: AiResumeJob = { id: 7, mode: 'IMPROVE', status: 'RUNNING' };

describe('AiResumeApiService', () => {
  let service: AiResumeApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AiResumeApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    service = TestBed.inject(AiResumeApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('POSTs to /resume/draft', () => {
    service.draft({ resumeId: 1 }).subscribe();
    const req = httpMock.expectOne('/api/ext/ai/resume/draft');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.resumeId).toBe(1);
    req.flush(RUNNING_JOB, { status: 202, statusText: 'Accepted' });
  });

  it('POSTs to /resume/improve', () => {
    service.improve({ resumeId: 1, instructions: 'be concise' }).subscribe();
    const req = httpMock.expectOne('/api/ext/ai/resume/improve');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.instructions).toBe('be concise');
    req.flush(RUNNING_JOB, { status: 202, statusText: 'Accepted' });
  });

  it('POSTs multipart to /resume/from-upload', () => {
    const file = new File(['data'], 'cv.pdf', { type: 'application/pdf' });
    service.fromUpload(file).subscribe();
    const req = httpMock.expectOne('/api/ext/ai/resume/from-upload');
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();
    req.flush(RUNNING_JOB, { status: 202, statusText: 'Accepted' });
  });

  it('POSTs to /resume/from-jd', () => {
    service.fromJd({ resumeId: 1, jobDescription: 'Senior dev' }).subscribe();
    const req = httpMock.expectOne('/api/ext/ai/resume/from-jd');
    expect(req.request.method).toBe('POST');
    req.flush(RUNNING_JOB, { status: 202, statusText: 'Accepted' });
  });

  it('POSTs to /cover-letter', () => {
    service.coverLetter({ resumeId: 1, jobDescription: 'Senior dev' }).subscribe();
    const req = httpMock.expectOne('/api/ext/ai/cover-letter');
    expect(req.request.method).toBe('POST');
    req.flush(RUNNING_JOB, { status: 202, statusText: 'Accepted' });
  });

  it('GETs a job by id', () => {
    service.getJob(7).subscribe(job => expect(job.status).toBe('SUCCEEDED'));
    const req = httpMock.expectOne('/api/ext/ai/jobs/7');
    expect(req.request.method).toBe('GET');
    req.flush(DONE_JOB);
  });
});

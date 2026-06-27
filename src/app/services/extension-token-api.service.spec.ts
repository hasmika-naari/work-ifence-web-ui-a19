import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ExtensionTokenApiService } from './extension-token-api.service';

describe('ExtensionTokenApiService', () => {
  let service: ExtensionTokenApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExtensionTokenApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    service = TestBed.inject(ExtensionTokenApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('POSTs to /extension/token to issue', () => {
    service.issue('Work laptop').subscribe();
    const req = httpMock.expectOne('/api/ext/extension/token');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.label).toBe('Work laptop');
    req.flush({ token: 'jwt.abc', tokenId: 'id1', expiresAt: null }, { status: 201, statusText: 'Created' });
  });

  it('GETs /extension/tokens to list', () => {
    service.list().subscribe(tokens => expect(tokens.length).toBe(1));
    const req = httpMock.expectOne('/api/ext/extension/tokens');
    expect(req.request.method).toBe('GET');
    req.flush([{ tokenId: 'id1', status: 'ACTIVE', label: 'Home' }]);
  });

  it('POSTs to /extension/token/revoke with tokenId', () => {
    service.revoke('id1').subscribe();
    const req = httpMock.expectOne('/api/ext/extension/token/revoke');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.tokenId).toBe('id1');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('POSTs to /extension/token/revoke-all', () => {
    service.revokeAll().subscribe(res => expect(res.revoked).toBe(2));
    const req = httpMock.expectOne('/api/ext/extension/token/revoke-all');
    expect(req.request.method).toBe('POST');
    req.flush({ revoked: 2 });
  });

  it('POSTs to /applications/capture', () => {
    service.capture({ jobTitle: 'Engineer', company: 'Acme', jobUrl: 'https://acme.com/job/1' }).subscribe();
    const req = httpMock.expectOne('/api/ext/applications/capture');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.jobTitle).toBe('Engineer');
    req.flush({ id: 99 }, { status: 201, statusText: 'Created' });
  });
});

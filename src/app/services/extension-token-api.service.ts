import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ExtensionTokenSummary {
  tokenId: string;
  status: string;
  label?: string;
  issuedAt?: string;
  expiresAt?: string;
  revokedAt?: string;
  lastUsedAt?: string;
}

export interface IssuedExtensionToken {
  token: string;
  tokenId: string;
  expiresAt?: string;
}

export interface CaptureApplicationRequest {
  jobTitle: string;
  company: string;
  location?: string;
  jobUrl?: string;
  jdText?: string;
  resumeId?: number;
  source?: string;
}

/**
 * R1-E4 client for extension token management (S4.2) and application capture (S4.1).
 */
@Injectable({ providedIn: 'root' })
export class ExtensionTokenApiService {
  private static readonly EXT_BASE = '/api/ext/extension';
  private static readonly APP_BASE = '/api/ext/applications';

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  /** Issue a new extension token (raw JWT returned once). */
  issue(label?: string): Observable<IssuedExtensionToken> {
    return this.http.post<IssuedExtensionToken>(
      `${this.url(ExtensionTokenApiService.EXT_BASE)}/token`,
      label ? { label } : {}
    );
  }

  /** List all tokens for the current user (no raw JWT). */
  list(): Observable<ExtensionTokenSummary[]> {
    return this.http.get<ExtensionTokenSummary[]>(`${this.url(ExtensionTokenApiService.EXT_BASE)}/tokens`);
  }

  /** Revoke a single token by tokenId. */
  revoke(tokenId: string): Observable<void> {
    return this.http.post<void>(`${this.url(ExtensionTokenApiService.EXT_BASE)}/token/revoke`, { tokenId });
  }

  /** Revoke all tokens for the current user. */
  revokeAll(): Observable<{ revoked: number }> {
    return this.http.post<{ revoked: number }>(`${this.url(ExtensionTokenApiService.EXT_BASE)}/token/revoke-all`, {});
  }

  /** Capture a job posting as a tracked application (S4.1). */
  capture(req: CaptureApplicationRequest): Observable<unknown> {
    return this.http.post(`${this.url(ExtensionTokenApiService.APP_BASE)}/capture`, req);
  }

  private url(path: string): string {
    const base = (environment.backend ?? '').replace(/\/$/, '');
    return `${isPlatformBrowser(this.platformId) ? '' : base}${path}`;
  }
}

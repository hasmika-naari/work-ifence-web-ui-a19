import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PublicResumeDto,
  ResumeDetailDto,
  ResumeVisibility,
  ShareLinkResponse,
} from '../models/resume-share.model';

/**
 * R1-E1 client for the resume visibility/share + public-view ext endpoints.
 * Backend is authoritative (owner-scoped, entitlement-gated on `resume.share`); this is a thin,
 * SSR-safe HTTP wrapper mirroring the AccessApiService conventions.
 */
@Injectable({ providedIn: 'root' })
export class ResumeShareApiService {
  private static readonly BASE = '/api/ext/job-resumes';
  private static readonly PUBLIC_BASE = '/api/public/resumes';

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  /** Owner-facing resume snapshot (visibility + content). */
  getResume(id: number): Observable<ResumeDetailDto> {
    return this.http.get<ResumeDetailDto>(`${this.url(ResumeShareApiService.BASE)}/${id}`);
  }

  duplicate(id: number): Observable<unknown> {
    return this.http.post<unknown>(`${this.url(ResumeShareApiService.BASE)}/${id}/duplicate`, {});
  }

  setVisibility(id: number, visibility: ResumeVisibility): Observable<unknown> {
    return this.http.put<unknown>(`${this.url(ResumeShareApiService.BASE)}/${id}/visibility`, { visibility });
  }

  softDelete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url(ResumeShareApiService.BASE)}/${id}`);
  }

  /** Mint a revocable share link; the returned url embeds the public /r/{token} path. */
  createShareLink(id: number): Observable<ShareLinkResponse> {
    return this.http.post<ShareLinkResponse>(`${this.url(ResumeShareApiService.BASE)}/${id}/share`, {});
  }

  revokeShareLink(id: number, token: string): Observable<void> {
    return this.http.delete<void>(`${this.url(ResumeShareApiService.BASE)}/${id}/share/${encodeURIComponent(token)}`);
  }

  /** Public, unauthenticated read of a shared resume by token (404 unknown / 410 revoked|expired). */
  getPublicResume(token: string): Observable<PublicResumeDto> {
    return this.http.get<PublicResumeDto>(`${this.url(ResumeShareApiService.PUBLIC_BASE)}/${encodeURIComponent(token)}`);
  }

  private url(path: string): string {
    const base = (environment.backend ?? '').replace(/\/$/, '');
    return `${isPlatformBrowser(this.platformId) ? '' : base}${path}`;
  }
}

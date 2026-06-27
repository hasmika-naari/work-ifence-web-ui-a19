import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, timer, switchMap, takeWhile, share, last } from 'rxjs';
import { environment } from '../../environments/environment';

export type AiJobStatus = 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';
export type AiResumeMode = 'DRAFT' | 'IMPROVE' | 'FROM_UPLOAD' | 'FROM_JD' | 'COVER_LETTER';

export interface AiResumeJob {
  id: number;
  resumeId?: number;
  mode: AiResumeMode;
  status: AiJobStatus;
  resultJson?: string;
  matchScore?: number;
  missingKeywords?: string;
  errorMessage?: string;
  createdDate?: string;
  completedDate?: string;
}

export interface DraftRequest { resumeId?: number; sections?: string[]; }
export interface ImproveRequest { resumeId?: number; instructions?: string; }
export interface JdRequest { resumeId?: number; jobDescription?: string; jobUrl?: string; }

/**
 * R1-E2 client for the async AI resume endpoints.
 * Each POST returns 202 with an AiResumeJob; poll via poll(id) until terminal status.
 */
@Injectable({ providedIn: 'root' })
export class AiResumeApiService {
  private static readonly BASE = '/api/ext/ai';
  private static readonly POLL_INTERVAL_MS = 3000;

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  draft(req: DraftRequest): Observable<AiResumeJob> {
    return this.http.post<AiResumeJob>(`${this.url(AiResumeApiService.BASE)}/resume/draft`, req);
  }

  improve(req: ImproveRequest): Observable<AiResumeJob> {
    return this.http.post<AiResumeJob>(`${this.url(AiResumeApiService.BASE)}/resume/improve`, req);
  }

  fromUpload(file: File): Observable<AiResumeJob> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<AiResumeJob>(`${this.url(AiResumeApiService.BASE)}/resume/from-upload`, form);
  }

  fromJd(req: JdRequest): Observable<AiResumeJob> {
    return this.http.post<AiResumeJob>(`${this.url(AiResumeApiService.BASE)}/resume/from-jd`, req);
  }

  coverLetter(req: JdRequest): Observable<AiResumeJob> {
    return this.http.post<AiResumeJob>(`${this.url(AiResumeApiService.BASE)}/cover-letter`, req);
  }

  getJob(id: number): Observable<AiResumeJob> {
    return this.http.get<AiResumeJob>(`${this.url(AiResumeApiService.BASE)}/jobs/${id}`);
  }

  /** Poll job until SUCCEEDED or FAILED (every 3 s). Emits each status update. */
  poll(id: number): Observable<AiResumeJob> {
    return timer(0, AiResumeApiService.POLL_INTERVAL_MS).pipe(
      switchMap(() => this.getJob(id)),
      takeWhile(job => job.status === 'QUEUED' || job.status === 'RUNNING', true),
      share()
    );
  }

  private url(path: string): string {
    const base = (environment.backend ?? '').replace(/\/$/, '');
    return `${isPlatformBrowser(this.platformId) ? '' : base}${path}`;
  }
}

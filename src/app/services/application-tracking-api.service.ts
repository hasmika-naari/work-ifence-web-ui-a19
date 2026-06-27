import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type CommType = 'EMAIL' | 'CALL' | 'MESSAGE' | 'NOTE' | 'EVENT';
export type CommDirection = 'INBOUND' | 'OUTBOUND' | 'INTERNAL';

export interface JobApplicationSummary {
  id: number;
  jobTitle: string;
  company: string;
  location?: string;
  jobType?: string;
  applicationDate?: string;
  statusId: number;
  source?: string;
  jobUrl?: string;
  notes?: string;
  resumeId?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ApplicationCommunication {
  id?: number;
  applicationId: number;
  type: CommType;
  direction?: CommDirection;
  subject?: string;
  body?: string;
  contactName?: string;
  occurredAt?: string;
  createdDate?: string;
}

export interface ApplicationHistory {
  id?: number;
  applicationId: number;
  fromStatusId?: number;
  toStatusId?: number;
  changedAt?: string;
  changedBy?: string;
  note?: string;
}

export interface ApplicationDetailDto {
  application: JobApplicationSummary;
  resumeId?: number;
  resumeTitle?: string;
  resumeVersionNo?: number;
  jdText?: string;
  interviewRounds?: unknown[];
  interviewFeedback?: unknown[];
  communications?: ApplicationCommunication[];
  offer?: unknown;
  history?: ApplicationHistory[];
}

export interface CommunicationRequest {
  type: CommType;
  direction?: CommDirection;
  subject?: string;
  body?: string;
  contactName?: string;
  occurredAt?: string;
}

/**
 * R1-E3 client for application tracking ext endpoints + the JHipster list CRUD.
 */
@Injectable({ providedIn: 'root' })
export class ApplicationTrackingApiService {
  private static readonly EXT_BASE = '/api/ext/applications';
  private static readonly CRUD_BASE = '/api/job-applications';

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  /** Paginated list from the JHipster CRUD endpoint. Returns raw response (X-Total-Count in headers). */
  list(page = 0, size = 20): Observable<JobApplicationSummary[]> {
    const params = new HttpParams().set('page', page).set('size', size).set('sort', 'createdAt,desc');
    return this.http.get<JobApplicationSummary[]>(this.url(ApplicationTrackingApiService.CRUD_BASE), { params });
  }

  /** Full detail aggregate for one application (FR-APP-2). */
  getDetail(id: number): Observable<ApplicationDetailDto> {
    return this.http.get<ApplicationDetailDto>(`${this.url(ApplicationTrackingApiService.EXT_BASE)}/${id}/detail`);
  }

  /** Change status and record history (FR-APP-1). */
  changeStatus(id: number, statusId: number): Observable<JobApplicationSummary> {
    return this.http.post<JobApplicationSummary>(
      `${this.url(ApplicationTrackingApiService.EXT_BASE)}/${id}/status`,
      { statusId }
    );
  }

  /** Append a communication log entry (FR-APP-3). */
  addCommunication(id: number, req: CommunicationRequest): Observable<ApplicationCommunication> {
    return this.http.post<ApplicationCommunication>(
      `${this.url(ApplicationTrackingApiService.EXT_BASE)}/${id}/communications`,
      req
    );
  }

  private url(path: string): string {
    const base = (environment.backend ?? '').replace(/\/$/, '');
    return `${isPlatformBrowser(this.platformId) ? '' : base}${path}`;
  }
}

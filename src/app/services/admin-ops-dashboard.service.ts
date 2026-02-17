import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface OpsEntitlementHealthDto {
  status: 'OK' | 'WARNING' | 'Warning' | string;
  lastSyncAt?: string | null;
}

export interface OpsOnboardingSummaryDto {
  submitted: number;
  inReview: number;
  approved: number;
  rejected: number;
  avgTimeToApproval?: string | null;
}

export interface OpsSubscriptionsSummaryDto {
  trials: number;
  active: number;
  canceling: number;
  canceled: number;
  pastDue: number;
}

export interface OpsAuditLogRowDto {
  id?: string | number;
  createdDate?: string;
  actor?: string;
  eventType?: string;
  message?: string;
  entityType?: string;
  entityId?: string;
  outcome?: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  number: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class AdminOpsDashboardService {
  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  /** KPI 1: Pending onboarding total (uses X-Total-Count when provided). */
  getPendingOnboardingTotal(): Observable<number> {
    const params = new HttpParams()
      .set('status.in', 'SUBMITTED,IN_REVIEW')
      .set('page', '0')
      .set('size', '1');

    return this.fetchTotalCount<unknown>(`${this.baseUrl()}/api/onboarding-requests`, params);
  }

  /** KPI 2: Trials expiring in N days (best-effort: uses criteria param when supported). */
  getTrialsExpiringTotal(days: number): Observable<number> {
    const cutoff = new Date(Date.now() + Math.max(1, days) * 24 * 60 * 60 * 1000).toISOString();

    let params = new HttpParams()
      .set('status.equals', 'TRIAL')
      .set('page', '0')
      .set('size', '1');

    // If backend supports criteria, this yields correct totals via X-Total-Count/totalElements.
    params = params.set('currentPeriodEnd.lessThan', cutoff);

    return this.fetchTotalCount<unknown>(`${this.baseUrl()}/api/subscriptions`, params);
  }

  /** KPI 3: Canceling subscriptions total. */
  getCancelAtPeriodEndTotal(): Observable<number> {
    const params = new HttpParams().set('cancelAtPeriodEnd.equals', 'true').set('page', '0').set('size', '1');
    return this.fetchTotalCount<unknown>(`${this.baseUrl()}/api/subscriptions`, params);
  }

  /** KPI 4: Entitlement health. */
  getEntitlementHealth(): Observable<OpsEntitlementHealthDto> {
    return this.http.get<OpsEntitlementHealthDto>(`${this.baseUrl()}/api/admin/ops/entitlements/health`);
  }

  /** KPI 5: Security events total in last 24 hours. */
  getSecurityEvents24hTotal(): Observable<number> {
    const params = new HttpParams().set('createdDate.greaterThan', 'NOW-24h').set('page', '0').set('size', '1');
    return this.fetchTotalCount<OpsAuditLogRowDto>(`${this.baseUrl()}/api/audit-logs`, params);
  }

  /** Insights: onboarding breakdown summary. */
  getOnboardingSummary(): Observable<OpsOnboardingSummaryDto> {
    return this.http.get<OpsOnboardingSummaryDto>(`${this.baseUrl()}/api/admin/ops/onboarding/summary`);
  }

  /** Insights: subscription lifecycle summary (ops only). */
  getSubscriptionsSummary(): Observable<OpsSubscriptionsSummaryDto> {
    return this.http.get<OpsSubscriptionsSummaryDto>(`${this.baseUrl()}/api/admin/ops/subscriptions/summary`);
  }

  /** Insights: recent audit feed. */
  getRecentAuditFeed(): Observable<OpsAuditLogRowDto[]> {
    const params = new HttpParams().set('sort', 'createdDate,desc').set('page', '0').set('size', '6');

    return this.http
      .get<PagedResponse<OpsAuditLogRowDto> | OpsAuditLogRowDto[]>(`${this.baseUrl()}/api/audit-logs`, {
        params,
      })
      .pipe(map((resp) => (Array.isArray(resp) ? resp : Array.isArray(resp?.content) ? resp.content : [])));
  }

  private fetchTotalCount<T>(url: string, params: HttpParams): Observable<number> {
    return this.http
      .get<PagedResponse<T> | T[]>(url, {
        params,
        observe: 'response',
      })
      .pipe(map((resp) => this.extractTotal(resp)));
  }

  private extractTotal<T>(resp: HttpResponse<PagedResponse<T> | T[]>): number {
    const header = resp.headers.get('X-Total-Count') ?? resp.headers.get('x-total-count');
    if (header != null) {
      const n = Number.parseInt(String(header), 10);
      if (Number.isFinite(n)) return n;
    }

    const body = resp.body as any;
    if (body && typeof body.totalElements === 'number') {
      return body.totalElements;
    }

    if (Array.isArray(body)) return body.length;
    if (Array.isArray(body?.content)) return body.content.length;
    return 0;
  }

  private baseUrl(): string {
    const base = (environment.backend ?? '').replace(/\/$/, '');
    return isPlatformBrowser(this.platformId) ? '' : base;
  }
}

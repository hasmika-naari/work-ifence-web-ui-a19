import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { buildPageableParams } from 'src/app/shared/http/build-pageable-params';
import type { AuditEventRow, AuditQuery, PagedResponse } from 'src/app/models/audit.model';

@Injectable({ providedIn: 'root' })
export class AuditApiService {
  private auditUnavailableUntilMs = 0;

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  /** Admin-facing audit log. Backend may not be enabled; callers should handle 404. */
  searchAdminEvents(query: AuditQuery): Observable<PagedResponse<AuditEventRow>> {
    if (Date.now() < this.auditUnavailableUntilMs) {
      return of({ content: [], totalElements: 0, number: query.page, size: query.size });
    }

    return this.http.get<PagedResponse<AuditEventRow>>(`${this.getBaseUrl()}/api/admin/audit/events`, {
      params: this.toParams(query),
    });
  }

  /** Enterprise admin audit log. Backend may not be enabled; callers should handle 404. */
  searchEnterpriseEvents(query: AuditQuery): Observable<PagedResponse<AuditEventRow>> {
    if (Date.now() < this.auditUnavailableUntilMs) {
      return of({ content: [], totalElements: 0, number: query.page, size: query.size });
    }

    return this.http.get<PagedResponse<AuditEventRow>>(`${this.getBaseUrl()}/api/enterprise/audit/events`, {
      params: this.toParams(query),
    });
  }

  /** Optional ingest endpoint (best-effort). */
  ingestEvent(event: AuditEventRow): Observable<void> {
    if (Date.now() < this.auditUnavailableUntilMs) {
      return of(void 0);
    }

    return this.http.post<void>(`${this.getBaseUrl()}/api/audit/events`, event);
  }

  markAuditUnavailable(minutes: number): void {
    this.auditUnavailableUntilMs = Date.now() + Math.max(1, minutes) * 60_000;
  }

  private toParams(query: AuditQuery): HttpParams {
    return buildPageableParams({
      page: query.page,
      size: query.size,
      sort: query.sort,
      filters: {
        eventType: query.eventType,
        q: query.q,
        actor: query.actor,
        from: query.from,
        to: query.to,
      },
    });
  }

  private getBaseUrl(): string {
    const base = (environment.backend ?? '').replace(/\/$/, '');
    return isPlatformBrowser(this.platformId) ? '' : base;
  }
}

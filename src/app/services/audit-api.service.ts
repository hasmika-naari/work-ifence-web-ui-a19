import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, isDevMode } from '@angular/core';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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

    return this.http.get<PagedResponse<AuditEventRow>>(`${this.getBaseUrl()}/api/ext/admin/audit/events`, {
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

    return this.http.post<void>(`${this.getBaseUrl()}/api/audit/events`, event).pipe(
      catchError((err: unknown) => {
        const status = (err as HttpErrorResponse | undefined)?.status;
        if (status === 404 || status === 401 || status === 403 || status === 500) {
          if (status === 404) {
            this.markAuditUnavailable(10);
          }
          if (isDevMode()) {
            console.warn('[AuditApiService] Audit ingest skipped:', {
              status,
              url: `${this.getBaseUrl()}/api/audit/events`,
            });
          }
          return EMPTY;
        }
        return throwError(() => err);
      })
    );
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

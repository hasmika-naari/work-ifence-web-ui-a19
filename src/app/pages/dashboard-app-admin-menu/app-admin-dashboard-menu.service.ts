import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, throwError } from 'rxjs';
import { AppAdminDashboardSummary, PagedResponse } from './app-admin-dashboard-menu.api.models';
import { AllowedSubscriptionStatuses, HAS_TRIAL_STATUS, SubscriptionStatus } from './subscription-status.constants';

@Injectable({ providedIn: 'root' })
export class AppAdminDashboardMenuService {
  private readonly http = inject(HttpClient);

  getSummary(): Observable<AppAdminDashboardSummary> {
    return forkJoin({
      baseSummary: this.http.get<AppAdminDashboardSummary>('/api/ext/app-admin/dashboard/summary').pipe(
        catchError(() => of({} as AppAdminDashboardSummary)),
      ),
      activeSubscriptions: this.getPaged<any>('/api/wifence-subscriptions', {
        page: 0,
        size: 1,
        'status.equals': SubscriptionStatus.ACTIVE,
      }).pipe(catchError(() => of(this.emptyPagedResponse<any>()))),
      trialSubscriptions: HAS_TRIAL_STATUS
        ? this.getPaged<any>('/api/wifence-subscriptions', {
            page: 0,
            size: 1,
            'status.equals': SubscriptionStatus.TRIALING,
          }).pipe(catchError(() => of(this.emptyPagedResponse<any>())))
        : of(this.emptyPagedResponse<any>()),
    }).pipe(
      map(({ baseSummary, activeSubscriptions, trialSubscriptions }) => ({
        ...baseSummary,
        activeSubscriptions: activeSubscriptions.totalElements ?? baseSummary.activeSubscriptions ?? 0,
        trialSubscriptions: trialSubscriptions.totalElements ?? baseSummary.trialSubscriptions ?? 0,
      })),
    );
  }

  getOnboardings(params: Record<string, unknown>): Observable<PagedResponse<any>> {
    return this.getPaged<any>('/api/enterprise-onboardings', params);
  }

  getSubscriptions(params: Record<string, unknown>): Observable<PagedResponse<any>> {
    return this.getPaged<any>('/api/wifence-subscriptions', this.normalizeSubscriptionStatusParams(params));
  }

  getPlans(params: Record<string, unknown>): Observable<PagedResponse<any>> {
    const preferredParams = {
      ...this.normalizePlanSortParams(params),
      'isActive.equals': true,
    };

    return this.getPaged<any>('/api/subscription-plans', preferredParams).pipe(
      catchError((error: { status?: number; error?: { message?: string } }) => {
        const isInvalidSortError =
          error?.status === 400 &&
          /invalid sort field/i.test(error?.error?.message || '');

        if (!isInvalidSortError) {
          return throwError(() => error);
        }

        const fallbackCodeParams = { ...preferredParams, sort: 'code,asc' };
        const fallbackIdParams = { ...preferredParams, sort: 'id,asc' };

        return this.getPaged<any>('/api/subscription-plans', fallbackCodeParams).pipe(
          catchError(() => this.getPaged<any>('/api/subscription-plans', fallbackIdParams)),
        );
      }),
    );
  }

  getAppAdminUsers(params: Record<string, unknown>): Observable<PagedResponse<any>> {
    return this.getPaged<any>('/api/ext/app-admin/users', params);
  }

  getAuditLogs(params: Record<string, unknown>): Observable<PagedResponse<any>> {
    return this.getPaged<any>('/api/audit-logs', params);
  }

  getEntitlements(params: Record<string, unknown>): Observable<PagedResponse<any>> {
    return this.getPaged<any>('/api/plan-entitlements', params);
  }

  updateOnboarding(id: string | number, payload: Record<string, unknown>): Observable<any> {
    return this.http.put<any>(`/api/ext/enterprise-onboardings/${encodeURIComponent(String(id))}`, payload);
  }

  updateSubscription(id: string | number, payload: Record<string, unknown>): Observable<any> {
    return this.http.put<any>(`/api/ext/wifence-subscriptions/${encodeURIComponent(String(id))}`, payload);
  }

  updatePlan(id: string | number, payload: Record<string, unknown>): Observable<any> {
    return this.http.put<any>(`/api/ext/subscription-plans/${encodeURIComponent(String(id))}`, payload);
  }

  updateUser(idOrLogin: string | number, payload: Record<string, unknown>): Observable<any> {
    const encoded = encodeURIComponent(String(idOrLogin));
    return this.http.put<any>(`/api/ext/admin/users/${encoded}`, payload).pipe(
      catchError((error: { status?: number }) => {
        if (error?.status === 404 || error?.status === 405) {
          return this.http.put<any>(`/api/ext/users/${encoded}`, payload);
        }

        return throwError(() => error);
      }),
    );
  }

  updateAuditLog(id: string | number, payload: Record<string, unknown>): Observable<any> {
    const encoded = encodeURIComponent(String(id));
    return this.http.put<any>(`/api/ext/audit-logs/${encoded}`, payload).pipe(
      catchError((error: { status?: number }) => {
        if (error?.status === 404 || error?.status === 405) {
          return this.http.put<any>(`/api/ext/admin/audit-logs/${encoded}`, payload);
        }

        return throwError(() => error);
      }),
    );
  }

  private getPaged<T>(url: string, params: Record<string, unknown>): Observable<PagedResponse<T>> {
    return this.http
      .get<any>(url, {
        params: this.toHttpParams(params),
        observe: 'response',
      })
      .pipe(map((response) => this.toPagedResponse<T>(response)));
  }

  private toHttpParams(params: Record<string, unknown>): HttpParams {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      const normalized = String(value).trim();
      if (!normalized) {
        return;
      }

      httpParams = httpParams.set(key, normalized);
    });

    return httpParams;
  }

  private normalizeSubscriptionStatusParams(params: Record<string, unknown>): Record<string, unknown> {
    const normalized = { ...params };

    const statusEquals = this.normalizeSubscriptionStatusValue(params['status.equals']);
    if (statusEquals) {
      normalized['status.equals'] = statusEquals;
    } else {
      delete normalized['status.equals'];
    }

    const status = this.normalizeSubscriptionStatusValue(params['status']);
    if (status) {
      normalized['status'] = status;
    } else {
      delete normalized['status'];
    }

    return normalized;
  }

  private normalizeSubscriptionStatusValue(value: unknown): string | null {
    if (value === null || value === undefined) {
      return null;
    }

    const normalized = String(value)
      .trim()
      .toUpperCase()
      .replace(/[\s-]+/g, '_');

    return AllowedSubscriptionStatuses.has(normalized) ? normalized : null;
  }

  private normalizePlanSortParams(params: Record<string, unknown>): Record<string, unknown> {
    const normalized = { ...params };
    const sortRaw = String(params['sort'] ?? '').trim();

    if (!sortRaw) {
      normalized['sort'] = 'code,asc';
      return normalized;
    }

    const [fieldRaw, directionRaw] = sortRaw.split(',');
    const field = String(fieldRaw || '').trim();
    const direction = (String(directionRaw || 'asc').trim().toLowerCase() === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc';

    const allowedFields = new Set(['id', 'code', 'name', 'price', 'billingCycle', 'isActive', 'createdDate', 'lastModifiedDate']);
    const safeField = allowedFields.has(field) ? field : 'code';

    normalized['sort'] = `${safeField},${direction}`;
    return normalized;
  }

  private toPagedResponse<T>(response: HttpResponse<any>): PagedResponse<T> {
    const body = response.body ?? {};

    const items =
      body.content ??
      body.items ??
      body.results ??
      body.data ??
      (Array.isArray(body) ? body : []);

    const page = this.pickNumber(
      body.number,
      body.page,
      body.pageNumber,
      response.headers.get('X-Page'),
      0,
    );

    const size = this.pickNumber(
      body.size,
      body.pageSize,
      body.limit,
      response.headers.get('X-Size'),
      Array.isArray(items) ? items.length : 0,
    );

    const totalElements = this.pickNumber(
      body.totalElements,
      body.total,
      body.totalCount,
      response.headers.get('X-Total-Count'),
      Array.isArray(items) ? items.length : 0,
    );

    const totalPages = this.pickNumber(
      body.totalPages,
      body.pages,
      size > 0 ? Math.ceil(totalElements / size) : 1,
      1,
    );

    return {
      items: Array.isArray(items) ? (items as T[]) : [],
      page,
      size,
      totalElements,
      totalPages,
    };
  }

  private pickNumber(...values: unknown[]): number {
    for (const value of values) {
      if (value === null || value === undefined) {
        continue;
      }

      const parsed = Number(value);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }

    return 0;
  }

  private emptyPagedResponse<T>(): PagedResponse<T> {
    return {
      items: [],
      page: 0,
      size: 0,
      totalElements: 0,
      totalPages: 0,
    };
  }
}

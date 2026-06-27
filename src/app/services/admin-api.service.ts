import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { buildPageableParams } from 'src/app/shared/http/build-pageable-params';
import type {
  AdminOnboardingRequestRow,
  AdminSubscriptionPlanRequestRow,
  AdminSubscriptionUpgradeRequestRow,
  AdminSubscriptionRow,
  PagedResponse,
} from 'src/app/models/admin.model';

export interface ListOnboardingRequestsParams {
  status?: string;
  q?: string;
  page: number;
  size: number;
}

export interface ListSubscriptionsParams {
  subscriberType?: string;
  status?: string;
  q?: string;
  page: number;
  size: number;
}

export interface ListSubscriptionUpgradeRequestsParams {
  status?: string;
  plan?: string;
  page: number;
  size: number;
}

export interface ListSubscriptionPlanRequestsParams {
  status?: string;
  planCode?: string;
  requestType?: string;
  page: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  listOnboardingRequests(
    params: ListOnboardingRequestsParams
  ): Observable<PagedResponse<AdminOnboardingRequestRow>> {
    const httpParams = buildPageableParams({
      page: params.page,
      size: params.size,
      filters: {
        status: params.status,
        q: params.q,
      },
    });

    return this.http.get<PagedResponse<AdminOnboardingRequestRow>>(
      `${this.getBaseUrl()}/api/ext/admin/onboarding/requests`,
      { params: httpParams }
    );
  }

  getOnboardingRequest(id: string): Observable<Record<string, any>> {
    return this.http.get<Record<string, any>>(
      `${this.getBaseUrl()}/api/ext/admin/onboarding/requests/${encodeURIComponent(id)}`
    );
  }

  approveOnboarding(id: string, body: { adminNotes?: string }): Observable<void> {
    return this.http.post<void>(
      `${this.getBaseUrl()}/api/ext/admin/onboarding/requests/${encodeURIComponent(id)}/approve`,
      body
    );
  }

  rejectOnboarding(id: string, body: { adminNotes?: string }): Observable<void> {
    return this.http.post<void>(
      `${this.getBaseUrl()}/api/ext/admin/onboarding/requests/${encodeURIComponent(id)}/reject`,
      body
    );
  }

  needMoreInfoOnboarding(id: string, body: { adminNotes?: string }): Observable<void> {
    return this.http.post<void>(
      `${this.getBaseUrl()}/api/ext/admin/onboarding/requests/${encodeURIComponent(id)}/need-more-info`,
      body
    );
  }

  listSubscriptions(
    params: ListSubscriptionsParams
  ): Observable<PagedResponse<AdminSubscriptionRow>> {
    const httpParams = buildPageableParams({
      page: params.page,
      size: params.size,
      filters: {
        'subscriberType.equals': params.subscriberType,
        'status.equals': params.status,
        q: params.q,
      },
    });

    return this.http.get<PagedResponse<AdminSubscriptionRow>>(
      `${this.getBaseUrl()}/api/wifence-subscriptions`,
      { params: httpParams }
    ).pipe(
      map((response) => {
        const paged = this.normalizePagedResponse(
          response as PagedResponse<AdminSubscriptionRow> | AdminSubscriptionRow[],
          params.page,
          params.size
        );
        return { ...paged, content: paged.content.map((r) => this.normalizeSubscriptionRow(r)) };
      })
    );
  }

  getSubscription(id: string): Observable<AdminSubscriptionRow> {
    return this.http
      .get<AdminSubscriptionRow>(`${this.getBaseUrl()}/api/wifence-subscriptions/${encodeURIComponent(id)}`)
      .pipe(map((r) => this.normalizeSubscriptionRow(r)));
  }

  createSubscription(body: Partial<AdminSubscriptionRow>): Observable<AdminSubscriptionRow> {
    return this.http
      .post<AdminSubscriptionRow>(`${this.getBaseUrl()}/api/wifence-subscriptions`, body)
      .pipe(map((r) => this.normalizeSubscriptionRow(r)));
  }

  /**
   * Full-replace update via the extended admin endpoint.
   * Uses PUT /api/ext/wifence-subscriptions/{id} consistent with how
   * the rest of this project persists subscription edits.
   */
  updateSubscription(id: string, body: Partial<AdminSubscriptionRow>): Observable<AdminSubscriptionRow> {
    return this.http
      .put<AdminSubscriptionRow>(
        `${this.getBaseUrl()}/api/ext/wifence-subscriptions/${encodeURIComponent(id)}`,
        body
      )
      .pipe(map((r) => this.normalizeSubscriptionRow(r)));
  }

  listSubscriptionUpgradeRequests(
    params: ListSubscriptionUpgradeRequestsParams
  ): Observable<PagedResponse<AdminSubscriptionUpgradeRequestRow>> {
    const httpParams = buildPageableParams({
      page: params.page,
      size: params.size,
      filters: {
        status: params.status,
        plan: params.plan,
      },
    });

    return this.http.get<PagedResponse<AdminSubscriptionUpgradeRequestRow> | AdminSubscriptionUpgradeRequestRow[]>(
      `${this.getBaseUrl()}/api/admin/subscription-upgrade-requests`,
      { params: httpParams }
    ).pipe(
      map((response) => this.normalizePagedResponse(response, params.page, params.size))
    );
  }

  approveSubscriptionUpgradeRequest(id: string | number, body: { adminRemarks?: string }): Observable<void> {
    return this.http.patch<void>(
      `${this.getBaseUrl()}/api/admin/subscription-upgrade-requests/${encodeURIComponent(String(id))}/approve`,
      body
    );
  }

  rejectSubscriptionUpgradeRequest(id: string | number, body: { adminRemarks?: string }): Observable<void> {
    return this.http.patch<void>(
      `${this.getBaseUrl()}/api/admin/subscription-upgrade-requests/${encodeURIComponent(String(id))}/reject`,
      body
    );
  }

  extendTrial(id: string, body: { days: number; reason: string }): Observable<void> {
    return this.http.post<void>(
      `${this.getBaseUrl()}/api/ext/admin/subscriptions/${encodeURIComponent(id)}/extend-trial`,
      body
    );
  }

  // ---------------------------------------------------------------------------
  // Subscription Plan Requests  (/api/admin/subscription-plan-requests)
  // ---------------------------------------------------------------------------

  listPlanRequests(
    params: ListSubscriptionPlanRequestsParams
  ): Observable<PagedResponse<AdminSubscriptionPlanRequestRow>> {
    const httpParams = buildPageableParams({
      page: params.page,
      size: params.size,
      filters: {
        status: params.status,
        planCode: params.planCode,
        requestType: params.requestType,
      },
    });
    return this.http.get<PagedResponse<AdminSubscriptionPlanRequestRow> | AdminSubscriptionPlanRequestRow[]>(
      `${this.getBaseUrl()}/api/admin/subscription-plan-requests`,
      { params: httpParams }
    ).pipe(
      map((response) => this.normalizePagedResponse(response, params.page, params.size))
    );
  }

  getPlanRequest(id: string | number): Observable<AdminSubscriptionPlanRequestRow> {
    return this.http.get<AdminSubscriptionPlanRequestRow>(
      `${this.getBaseUrl()}/api/admin/subscription-plan-requests/${encodeURIComponent(String(id))}`
    );
  }

  approveTrial(
    id: string | number,
    body: {
      adminRemarks?: string;
      trialDays?: number;
      trialStartDate?: string;
      trialEndDate?: string;
    }
  ): Observable<void> {
    return this.http.patch<void>(
      `${this.getBaseUrl()}/api/admin/subscription-plan-requests/${encodeURIComponent(String(id))}/approve-trial`,
      body
    );
  }

  rejectPlanRequest(id: string | number, body: { adminRemarks?: string }): Observable<void> {
    return this.http.patch<void>(
      `${this.getBaseUrl()}/api/admin/subscription-plan-requests/${encodeURIComponent(String(id))}/reject`,
      body
    );
  }

  extendPlanTrial(
    id: string | number,
    body: { trialDays?: number; trialEndDate?: string; reason?: string }
  ): Observable<void> {
    return this.http.patch<void>(
      `${this.getBaseUrl()}/api/admin/subscription-plan-requests/${encodeURIComponent(String(id))}/extend-trial`,
      body
    );
  }

  endTrial(id: string): Observable<void> {
    return this.http.post<void>(
      `${this.getBaseUrl()}/api/ext/admin/subscriptions/${encodeURIComponent(id)}/end-trial`,
      {}
    );
  }

  activate(id: string): Observable<void> {
    return this.http.post<void>(
      `${this.getBaseUrl()}/api/ext/admin/subscriptions/${encodeURIComponent(id)}/activate`,
      {}
    );
  }

  suspend(id: string): Observable<void> {
    return this.http.post<void>(
      `${this.getBaseUrl()}/api/ext/admin/subscriptions/${encodeURIComponent(id)}/suspend`,
      {}
    );
  }

  /** Search platform users for the subscriber assignment autocomplete. */
  searchUsers(
    q: string,
    size = 20
  ): Observable<Array<{ login: string; firstName?: string; lastName?: string; email?: string }>> {
    const params = new HttpParams()
      .set('login.contains', q)
      .set('size', String(size));
    return this.http.get<Array<{ login: string; firstName?: string; lastName?: string; email?: string }>>(
      `${this.getBaseUrl()}/api/users`, { params }
    );
  }

  private normalizeSubscriptionRow(row: AdminSubscriptionRow): AdminSubscriptionRow {
    // ---------------------------------------------------------------------------
    // Subscription lifecycle summary (for future ext-API migration reference):
    //   BASIC free user            → status=ACTIVE,    planCode=BASIC   (Subscriptions tab)
    //   Trial granted              → status=TRIALING                    (Trials tab)
    //   Trial converted / upgraded → status=ACTIVE (paid plan)          (Subscriptions tab)
    //   Request pending/approved   → separate domain (/api/admin/subscription-plan-requests)
    //                                                                    (Requests tab)
    // ---------------------------------------------------------------------------
    return {
      ...row,
      // /api/wifence-subscriptions exposes the period-end date as nextBillingDate.
      // The admin subscriptions UI binds to currentPeriodEnd, so fall back here.
      currentPeriodEnd: row.currentPeriodEnd || row.nextBillingDate,
      // Preserve currentPeriodStart as-is (raw field from API).
      currentPeriodStart: row.currentPeriodStart,
      // Normalise display name for subscriber column enrichment.
      subscriberDisplayName:
        row.subscriberDisplayName || row.subscriberId || undefined,
    };
  }

  private getBaseUrl(): string {
    const base = (environment.backend ?? '').replace(/\/$/, '');
    return isPlatformBrowser(this.platformId) ? '' : base;
  }

  private normalizePagedResponse<T>(response: PagedResponse<T> | T[], page: number, size: number): PagedResponse<T> {
    if (Array.isArray(response)) {
      return {
        content: response,
        totalElements: response.length,
        number: page,
        size,
      };
    }

    return {
      content: response?.content ?? [],
      totalElements: response?.totalElements ?? response?.content?.length ?? 0,
      number: response?.number ?? page,
      size: response?.size ?? size,
    };
  }
}

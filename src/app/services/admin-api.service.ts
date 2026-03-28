import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { buildPageableParams } from 'src/app/shared/http/build-pageable-params';
import type {
  AdminOnboardingRequestRow,
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
        subscriberType: params.subscriberType,
        status: params.status,
        q: params.q,
      },
    });

    return this.http.get<PagedResponse<AdminSubscriptionRow>>(
      `${this.getBaseUrl()}/api/ext/admin/subscriptions`,
      { params: httpParams }
    );
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

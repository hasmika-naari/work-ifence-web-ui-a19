import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import type {
  AdminOnboardingRequestRow,
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

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  listOnboardingRequests(
    params: ListOnboardingRequestsParams
  ): Observable<PagedResponse<AdminOnboardingRequestRow>> {
    let httpParams = new HttpParams()
      .set('page', String(params.page))
      .set('size', String(params.size));

    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.q) httpParams = httpParams.set('q', params.q);

    return this.http.get<PagedResponse<AdminOnboardingRequestRow>>(
      `${this.getBaseUrl()}/api/admin/onboarding/requests`,
      { params: httpParams }
    );
  }

  getOnboardingRequest(id: string): Observable<Record<string, any>> {
    return this.http.get<Record<string, any>>(
      `${this.getBaseUrl()}/api/admin/onboarding/requests/${encodeURIComponent(id)}`
    );
  }

  approveOnboarding(id: string, body: { adminNotes?: string }): Observable<void> {
    return this.http.post<void>(
      `${this.getBaseUrl()}/api/admin/onboarding/requests/${encodeURIComponent(id)}/approve`,
      body
    );
  }

  rejectOnboarding(id: string, body: { adminNotes?: string }): Observable<void> {
    return this.http.post<void>(
      `${this.getBaseUrl()}/api/admin/onboarding/requests/${encodeURIComponent(id)}/reject`,
      body
    );
  }

  needMoreInfoOnboarding(id: string, body: { adminNotes?: string }): Observable<void> {
    return this.http.post<void>(
      `${this.getBaseUrl()}/api/admin/onboarding/requests/${encodeURIComponent(id)}/need-more-info`,
      body
    );
  }

  listSubscriptions(
    params: ListSubscriptionsParams
  ): Observable<PagedResponse<AdminSubscriptionRow>> {
    let httpParams = new HttpParams()
      .set('page', String(params.page))
      .set('size', String(params.size));

    if (params.subscriberType) httpParams = httpParams.set('subscriberType', params.subscriberType);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.q) httpParams = httpParams.set('q', params.q);

    return this.http.get<PagedResponse<AdminSubscriptionRow>>(
      `${this.getBaseUrl()}/api/admin/subscriptions`,
      { params: httpParams }
    );
  }

  extendTrial(id: string, body: { days: number; reason: string }): Observable<void> {
    return this.http.post<void>(
      `${this.getBaseUrl()}/api/admin/subscriptions/${encodeURIComponent(id)}/extend-trial`,
      body
    );
  }

  endTrial(id: string): Observable<void> {
    return this.http.post<void>(
      `${this.getBaseUrl()}/api/admin/subscriptions/${encodeURIComponent(id)}/end-trial`,
      {}
    );
  }

  activate(id: string): Observable<void> {
    return this.http.post<void>(
      `${this.getBaseUrl()}/api/admin/subscriptions/${encodeURIComponent(id)}/activate`,
      {}
    );
  }

  suspend(id: string): Observable<void> {
    return this.http.post<void>(
      `${this.getBaseUrl()}/api/admin/subscriptions/${encodeURIComponent(id)}/suspend`,
      {}
    );
  }

  private getBaseUrl(): string {
    const base = (environment.backend ?? '').replace(/\/$/, '');
    return isPlatformBrowser(this.platformId) ? '' : base;
  }
}

import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { SubscriptionPlanDto, WifenceSubscriptionDto } from '../models/subscription.dto';
import { buildCriteriaParams } from '../shared/http/build-criteria-params';
import type { CreateSubscriptionUpgradeRequest, StartSubscriptionRequest, SubscriptionPlan, SubscriptionPlanRequest, SubscriptionPlanRequestRow, SubscriptionScope, WifenceSubscription } from '../models/subscription.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionApiService {
  private readonly plansCache = new Map<string, Observable<SubscriptionPlan[]>>();

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  getMySubscription(scope?: SubscriptionScope): Observable<WifenceSubscriptionDto> {
    const base = `${this.getBaseUrl()}/api/subscriptions/my`;
    const url = scope ? `${base}?scope=${encodeURIComponent(scope)}` : base;
    return this.http.get<WifenceSubscriptionDto>(url);
  }

  /**
   * Returns active subscription plans for the given scope.
   * Cached per-scope using shareReplay(1) to avoid repeated calls.
   */
  getActivePlans(scope: SubscriptionScope): Observable<SubscriptionPlan[]> {
    const cacheKey = scope;
    const cached = this.plansCache.get(cacheKey);
    if (cached) return cached;

    const req$ = this.listPlans({ isActive: true, scope }).pipe(shareReplay(1)) as Observable<SubscriptionPlan[]>;

    this.plansCache.set(cacheKey, req$);
    return req$;
  }

  /**
   * Fetches subscription plans using JHipster Criteria filters.
   * Example URL:
   * /api/subscription-plans?isActive.equals=true&scope.equals=INDIVIDUAL
   */
  listPlans(criteria: { isActive?: boolean; scope?: SubscriptionScope }): Observable<SubscriptionPlan[]> {
    const params = buildCriteriaParams({
      // SubscriptionPlanCriteria field is `isActive` (not `active`).
      isActive: criteria.isActive,
      scope: criteria.scope,
    });

    return this.http.get<SubscriptionPlanDto[] | SubscriptionPlan[]>(`${this.getBaseUrl()}/api/subscription-plans`, {
      params,
    }) as Observable<SubscriptionPlan[]>;
  }

  startSubscription(req: StartSubscriptionRequest): Observable<WifenceSubscription> {
    const url = `${this.getBaseUrl()}/api/subscriptions/start`;
    return this.http.post<WifenceSubscription>(url, req);
  }

  submitUpgradeRequest(req: CreateSubscriptionUpgradeRequest): Observable<unknown> {
    const url = `${this.getBaseUrl()}/api/subscription-upgrade-requests`;
    return this.http.post(url, req);
  }

  /** Returns all plan requests submitted by the current user. */
  getMyPlanRequests(): Observable<SubscriptionPlanRequestRow[]> {
    return this.http.get<SubscriptionPlanRequestRow[]>(`${this.getBaseUrl()}/api/subscription-plan-requests/my`);
  }

  /** Submits a new subscription plan request (trial or upgrade). */
  submitPlanRequest(req: SubscriptionPlanRequest): Observable<SubscriptionPlanRequestRow> {
    return this.http.post<SubscriptionPlanRequestRow>(`${this.getBaseUrl()}/api/subscription-plan-requests`, req);
  }

  private getBaseUrl(): string {
    const base = (environment.backend ?? '').replace(/\/$/, '');
    return isPlatformBrowser(this.platformId) ? '' : base;
  }
}

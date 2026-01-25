import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { SubscriptionPlanDto, WifenceSubscriptionDto } from '../models/subscription.dto';
import type { StartSubscriptionRequest, SubscriptionPlan, SubscriptionScope, WifenceSubscription } from '../models/subscription.model';

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

    // Keep both param spellings for compatibility with older backends.
    const base = `${this.getBaseUrl()}/api/subscription-plans?isActive=true&active=true&scope=${encodeURIComponent(scope)}`;
    const req$ = this.http.get<SubscriptionPlanDto[] | SubscriptionPlan[]>(base).pipe(
      shareReplay(1)
    ) as Observable<SubscriptionPlan[]>;

    this.plansCache.set(cacheKey, req$);
    return req$;
  }

  startSubscription(req: StartSubscriptionRequest): Observable<WifenceSubscription> {
    const url = `${this.getBaseUrl()}/api/subscriptions/start`;
    return this.http.post<WifenceSubscription>(url, req);
  }

  private getBaseUrl(): string {
    const base = (environment.backend ?? '').replace(/\/$/, '');
    return isPlatformBrowser(this.platformId) ? '' : base;
  }
}

import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import type {
  PlanEntitlementDto,
  PagedResponse,
  SubscriptionPlanDto,
  WifenceServiceDto,
} from 'src/app/models/plan-admin.model';

export interface ListPlansParams {
  scope?: string;
  isActive?: boolean;
  page: number;
  size: number;
  sort?: string; // e.g. 'sortOrder,asc'
}

export interface ListEntitlementsParams {
  planId: string | number;
  page: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class PlanAdminApiService {
  private readonly services$:
    | Observable<PagedResponse<WifenceServiceDto>>
    | null = null;

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {
    this.services$ = this.http
      .get<PagedResponse<WifenceServiceDto>>(`${this.baseUrl()}/api/wifence-services`, {
        params: new HttpParams().set('page', '0').set('size', '200'),
      })
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  listPlans(params: ListPlansParams): Observable<PagedResponse<SubscriptionPlanDto>> {
    let httpParams = new HttpParams().set('page', String(params.page)).set('size', String(params.size));

    if (params.sort) httpParams = httpParams.set('sort', params.sort);
    if (params.scope) httpParams = httpParams.set('scope', params.scope);
    if (typeof params.isActive === 'boolean') httpParams = httpParams.set('isActive', String(params.isActive));

    return this.http.get<PagedResponse<SubscriptionPlanDto>>(`${this.baseUrl()}/api/subscription-plans`, {
      params: httpParams,
    });
  }

  getPlan(id: string | number): Observable<SubscriptionPlanDto> {
    return this.http.get<SubscriptionPlanDto>(`${this.baseUrl()}/api/subscription-plans/${encodeURIComponent(String(id))}`);
  }

  savePlan(plan: SubscriptionPlanDto): Observable<SubscriptionPlanDto> {
    if (!plan.id) {
      return this.http.post<SubscriptionPlanDto>(`${this.baseUrl()}/api/subscription-plans`, plan);
    }
    return this.http.put<SubscriptionPlanDto>(
      `${this.baseUrl()}/api/subscription-plans/${encodeURIComponent(String(plan.id))}`,
      plan
    );
  }

  listEntitlements(params: ListEntitlementsParams): Observable<PagedResponse<PlanEntitlementDto>> {
    const httpParams = new HttpParams()
      .set('planId', String(params.planId))
      .set('page', String(params.page))
      .set('size', String(params.size));

    return this.http.get<PagedResponse<PlanEntitlementDto>>(`${this.baseUrl()}/api/plan-entitlements`, {
      params: httpParams,
    });
  }

  saveEntitlement(ent: PlanEntitlementDto): Observable<PlanEntitlementDto> {
    if (!ent.id) {
      return this.http.post<PlanEntitlementDto>(`${this.baseUrl()}/api/plan-entitlements`, ent);
    }

    return this.http.put<PlanEntitlementDto>(
      `${this.baseUrl()}/api/plan-entitlements/${encodeURIComponent(String(ent.id))}`,
      ent
    );
  }

  deleteEntitlement(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl()}/api/plan-entitlements/${encodeURIComponent(String(id))}`);
  }

  listServices(): Observable<PagedResponse<WifenceServiceDto>> {
    // Initialized in constructor; kept null-safe for TS.
    return this.services$!;
  }

  private baseUrl(): string {
    const base = (environment.backend ?? '').replace(/\/$/, '');
    return isPlatformBrowser(this.platformId) ? '' : base;
  }
}

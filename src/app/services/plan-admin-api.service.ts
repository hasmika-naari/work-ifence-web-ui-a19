import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { buildPageableParams } from 'src/app/shared/http/build-pageable-params';
import { buildCriteriaParams } from 'src/app/shared/http/build-criteria-params';
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
  private readonly services$: Observable<PagedResponse<WifenceServiceDto>>;

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {
    this.services$ = this.http
      .get<PagedResponse<WifenceServiceDto> | WifenceServiceDto[]>(`${this.baseUrl()}/api/wifence-services`, {
        params: new HttpParams().set('page', '0').set('size', '200'),
      })
      .pipe(
        map((resp) => this.normalizePaged(resp, { page: 0, size: 200 }))
      )
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  listPlans(params: ListPlansParams): Observable<PagedResponse<SubscriptionPlanDto>> {
    const base = buildPageableParams({
      page: params.page,
      size: params.size,
      sort: params.sort,
    });

    const httpParams = buildCriteriaParams(
      {
        scope: params.scope,
        isActive: params.isActive,
      },
      base
    );

    return this.http
      .get<PagedResponse<SubscriptionPlanDto> | SubscriptionPlanDto[]>(`${this.baseUrl()}/api/subscription-plans`, {
        params: httpParams,
      })
      .pipe(map((resp) => this.normalizePaged(resp, { page: params.page, size: params.size })));
  }

  getPlan(id: string | number): Observable<SubscriptionPlanDto> {
    return this.http.get<SubscriptionPlanDto>(`${this.baseUrl()}/api/ext/subscription-plans/${encodeURIComponent(String(id))}`);
  }

  savePlan(plan: SubscriptionPlanDto): Observable<SubscriptionPlanDto> {
    if (!plan.id) {
      return this.http.post<SubscriptionPlanDto>(`${this.baseUrl()}/api/ext/subscription-plans`, plan);
    }
    return this.http.put<SubscriptionPlanDto>(
      `${this.baseUrl()}/api/ext/subscription-plans/${encodeURIComponent(String(plan.id))}`,
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
    return this.services$;
  }

  private normalizePaged<T>(
    resp: PagedResponse<T> | T[],
    fallback: { page: number; size: number }
  ): PagedResponse<T> {
    if (Array.isArray(resp)) {
      return {
        content: resp,
        totalElements: resp.length,
        number: fallback.page,
        size: fallback.size,
      } as PagedResponse<T>;
    }

    const content = Array.isArray((resp as any)?.content) ? (resp as any).content : [];
    const totalElements = typeof (resp as any)?.totalElements === 'number' ? (resp as any).totalElements : content.length;
    const number = typeof (resp as any)?.number === 'number' ? (resp as any).number : fallback.page;
    const size = typeof (resp as any)?.size === 'number' ? (resp as any).size : fallback.size;
    return { ...(resp as any), content, totalElements, number, size } as PagedResponse<T>;
  }

  private baseUrl(): string {
    const base = (environment.backend ?? '').replace(/\/$/, '');
    return isPlatformBrowser(this.platformId) ? '' : base;
  }
}

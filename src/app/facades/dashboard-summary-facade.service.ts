import { Injectable, Injector, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Observable,
  catchError,
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';
import { AccessFacadeService } from './access-facade.service';
import { DashboardContextService } from '../services/dashboard-context.service';
import { DashboardSummaryApiService } from '../services/dashboard-summary-api.service';
import type {
  EnterpriseDashboardSummary,
  PersonalDashboardSummary,
} from '../models/dashboard-summary.model';
import { DashboardApiService } from '../services/dashboard-api.service';

export type DashboardSummaryVm =
  | { type: 'PERSONAL'; summary: PersonalDashboardSummary | null }
  | { type: 'ENTERPRISE'; summary: EnterpriseDashboardSummary | null };

@Injectable({ providedIn: 'root' })
export class DashboardSummaryFacadeService {
  private readonly injector = inject(Injector);
  private readonly accessFacade = inject(AccessFacadeService);
  private readonly dashboardContext = inject(DashboardContextService);
  private readonly api = inject(DashboardSummaryApiService);

  // Optional fallback for older backends where /api/dashboard/summary/me doesn't exist yet.
  private readonly legacyDashboardApi = inject(DashboardApiService);

  private personalCache$: Observable<PersonalDashboardSummary> | null = null;
  private readonly enterpriseCache$ = new Map<string, Observable<EnterpriseDashboardSummary>>();

  private readonly loggedErrorKeys = new Set<string>();

  private readonly refreshNonce = signal(0);
  private readonly refresh$ = toObservable(this.refreshNonce, { injector: this.injector });

  private readonly enterpriseIdSignal = computed(() => {
    const id = (this.accessFacade.accessMeSignal()?.enterpriseId ?? '').toString();
    return id || null;
  });

  readonly personalSummarySignal = toSignal(this.buildPersonalSummary$(), {
    injector: this.injector,
    initialValue: null,
  });

  readonly enterpriseSummarySignal = toSignal(this.buildEnterpriseSummary$(), {
    injector: this.injector,
    initialValue: null,
  });

  readonly currentSummaryVmSignal = computed<DashboardSummaryVm>(() => {
    const ctx = this.dashboardContext.context();

    if (ctx === 'ENTERPRISE') {
      return { type: 'ENTERPRISE', summary: this.enterpriseSummarySignal() };
    }

    return { type: 'PERSONAL', summary: this.personalSummarySignal() };
  });

  constructor() {}

  reload(): void {
    this.personalCache$ = null;
    this.enterpriseCache$.clear();
    this.refreshNonce.update((n) => n + 1);
  }

  private buildPersonalSummary$(): Observable<PersonalDashboardSummary | null> {
    const isLoggedIn$ = toObservable(this.accessFacade.isLoggedIn, { injector: this.injector });

    return combineLatest([isLoggedIn$, this.refresh$]).pipe(
      switchMap(([isLoggedIn]) => (isLoggedIn ? this.getOrCreatePersonal$() : of(null)))
    );
  }

  private buildEnterpriseSummary$(): Observable<EnterpriseDashboardSummary | null> {
    const enterpriseId$ = toObservable(this.enterpriseIdSignal, { injector: this.injector });
    const ctx$ = toObservable(this.dashboardContext.context, { injector: this.injector });

    return combineLatest([ctx$, enterpriseId$, this.refresh$]).pipe(
      map(([ctx, enterpriseId, refreshNonce]) => ({ ctx, enterpriseId, refreshNonce })),
      distinctUntilChanged(
        (a, b) => a.ctx === b.ctx && a.enterpriseId === b.enterpriseId && a.refreshNonce === b.refreshNonce
      ),
      switchMap(({ ctx, enterpriseId }) => {
        if (ctx !== 'ENTERPRISE') return of(null);
        if (!enterpriseId) return of(null);
        return this.getOrCreateEnterprise$(enterpriseId);
      })
    );
  }

  private getOrCreatePersonal$(): Observable<PersonalDashboardSummary> {
    if (this.personalCache$) return this.personalCache$;

    // Prefer the new endpoint, but gracefully fall back to the legacy dashboard endpoint.
    this.personalCache$ = this.api.getMySummary().pipe(
      catchError((err) => {
        const httpErr = err as HttpErrorResponse;
        if (httpErr?.status === 404) {
          // TODO(back-end): implement /api/dashboard/summary/me
          return this.legacyDashboardApi.getMyDashboard().pipe(
            map((dto) => ({
              resumeCount: dto.resumeCount,
              jobApplicationCount: dto.jobApplicationCount,
              ongoingApplications: dto.ongoingApplicationsCount,
              offeredCount: dto.offeredCount,
              rejectedCount: dto.rejectedApplicationsCount,
            }))
          );
        }

        this.logOnce('personal', httpErr);
        return of({} as PersonalDashboardSummary);
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );

    return this.personalCache$;
  }

  private getOrCreateEnterprise$(enterpriseId: string): Observable<EnterpriseDashboardSummary> {
    const existing = this.enterpriseCache$.get(enterpriseId);
    if (existing) return existing;

    const created = this.api.getEnterpriseSummary(enterpriseId).pipe(
      catchError((err) => {
        const httpErr = err as HttpErrorResponse;
        // TODO(back-end): implement /api/dashboard/summary/enterprise/{enterpriseId}
        this.logOnce(`enterprise:${enterpriseId}`, httpErr);
        return of({} as EnterpriseDashboardSummary);
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );

    this.enterpriseCache$.set(enterpriseId, created);
    return created;
  }

  private logOnce(key: string, err: unknown): void {
    if (this.loggedErrorKeys.has(key)) return;
    this.loggedErrorKeys.add(key);
    console.error('[DashboardSummary]', key, err);
  }
}

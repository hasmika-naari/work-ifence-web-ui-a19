import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of, tap, map } from 'rxjs';
import { MyApi } from '../api/my.api';
import { MyDashboardDTO } from '../models/my-dashboard.model';
import { MyEntitlementsDTO } from '../models/my-entitlements.model';
import { SessionContextStore } from './session-context.store';
import { AccessContextService } from 'src/app/services/access-context.service';

@Injectable({ providedIn: 'root' })
export class UserDashboardStore {
  private readonly api = inject(MyApi);
  private readonly sessionContext = inject(SessionContextStore);
  private readonly accessContext = inject(AccessContextService);

  private readonly dashboardSubject = new BehaviorSubject<MyDashboardDTO | null>(null);
  readonly dashboard$ = this.dashboardSubject.asObservable();

  private readonly entitlementsSubject = new BehaviorSubject<MyEntitlementsDTO | null>(null);
  readonly entitlements$ = this.entitlementsSubject.asObservable();

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  private readonly errorSubject = new BehaviorSubject<string>('');
  readonly error$ = this.errorSubject.asObservable();

  constructor() {
    this.sessionContext.selectedRole$.subscribe((role) => {
      if (role !== 'ROLE_USER') {
        this.reset();
      }
    });
  }

  load(): Observable<{ dashboard: MyDashboardDTO | null; entitlements: MyEntitlementsDTO | null }> {
    if (!this.isSelectedRoleUser()) {
      this.reset();
      return of({ dashboard: null, entitlements: null });
    }

    this.loadingSubject.next(true);
    this.errorSubject.next('');

    return forkJoin({
      dashboard: this.api.getMyDashboard(),
      entitlements: this.loadEntitlements(),
    }).pipe(
      tap({
        next: ({ dashboard, entitlements }) => {
          this.dashboardSubject.next(dashboard);
          this.entitlementsSubject.next(entitlements);
          this.loadingSubject.next(false);
        },
        error: () => {
          this.errorSubject.next('Unable to load dashboard data right now. Showing available content.');
          this.loadingSubject.next(false);
        },
      }),
    );
  }

  loadDashboard(): Observable<MyDashboardDTO | null> {
    if (!this.isSelectedRoleUser()) {
      this.loadingSubject.next(false);
      return of(null);
    }

    this.loadingSubject.next(true);
    this.errorSubject.next('');

    return this.api.getMyDashboard().pipe(
      tap({
        next: (dashboard) => {
          this.dashboardSubject.next(dashboard);
          this.loadingSubject.next(false);
        },
        error: () => {
          this.errorSubject.next('Unable to load dashboard data right now. Showing available content.');
          this.loadingSubject.next(false);
        },
      }),
    );
  }

  loadEntitlements(): Observable<MyEntitlementsDTO | null> {
    if (!this.isSelectedRoleUser()) {
      this.loadingSubject.next(false);
      return of(null);
    }

    const cachedEntitlements = this.entitlementsSubject.value;
    if (cachedEntitlements) {
      return of(cachedEntitlements);
    }

    return this.api.getMyEntitlements().pipe(
      map((entitlements) => this.normalizeEntitlementsPayload(entitlements)),
      tap({
        next: (entitlements) => {
          this.entitlementsSubject.next(entitlements);
        },
        error: () => {
          this.errorSubject.next('Unable to load entitlements right now.');
        },
      }),
    );
  }

  hasEntitlement(key: string): boolean {
    const normalized = this.normalizeEntitlementKey(key);
    if (!normalized) {
      return false;
    }

    return (this.entitlementsSubject.value?.entitlements ?? []).some((entry) => this.normalizeEntitlementKey(entry) === normalized);
  }

  hasAnyEntitlement(keys: string[]): boolean {
    return (keys ?? []).some((entry) => this.hasEntitlement(entry));
  }

  dashboard(): MyDashboardDTO | null {
    return this.dashboardSubject.value;
  }

  entitlements(): MyEntitlementsDTO | null {
    return this.entitlementsSubject.value;
  }

  loading(): boolean {
    return this.loadingSubject.value;
  }

  error(): string {
    return this.errorSubject.value;
  }

  entitlementKeys(): string[] {
    return this.entitlementsSubject.value?.entitlements ?? [];
  }

  reset(): void {
    this.dashboardSubject.next(null);
    this.entitlementsSubject.next(null);
    this.loadingSubject.next(false);
    this.errorSubject.next('');
  }

  private isSelectedRoleUser(): boolean {
    if (this.sessionContext.isRole('ROLE_USER')) {
      return true;
    }

    const activeProfile = (this.accessContext.activeProfileKey() ?? '').toString().trim().toUpperCase();
    return (
      activeProfile === 'ROLE_USER' ||
      activeProfile === 'ROLE_INDIVIDUAL' ||
      activeProfile === 'INDIVIDUAL' ||
      activeProfile === 'PERSONAL'
    );
  }

  private normalizeEntitlementKey(value: unknown): string {
    return String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, '.')
      .replace(/\.+/g, '.');
  }

  private normalizeEntitlementsPayload(payload: unknown): MyEntitlementsDTO {
    const extractKeys = (source: unknown): string[] => {
      if (!source) {
        return [];
      }

      if (Array.isArray(source)) {
        return source
          .map((item) => {
            if (typeof item === 'string') {
              return item;
            }

            if (item && typeof item === 'object') {
              const candidate = item as { key?: unknown; code?: unknown; name?: unknown; allowed?: unknown };
              const allowed = candidate.allowed;
              if (allowed === false) {
                return '';
              }

              return String(candidate.key ?? candidate.code ?? candidate.name ?? '').trim();
            }

            return '';
          })
          .filter((item) => !!item);
      }

      if (typeof source === 'object') {
        const value = source as any;
        const nestedCandidates = [
          value.entitlements,
          value.features,
          value.items,
          value.permissions,
          value.allowed,
        ];

        for (const candidate of nestedCandidates) {
          const parsed = extractKeys(candidate);
          if (parsed.length > 0) {
            return parsed;
          }
        }
      }

      return [];
    };

    const parsed = extractKeys(payload)
      .map((entry) => String(entry).trim())
      .filter((entry) => !!entry);

    if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
      const source = payload as any;
      return {
        subscriberType: String(source.subscriberType ?? ''),
        subscriberId: String(source.subscriberId ?? ''),
        planCode: String(source.planCode ?? ''),
        subscriptionStatus: String(source.subscriptionStatus ?? ''),
        entitlements: parsed,
        limits: source.limits,
      };
    }

    return {
      subscriberType: '',
      subscriberId: '',
      planCode: '',
      subscriptionStatus: '',
      entitlements: parsed,
    };
  }
}

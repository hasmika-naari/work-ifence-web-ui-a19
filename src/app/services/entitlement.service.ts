import { Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserEntitlements, EntitlementMap, PlanTier } from '../nav/nav.model';
import { ENTITLEMENT_KEYS } from '../entitlements/entitlement-keys';
import { environment } from '../../environments/environment';
import type { EntitlementsResponse } from '../models/entitlements-response.model';
import { Observable, catchError, firstValueFrom, map, of, tap } from 'rxjs';

declare const ngDevMode: boolean;

const ENTITLEMENT_TTL_MS = 5 * 60 * 1000; // 5 minutes

export interface EntitlementSnapshot {
  loaded: boolean;
  planTier: PlanTier | null;
  entitlements: EntitlementMap;
}

@Injectable({ providedIn: 'root' })
export class EntitlementService {
  private _entitlements = signal<UserEntitlements | null>(null);
  private _lastFetched = 0;
  private _loggedProdFallback = false;

  constructor(private http: HttpClient) {}

  /**
   * Frontend is NOT source of truth for entitlements.
   * - The backend must enforce authorization for protected APIs and data.
   * - Frontend gating (nav/guards) is a UX optimization and defense-in-depth, not security.
   *
   * FE may use a DEV-only fallback to keep UI usable when backend is unavailable.
   * Production fallback must remain deny-by-default.
   */

  private logProdFallbackOnce(reason: string) {
    // DEV-only assertion: prod should never be running on fallback entitlements.
    // (This catches misconfiguration or backend outages during dev-mode builds.)
    if (typeof ngDevMode !== 'undefined' && ngDevMode) {
      if (environment.production && this._entitlements()?.isFallback && !this._loggedProdFallback) {
        this._loggedProdFallback = true;
        console.error('[EntitlementService] PRODUCTION ENTITLEMENT FALLBACK ACTIVE (deny-by-default):', reason);
        console.assert(
          Object.keys(this._entitlements()?.entitlements ?? {}).length === 0,
          '[EntitlementService] Production fallback must not grant any entitlements.'
        );
      }
    }
  }

  private debugLog(...args: unknown[]): void {
    if (!environment.production) {
      // eslint-disable-next-line no-console
      console.log('[EntitlementService]', ...args);
    }
  }

  private setFallbackEntitlements(reason: string) {
    if (environment.production) {
      this._entitlements.set({
        plan: PlanTier.FREE,
        entitlements: {},
        entitlementKeys: [],
        roles: [],
        isFallback: true
      });
    } else {
      // DEV/preview only: help UI development when backend is unavailable.
      console.warn('[EntitlementService] DEV ONLY ENTITLEMENT FALLBACK ACTIVE:', reason);
      const defaultEntitlements: EntitlementMap = {};
      Object.values(ENTITLEMENT_KEYS).forEach(key => {
        defaultEntitlements[key] = true;
      });
      // Legacy/compatibility key
      defaultEntitlements['notifications'] = true;
      this._entitlements.set({
        plan: PlanTier.FREE,
        entitlements: defaultEntitlements,
        entitlementKeys: Object.keys(defaultEntitlements),
        roles: ['ROLE_USER'],
        isFallback: true
      });
    }

    this.logProdFallbackOnce(reason);
    this._lastFetched = Date.now();
  }

  getEntitlements(): Signal<UserEntitlements | null> {
    // SSR-safe: do not auto-fetch on server
    if (typeof window === 'undefined') {
      // On SSR, always use a safe fallback state.
      if (!this._entitlements()) {
        this.setFallbackEntitlements('SSR: entitlements not fetched on server');
      }
      return this._entitlements;
    }

    // Client: fetch entitlements when empty or stale.
    if (!this._entitlements() || Date.now() - this._lastFetched > ENTITLEMENT_TTL_MS) {
      this.fetchEntitlements();
    }

    // Client: only apply fallback if nothing is loaded yet.
    // In production this MUST be safe (no granted entitlements).
    if (!this._entitlements()) {
      this.setFallbackEntitlements('Client: entitlements not yet available');
    }
    return this._entitlements;
  }

  /**
   * Apply a freshly-fetched backend response to the entitlement signal.
   * Useful when another service orchestrates the fetch order (e.g., profile switch refresh).
   */
  applyBackendResponse(raw: unknown): void {
    const decoded = this.decodeBackendEntitlements(raw);
    if (!decoded) {
      this.setFallbackEntitlements('Invalid backend entitlements contract (applyBackendResponse)');
      return;
    }

    this._entitlements.set(decoded);
    this._lastFetched = Date.now();
  }

  /** Force the next getEntitlements() call to refetch from backend. */
  invalidateCache(): void {
    this._lastFetched = 0;
  }

  private fetchEntitlements() {
    const e2eOverride = this.getE2EEntitlementsOverride();
    if (e2eOverride) {
      this._entitlements.set(e2eOverride);
      this._lastFetched = Date.now();
      return;
    }

    // Backend contract: `/api/entitlements/me` returns { plan, roles, entitlements, updatedAt? }.
    // If the contract breaks, FE fails closed by falling back (no entitlements granted in prod).
    this.http.get<unknown>('/api/entitlements/me').subscribe({
      next: raw => {
        this.debugLog('raw /api/entitlements/me response', raw);
        const decoded = this.decodeBackendEntitlements(raw);
        if (!decoded) {
          this.setFallbackEntitlements('Invalid backend entitlements contract (missing/invalid entitlements object)');
          return;
        }

        this._entitlements.set(decoded);
        this._lastFetched = Date.now();
      },
      error: err => {
        this.setFallbackEntitlements(`HTTP error loading /api/entitlements/me: ${String(err)}`);
      }
    });
  }

  private decodeBackendEntitlements(raw: unknown): UserEntitlements | null {
    if (!raw || typeof raw !== 'object') return null;

    const resp = raw as Partial<EntitlementsResponse> & Record<string, unknown>;
    const entRaw = (resp as any).entitlements;

    // Requirement: if entitlements missing or not object => treat as fallback
    if (!entRaw || typeof entRaw !== 'object' || Array.isArray(entRaw)) return null;

    const entitlements: EntitlementMap = {};
    for (const [k, v] of Object.entries(entRaw as Record<string, unknown>)) {
      if (typeof k !== 'string' || !k.trim()) continue;
      // Fail-closed: only explicit boolean true grants access.
      if (v === true) entitlements[k] = true;
    }

    const roles = Array.isArray((resp as any).roles) ? (resp as any).roles.filter((r: unknown) => typeof r === 'string') : [];
    const plan = this.normalizePlan((resp as any).plan);

    return {
      plan,
      entitlements,
      entitlementKeys: Object.keys(entitlements),
      roles,
      // Normalize: backend does not send isFallback; ensure it is false.
      isFallback: false,
    };
  }

  private normalizePlan(plan: unknown): PlanTier {
    const p = typeof plan === 'string' ? plan : '';
    switch (p) {
      case PlanTier.FREE:
      case PlanTier.PRO:
      case PlanTier.PREMIUM:
      case PlanTier.ENTERPRISE:
        return p;
      default:
        // Unknown plan values are treated as lowest tier to keep behavior fail-closed.
        return PlanTier.FREE;
    }
  }

  private getE2EEntitlementsOverride(): UserEntitlements | null {
    if (environment.production) return null;
    if (typeof window === 'undefined') return null;

    const e2e = window.__E2E__;
    const raw = e2e?.entitlements;
    if (!raw) return null;

    const entitlements: EntitlementMap = {};

    if (Array.isArray(raw.allowList)) {
      for (const k of raw.allowList) {
        if (typeof k === 'string' && k.trim()) entitlements[k.trim()] = true;
      }
    }

    if (raw.map && typeof raw.map === 'object') {
      for (const [k, v] of Object.entries(raw.map)) {
        if (!k || typeof v !== 'boolean') continue;
        entitlements[k] = v;
      }
    }

    return {
      plan: PlanTier.FREE,
      entitlements,
      entitlementKeys: Object.keys(entitlements),
      roles: Array.isArray(raw.roles) ? raw.roles : [],
      isFallback: false,
    };
  }

  plan(): PlanTier | null {
    return this._entitlements()?.plan ?? null;
  }

  entitlements(): EntitlementMap {
    return this._entitlements()?.entitlements ?? {};
  }

  entitlementKeys(): string[] {
    return this._entitlements()?.entitlementKeys ?? [];
  }

  roles(): string[] {
    return this._entitlements()?.roles ?? [];
  }

  async ensureLoaded(): Promise<void> {
    await firstValueFrom(this.loadIfNeeded().pipe(map(() => void 0)));
  }

  getSnapshot(): EntitlementSnapshot {
    const current = this._entitlements();
    return {
      loaded: !!current,
      planTier: current?.plan ?? null,
      entitlements: current?.entitlements ?? {},
    };
  }

  loadIfNeeded(): Observable<UserEntitlements | null> {
    const current = this._entitlements();
    const isFresh = !!current && Date.now() - this._lastFetched <= ENTITLEMENT_TTL_MS;

    if (isFresh) {
      return of(current);
    }

    const e2eOverride = this.getE2EEntitlementsOverride();
    if (e2eOverride) {
      this._entitlements.set(e2eOverride);
      this._lastFetched = Date.now();
      return of(e2eOverride);
    }

    return this.http.get<unknown>('/api/entitlements/me').pipe(
      map((raw) => {
        this.debugLog('raw /api/entitlements/me response', raw);
        return this.decodeBackendEntitlements(raw);
      }),
      tap((decoded) => {
        if (!decoded) {
          this.setFallbackEntitlements('Invalid backend entitlements contract (loadIfNeeded)');
          return;
        }

        this._entitlements.set(decoded);
        this._lastFetched = Date.now();
      }),
      map((decoded) => decoded ?? this._entitlements()),
      catchError((err) => {
        this.setFallbackEntitlements(`HTTP error loading /api/entitlements/me (loadIfNeeded): ${String(err)}`);
        return of(this._entitlements());
      })
    );
  }

  canAccess(entitlementKey: string, minPlan?: PlanTier): boolean {
    const ent = this.entitlements();
    const plan = this.plan();

    // Production safety: if we're in fallback mode, never grant access unless explicitly true.
    if (environment.production && this._entitlements()?.isFallback) {
      return !!entitlementKey && ent[entitlementKey] === true;
    }

    // Fail-closed: callers must provide an entitlementKey for entitlement-gated features.
    // If a caller wants plan-only gating, it must explicitly pass minPlan.
    if (!entitlementKey) {
      if (minPlan && plan) {
        const order = ['FREE','PRO','PREMIUM','ENTERPRISE'];
        return order.indexOf(plan) >= order.indexOf(minPlan);
      }
      return false;
    }
    if (ent[entitlementKey]) return true;
    if (minPlan && plan) {
      const order = ['FREE','PRO','PREMIUM','ENTERPRISE'];
      return order.indexOf(plan) >= order.indexOf(minPlan);
    }
    return false;
  }
}

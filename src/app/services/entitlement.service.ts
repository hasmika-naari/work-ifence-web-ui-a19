import { Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserEntitlements, EntitlementMap, PlanTier } from '../nav/nav.model';
import { ENTITLEMENT_KEYS } from '../entitlements/entitlement-keys';
import { environment } from '../../environments/environment';

declare const ngDevMode: boolean;

const ENTITLEMENT_TTL_MS = 5 * 60 * 1000; // 5 minutes

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

  private setFallbackEntitlements(reason: string) {
    if (environment.production) {
      this._entitlements.set({
        plan: PlanTier.FREE,
        entitlements: {},
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

  private fetchEntitlements() {
    this.http.get<UserEntitlements>('/api/me/entitlements').subscribe({
      next: data => {
        // Normalize: backend does not send isFallback; ensure it is false.
        this._entitlements.set({ ...data, isFallback: false });
        this._lastFetched = Date.now();
      },
      error: err => {
        this.setFallbackEntitlements(`HTTP error loading /api/me/entitlements: ${String(err)}`);
      }
    });
  }

  plan(): PlanTier | null {
    return this._entitlements()?.plan ?? null;
  }

  entitlements(): EntitlementMap {
    return this._entitlements()?.entitlements ?? {};
  }

  roles(): string[] {
    return this._entitlements()?.roles ?? [];
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

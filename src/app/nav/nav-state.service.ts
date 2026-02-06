import { Injectable, effect, signal, Signal } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EntitlementService } from '../services/entitlement.service';
import { NavSection, NavItem, UserEntitlements } from './nav.model';
import { RemoteConfigFacadeService } from '../facades/remote-config-facade.service';
import { environment } from '../../environments/environment';
import { NavApiService } from './nav-api.service';

@Injectable({ providedIn: 'root' })
export class NavStateService {
  private _sections = signal<NavSection[]>([]);
  private _menu = signal<NavSection[] | null>(null);
  private _loading = signal<boolean>(false);

  /**
   * Nav gating evaluation order (UI-only):
   * 1) Feature flag (RemoteConfigFacadeService)
   * 2) Role check
   * 3) Entitlement check
   * 4) Plan tier check (used to refine the lock reason when a min plan is required)
  *
  * Rendering semantics:
  * - Hidden: visible=false (do not render)
  * - Locked: visible=true + enabled=false (upgrade CTA)
  * - Enabled: visible=true + enabled=true
  *
  * Rules:
  * - If featureFlag is disabled => hidden
  * - If requiredRoles mismatch => hidden
  * - If not entitled / plan insufficient => showWhenLocked ? locked : hidden
   *
   * Important boundary: The frontend is NOT the source of truth for access control.
   * Backend APIs must enforce authorization. Frontend gating is defense-in-depth + UX.
   */

  constructor(
    private navApi: NavApiService,
    private entitlement: EntitlementService,
    private remoteConfig: RemoteConfigFacadeService
  ) {
    effect(() => {
      const ent = this.entitlement.getEntitlements()();
      if (!ent) {
        this._sections.set([]);
        return;
      }

      const menu = this._menu();
      if (menu) {
        this._sections.set(this.evaluateSections(menu, ent));
        return;
      }

      this.loadMenu(ent);
    });
  }

  navSections(): Signal<NavSection[]> {
    return this._sections;
  }

  private loadMenu(ent: UserEntitlements): void {
    if (this._loading()) return;
    this._loading.set(true);

    this.navApi
      .getMenu()
      .pipe(
        catchError(err => {
          console.warn('[NavStateService] Failed to load /api/nav/menu, using fallback menu:', err);
          return of(this.getFallbackMenu());
        })
      )
      .subscribe(sections => {
        const normalized = this.normalizeMenu(sections || []);
        this._menu.set(normalized);
        const latestEnt = this.entitlement.getEntitlements()() ?? ent;
        this._sections.set(this.evaluateSections(normalized, latestEnt));
        this._loading.set(false);
      });
  }

  private getFallbackMenu(): NavSection[] {
    return [];
  }

  private normalizeMenu(sections: NavSection[]): NavSection[] {
    return (sections || []).map(section => ({
      ...section,
      items: (section.items || []).map(item => this.normalizeItem(item))
    }));
  }

  private normalizeItem(item: NavItem): NavItem {
    const children = item.children?.map(child => this.normalizeItem(child));
    const route = item.route === '/authentication' ? '/sign-in' : item.route;
    return {
      ...item,
      route,
      children
    };
  }

  private evaluateSections(sections: NavSection[], ent: UserEntitlements): NavSection[] {
    // Deep clone to avoid mutating config
    if (!sections || !ent) return [];
    return sections
      .map(section => ({
        ...section,
        items: section.items
          .map(item => this.evaluateItem(item, ent))
          .filter(item => item.visible === true)
      }))
      // Filter out empty sections after applying hidden semantics
      .filter(section => section.items.length > 0);
  }

  private evaluateItem(item: NavItem, ent: UserEntitlements): NavItem {
    // Children are evaluated regardless; parent visibility may depend on children.
    let children = item.children;
    if (children) {
      children = children
        .map(child => this.evaluateItem(child, ent))
        .filter(child => child.visible === true);
    }

    // 1) Feature flag check => hidden
    if (item.featureFlag) {
      const flagEnabled = this.remoteConfig.isFlagEnabledSafe(item.featureFlag);
      if (!flagEnabled) {
        return { ...item, visible: false, enabled: false, lockedReason: '', children };
      }
    }

    // 2) Role check => hidden
    if (item.requiredRoles && !item.requiredRoles.some(r => ent.roles.includes(r))) {
      return { ...item, visible: false, enabled: false, lockedReason: '', children };
    }

    // Production safety: if entitlements are in fallback mode, treat gated items as not entitled.
    const isProdFallback = environment.production && ent?.isFallback;

    // 3) Entitlement check
    let entitled = true;
    let lockedReason = '';
    if (item.entitlementKey) {
      entitled = !isProdFallback && ent.entitlements[item.entitlementKey] === true;
      if (!entitled) {
        lockedReason = isProdFallback ? 'Entitlements unavailable' : 'Upgrade to unlock';
      }
    }

    // 4) Plan tier check (after entitlementKey) => may refine lock reason
    if (entitled && item.minPlan) {
      const order = ['FREE', 'PRO', 'PREMIUM', 'ENTERPRISE'];
      if (order.indexOf(ent.plan) < order.indexOf(item.minPlan)) {
        entitled = false;
        lockedReason = `Upgrade to ${item.minPlan} to unlock`;
      }
    } else if (!entitled && item.minPlan) {
      // If already not entitled, still prefer a specific plan lock reason when available.
      const order = ['FREE', 'PRO', 'PREMIUM', 'ENTERPRISE'];
      if (order.indexOf(ent.plan) < order.indexOf(item.minPlan)) {
        lockedReason = `Upgrade to ${item.minPlan} to unlock`;
      }
    }

    // If this is a purely grouping item (no route) and has visible children, keep it visible.
    const hasVisibleChildren = Array.isArray(children) && children.length > 0;

    if (!entitled) {
      const visible = item.showWhenLocked === true || hasVisibleChildren;
      return { ...item, visible, enabled: false, lockedReason, children };
    }

    // Entitled (or not gated)
    return { ...item, visible: true, enabled: true, lockedReason: '', children };
  }
}

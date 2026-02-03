import { Injectable, computed, signal, Signal } from '@angular/core';
import { NavConfigService } from './nav-config.service';
import { EntitlementService } from '../services/entitlement.service';
import { NavSection, NavItem, UserEntitlements } from './nav.model';
import { RemoteConfigFacadeService } from '../facades/remote-config-facade.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NavStateService {
  private _sections = signal<NavSection[]>([]);

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
    private navConfig: NavConfigService,
    private entitlement: EntitlementService,
    private remoteConfig: RemoteConfigFacadeService
  ) {
    computed(() => {
      const ent = this.entitlement.getEntitlements()();
      if (!ent) {
        this._sections.set([]);
        return [];
      }
      const sections = this.navConfig.getSectionsForRole(ent.roles[0] || 'ROLE_USER');
      const evaluated = this.evaluateSections(sections, ent);
      this._sections.set(evaluated);
      return evaluated;
    });
  }

  navSections(): Signal<NavSection[]> {
    return this._sections;
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

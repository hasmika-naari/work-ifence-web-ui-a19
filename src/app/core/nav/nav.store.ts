import { Injectable, computed, signal } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NavApiService } from './nav-api.service';
import { NavApiItem, NavApiResponse, NavApiSection } from './nav-api.model';
import { NavBadge, NavItem, NavSection, PlanTier } from 'src/app/nav/nav.model';
import { RemoteConfigFacadeService } from 'src/app/facades/remote-config-facade.service';
import { EntitlementService } from 'src/app/services/entitlement.service';

const CACHE_KEY = 'nav_me_cache_v1';

@Injectable({ providedIn: 'root' })
export class NavStore {
  private readonly navResponse = signal<NavApiResponse | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly sectionsSorted = computed<NavApiSection[]>(() => {
    const sections = this.navResponse()?.sections ?? [];
    return [...sections]
      .sort((a, b) => this.sortNum(a.sortOrder, b.sortOrder))
      .map(section => ({
        ...section,
        items: [...(section.items ?? [])].sort((a, b) => this.sortNum(a.sortOrder, b.sortOrder))
      }));
  });

  readonly visibleSections = computed<NavSection[]>(() => {
    const sections = this.sectionsSorted();
    return sections
      .map(section => this.toNavSection(section))
      .filter(section => section.items.length > 0);
  });

  constructor(
    private api: NavApiService,
    private remoteConfig: RemoteConfigFacadeService,
    private entitlement: EntitlementService
  ) {
    this.hydrateCache();
  }

  load(): void {
    if (this.loading()) return;
    if (this.navResponse()) return;
    this.refresh();
  }

  refresh(): void {
    if (this.loading()) return;
    this.loading.set(true);

    this.api.getMyNav()
      .pipe(
        catchError(err => {
          this.error.set(`Failed to load /api/nav/me: ${String(err)}`);
          const fallback = this.buildFallbackResponse();
          this.navResponse.set(fallback);
          this.persistCache(fallback);
          this.loading.set(false);
          return of(fallback);
        })
      )
      .subscribe(resp => {
        this.navResponse.set(resp);
        this.persistCache(resp);
        this.error.set(null);
        this.loading.set(false);
      });
  }

  clear(): void {
    this.navResponse.set(null);
    this.error.set(null);
  }

  private toNavSection(section: NavApiSection): NavSection {
    const items = (section.items ?? [])
      .map(item => this.toNavItem(item))
      .filter(item => item.visible === true);

    return {
      id: section.id,
      title: section.title,
      items
    };
  }

  private toNavItem(item: NavApiItem): NavItem {
    const children = item.children?.map(child => this.toNavItem(child));
    const route = item.route === '/authentication' ? '/sign-in' : item.route;
    const badge = item.badge
      ? {
          text: item.badge.text,
          type: this.normalizeBadgeType(item.badge.type)
        }
      : undefined;

    let visible = true;
    let enabled = true;
    let lockedReason = '';

    if (item.featureFlag && !this.remoteConfig.isFlagEnabledSafe(item.featureFlag)) {
      visible = false;
      enabled = false;
    } else {
      if (item.locked === true || item.allowed === false) {
        const showLocked = item.showWhenLocked === true;
        visible = showLocked;
        enabled = false;
        lockedReason = item.minPlan
          ? `Upgrade to ${item.minPlan} to unlock`
          : 'Upgrade to unlock';
      } else if (item.allowed === true || item.locked === false) {
        visible = true;
        enabled = true;
      } else {
        const minPlan = item.minPlan as PlanTier | undefined;
        const canAccess = item.entitlementKey
          ? this.entitlement.canAccess(item.entitlementKey, minPlan)
          : (minPlan ? this.entitlement.canAccess('', minPlan) : true);

        if (!canAccess) {
          const showLocked = item.showWhenLocked === true;
          visible = showLocked;
          enabled = false;
          lockedReason = minPlan ? `Upgrade to ${minPlan} to unlock` : 'Upgrade to unlock';
        } else {
          visible = true;
          enabled = true;
        }
      }
    }

    const hasVisibleChildren = Array.isArray(children) && children.some(c => c.visible);
    if (!visible && hasVisibleChildren) {
      visible = true;
    }

    return {
      id: item.id,
      title: item.title,
      icon: item.icon,
      route,
      featureFlag: item.featureFlag,
      entitlementKey: item.entitlementKey,
      minPlan: item.minPlan as PlanTier | undefined,
      showWhenLocked: item.showWhenLocked,
      externalUrl: item.externalUrl,
      tooltip: item.tooltip,
      badge,
      queryParams: item.queryParams,
      children,
      visible,
      enabled,
      lockedReason
    };
  }

  private normalizeBadgeType(type?: string): NavBadge['type'] | undefined {
    if (!type) return undefined;
    const normalized = type.toLowerCase();
    switch (normalized) {
      case 'info':
      case 'success':
      case 'warning':
      case 'danger':
      case 'pro':
      case 'premium':
        return normalized as NavBadge['type'];
      default:
        return undefined;
    }
  }

  private sortNum(a?: number, b?: number): number {
    return (a ?? 0) - (b ?? 0);
  }

  private hydrateCache(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as NavApiResponse;
      if (parsed?.sections) {
        this.navResponse.set(parsed);
      }
    } catch {
      // ignore
    }
  }

  private persistCache(resp: NavApiResponse): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(resp));
    } catch {
      // ignore
    }
  }

  private buildFallbackResponse(): NavApiResponse {
    return {
      user: {
        login: '',
        userId: '',
        roleKey: '',
        roles: [],
        planTier: 'FREE',
        planCode: '',
        subscriptionStatus: ''
      },
      sections: [
        {
          id: 'fallback',
          title: '',
          sortOrder: 0,
          items: [
            { id: 'dashboard', title: 'Dashboard', icon: 'grid', route: '/user/dashboard', allowed: true, locked: false, sortOrder: 1 },
            { id: 'profile', title: 'My Profile', icon: 'user', route: '/user/profile', allowed: true, locked: false, sortOrder: 2 },
            { id: 'logout', title: 'Logout', icon: 'log-out', route: '/authentication/logout', allowed: true, locked: false, sortOrder: 99 }
          ]
        }
      ]
    };
  }
}

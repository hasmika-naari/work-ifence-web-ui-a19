import { Injectable, computed, signal } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NavApiService } from './nav-api.service';
import { NavApiItem, NavApiResponse, NavApiSection } from './nav-api.model';
import { NavBadge, NavItem, NavSection, PlanTier } from 'src/app/nav/nav.model';
import { RemoteConfigFacadeService } from 'src/app/facades/remote-config-facade.service';
import { EntitlementService } from 'src/app/services/entitlement.service';
import { environment } from 'src/environments/environment';

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

    // Ensure entitlements are fetched so gating logic has data.
    this.entitlement.getEntitlements();

    this.api.getMyNav()
      .pipe(
        catchError(err => {
          this.error.set(`Failed to load /api/nav/menu: ${String(err)}`);
          const fallback = this.buildFallbackResponse();
          this.navResponse.set(fallback);
          this.persistCache(fallback);
          this.loading.set(false);
          return of(fallback);
        })
      )
      .subscribe(resp => {
        this.debugLog('raw /api/nav/menu response', resp);
        this.logFilterDiagnostics(resp);
        this.navResponse.set(resp);
        this.persistCache(resp);
        this.debugLog('nav counts', {
          sections: this.countSections(resp),
          itemsBeforeFilter: this.countItems(resp),
          itemsAfterFilter: this.countItemsFromSections(this.visibleSections())
        });
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
    const icon = this.normalizeIcon(item.icon);
    const badge = item.badge
      ? {
          text: item.badge.text,
          type: this.normalizeBadgeType(item.badge.type)
        }
      : undefined;

    let visible = true;
    let enabled = true;
    let lockedReason = '';
    const entitlements = this.entitlement.entitlements();

    const flagInfo = this.resolveFeatureFlagKey(item.featureFlag);
    if (flagInfo.key && flagInfo.known && !this.remoteConfig.isFlagEnabledSafe(flagInfo.key)) {
      this.debugLog('item hidden: featureFlag disabled', {
        id: item.id,
        title: item.title,
        featureFlag: flagInfo.key
      });
      visible = false;
      enabled = false;
    } else {
      if (flagInfo.key && !flagInfo.known) {
        this.debugLog('item featureFlag unknown (treated as enabled)', {
          id: item.id,
          title: item.title,
          featureFlag: flagInfo.key
        });
      }
      const allowed = !item.entitlementKey || entitlements[item.entitlementKey] === true;
      if (!allowed) {
        const showLocked = item.showWhenLocked === true;
        visible = showLocked;
        enabled = false;
        lockedReason = item.minPlan
          ? `Upgrade to ${item.minPlan} to unlock`
          : 'Upgrade to unlock';
        if (!showLocked) {
          this.debugLog('item hidden: entitlement missing without showWhenLocked', {
            id: item.id,
            title: item.title,
            entitlementKey: item.entitlementKey
          });
        }
      } else {
        visible = true;
        enabled = true;
      }
    }

    const hasVisibleChildren = Array.isArray(children) && children.some(c => c.visible);
    if (!visible && hasVisibleChildren) {
      visible = true;
    }

    return {
      id: item.id,
      title: item.title,
      icon,
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

  private normalizeIcon(name?: string): string {
    const normalized = (name ?? '').trim().toLowerCase();
    if (!normalized) return 'grid';
    if (this.validIcons.has(normalized)) return normalized;

    this.debugLog('item icon invalid, using fallback', { icon: normalized });
    return 'grid';
  }

  private resolveFeatureFlagKey(raw?: string): { key?: string; known: boolean } {
    const key = (raw ?? '').trim();
    if (!key) return { key: undefined, known: false };

    const lower = key.toLowerCase();
    if (lower === 'nav.placeholder') {
      return { key: undefined, known: false };
    }

    if (lower === 'job.alerts' && this.remoteConfig.getFlag('ALERTS' as any)) {
      return { key: 'ALERTS', known: true };
    }

    if (lower === 'user.dashboard' && this.remoteConfig.getFlag('USER_DASHBOARD' as any)) {
      return { key: 'USER_DASHBOARD', known: true };
    }

    if (this.remoteConfig.getFlag(key as any)) return { key, known: true };

    const normalized = key.replace(/[^a-zA-Z0-9]+/g, '_').toUpperCase();
    if (normalized && this.remoteConfig.getFlag(normalized as any)) {
      return { key: normalized, known: true };
    }

    return { key, known: false };
  }

  private logFilterDiagnostics(resp: NavApiResponse): void {
    const items = this.flattenItems(resp?.sections ?? []);
    const menuItems = items.map(item => ({
      id: item.id,
      title: item.title,
      featureFlag: item.featureFlag,
      entitlementKey: item.entitlementKey,
      showWhenLocked: item.showWhenLocked
    }));

    const entitlements = this.entitlement.entitlements();

    const hiddenByFeatureFlag = items
      .filter(item => {
        const flagInfo = this.resolveFeatureFlagKey(item.featureFlag);
        return !!flagInfo.key && flagInfo.known && !this.remoteConfig.isFlagEnabledSafe(flagInfo.key);
      })
      .map(item => ({
        id: item.id,
        title: item.title,
        featureFlag: item.featureFlag
      }));

    const hiddenByEntitlement = items
      .filter(item => {
        const allowed = !item.entitlementKey || entitlements[item.entitlementKey] === true;
        if (allowed) return false;
        return item.showWhenLocked !== true;
      })
      .map(item => ({
        id: item.id,
        title: item.title,
        entitlementKey: item.entitlementKey
      }));

    this.debugLog('menu items before filtering', menuItems);
    this.debugLog('items hidden by featureFlag', hiddenByFeatureFlag);
    this.debugLog('items hidden by entitlement', hiddenByEntitlement);
  }

  private flattenItems(sections: NavApiSection[]): NavApiItem[] {
    const result: NavApiItem[] = [];
    const visit = (items: NavApiItem[]) => {
      for (const item of items ?? []) {
        result.push(item);
        if (Array.isArray(item.children) && item.children.length > 0) {
          visit(item.children);
        }
      }
    };

    for (const section of sections ?? []) {
      visit(section.items ?? []);
    }

    return result;
  }

  private debugLog(...args: unknown[]): void {
    if (!environment.production) {
      // eslint-disable-next-line no-console
      console.log('[NavStore]', ...args);
    }
  }

  private countSections(resp: NavApiResponse | null): number {
    return resp?.sections?.length ?? 0;
  }

  private countItems(resp: NavApiResponse | null): number {
    return (resp?.sections ?? []).reduce((acc, section) => acc + (section.items?.length ?? 0), 0);
  }

  private countItemsFromSections(sections: NavSection[]): number {
    return (sections ?? []).reduce((acc, section) => acc + (section.items?.length ?? 0), 0);
  }

  private readonly validIcons = new Set<string>([
    'activity',
    'alert-circle',
    'alert-triangle',
    'align-left',
    'bar-chart-2',
    'bell',
    'book-open',
    'briefcase',
    'calendar',
    'camera',
    'check',
    'check-circle',
    'chevron-left',
    'clock',
    'code',
    'codepen',
    'coffee',
    'command',
    'copy',
    'crosshair',
    'database',
    'dollar-sign',
    'dribbble',
    'edit',
    'edit-3',
    'facebook',
    'file',
    'file-minus',
    'file-text',
    'flag',
    'folder',
    'github',
    'globe',
    'grid',
    'headphones',
    'heart',
    'home',
    'info',
    'key',
    'layers',
    'link',
    'linkedin',
    'list',
    'loader',
    'lock',
    'log-out',
    'mail',
    'map',
    'map-pin',
    'meh',
    'message-square',
    'minimize',
    'moon',
    'more-vertical',
    'octagon',
    'paperclip',
    'percent',
    'phone',
    'pie-chart',
    'play-circle',
    'plus',
    'search',
    'send',
    'settings',
    'share-2',
    'shopping-bag',
    'shopping-cart',
    'sliders',
    'smile',
    'star',
    'table',
    'tag',
    'thumbs-up',
    'trash',
    'trash-2',
    'trending-down',
    'trending-up',
    'twitch',
    'twitter',
    'user',
    'user-check',
    'user-plus',
    'users',
    'x',
    'youtube'
  ]);

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

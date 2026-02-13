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

  // Tracks whether we've fetched nav from the server in this browser session.
  // (We may hydrate a cached response first; we still want a fresh fetch.)
  private fetchedThisSession = false;

  readonly sectionsSorted = computed<NavApiSection[]>(() => {
    const sections = this.navResponse()?.sections ?? [];
    return [...sections]
      .sort((a, b) => this.sortNum(a.sortOrder, b.sortOrder))
      .map(section => ({
        ...section,
        items: [...(section.items ?? [])].sort((a, b) => this.sortNum(a.sortOrder, b.sortOrder))
      }));
  });

  readonly allSections = computed<NavSection[]>(() => {
    const sections = this.sectionsSorted();
    // Render ALL sections/items returned by the backend menu, even if locked.
    // Client-side entitlement/feature-flag filtering is intentionally not applied here.
    return sections.map(section => this.toNavSection(section));
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

    // If we only have a hydrated cache, still refresh once to get the latest menu.
    if (this.navResponse() && this.fetchedThisSession) return;
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
          this.error.set(`Failed to load /api/access/nav/menu: ${String(err)}`);
          const fallback = this.buildFallbackResponse();
          this.navResponse.set(fallback);
          this.persistCache(fallback);
          this.fetchedThisSession = true;
          this.loading.set(false);
          return of(fallback);
        })
      )
      .subscribe(resp => {
        this.debugLog('raw /api/access/nav/menu response', resp);
        this.logFilterDiagnostics(resp);
        this.navResponse.set(resp);
        this.persistCache(resp);
        this.fetchedThisSession = true;
        this.debugLog('nav counts', {
          sections: this.countSections(resp),
          itemsBeforeFilter: this.countItems(resp),
          itemsAfterFilter: this.countItemsFromSections(this.allSections())
        });
        this.error.set(null);
        this.loading.set(false);
      });
  }

  /**
   * Apply a backend nav response without issuing a new HTTP request.
   * Accepts either the full response shape ({ user, sections }) or a sections array.
   */
  applyBackendResponse(raw: unknown): void {
    const normalized = this.normalizeBackendResponse(raw);
    if (!normalized) {
      const fallback = this.buildFallbackResponse();
      this.navResponse.set(fallback);
      this.persistCache(fallback);
      this.fetchedThisSession = true;
      return;
    }

    this.debugLog('raw /api/access/nav/menu response (applied)', normalized);
    this.logFilterDiagnostics(normalized);
    this.navResponse.set(normalized);
    this.persistCache(normalized);
    this.fetchedThisSession = true;
    this.error.set(null);
  }

  clear(): void {
    this.navResponse.set(null);
    this.error.set(null);
    this.fetchedThisSession = false;

    // Avoid showing stale menu after profile switch.
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(CACHE_KEY);
      } catch {
        // ignore
      }
    }
  }

  private normalizeBackendResponse(raw: unknown): NavApiResponse | null {
    if (!raw) return null;

    // Some endpoints may return sections array directly
    if (Array.isArray(raw)) {
      return {
        user: {
          login: '',
          userId: '',
          roleKey: '',
          roles: [],
          planTier: '',
          planCode: '',
          subscriptionStatus: ''
        },
        sections: raw as NavApiSection[]
      };
    }

    if (typeof raw === 'object') {
      const maybe = raw as Partial<NavApiResponse>;
      if (Array.isArray((maybe as any).sections)) {
        return maybe as NavApiResponse;
      }
    }

    return null;
  }

  private toNavSection(section: NavApiSection): NavSection {
    const items = (section.items ?? []).map(item => this.toNavItem(item));
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

    // Always render items returned by the backend.
    // Mark locked when backend says so, or when explicit allowed=false is provided.
    const lockedByBackend = item.locked === true;
    const lockedByAllowed = typeof item.allowed === 'boolean' ? item.allowed === false : false;
    const locked = lockedByBackend || lockedByAllowed;
    const enabled = !locked;
    const visible = true;
    const lockedReason = locked
      ? (item.minPlan ? `Upgrade to ${item.minPlan} to unlock` : 'Upgrade to unlock')
      : '';

    return {
      id: item.id,
      title: item.title,
      icon,
      route,
      featureFlag: item.featureFlag,
      entitlementKey: item.entitlementKey,
      minPlan: item.minPlan as PlanTier | undefined,
      showWhenLocked: item.showWhenLocked,
      locked,
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
        return item.showWhenLocked !== true && item.locked !== true;
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

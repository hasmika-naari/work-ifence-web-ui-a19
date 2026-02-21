import { CommonModule, isPlatformBrowser, Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, PLATFORM_ID, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NavigationCancel, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { firstValueFrom, of } from 'rxjs';
import { catchError, filter, map, take, timeout } from 'rxjs/operators';
import { SidebarDirective } from '../../@navan/shared/sidebar/sidebar.directive';
import { ThemeService } from '../../@navan/services/theme.service';
import { HeaderComponent } from '../common/header/header.component';
import { SidebarComponent } from '../common/sidebar/sidebar.component';
import { ToggleService } from '../common/header/toggle.service';
import { IconsModule } from '../shared/icons.module';
import { AccessContextService } from '../services/access-context.service';
import { ProfilePanelService } from '../services/profile-panel.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import type { AccessMeDto, OwnedProfileDto } from '../models/access-me.model';
import { NavStore } from '../core/nav/nav.store';
import { SessionContextStore } from '../core/store/session-context.store';
import { getLandingRoute } from 'src/app/routing/landing-route.util';
import { ActiveProfileStore } from 'src/app/auth/active-profile.store';
import { NavbarStoreService } from 'src/main/webapp/app/core/navbar/navbar-store.service';
import { ActiveProfileService } from 'src/app/services/active-profile.service';
import { ProfileContextStorageService } from 'src/app/services/profile-context-storage.service';
import { AccessContextStore } from 'src/app/core/store/access-context.store';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'wif-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    MatSidenavModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    IconsModule,
  ],
  providers: [
    Location,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    }
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [
    trigger('sidenavSlide', [
      state('open', style({
        opacity: 1,
        transform: 'translateX(0)',
        'pointer-events': 'auto',
      })),
      state('closed', style({
        opacity: 0,
        // Move fully off-canvas; don't leave an invisible panel intercepting clicks.
        transform: 'translateX(100%)',
        'pointer-events': 'none',
      })),
      transition('closed => open', [
        animate('200ms cubic-bezier(0.16, 1, 0.3, 1)')
      ]),
      transition('open => closed', [
        animate('160ms cubic-bezier(0.16, 1, 0.3, 1)')
      ]),
    ]),
    trigger('backdropFade', [
      state('open', style({
        opacity: 0.35,
        backdropFilter: 'blur(2px)',
      })),
      state('closed', style({
        opacity: 0,
        backdropFilter: 'blur(0px)',
      })),
      transition('closed => open', [
        animate('180ms cubic-bezier(0.16, 1, 0.3, 1)')
      ]),
      transition('open => closed', [
        animate('120ms cubic-bezier(0.16, 1, 0.3, 1)')
      ]),
    ]),
  ]
})
export class LayoutComponent implements OnInit, OnDestroy {
  @ViewChild('configPanel', { static: false })
  configPanel: SidebarDirective | undefined;

  @ViewChild('headerSentinel', { static: false })
  headerSentinel!: ElementRef;

  @ViewChild('menuSidenav', { static: false })
  private menuSidenavRef?: MatSidenav;

  // Prefer-reduced-motion (used by template attributes)
  prefersReducedMotion = false;

  // Right-side profile/menu panel open state (template calls rightSidenavOpen())
  readonly rightSidenavOpen = signal(false);

  // Track current URL as a signal so we can react to profile-context changes.
  readonly currentUrl = signal<string>('');
  readonly profileSwitchNavigationInFlight = signal(false);

  // Services used directly by template
  readonly profilePanelService = inject(ProfilePanelService);
  readonly accessContextService = inject(AccessContextService);
  readonly sessionContextStore = inject(SessionContextStore);
  private readonly navStore = inject(NavStore);
  private readonly activeProfileStore = inject(ActiveProfileStore);
  private readonly navbarStore = inject(NavbarStoreService);
  private readonly activeProfileService = inject(ActiveProfileService);
  private readonly profileContextStorage = inject(ProfileContextStorageService);
  private readonly accessContextStore = inject(AccessContextStore);
  private layoutNavigationQueue: Promise<void> = Promise.resolve();

  readonly profileRoles$ = this.sessionContextStore.account$.pipe(
    map((account) => account?.authorities ?? []),
  );

  private readonly platformId: object = inject(PLATFORM_ID);
  readonly toggleService: ToggleService = inject(ToggleService);
  private readonly deviceService: DeviceDetectorService = inject(DeviceDetectorService);
  readonly locationService: Location = inject(Location);

  isBrowser = false;
  isMobile = false;
  isTablet = false;
  isDesktop = true;
  isToggled = false;

  public isSticky = false;
  private observer?: IntersectionObserver;

  title = 'workifence -  Angular 19 Material Design Admin Dashboard Template';
  routerSubscription: any;
  location: any;

  constructor(
    private readonly themeService: ThemeService,
    public readonly router: Router
  ) {
    this.toggleService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
    });

    // Ensure we never remain on an admin-only route after switching away from Admin profile.
    // canActivate guards won't re-run on an already-activated route, so we enforce it here.
    effect(() => {
      const profileKey = (this.accessContextService.activeProfileKey() ?? '').toString();
      const url = (this.currentUrl() ?? '').toString();
      const switching = this.profilePanelService.switching();
      const switchingNavigation = this.profileSwitchNavigationInFlight();

      if (!profileKey) return;
      if (switching) return;
      if (switchingNavigation) return;

      const inAdminArea = url.startsWith('/user/dashboard-admin') || url.startsWith('/user/admin');
      const inPersonalDashboard = url.startsWith('/user/dashboard') && !url.startsWith('/user/dashboard-admin');

      // If we are on an admin-only page but active profile is not admin, redirect to that profile's dashboard.
      if (inAdminArea && profileKey !== 'ROLE_ADMIN') {
        const target = this.profileLandingRoute(profileKey);
        if (target && !url.startsWith(target)) {
          this.profileSwitchNavigationInFlight.set(true);
          void this.queueLayoutNavigation(target).finally(() => {
            this.profileSwitchNavigationInFlight.set(false);
          });
        }
        return;
      }

      // If we are on personal dashboard but active profile is admin, redirect to admin dashboard.
      if (inPersonalDashboard && profileKey === 'ROLE_ADMIN') {
        const target = this.profileLandingRoute(profileKey);
        if (target && !url.startsWith(target)) {
          this.profileSwitchNavigationInFlight.set(true);
          void this.queueLayoutNavigation(target).finally(() => {
            this.profileSwitchNavigationInFlight.set(false);
          });
        }
      }
    });

  }

  // Proxy for logout
  logoutHandler($event: any) {
    // Header is a standalone component; logout is handled there.
    // Keep this hook for the layout's sidenav logout button.
    // If HeaderComponent instance is available in the view tree, call through.
    const headerComponent = this.headerComponentSignal();
    if (headerComponent?.logoutHandler) {
      headerComponent.logoutHandler($event);
    }
    this.closeRightSidenav();
  }

  // Keep this for logout proxy only.
  private headerComponentSignal = signal<HeaderComponent | undefined>(undefined);
  @ViewChild(HeaderComponent) set headerComponent(component: HeaderComponent | undefined) {
    this.headerComponentSignal.set(component);
  }

  ngOnInit(): void {
    this.sessionContextStore.loadAccount().subscribe({ error: () => void 0 });

    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Initialize URL signal
      this.currentUrl.set(this.router.url ?? '');

      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.currentUrl.set(this.router.url ?? '');
        });

      if (this.deviceService.isDesktop()) {
        this.isDesktop = true;
        this.isMobile = false;
        this.isTablet = false;
      } else if (this.deviceService.isMobile()) {
        this.isMobile = true;
        this.isDesktop = false;
        this.isTablet = false;
      } else if (this.deviceService.isTablet()) {
        this.isTablet = true;
        this.isMobile = false;
        this.isDesktop = false;
      }
    }
  }

  openMenuSidenav(menuSidenav: MatSidenav) {
    this.rightSidenavOpen.set(true);
    menuSidenav.open();
  }
  
  async closeMenuSidenav(menuSidenav: MatSidenav): Promise<void> {
    // Update state immediately; await close to keep sequencing predictable.
    this.rightSidenavOpen.set(false);

    // MatSidenav.close() can occasionally hang or throw (animation/focus edge cases).
    // Profile switching must always navigate, so never let close() block forever.
    try {
      await Promise.race([
        menuSidenav.close(),
        new Promise<void>((resolve) => setTimeout(resolve, 250)),
      ]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[Layout] Failed to close profile panel; continuing.', err);
    }
  }

  closeRightSidenav(): void {
    this.menuSidenavRef?.close();
    this.rightSidenavOpen.set(false);
  }

  async switchProfileFromPanel(profileKey: string, menuSidenav: MatSidenav): Promise<void> {
    if (this.profilePanelService.isSwitching) return;
    if (this.isActiveProfile(profileKey)) return;
    if (this.profileSwitchNavigationInFlight()) return;

    this.profileSwitchNavigationInFlight.set(true);

    try {
      const fromProfileKey = this.normalizeProfileKey(
        this.accessContextStore.activeProfileKey || this.accessContextService.activeProfileKey(),
      );
      const targetProfileKey = this.normalizeProfileKey(profileKey);

      const ok = await this.profilePanelService.switchProfile(profileKey, () => {
        void this.closeMenuSidenav(menuSidenav);
      });
      if (!ok) return;

      this.profileContextStorage.setProfileContext(
        targetProfileKey,
        this.profileContextStorage.inferModeFromRole(targetProfileKey),
      );

      await firstValueFrom(
        this.accessContextStore.refreshAfterProfileSwitch().pipe(catchError(() => of(void 0))),
      );

      const toProfileKey = this.normalizeProfileKey(this.accessContextStore.activeProfileKey || targetProfileKey);
      const mode = (this.accessContextStore.mode || this.profileContextStorage.inferModeFromRole(toProfileKey)).toUpperCase();
      const nextHomeRoute = (this.accessContextStore.homeRoute || getLandingRoute(toProfileKey)).trim();

      this.profileContextStorage.setProfileContext(toProfileKey, mode);
      this.sessionContextStore.switchRole(toProfileKey);
      this.activeProfileStore.setActiveRole(toProfileKey);

      this.navbarStore.applySectionsFromAccessContext(this.accessContextStore.navMenuSections, toProfileKey);

      if (!environment.production) {
        console.debug(`[PROFILE_SWITCH] from=${fromProfileKey || 'UNKNOWN'}, to=${toProfileKey || 'UNKNOWN'}, nextHomeRoute=${nextHomeRoute || 'UNKNOWN'}`);
      }

      await this.router.navigateByUrl(nextHomeRoute || '/user/dashboard', { replaceUrl: true });
    } finally {
      this.profileSwitchNavigationInFlight.set(false);
    }
  }

  private queueLayoutNavigation(target: string): Promise<boolean> {
    const next = this.layoutNavigationQueue.then(() => this.navigateByUrlSafely(target));
    this.layoutNavigationQueue = next.then(() => void 0, () => void 0);
    return next;
  }

  private async navigateByUrlSafely(target: string): Promise<boolean> {
    if (!target) return false;
    if (this.router.url.startsWith(target)) return true;

    try {
      return await this.router.navigateByUrl(target, { replaceUrl: true });
    } catch (error) {
      const name = (error as { name?: string })?.name ?? '';
      if (name === 'AbortError' || name === 'InvalidStateError') {
        return false;
      }
      throw error;
    }
  }

  private profileSwitchTargetRoute(profileKey: string): string {
    const normalized = this.normalizeProfileKey(profileKey);
    if (normalized === 'ROLE_ADMIN' || normalized === 'ROLE_USER') {
      return getLandingRoute(normalized);
    }
    return this.profileLandingRoute(profileKey);
  }

  private async waitForNavbarLoad(): Promise<void> {
    await firstValueFrom(
      this.navbarStore.navbar$.pipe(
        filter((navbar) => !!navbar),
        take(1),
        timeout({ first: 5000 }),
        catchError(() => of(null)),
      ),
    );
  }

  onProfileItemActivate(event: Event, profileKey: string, menuSidenav: MatSidenav): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.profilePanelService.isSwitching) return;
    if (this.isActiveProfile(profileKey)) return;
    // Delegate to the async switch handler.
    void this.switchProfileFromPanel(profileKey, menuSidenav);
  }

  onProfileItemKeydown(event: KeyboardEvent, profileKey: string, menuSidenav: MatSidenav): void {
    const key = event.key;
    const isEnter = key === 'Enter';
    const isSpace = key === ' ' || key === 'Spacebar' || key === 'Space';
    if (!isEnter && !isSpace) return;
    event.preventDefault();
    event.stopPropagation();

    if (this.profilePanelService.isSwitching) return;
    if (this.isActiveProfile(profileKey)) return;
    void this.switchProfileFromPanel(profileKey, menuSidenav);
  }

  isActiveProfile(profileKey: string): boolean {
    const current = this.normalizeProfileKey(this.accessContextService.activeProfileKey());
    const target = this.normalizeProfileKey(profileKey);
    return !!current && !!target && current === target;
  }

  private normalizeProfileKey(value: string | null | undefined): string {
    const normalized = (value ?? '').toString().trim().toUpperCase();
    if (!normalized) return '';
    if (normalized === 'ENTERPRISE_ADMIN') return 'ROLE_ENTERPRISE_ADMIN';
    if (normalized === 'ENTERPRISE_EMPLOYEE') return 'ROLE_ENTERPRISE_EMPLOYEE';
    if (normalized === 'PLATFORM_ADMIN') return 'ROLE_ADMIN';
    return normalized;
  }

  private routeForSelectedRole(role: string): string {
    const normalized = (role ?? '').toString().trim().toUpperCase();

    if (normalized === 'ROLE_USER') {
      return '/user/dashboard';
    }

    if (normalized === 'ROLE_ADMIN' || normalized === 'PLATFORM_ADMIN') {
      return '/user/dashboard-admin';
    }

    if (
      normalized === 'ROLE_ENTERPRISE_ADMIN' ||
      normalized === 'ROLE_ENTERPRISE_EMPLOYEE' ||
      normalized === 'ENTERPRISE_ADMIN' ||
      normalized === 'ENTERPRISE_EMPLOYEE'
    ) {
      return '/user/enterprise/org';
    }

    return '/user/dashboard';
  }

  activeProfileLabel(): string {
    const key = this.accessContextService.activeProfileKey();
    if (!key) return '';

    const profiles = this.accessContextService.ownedProfiles();
    const match = (profiles ?? []).find((p: any) => p?.key === key);
    return this.profileLabel(match ?? ({ key } as OwnedProfileDto));
  }

  profileLabel(profile: Partial<OwnedProfileDto> | null | undefined): string {
    const label = (profile?.label ?? '').toString().trim();
    if (label) return label;

    const key = (profile?.key ?? '').toString().trim();
    if (!key) return '';

    switch (key) {
      case 'ROLE_ADMIN':
        return 'Admin';
      case 'ROLE_USER':
        return 'Personal';
      case 'ROLE_ENTERPRISE_ADMIN':
        return 'Enterprise Admin';
      case 'ROLE_ENTERPRISE_EMPLOYEE':
        return 'Enterprise';
      default:
        return key
          .replace(/^ROLE_/, '')
          .replace(/_/g, ' ')
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }

  profileLandingRoute(profileKey: string | null | undefined): string {
    const key = (profileKey ?? '').toString();

    // Highest priority: resolve from the (refreshed) BE-driven nav menu.
    // Requirement: route should be picked from the menu dashboard first item.
    const fromMenu = this.resolveDashboardRouteFromMenu(key);
    if (fromMenu) return fromMenu;

    const me = this.accessContextService.accessMe();
    const homeRoute = (me?.availableProfiles ?? []).find((p: any) => (p?.key ?? '').toString() === key)?.homeRoute;
    if (typeof homeRoute === 'string' && homeRoute.trim()) {
      return homeRoute.trim();
    }
    let route = '';
    switch (profileKey) {
      case 'ROLE_ADMIN':
        route = '/user/dashboard-admin';
        break;    
      case 'ROLE_ENTERPRISE_ADMIN':
        route = '/user/enterprise/org';
        break;
      case 'ROLE_ENTERPRISE_EMPLOYEE':
      case 'ROLE_USER':
        route = '/user/dashboard'; 
        break;
      default:
        route = '/user/dashboard';
    }
    return route;
  }

  private resolveDashboardRouteFromMenu(profileKey: string): string | null {
    const wantsAdmin = profileKey === 'ROLE_ADMIN';
    const sections = this.navStore.allSections();

    const flat: Array<{ route?: string; title?: string }> = [];
    const visit = (items: any[] | undefined) => {
      for (const it of items ?? []) {
        flat.push({ route: it?.route, title: it?.title });
        if (Array.isArray(it?.children) && it.children.length > 0) {
          visit(it.children);
        }
      }
    };
    for (const s of sections ?? []) {
      visit((s as any)?.items);
    }

    const isAdminDashboardRoute = (r: string) => r.includes('/user/dashboard-admin');
    const isUserDashboardRoute = (r: string) => r.includes('/user/dashboard') && !isAdminDashboardRoute(r);

    const match = flat.find((it) => {
      const r = (it.route ?? '').toString();
      if (!r) return false;
      return wantsAdmin ? isAdminDashboardRoute(r) : isUserDashboardRoute(r);
    });

    const route = (match?.route ?? '').toString().trim();
    return route ? route : null;
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isSticky = false;
    const contentWrapper = document.querySelector('.content-wrapper');
    this.observer = new IntersectionObserver(
      (entries) => {
        this.isSticky = !entries[0].isIntersecting;
      },
      { root: contentWrapper }
    );
    if (this.headerSentinel?.nativeElement) {
      this.observer.observe(this.headerSentinel.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();

    try {
      this.routerSubscription?.unsubscribe?.();
    } catch {
      // ignore
    }
  }

  openConfigPanel() {
    this.configPanel?.open();
  }

  onClickOutside(){
    this.configPanel?.close();
  }


  @HostListener('mouseenter', ['$event.target'])
  onMouseEnter($event: any): void {
    // $event.stopPropgation();
    // this.sidenavService.setMouseOver(true); // Prevent collapse
  }

  @HostListener('mouseleave', ['$event.target'])
  onMouseLeave($event: any): void {
    // $event.stopPropogation();

    // this.sidenavService.setMouseOver(false); // Allow collapse
  }

  // recallJsFuntions
  recallJsFuntions(): void {
    this.routerSubscription = this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd | NavigationCancel =>
            event instanceof NavigationEnd || event instanceof NavigationCancel
        )
      )
      .subscribe((event) => {
        this.location = this.router.url;
        if (!(event instanceof NavigationEnd)) {
          return;
        }
        this.scrollToTop();
      });
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }
}


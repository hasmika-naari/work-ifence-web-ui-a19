import { CommonModule, isPlatformBrowser, Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, PLATFORM_ID, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NavigationCancel, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { filter } from 'rxjs/operators';
import { SidebarDirective } from '../../@navan/shared/sidebar/sidebar.directive';
import { ThemeService } from '../../@navan/services/theme.service';
import { HeaderComponent } from '../common/header/header.component';
import { SidebarComponent } from '../common/sidebar/sidebar.component';
import { ToggleService } from '../common/header/toggle.service';
import { IconsModule } from '../shared/icons.module';
import { AccessContextService } from '../services/access-context.service';
import { ProfilePanelService } from '../services/profile-panel.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'wif-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
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
      })),
      state('closed', style({
        opacity: 0,
        transform: 'translateX(24px)',
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

  // Services used directly by template
  readonly profilePanelService = inject(ProfilePanelService);
  readonly accessContextService = inject(AccessContextService);

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
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          // no-op; keeps parity with legacy behavior
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

  openMenuSidenav(menuSidenav: { open: () => void; }) {
    this.rightSidenavOpen.set(true);
    menuSidenav.open();
  }
  
  closeMenuSidenav(menuSidenav: { close: () => void; }) {
    menuSidenav.close();
    this.rightSidenavOpen.set(false);
  }

  closeRightSidenav(): void {
    this.menuSidenavRef?.close();
    this.rightSidenavOpen.set(false);
  }

  async switchProfileFromPanel(profileKey: string, menuSidenav: MatSidenav): Promise<void> {
    if (this.profilePanelService.isSwitching) return;
    if (this.accessContextService.activeProfileKey() === profileKey) return;

    const ok = await this.profilePanelService.switchProfile(profileKey);
    if (!ok) return;

    await this.router.navigateByUrl(this.profileLandingRoute(profileKey), { replaceUrl: true });
    this.closeMenuSidenav(menuSidenav);
  }

  onProfileItemActivate(event: Event, profileKey: string, menuSidenav: MatSidenav): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.profilePanelService.isSwitching) return;
    if (this.accessContextService.activeProfileKey() === profileKey) return;
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
    if (this.accessContextService.activeProfileKey() === profileKey) return;
    void this.switchProfileFromPanel(profileKey, menuSidenav);
  }

  activeProfileLabel(): string {
    const key = this.accessContextService.activeProfileKey();
    if (!key) return '';

    const profiles = this.accessContextService.ownedProfiles();
    const match = (profiles ?? []).find((p: any) => p?.key === key);
    return match?.label ?? key;
  }

  profileLandingRoute(profileKey: string | null | undefined): string {
    switch (profileKey) {
      case 'ROLE_ADMIN':
        return '/user/dashboard-admin';
      case 'ROLE_ENTERPRISE_ADMIN':
        return '/user/enterprise/org';
      case 'ROLE_ENTERPRISE_EMPLOYEE':
      case 'ROLE_USER':
        return '/user/dashboard';
      default:
        return '/user/dashboard';
    }
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
    alert('Heloo Close');
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


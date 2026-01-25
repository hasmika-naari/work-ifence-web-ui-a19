
import { Component, ElementRef, HostListener, OnDestroy, OnInit, PLATFORM_ID, ViewChild, inject, AfterViewInit, computed, effect, signal } from '@angular/core';

interface LayoutRole { title: string; [key: string]: any; }
import { SidebarDirective } from '../../@navan/shared/sidebar/sidebar.directive';
import { filter, map, startWith } from 'rxjs/operators';
import { ThemeService } from '../../@navan/services/theme.service';
import { ActivatedRoute, NavigationCancel, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { checkRouterChildsData } from '../../@navan/utils/check-router-childs-data';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule, isPlatformBrowser, LocationStrategy, PathLocationStrategy, Location } from '@angular/common';
import { SidebarComponent } from '../common/sidebar/sidebar.component';
import { HeaderComponent } from '../common/header/header.component';
import { ToggleService } from '../common/header/toggle.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { stubFalse } from 'lodash';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { IconsModule } from '../shared/icons.module';
import { UserStoreService } from '../services/store/user-store.service';
import { WifRole } from '../services/profile.model';
import { ActiveRoleService } from '../services/active-role.service';
import { AccessFacadeService } from '../facades/access-facade.service';
import { AccessMeDto } from '../models/access-me.model';
import { DashboardContextService } from '../services/dashboard-context.service';

@Component({
  selector: 'wif-layout',
  standalone: true,
   imports: [RouterOutlet, CommonModule, SidebarComponent, HeaderComponent, MatSidenavModule,
     MatIconModule, MatDividerModule, IconsModule],
   providers: [
    Location, 
    {
        provide: LocationStrategy,
        useClass: PathLocationStrategy
    }
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  menuSidenavOpened = false;

  // Use signals for role menu (single source: ActiveRoleService -> UserStore)
  private readonly userStore: UserStoreService = inject(UserStoreService);
  private readonly activeRoleService: ActiveRoleService = inject(ActiveRoleService);
  private readonly accessFacade: AccessFacadeService = inject(AccessFacadeService);
  private readonly dashboardContext: DashboardContextService = inject(DashboardContextService);

  userRoles = computed(() => this.buildRoles(this.accessFacade.accessMeSignal()));
  userActiveRole = computed(() => this.activeRoleService.getActiveRole()());

  constructor(
    private themeService: ThemeService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    // Keep the legacy role store in sync (for active role highlighting + persistence via ActiveRoleService)
    effect(() => {
      const roles = this.userRoles();
      const current = this.userStore.getUserRoles()();

      const currentKey = (current ?? []).map((r) => r.role).join('|');
      const nextKey = (roles ?? []).map((r) => r.role).join('|');
      if (currentKey !== nextKey) {
        this.userStore.updateRoles(roles);
      }
    });

    this.toggleService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });
  }

  // Role switching happens ONLY here (layout role menu)
  switchDashboard($event: any, role: WifRole) {
    this.activeRoleService.setActiveRole(role);

    const title = (role?.title ?? '').toLowerCase();
    const isPlatformAdmin = title.includes('platform admin') || role?.role === 'PLATFORM_ADMIN' || role?.role === 'ROLE_ADMIN';

    // Update UI-only dashboard context when switching roles
    if (role?.role === 'PERSONAL') {
      this.dashboardContext.setPersonal();
    } else if (role?.role === 'ENTERPRISE_ADMIN' || role?.role === 'ENTERPRISE_EMPLOYEE') {
      this.dashboardContext.setEnterprise();
    }

    this.router.navigateByUrl(isPlatformAdmin ? '/user/dashboard-admin' : '/user/dashboard');
    this.menuSidenavOpened = false;
  }

  // Proxy for logout
  logoutHandler($event: any) {
    const headerComponent = this.headerComponentSignal();
    if (headerComponent && headerComponent.logoutHandler) {
      headerComponent.logoutHandler($event);
      this.menuSidenavOpened = false;
    }
  }

  // Keep this for logout proxy only.
  private headerComponentSignal = signal<HeaderComponent | undefined>(undefined);
  @ViewChild(HeaderComponent) set headerComponent(component: HeaderComponent | undefined) {
    this.headerComponentSignal.set(component);
  }
  @ViewChild('headerSentinel', { static: false }) headerSentinel!: ElementRef;
  public isSticky: boolean = false;
  private observer!: IntersectionObserver;
  @ViewChild('configPanel', { static: false })
  configPanel: SidebarDirective | undefined;

  private platformId: object =  inject(PLATFORM_ID);
  public toggleService: ToggleService = inject(ToggleService);
  private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);
  isBrowser = false;
  isMobile = false;
  isTablet = false;
  isDesktop = true;
  // Toggle Service
  isToggled = false;
  title = 'workifence -  Angular 19 Material Design Admin Dashboard Template';
  routerSubscription: any;
  public locationService: Location =  inject(Location);
  public location: any;

  private buildRoles(me: AccessMeDto): WifRole[] {
    const mode = (me?.mode ?? 'PERSONAL').toString();

    if (mode === 'ADMIN') {
      return [{ title: 'Platform Admin', role: 'PLATFORM_ADMIN', url: '/user/dashboard-admin' }];
    }

    const roles: WifRole[] = [{ title: 'Personal', role: 'PERSONAL', url: '/user/dashboard' }];

    if (mode === 'ENTERPRISE_ADMIN') {
      roles.push(
        { title: 'Enterprise Admin', role: 'ENTERPRISE_ADMIN', url: '/user/dashboard' },
        { title: 'Employee', role: 'ENTERPRISE_EMPLOYEE', url: '/user/dashboard' },
      );
    } else if (mode === 'ENTERPRISE_EMPLOYEE') {
      roles.push({ title: 'Employee', role: 'ENTERPRISE_EMPLOYEE', url: '/user/dashboard' });
    }

    return roles;
  }

  ngOnInit() {
    if(isPlatformBrowser(this.platformId)){
      this.isBrowser = true;
      this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
       
      });
      console.log('ITS Browser Running');

      if(this.deviceService.isDesktop()){
        this.isDesktop = true;

        this.isMobile = false;
        this.isTablet = false;
      }else if(this.deviceService.isMobile()){
        this.isMobile = true;
        this.isDesktop = false;
        this.isTablet = false;
      }else if(this.deviceService.isTablet()){
        this.isTablet = true;

        this.isMobile = false;
        this.isDesktop = false;
      }
    }else{
      console.log('ITS Server Running');
    }
  }

  openMenuSidenav(menuSidenav: { open: () => void; }) {
    menuSidenav.open();
  }
  
  closeMenuSidenav(menuSidenav: { close: () => void; }) {
    menuSidenav.close();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isSticky = false;
      const contentWrapper = document.querySelector('.content-wrapper');
      this.observer = new IntersectionObserver(entries => {
        this.isSticky = !entries[0].isIntersecting;
      }, { root: contentWrapper });
      if (this.headerSentinel?.nativeElement) {
        this.observer.observe(this.headerSentinel.nativeElement);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
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
      recallJsFuntions() {
          this.routerSubscription = this.router.events
              .pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationCancel))
              .subscribe(event => {
              this.location = this.router.url;
              if (!(event instanceof NavigationEnd)) {
                  return;
              }
              this.scrollToTop();
          });
      }
      scrollToTop() {
          if (isPlatformBrowser(this.platformId)) {
              window.scrollTo(0, 0);
          }
      }
  
}


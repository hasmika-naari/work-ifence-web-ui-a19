    // Use correct signal for login state
import { CommonModule, NgOptimizedImage, isPlatformBrowser, Location, ViewportScroller } from '@angular/common';
import { Component, OnInit, ElementRef, inject, Input, PLATFORM_ID, Inject, AfterViewInit, AfterViewChecked, OnDestroy, Renderer2, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SaasSidebarComponent } from './sidebar/sidebar.component';
import { MenuSidebarComponent } from './menu-sidebar/menu-sidebar.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WINDOW } from '../../../services/window.token';
import { LocalStorageService } from '../../../services/local-storage.service';
import { UserStoreService } from '../../../services/store/user-store.service';
import { Account, WifRole } from '../../../services/profile.model';
import { MenuListItem } from '../../../services/bee-compete.model';
import { ThemeCustomizerService } from '../../../services/theme-customizer/theme-customizer.service';
import { LayoutService } from 'src/app/layout/layout.service';
import { Subscription } from 'rxjs';
import { IconsModule } from 'src/app/shared/icons.module';

@Component({
    selector: 'app-header-wifence',
    standalone: true,
    imports: [
        CommonModule, 
        NgOptimizedImage, 
        RouterModule,
        RouterLink, 
        NgbModule, 
        NgbNavModule, 
        SaasSidebarComponent,
        MenuSidebarComponent,
        MatDividerModule,
        MatProgressSpinnerModule,
        IconsModule,
    ],
    templateUrl: './header-wifence.component.html',
    styleUrls: ['./header-wifence.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderWorkIfenceComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
    public isLoggedIn: any;
    sidebarOpen = false;
    menuSidebarOpen = false; // Property for menu sidebar
    isAutoLoggingIn = false; // Property to track auto login state
    authStateUndetermined = true; // Flag to track if auth state is still being determined
    private loginStatusSubscription: Subscription | null = null;
    private autoLoginTimeoutId: any = null; // Timeout reference for cleanup

  @Input('back') back: boolean = false;
  @Input('container') container: boolean = true;
  @Input() isSticky: boolean = false;
  @Input() isToggled: boolean = false;
  @Input() hasBanner: boolean = false;
  @Input() bannerTitle: string = '';
  @Input() bannerSubtitle: string = '';

  isMenuVisible = false;

  private scroller: ViewportScroller;
  private renderer: Renderer2;
  private scrollListener: (() => void) | undefined = undefined;
  @ViewChild('pageSection', { static: false }) pageSectionRef!: ElementRef;

    private storageService: LocalStorageService = inject(LocalStorageService);
    private userStore: UserStoreService = inject(UserStoreService);

    private router:Router =  inject(Router);
    private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);
    private platformId: object =  inject(PLATFORM_ID);
    private locationService:Location =  inject(Location);
    public userActiveRole: any = this.userStore.getUserActiveRole();

    isMobile = false;
    isTablet = false;
    isDesktop = true;
    browser = false;

    private observer: IntersectionObserver | undefined;
    private stickySubscription: Subscription;

    private aosInitialized = false;

    ngAfterViewInit() {
                const isNodeRuntime =
                    typeof (globalThis as any).process !== 'undefined' &&
                    !!(globalThis as any).process?.versions?.node;

                if (isPlatformBrowser(this.platformId) && !isNodeRuntime) {
                    // Check initial scroll position
                    const initialYOffset = window.scrollY || window.pageYOffset;
                    this.isSticky = initialYOffset > 100;
                    this.cdr.markForCheck();
                    
                    // Try to find the page section first
                    const pageSection = document.querySelector('.page-full-section');
                    if (pageSection) {
                        this.scrollListener = this.renderer.listen(pageSection, 'scroll', () => {
                            const yOffset = (pageSection as HTMLElement).scrollTop;
                            this.isSticky = yOffset > 100;
                            this.cdr.markForCheck();
                        });
                    } else {
                        // fallback to window scroll if not found
                        this.scrollListener = this.renderer.listen('window', 'scroll', () => {
                            const yOffset = window.scrollY || window.pageYOffset;
                            this.isSticky = yOffset > 100;
                            this.cdr.markForCheck();
                        });
                    }
                    
                    // Force detection on page load
                    setTimeout(() => {
                        const currentYOffset = window.scrollY || window.pageYOffset;
                        this.isSticky = currentYOffset > 100;
                        this.cdr.markForCheck();
                    }, 100);

                    if (!this.aosInitialized) {
                        this.aosInitialized = true;
                        void (async () => {
                            const mod: any = await import('aos');
                            const aos: any = mod?.default ?? mod;
                            if (typeof aos?.init === 'function') {
                                aos.init();
                            }
                        })();
                    }
                }
    }

    userAccount: any = this.userStore.getUserAccount();
    menuListStore: any = this.userStore.getMenuList();

    constructor(
        @Inject(WINDOW) private window: Window,
        public themeService: ThemeCustomizerService,
        renderer: Renderer2,
        private el: ElementRef,
        public layoutService: LayoutService,
        private cdr: ChangeDetectorRef
    ) {
        this.renderer = renderer; // Assign renderer to class property
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        this.scroller = inject(ViewportScroller);
        this.renderer = renderer;
        this.stickySubscription = this.layoutService.isSticky$.subscribe((isSticky: boolean) => {
          this.isSticky = isSticky;
        });
    this.isLoggedIn = this.userStore.getUserLoginStatus();
    }

    openSidebar() {
        console.log('Opening sidebar');
        this.sidebarOpen = true;
        this.cdr.detectChanges();
    }

    closeSidebar() {
        console.log('Closing sidebar');
        this.sidebarOpen = false;
        this.cdr.detectChanges();
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.browser = true;
            this.scroller.scrollToPosition([0, 0]);
            
            // Set device detection flags
            this.isMobile = this.deviceService.isMobile();
            this.isTablet = this.deviceService.isTablet();
            this.isDesktop = this.deviceService.isDesktop();
            
            // Always start with showing spinner
            this.isAutoLoggingIn = true;
            this.authStateUndetermined = true;
            this.cdr.detectChanges();
            
            // Check if user account already exists in store
            const currentUserAccount = this.userStore.getUserAccount()();
            const isLoggedIn = this.userStore.getUserLoginStatus()();
            
            console.log('Initial auth check - Logged in:', isLoggedIn, 'User account:', !!currentUserAccount);
            
            // If we have clear auth state already, update UI after a short delay
            if (isLoggedIn !== undefined) {
                // Keep showing the auth spinner for a moment for better UX
                setTimeout(() => {
                    this.authStateUndetermined = false;
                    this.cdr.detectChanges();
                    
                    // Keep auto login spinner visible for a bit longer
                    setTimeout(() => {
                        this.isAutoLoggingIn = false;
                        this.cdr.detectChanges();
                    }, 500);
                }, 800);
            }
            
            // Subscribe to login status changes
            this.loginStatusSubscription = this.userStore.getUserLoginStatus$().subscribe((loggedIn: boolean) => {
                console.log('Login status determined:', loggedIn);
                
                // Keep showing the spinner for a moment before updating auth state
                setTimeout(() => {
                    // Clear auth state uncertainty
                    this.authStateUndetermined = false;
                    this.cdr.detectChanges();
                    
                    // Keep spinner for a longer moment after state is determined for smoother transition
                    setTimeout(() => {
                        this.isAutoLoggingIn = false;
                        this.cdr.detectChanges();
                    }, 500);
                }, 800);
                
                // Clear the timeout if login status is determined
                if (this.autoLoginTimeoutId) {
                    clearTimeout(this.autoLoginTimeoutId);
                    this.autoLoginTimeoutId = null;
                }
            });
            
            // Auto-reset after a timeout to ensure UI is responsive even if auth state determination fails
            this.autoLoginTimeoutId = setTimeout(() => {
                if (this.authStateUndetermined || this.isAutoLoggingIn) {
                    console.log('Auto-hiding login spinner after timeout');
                    // First hide auth determination spinner
                    this.authStateUndetermined = false;
                    this.cdr.detectChanges();
                    
                    // Then hide auto login spinner after a small delay
                    setTimeout(() => {
                        this.isAutoLoggingIn = false;
                        this.cdr.detectChanges();
                    }, 500);
                }
                this.autoLoginTimeoutId = null;
            }, 3000); // Increased timeout to give more time for auth state to be determined
            
            if(this.browser){
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
            }
        }
    }

    ngOnDestroy(): void {
        if (this.scrollListener) {
          this.scrollListener();
        }
        if (this.stickySubscription) {
          this.stickySubscription.unsubscribe();
        }
        if (this.loginStatusSubscription) {
          this.loginStatusSubscription.unsubscribe();
        }
        if (this.autoLoginTimeoutId) {
          clearTimeout(this.autoLoginTimeoutId);
        }
    }

    classApplied = false;
    toggleClass() {
        this.classApplied = !this.classApplied;
    }

    classApplied2 = false;
    toggleClass2() {
        this.classApplied2 = !this.classApplied2;
    }

    classApplied3 = false;
    toggleClass3() {
        this.classApplied3 = !this.classApplied3;
    }

    logoutHandler($event: any){

         this.storageService.removeItem("userName");
         this.storageService.removeItem("passWord");
        this.storageService.removeItem("authenticated");

        this.userStore.resetStore();
         this.router.navigateByUrl("/");
    }
    goToDashboard($event: any){
        if(this.userActiveRole().role === 'ROLE_ADMIN'){
            this.router.navigateByUrl("/user/dashboard-admin");
        }else if(this.userActiveRole().role === 'ROLE_USER'){
            this.router.navigateByUrl("/user/dashboard");
        }
    }

    isMenuOpen(){
        return this.isMenuVisible;
    }

    toggleMenu() {
        // Check if we're on mobile
        if (this.isMobile || this.isTablet) {
            // On mobile, open the menu sidebar instead of toggling dropdown
            this.menuSidebarOpen = !this.menuSidebarOpen;
        } else {
            // On desktop, toggle the dropdown menu as before
            this.isMenuVisible = !this.isMenuVisible;
        }
        // Since we're using OnPush change detection, explicitly mark for check
        this.cdr.markForCheck();
    }
    
    closeMenuSidebar() {
        this.menuSidebarOpen = false;
        this.cdr.markForCheck();
    }

    goBackScreen($event: any){
        this.locationService.back();
    }

        // (removed duplicate ngAfterViewInit)
    ngAfterViewChecked() {
        // AOS.refreshHard(); // Forces AOS to scan for hidden elements
    }

}
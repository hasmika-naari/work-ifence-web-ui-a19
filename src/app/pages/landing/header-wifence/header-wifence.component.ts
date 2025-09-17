    // Use correct signal for login state
import { CommonModule, NgOptimizedImage, isPlatformBrowser, Location, ViewportScroller } from '@angular/common';
import { Component, OnInit, ElementRef, inject, Input, PLATFORM_ID, Inject, AfterViewInit, AfterViewChecked, OnDestroy, Renderer2, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SaasSidebarComponent } from './sidebar/sidebar.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatDividerModule } from '@angular/material/divider';
import { WINDOW } from '../../../services/window.token';
import { LocalStorageService } from '../../../services/local-storage.service';
import { UserStoreService } from '../../../services/store/user-store.service';
import { Account, WifRole } from '../../../services/profile.model';
import { MenuListItem } from '../../../services/bee-compete.model';
import { ThemeCustomizerService } from '../../../services/theme-customizer/theme-customizer.service';
import AOS from 'aos';
import { LayoutService } from 'src/app/layout/layout.service';
import { Subscription } from 'rxjs';
import { IconsModule } from 'src/app/shared/icons.module';

@Component({
    selector: 'app-header-wifence',
    standalone: true,
    imports: [
        CommonModule, NgOptimizedImage, RouterModule,
        RouterLink, NgbModule, NgbNavModule, SaasSidebarComponent,
        MatDividerModule,
        IconsModule,
    ],
    templateUrl: './header-wifence.component.html',
    styleUrls: ['./header-wifence.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderWorkIfenceComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
    public isLoggedIn: any;
    sidebarOpen = false;

  @Input('back') back: boolean = false;
  @Input('container') container: boolean = true;
  @Input() isSticky: boolean = false;

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

    ngAfterViewInit() {
                if (isPlatformBrowser(this.platformId)) {
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
                }
                AOS.init();
    }

    isToggled = false;

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
            // this.scrollListener = this.renderer.listen('window', 'scroll', () => {
            //     const yOffset = this.scroller.getScrollPosition()[1];
            //     this.isSticky = yOffset > 100;
            // });
        }
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

    ngOnDestroy(): void {
        if (this.scrollListener) {
          this.scrollListener();
        }
        if (this.stickySubscription) {
          this.stickySubscription.unsubscribe();
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
        this.isMenuVisible = !this.isMenuVisible;
        // Since we're using OnPush change detection, explicitly mark for check
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
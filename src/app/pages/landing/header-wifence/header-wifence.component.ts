import { CommonModule, NgOptimizedImage, isPlatformBrowser, Location } from '@angular/common';
import { Component, OnInit, HostListener, inject, Signal, Input, PLATFORM_ID, Inject, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SaasSidebarComponent } from './sidebar/sidebar.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatDividerModule } from '@angular/material/divider';
import { WINDOW } from '../../../services/window.token';
import { LocalStorageService } from '../../../services/local-storage.service';
import { UserStoreService } from '../../../services/store/user-store.service';
import { Account } from '../../../services/profile.model';
import { MenuListItem } from '../../../services/bee-compete.model';
import { ThemeCustomizerService } from '../../../services/theme-customizer/theme-customizer.service';
import { FeathericonsModule } from 'src/app/icons/feathericons/feathericons.module';
import AOS from 'aos';

@Component({
    selector: 'app-header-wifence',
    standalone: true,
    imports: [
                CommonModule, NgOptimizedImage, RouterModule, 
                RouterLink, NgbModule, NgbNavModule, FeathericonsModule,
                SaasSidebarComponent, MatDividerModule
            ],
    templateUrl: './header-wifence.component.html',
    styleUrls: ['./header-wifence.component.scss']
})
export class HeaderWorkIfenceComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @Input('back') back: boolean = false;


    isSticky: boolean = false;
    private storageService: LocalStorageService = inject(LocalStorageService);
    private router:Router =  inject(Router);
    private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);
    private platformId: object =  inject(PLATFORM_ID);
    private locationService:Location =  inject(Location);

    isMobile = false;
    isTablet = false;
    isDesktop = true;
    browser = false;

    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        const scrollPosition = this.window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (scrollPosition >= 50) {
            this.isSticky = true;
        } else {
            this.isSticky = false;
        }
    }

    isToggled = false;

    private userStore: UserStoreService = inject(UserStoreService);
    userAccount: Signal<Account> = this.userStore.getUserAccount();
    menuListStore: Signal<Array<MenuListItem>> = this.userStore.getMenuList();

    constructor(
        @Inject(WINDOW) private window: Window,
        public themeService: ThemeCustomizerService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    ngOnInit(): void {
        if(isPlatformBrowser(this.platformId)){
            this.browser = true;
            console.log('ITS Browser Running');
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

    goBackScreen($event: any){
        this.locationService.back();
    }

    ngAfterViewInit() {
        // AOS.refresh(); // Ensures AOS scans new elements
        AOS.init();
      }
    ngAfterViewChecked() {
    // AOS.refreshHard(); // Forces AOS to scan for hidden elements
    }

}
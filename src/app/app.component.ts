import { filter } from 'rxjs/operators';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, inject, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { ToggleService } from '../app/common/header/toggle.service';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { CommonModule, Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { RouterOutlet, Router, NavigationCancel, NavigationEnd, ActivatedRoute, RouterModule } from '@angular/router';
// import { AppUtilService } from './services/app.util.service';
import { UserStoreService } from './services/store/user-store.service';
import { AppConstantsService } from './services/app-constants.service';
import { LocalStorageService } from './services/local-storage.service';
import { MenuListItem } from './services/bee-compete.model';
import { MatIconRegistry } from '@angular/material/icon';
import { ThemeService } from 'src/@navan/services/theme.service';
import { ThemeCustomizerService } from './services/theme-customizer/theme-customizer.service';
import { Platform } from '@angular/cdk/platform';
import { SplashScreenService } from 'src/@navan/services/splash-screen.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarConfig } from '@angular/material/snack-bar';
import { InitializeStore } from './services/store/signal-store';
import { UserState, userStateConfig } from './services/store/user-store';
import $ from 'jquery';
import { AppUtilService } from './services/app.util.service';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ScrollPositionDirective } from './scroll-position.directive';
@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterModule, CommonModule, LoadingScreenComponent,
      SidebarComponent, HeaderComponent, FooterComponent, LoadingBarModule, ScrollPositionDirective],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [ 
      {
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: {
          appearance: 'fill'
        } as MatFormFieldDefaultOptions
      },
      {
        provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
        useValue: {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        } as MatSnackBarConfig
      },
        Location, {
            provide: LocationStrategy,
            useClass: PathLocationStrategy
        },
        InitializeStore<UserState>('user-store', userStateConfig)
    ]
})
export class AppComponent implements OnInit, AfterViewInit{

    title = 'workifence -  Angular 19 Material Design Admin Dashboard Template';
    routerSubscription: any;
    location: any;
    isLoading = true;
    menuList: Array<MenuListItem> =[
        {
          id: '1',
          parent: 'Features',
          menuItems: [
            {
              id: '1',
              title: 'AI Resume Optimizer',
              count: '31',
              code: 'AIRESUME',
              status: 'active',
              isSelected: false
            },
            {
              id: '2',
              title: 'Resume Manager',
              count: '40',
              code: 'RESUME-OPTI',
              status: 'active',
              isSelected: false
            },
            {
              id: '3',
              title: 'JOB Application Manager',
              count: '31',
              code: 'JOB-MANAGER',
              status: 'active',
              isSelected: false
            }
          ]
        },
        {
          id: '2',
          parent: 'Our Dashboard',
          menuItems:[]
        },
        {
          id: '3',
          parent: 'Resources',
          menuItems: []
        },
        {
          id: '4',
          parent: 'Trends',
          menuItems: []
        }
      ];
      private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
      private loadingBarService: LoadingBarService =  inject(LoadingBarService);
    // private appUtilService: AppUtilService =  inject(AppUtilService);
    // Conditionally inject AppUtilService only in the browser
    private appUtilService: AppUtilService | null = this.isBrowser ? inject(AppUtilService) : null;
    private storageService: LocalStorageService = inject(LocalStorageService);
    private constantsService: AppConstantsService= inject(AppConstantsService);
    private userStore: UserStoreService = inject(UserStoreService);
    // private appUtilService: AppUtilService =  inject(AppUtilService);
    private locationService:Location =  inject(Location);
    public  router:Router =  inject(Router);
    

    constructor(
        public toggleService: ToggleService,
        @Inject(PLATFORM_ID) private platformId: Object,
        private iconRegistry: MatIconRegistry,
        private renderer: Renderer2,
        private themeService: ThemeService,
        public themeCustomizer: ThemeCustomizerService,
        @Inject(DOCUMENT) private document: Document,
        private platform: Platform,
        // private route: ActivatedRoute,
        private splashScreenService: SplashScreenService
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    // Toggle Service
    isToggled = false;

    // Dark Mode
    toggleTheme() {
        this.toggleService.toggleTheme();
    }

    // Settings Button Toggle
    toggle() {
        this.toggleService.toggle();
    }

    // ngOnInit
    async ngOnInit(){
        this.userStore.updateMenuList(this.menuList);

        if(isPlatformBrowser(this.platformId)){
          import('aos').then(AOS => {
            AOS.default.init({
              duration: 1000,  // Animation duration (in milliseconds)
              once: false,       // Ensures animation happens only once
              easing: 'ease-in-out' // Animation style
            });
          });
        
          setTimeout(() => {
            this.isLoading = false; // Set to false when data is loaded
          }, 10);
          // this.loadingBarService.start();
           // Import WOW.js dynamically only on the client side
            // const WOW = (await import('wow.js')).default;
            // new WOW({
            //   boxClass:     'wow',      // animated element css class (default is wow)
            //   animateClass: 'animated', // animation css class (default is animated)
            //   offset:       10,          // distance to the element when triggering the animation (default is 0)
            //   mobile:       true,       // trigger animations on mobile devices (default is true)
            //   live:         true,       // act on asynchronously loaded content (default is true)
            //   }).init();
    
        //   setTimeout(() => {
        //     this.isLoading = false; // Set to false when data is loaded
        //   }, 10);
        // //   this.sidenavService.addItems([
        // //     {
        // //       name: 'Dashboard',
        // //       routeOrFunction: '/',
        // //       icon: 'dashboard',
        // //       position: 10,
        // //       pathMatchExact: true,
        // //       subItems: []
        // //     },
        // //     {
        // //       name: 'Coming Soon',
        // //       routeOrFunction: '/coming-soon',
        // //       icon: 'watch_later',
        // //       position: 68,
        // //       subItems: []
        // //     },
        // //     {
        // //       name: 'Blank',
        // //       routeOrFunction: '/blank',
        // //       icon: 'picture_in_picture',
        // //       position: 69,
        // //       subItems: []
        // //     },
          
        // //   ]);
    
          // this.recallJsFuntions();
          this.storageService.removeItem('authToken');
          let userName:any = this.storageService.getItemByName("userName");
          let passWord:any = this.storageService.getItemByName("passWord");
          let locationPath:string = this.locationService.path(true);
          
          console.log('UserName: ' + userName);
          console.log('passWord: ' + passWord);
          console.log('locationPath: ' + this.router.url);
    
    
      // const item = localStorage.getItem('yourKey'); // Replace 'yourKey' with the actual key used
      if (!userName || !passWord) {
        // No value in localStorage for the given key
        console.log('No value found in localStorage');
        if(!locationPath.includes('activate') && !locationPath.includes('reset-finish') ){
          this.router.navigateByUrl('/');
        }
      }
      let parsedUserName;
      let parsedUserPassword;

      try {
        parsedUserName =JSON.parse(userName);
      } catch (e) {
        // item is not a valid JSON, handle it as a plain string
        console.log('Item is not a valid JSON, treating it as plain string');
        parsedUserName = { notoken: userName };
      }

      try {
        parsedUserPassword =JSON.parse(passWord);
      } catch (e) {
        // item is not a valid JSON, handle it as a plain string
        console.log('Item is not a valid JSON, treating it as plain string');
        parsedUserPassword = { notoken: passWord };
      }

    
    
        
      try {
        
        // const userNameNoTokenEmpty = parsedUserName &&  parsedUserName.notoken !== '';
        // const userPasswordNoTokenEmpty = parsedUserPassword && parsedUserPassword.notoken !== '';
        if (!parsedUserName || !parsedUserPassword) {
          // noToken exists and is an empty string
          console.log('noToken is an empty string');
          this.storageService.removeItem('authenticated');
          if(!locationPath.includes('activate') && !locationPath.includes('reset-finish') && !locationPath.includes('opening')){
            // this.router.navigateByUrl('/');
          }
        } else {
          // noToken does not exist or is not an empty string
          console.log('noToken is not an empty string or does not exist');
          if (this.appUtilService) {
           this.appUtilService.loginWithCredentials(parsedUserName, parsedUserPassword, locationPath);
          }
          // this.isLoggedIn = this.storageService.isLoggedIn();
          // if (this.isLoggedIn) {
          //   const user = this.storageService.getUser();
          //   this.roles = user.roles;
      
          //   this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
          //   this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
          //   this.username = user.username;
          // }
          // this.eventBusSub = this.eventBusService.on('logout', () => {
          // });
        }
      } catch (e) {
        // Handle JSON parse error
        console.log('Error parsing JSON from localStorage', e);
      }
        
        }
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

    async ngAfterViewInit(): Promise<void> {
 
      if(isPlatformBrowser(this.platformId)){
        // this.loadingBarService.start();
         // Import WOW.js dynamically only on the client side
          // const WOW = (await import('wow.js')).default;
          // new WOW({
          //   boxClass:     'wow',      // animated element css class (default is wow)
          //   animateClass: 'animated', // animation css class (default is animated)
          //   offset:       10,          // distance to the element when triggering the animation (default is 0)
          //   mobile:       true,       // trigger animations on mobile devices (default is true)
          //   live:         true,       // act on asynchronously loaded content (default is true)
          //   }).init();
          // // this.constantsService.BASE_API_URL = '';
          debugger;
          $.ajaxSetup({
            cache: true
          });
          if($ !== undefined && $.getScript){
            $.getScript('assets/js/custom.js');
            console.log('ngAfterViewInit -  called from browser' )
          }
          this.recallJsFuntions();
        }
      }

}
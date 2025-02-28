import { Component, HostListener, OnDestroy, OnInit, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { SidebarDirective } from '../../@navan/shared/sidebar/sidebar.directive';
import { filter, map, startWith } from 'rxjs/operators';
import { ThemeService } from '../../@navan/services/theme.service';
import { ActivatedRoute, NavigationCancel, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { checkRouterChildsData } from '../../@navan/utils/check-router-childs-data';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule, isPlatformBrowser, LocationStrategy, PathLocationStrategy , Location} from '@angular/common';
import { SidebarComponent } from '../common/sidebar/sidebar.component';
import { HeaderComponent } from '../common/header/header.component';
import { FooterComponent } from '../common/footer/footer.component';
import { ToggleService } from '../common/header/toggle.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'wif-layout',
  standalone: true,
   imports: [RouterOutlet, CommonModule, SidebarComponent, HeaderComponent, FooterComponent],
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
export class LayoutComponent implements OnInit, OnDestroy {

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


  constructor(
              private themeService: ThemeService,
              public route: ActivatedRoute,
              public router: Router) {
                this.toggleService.isToggled$.subscribe(isToggled => {
                  this.isToggled = isToggled;
              });
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
  ngOnDestroy(): void {}

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


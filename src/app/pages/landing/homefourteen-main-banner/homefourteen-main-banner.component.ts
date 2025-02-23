import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { WINDOW } from '../../../services/window.token';
import { ThemeCustomizerService } from '../../../services/theme-customizer/theme-customizer.service';

@Component({
    selector: 'app-homefourteen-main-banner',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage, CarouselModule, RouterLink],
    templateUrl: './homefourteen-main-banner.component.html',
    styleUrls: ['./homefourteen-main-banner.component.scss']
})
export class HomefourteenMainBannerComponent implements OnInit {

    isToggled = false;
    private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);
    private platformId: object =  inject(PLATFORM_ID);

	isMobile = false;
    isTablet = false;
    isDesktop = true;
    browser = false;
    
    constructor(
        @Inject(WINDOW) private window: Window,
        public themeService: ThemeCustomizerService
    ) {
      this.browser = isPlatformBrowser(this.platformId);
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    ngOnInit(): void {
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

    partnerSlides: OwlOptions = {
		loop: true,
        nav: false,
        dots: false,
        autoplayHoverPause: true,
        autoplay: true,
        margin: 30,
        navText: [
            "<i class='bx bx-left-arrow-alt'></i>",
            "<i class='bx bx-right-arrow-alt'></i>"
        ],
        responsive: {
            0: {
                items: 2,
            },
            576: {
                items: 3,
            },
            768: {
                items: 6,
            },
            1200: {
                items: 6,
            }
        }
    }

    scrollToNextPage(){
        if(this.isMobile){
            this.window.scrollTo(0, 275);
          }else{
            this.window.scrollTo(0, this.window.innerHeight);
          }
    }

}
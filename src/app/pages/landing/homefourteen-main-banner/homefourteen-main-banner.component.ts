import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, inject, Input } from '@angular/core';
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
    overlays: Array<{gradient: string, top: string, left: string, width: string, height: string, zIndex: number, opacity: number, blur: string}> = [];

    ngOnChanges(): void {
        this.generateOverlays();
    }

    generateOverlays() {
                this.overlays = [];
                // 3-5 overlays, mostly white, some theme color gradients
                const overlayCount = 3 + Math.floor(Math.random() * 3); // 3-5 overlays
                const themeColors = [
                    '#e0f7fa', '#ffe0b2', '#e1bee7', '#c8e6c9', '#fffde7', '#fce4ec', '#e3f2fd', '#f3e5f5', '#e0f2f1', '#f9fbe7', '#f8fafc', '#f5f5f5', '#a5b4fc', '#c7d2fe', '#f0abfc', '#f9a8d4', '#fcd34d', '#6ee7b7', '#bae6fd', '#fca5a5'
                ];
                for (let i = 0; i < overlayCount; i++) {
                    // Most overlays are white, some are theme color gradients
                    const isTheme = Math.random() < 0.4; // 40% chance for theme color
                    let colors;
                    if (isTheme) {
                        // Soft theme color gradient with white
                        colors = [themeColors[Math.floor(Math.random() * themeColors.length)], '#fff'];
                    } else {
                        // Pure white, for subtle gloss
                        colors = ['#fff', '#fff'];
                    }
                    // Radial for soft effect
                    const positions = ['top left', 'top right', 'bottom left', 'bottom right', 'center', '60% 20%', '80% 80%'];
                    const pos = positions[Math.floor(Math.random() * positions.length)];
                    const gradient = `radial-gradient(circle at ${pos}, ${colors.join(', ')})`;
                    // Random position and size, mostly small
                    const top = Math.floor(Math.random() * 70) + (i * 60) + 'px';
                    const left = Math.floor(Math.random() * 120) + (i * 40) + 'px';
                    const width = (isTheme ? Math.floor(Math.random() * 120) + 80 : Math.floor(Math.random() * 80) + 40) + 'px';
                    const height = (isTheme ? Math.floor(Math.random() * 80) + 60 : Math.floor(Math.random() * 60) + 30) + 'px';
                    const zIndex = 1;
                    const opacity = isTheme ? 0.45 : 0.18;
                    const blur = isTheme ? '32px' : '18px';
                    this.overlays.push({gradient, top, left, width, height, zIndex, opacity, blur});
                }
    }
    @Input() gradient: string = '';

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
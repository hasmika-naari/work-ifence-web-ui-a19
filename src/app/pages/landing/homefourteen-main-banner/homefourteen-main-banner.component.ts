import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { WINDOW } from '../../../services/window.token';
import { ThemeCustomizerService } from '../../../services/theme-customizer/theme-customizer.service';
import { IconsModule } from 'src/app/shared/icons.module';
import { LucideAngularModule, ArrowRight, LayoutDashboard } from 'lucide-angular';

@Component({
    selector: 'app-homefourteen-main-banner',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage, CarouselModule, RouterLink, IconsModule],
    templateUrl: './homefourteen-main-banner.component.html',
    styleUrls: ['./homefourteen-main-banner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomefourteenMainBannerComponent implements OnInit {
    overlays: Array<{gradient: string, top: string, left: string, width: string, height: string, zIndex: number, opacity: number, blur: string}> = [];
    
    // Responsive layout properties
    isMobile = false;
    isTablet = false;
    isDesktop = true;
    browser = false;
    screenSize = 'desktop'; // For more granular control: xs, sm, md, lg, xl
    
    @Input() gradient: string = '';
    isToggled = false;
    
    private deviceService: DeviceDetectorService = inject(DeviceDetectorService);
    private platformId: object = inject(PLATFORM_ID);
    private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    
    constructor(
        @Inject(WINDOW) private window: Window,
        public themeService: ThemeCustomizerService
    ) {
        this.browser = isPlatformBrowser(this.platformId);
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
            this.cdr.markForCheck();
        });
    }
    
    ngOnInit(): void {
        if (this.browser) {
            // Initial device detection
            this.detectDevice();
            
            // Generate the decorative overlays
            this.generateOverlays();
            
            // Add window resize listener for responsive updates
            this.window.addEventListener('resize', this.handleResize.bind(this));
        }
    }
    
    ngOnDestroy(): void {
        // Clean up event listeners
        if (this.browser) {
            this.window.removeEventListener('resize', this.handleResize.bind(this));
        }
    }
    
    ngOnChanges(): void {
        this.generateOverlays();
    }
    
    // Handle window resize events
    private handleResize(): void {
        this.detectDevice();
        this.cdr.markForCheck();
    }
    
    // Detect device type and screen size
    private detectDevice(): void {
        if (this.deviceService.isDesktop()) {
            this.isDesktop = true;
            this.isMobile = false;
            this.isTablet = false;
            
            // Further categorize desktop screen sizes
            const width = this.window.innerWidth;
            if (width >= 1400) {
                this.screenSize = 'xl'; // Extra large screens
            } else if (width >= 1200) {
                this.screenSize = 'lg'; // Large desktop screens
            } else if (width >= 992) {
                this.screenSize = 'md'; // Medium desktop screens
            }
        } else if (this.deviceService.isMobile()) {
            this.isMobile = true;
            this.isDesktop = false;
            this.isTablet = false;
            const width = this.window.innerWidth;
            this.screenSize = width < 576 ? 'xs' : 'sm';
        } else if (this.deviceService.isTablet()) {
            this.isTablet = true;
            this.isMobile = false;
            this.isDesktop = false;
            this.screenSize = 'md';
        }
    }

    // Generate decorative overlays
    generateOverlays() {
        this.overlays = [];
        
        // Adjust overlay count and size based on screen size
        let overlayCount = this.isMobile ? 2 : (this.isTablet ? 3 : 4);
        
        const themeColors = [
            '#e0f7fa', '#ffe0b2', '#e1bee7', '#c8e6c9', '#fffde7', '#fce4ec', 
            '#e3f2fd', '#f3e5f5', '#e0f2f1', '#f9fbe7', '#f8fafc', '#f5f5f5', 
            '#a5b4fc', '#c7d2fe', '#f0abfc', '#f9a8d4', '#fcd34d', '#6ee7b7', 
            '#bae6fd', '#fca5a5'
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
            
            // Adjust positioning and size based on device
            let topOffset, leftOffset, widthSize, heightSize;
            
            if (this.isMobile) {
                // Mobile - smaller, more centered overlays
                topOffset = Math.floor(Math.random() * 40) + (i * 30);
                leftOffset = Math.floor(Math.random() * 60) + (i * 20);
                widthSize = (isTheme ? Math.floor(Math.random() * 60) + 40 : Math.floor(Math.random() * 40) + 20);
                heightSize = (isTheme ? Math.floor(Math.random() * 40) + 30 : Math.floor(Math.random() * 30) + 15);
            } else if (this.isTablet) {
                // Tablet - medium-sized overlays
                topOffset = Math.floor(Math.random() * 60) + (i * 40);
                leftOffset = Math.floor(Math.random() * 80) + (i * 30);
                widthSize = (isTheme ? Math.floor(Math.random() * 80) + 60 : Math.floor(Math.random() * 60) + 30);
                heightSize = (isTheme ? Math.floor(Math.random() * 60) + 40 : Math.floor(Math.random() * 40) + 20);
            } else {
                // Desktop - larger overlays
                topOffset = Math.floor(Math.random() * 70) + (i * 60);
                leftOffset = Math.floor(Math.random() * 120) + (i * 40);
                widthSize = (isTheme ? Math.floor(Math.random() * 120) + 80 : Math.floor(Math.random() * 80) + 40);
                heightSize = (isTheme ? Math.floor(Math.random() * 80) + 60 : Math.floor(Math.random() * 60) + 30);
            }
            
            const top = topOffset + 'px';
            const left = leftOffset + 'px';
            const width = widthSize + 'px';
            const height = heightSize + 'px';
            const zIndex = 1;
            const opacity = isTheme ? 0.45 : 0.18;
            const blur = this.isMobile ? (isTheme ? '24px' : '12px') : (isTheme ? '32px' : '18px');
            
            this.overlays.push({gradient, top, left, width, height, zIndex, opacity, blur});
        }
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    // Scroll to next section with device-aware behavior
    scrollToNextPage() {
        if (this.browser) {
            if (this.isMobile) {
                // Smaller scroll distance on mobile
                this.window.scrollTo({
                    top: 275,
                    behavior: 'smooth'
                });
            } else if (this.isTablet) {
                // Medium scroll distance on tablet
                this.window.scrollTo({
                    top: this.window.innerHeight * 0.8,
                    behavior: 'smooth'
                });
            } else {
                // Full-height scroll on desktop
                this.window.scrollTo({
                    top: this.window.innerHeight,
                    behavior: 'smooth'
                });
            }
        }
    }

    // Helper methods for responsive display
    get bannerPadding(): string {
        if (this.isMobile) return '80px 0 60px';  // Increased from 30px to 80px
        if (this.isTablet) return '100px 0 80px'; // Increased from 60px to 100px
        return '160px 0 100px';                   // Increased from 115px to 160px
    }
    
    get headingFontSize(): string {
        if (this.isMobile) return '32px';
        if (this.isTablet) return '42px';
        if (this.screenSize === 'md') return '50px';
        return '5rem';
    }
    
    get headingLineHeight(): string {
        if (this.isMobile) return '36px';
        if (this.isTablet) return '46px';
        if (this.screenSize === 'md') return '54px';
        return '5.2rem';
    }
    
    // Partner slides carousel options
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
}
import { Component, Inject, OnInit, PLATFORM_ID, inject, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { MatIconModule } from '@angular/material/icon';
import { IconsModule } from 'src/app/shared/icons.module';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';

// Components
import { PartnerStyleOneComponent } from '../../common2/partner-style-one/partner-style-one.component';
import { HometwelveBlogComponent } from './hometwelve-blog/hometwelve-blog.component';
import { HometwelveCoursesComponent } from './hometwelve-courses/hometwelve-courses.component';
import { HometwelveAboutComponent } from './hometwelve-about/hometwelve-about.component';
import { HometwelvePopularCoursesComponent } from './hometwelve-popular-courses/hometwelve-popular-courses.component';
import { HometwelveMainBannerComponent } from './hometwelve-main-banner/hometwelve-main-banner.component';
import { HeaderStyleSevenComponent } from '../../common2/header-style-seven/header-style-seven.component';
import { HeaderWorkIfenceComponent } from '../landing/header-wifence/header-wifence.component';
import { HometwoCoursesComponent } from './hometwo-courses/hometwo-courses.component';
import { BoxesComponent } from 'src/app/common2/boxes/boxes.component';
import { FooterWorkifenceComponent } from '../landing/footer-wifence/footer-wifence.component';
import { DiscoverEdnuvComponent } from '../../common2/discover-ednuv/discover-ednuv.component';
import { InstructorsStyleFourComponent } from '../../common2/instructors-style-four/instructors-style-four.component';
import { OurGrowthComponent } from '../../common2/our-growth/our-growth.component';
import { TrendingCategoriesComponent } from '../../common2/trending-categories/trending-categories.component';

@Component({
    selector: 'app-online-motivation-course',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        CarouselModule,
        MatIconModule,
        IconsModule,
        // Components
        PartnerStyleOneComponent,
        HometwelveBlogComponent,
        HeaderWorkIfenceComponent,
        DiscoverEdnuvComponent,
        InstructorsStyleFourComponent,
        OurGrowthComponent,
        HometwelveCoursesComponent,
        HometwelveAboutComponent,
        TrendingCategoriesComponent,
        HometwoCoursesComponent,
        BoxesComponent,
        FooterWorkifenceComponent,
        HometwelvePopularCoursesComponent,
        HometwelveMainBannerComponent,
        HeaderStyleSevenComponent
    ],
    templateUrl: './online-motivation-course.component.html',
    styleUrl: './online-motivation-course.component.scss'
})
export class OnlineMotivationCourseComponent implements OnInit, AfterViewInit, OnDestroy {
    // Properties
    isToggled = false;
    public isSticky: boolean = false;
    private observer!: IntersectionObserver;
    @ViewChild('sentinel', { static: false }) sentinel!: ElementRef;
    @ViewChild('pageSection', { static: false }) pageSectionRef!: ElementRef;

    // Device detection
    isMobile = false;
    isTablet = false;
    isDesktop = true;
    browser = false;

    // Services
    private location: Location = inject(Location);
    private deviceService: DeviceDetectorService = inject(DeviceDetectorService);
    public themeService: ThemeCustomizerService = inject(ThemeCustomizerService);
    private platformId: object = inject(PLATFORM_ID);

    // Carousel options
    homeSlides: OwlOptions = {
        items: 1,
        nav: true,
        loop: true,
        dots: true,
        autoplay: true,
        smartSpeed: 500,
        autoHeight: true,
        autoplayHoverPause: true,
        navText: [
            "<i class='bx bx-chevron-left'></i>",
            "<i class='bx bx-chevron-right'></i>"
        ]
    }

    constructor() {
        this.browser = isPlatformBrowser(this.platformId);
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        if (this.browser) {
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

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId) && this.sentinel && this.pageSectionRef) {
            this.observer = new IntersectionObserver(entries => {
                this.isSticky = !entries[0].isIntersecting;
            }, { root: this.pageSectionRef.nativeElement });
            this.observer.observe(this.sentinel.nativeElement);
        }
    }

    ngOnDestroy(): void {
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    // Navigation methods
    goBack($event: any) {
        $event.preventDefault();
        this.location.back();
    }
}
import { Component } from '@angular/core';
import { PartnerStyleOneComponent } from '../../common2/partner-style-one/partner-style-one.component';
import { HometwelveBlogComponent } from './hometwelve-blog/hometwelve-blog.component';
import { DiscoverEdnuvComponent } from '../../common2/discover-ednuv/discover-ednuv.component';
import { InstructorsStyleFourComponent } from '../../common2/instructors-style-four/instructors-style-four.component';
import { OurGrowthComponent } from '../../common2/our-growth/our-growth.component';
import { HometwelveCoursesComponent } from './hometwelve-courses/hometwelve-courses.component';
import { HometwelveAboutComponent } from './hometwelve-about/hometwelve-about.component';
import { TrendingCategoriesComponent } from '../../common2/trending-categories/trending-categories.component';
import { HometwelvePopularCoursesComponent } from './hometwelve-popular-courses/hometwelve-popular-courses.component';
import { HometwelveMainBannerComponent } from './hometwelve-main-banner/hometwelve-main-banner.component';
import { HeaderStyleSevenComponent } from '../../common2/header-style-seven/header-style-seven.component';
import { RouterLink } from '@angular/router';
import { HeaderWorkIfenceComponent } from '../landing/header-wifence/header-wifence.component';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { HometwoCoursesComponent } from './hometwo-courses/hometwo-courses.component';
import { BoxesComponent } from 'src/app/common2/boxes/boxes.component';
import { FooterWorkifenceComponent } from '../landing/footer-wifence/footer-wifence.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-online-motivation-course',
    standalone: true,
    imports: [PartnerStyleOneComponent, HometwelveBlogComponent, HeaderWorkIfenceComponent,
        DiscoverEdnuvComponent, InstructorsStyleFourComponent, OurGrowthComponent, CarouselModule,
        HometwelveCoursesComponent, HometwelveAboutComponent, TrendingCategoriesComponent, HometwoCoursesComponent,
        BoxesComponent,FooterWorkifenceComponent, MatIconModule,
        HometwelvePopularCoursesComponent, HometwelveMainBannerComponent, HeaderStyleSevenComponent, RouterLink],
    templateUrl: './online-motivation-course.component.html',
    styleUrl: './online-motivation-course.component.scss'
})
export class OnlineMotivationCourseComponent {
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
}
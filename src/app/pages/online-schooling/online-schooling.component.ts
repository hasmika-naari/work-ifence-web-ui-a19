import { Component } from '@angular/core';
import { HeaderStyleOneComponent } from '../../common2/header-style-one/header-style-one.component';
import { BlogComponent } from '../../common2/blog/blog.component';
import { FeedbackStyleTwoComponent } from '../../common2/feedback-style-two/feedback-style-two.component';
import { BecomeInstructorPartnerComponent } from '../../common2/become-instructor-partner/become-instructor-partner.component';
import { PartnerStyleTwoComponent } from '../../common2/partner-style-two/partner-style-two.component';
import { CategoriesStyleTwoComponent } from '../../common2/categories-style-two/categories-style-two.component';
import { HomefiveCoursesComponent } from './homefive-courses/homefive-courses.component';
import { FunfactsComponent } from '../../common2/funfacts/funfacts.component';
import { HomefiveMainBannerComponent } from './homefive-main-banner/homefive-main-banner.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-online-schooling',
    standalone: true,
    imports: [HeaderStyleOneComponent, BlogComponent,
             FeedbackStyleTwoComponent, BecomeInstructorPartnerComponent, 
             PartnerStyleTwoComponent, CategoriesStyleTwoComponent, 
             HomefiveCoursesComponent, FunfactsComponent, 
             HomefiveMainBannerComponent, RouterLink],
    templateUrl: './online-schooling.component.html',
    styleUrl: './online-schooling.component.scss'
})
export class OnlineSchoolingComponent {}
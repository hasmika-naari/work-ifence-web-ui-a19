import { Component } from '@angular/core';
import { HeaderStyleTwoComponent } from '../../common2/header-style-two/header-style-two.component';
import { HometwoMainBannerComponent } from './hometwo-main-banner/hometwo-main-banner.component';
import { HometwoAboutComponent } from './hometwo-about/hometwo-about.component';
import { CategoriesStyleOneComponent } from '../../common2/categories-style-one/categories-style-one.component';
import { FunfactsComponent } from '../../common2/funfacts/funfacts.component';
import { HometwoCoursesComponent } from './hometwo-courses/hometwo-courses.component';
import { OurMissionComponent } from '../../common2/our-mission/our-mission.component';
import { PartnerStyleOneComponent } from '../../common2/partner-style-one/partner-style-one.component';
import { InstructorsStyleTwoComponent } from '../../common2/instructors-style-two/instructors-style-two.component';
import { StudentsFeedbackFormComponent } from '../../common2/students-feedback-form/students-feedback-form.component';
import { BlogComponent } from '../../common2/blog/blog.component';
import { WebinarCountdownComponent } from '../../common2/webinar-countdown/webinar-countdown.component';
import { RouterLink } from '@angular/router';
import { HeaderStyleOneComponent } from '../home-page-one/header-style-one/header-style-one.component';

@Component({
    selector: 'app-course-portal-online',
    standalone: true,
    imports: [HeaderStyleTwoComponent, HometwoMainBannerComponent, HeaderStyleOneComponent,
            HometwoAboutComponent, CategoriesStyleOneComponent, FunfactsComponent, 
            HometwoCoursesComponent, OurMissionComponent, PartnerStyleOneComponent, 
            InstructorsStyleTwoComponent, StudentsFeedbackFormComponent, 
            BlogComponent, WebinarCountdownComponent, RouterLink],
    templateUrl: './course-portal-online.component.html',
    styleUrl: './course-portal-online.component.scss'
})
export class CoursePortalOnlineComponent {}
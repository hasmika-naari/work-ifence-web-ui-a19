import { Component, OnInit } from '@angular/core';
import { HomeoneCoursesComponent } from './homeone-courses/homeone-courses.component';
import { HomeoneAboutComponent } from './homeone-about/homeone-about.component';
import { HomeoneMainBannerComponent } from './homeone-main-banner/homeone-main-banner.component';
import { RouterLink } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HeaderStyleOneComponent } from './header-style-one/header-style-one.component';
import { BlogComponent } from './blog/blog.component';
import { FeedbackStyleOneComponent } from './feedback-style-one/feedback-style-one.component';
import { BecomeInstructorPartnerComponent } from './become-instructor-partner/become-instructor-partner.component';
import { InstructorsStyleOneComponent } from './instructors-style-one/instructors-style-one.component';
import { PartnerStyleOneComponent } from './partner-style-one/partner-style-one.component';
import { CategoriesStyleOneComponent } from './categories-style-one/categories-style-one.component';
import { ThemeCustomizerComponent } from 'src/app/services/theme-customizer/theme-customizer.component';

@Component({
  selector: 'app-home-page-one',
  standalone: true,
  imports: [HeaderStyleOneComponent, BlogComponent, 
      FeedbackStyleOneComponent, BecomeInstructorPartnerComponent, 
      InstructorsStyleOneComponent, PartnerStyleOneComponent, MatButtonModule,
      MatCardModule,ThemeCustomizerComponent,
      HomeoneCoursesComponent, CategoriesStyleOneComponent,
       HomeoneAboutComponent, HomeoneMainBannerComponent, RouterLink,
       MatIconModule],
  templateUrl: './home-page-one.component.html',
  styleUrls: ['./home-page-one.component.scss']
})
export class HomePageOneComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

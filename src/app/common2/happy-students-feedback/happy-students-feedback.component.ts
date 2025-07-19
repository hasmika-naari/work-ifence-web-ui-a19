import { Component } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ThemeCustomizerService } from '../theme-customizer/theme-customizer.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-happy-students-feedback',
    standalone: true,
    imports: [CarouselModule, RouterLink],
    templateUrl: './happy-students-feedback.component.html',
    styleUrls: ['./happy-students-feedback.component.scss']
})
export class HappyStudentsFeedbackComponent {

    isToggled = false;

    constructor(
        public themeService: ThemeCustomizerService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    testimonialsWrapSlides: OwlOptions = {
        dots: true,
        margin: 25,
		loop: true,
        nav: false,
        autoplay: true,
		smartSpeed: 500,
        stagePadding: 50,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
                stagePadding: 0
            },
            576: {
                items: 1,
                stagePadding: 0
            },
            768: {
                items: 2,
                stagePadding: 0
            },
            1200: {
                items: 3,
            }
        }
    }

}
import { Component } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ThemeCustomizerService } from '../theme-customizer/theme-customizer.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-funfacts-feedback',
    standalone: true,
    imports: [CarouselModule, RouterLink],
    templateUrl: './funfacts-feedback.component.html',
    styleUrls: ['./funfacts-feedback.component.scss']
})
export class FunfactsFeedbackComponent {

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

    feedbackSlidesTwo: OwlOptions = {
        items: 1,
		loop: true,
        nav: false,
        dots: true,
        autoplay: true,
		smartSpeed: 500,
        autoHeight: true,
        animateIn: 'fadeIn',
        animateOut: 'fadeOut',
        autoplayHoverPause: true,
        navText: [
            "<i class='flaticon-arrows'></i>",
            "<i class='flaticon-right-arrow'></i>"
        ]
    }

}
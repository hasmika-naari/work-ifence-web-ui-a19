import { Component, OnInit } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';

@Component({
    selector: 'app-feedback-style-one',
    standalone: true,
    imports: [CarouselModule, RouterLink],
    templateUrl: './feedback-style-one.component.html',
    styleUrls: ['./feedback-style-one.component.scss']
})
export class FeedbackStyleOneComponent implements OnInit {

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

    ngOnInit(): void {}

    feedbackSlides: OwlOptions = {
		loop: true,
		nav: true,
		dots: false,
		animateOut: 'fadeOut',
		autoplayHoverPause: true,
		autoplay: true,
		mouseDrag: false,
		items: 1,
		navText: [
			"<i class='bx bx-left-arrow-alt'></i>",
			"<i class='bx bx-right-arrow-alt'></i>"
		]
    }

}
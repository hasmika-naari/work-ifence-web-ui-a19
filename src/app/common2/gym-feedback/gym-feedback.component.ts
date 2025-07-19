import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-gym-feedback',
    standalone: true,
    imports: [CarouselModule, RouterLink],
    templateUrl: './gym-feedback.component.html',
    styleUrls: ['./gym-feedback.component.scss']
})
export class GymFeedbackComponent {

    constructor() { }

    feedbackSlidesTwo: OwlOptions = {
        items: 1,
        loop: true,
        nav: false,
        dots: true,
		smartSpeed: 500,
        autoplay: true,
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
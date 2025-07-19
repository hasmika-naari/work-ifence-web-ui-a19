import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-features',
    standalone: true,
    imports: [CarouselModule, RouterLink],
    templateUrl: './features.component.html',
    styleUrls: ['./features.component.scss']
})
export class FeaturesComponent {

    slideShowSlides: OwlOptions = {
		items: 1,
		loop: true,
		nav: false,
		dots: false,
		autoplay: true,
		smartSpeed: 500,
		mouseDrag: false,
		autoHeight: true,
        animateIn: 'fadeIn',
		animateOut: 'fadeOut',
		autoplayHoverPause: false,
		navText: [
			"<i class='bx bx-left-arrow-alt'></i>",
			"<i class='bx bx-right-arrow-alt'></i>"
		]
    }

}
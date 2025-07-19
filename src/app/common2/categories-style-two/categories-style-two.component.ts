import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
	selector: 'app-categories-style-two',
	standalone: true,
	imports: [CarouselModule, RouterLink],
	templateUrl: './categories-style-two.component.html',
	styleUrls: ['./categories-style-two.component.scss']
})
export class CategoriesStyleTwoComponent {

    categoriesSlides: OwlOptions = {
		nav: true,
		loop: true,
		dots: false,
		autoplayHoverPause: true,
		smartSpeed: 500,
		autoplay: true,
		margin: 25,
		navText: [
			"<i class='bx bx-left-arrow-alt'></i>",
			"<i class='bx bx-right-arrow-alt'></i>"
		],
		responsive: {
			0: {
				items: 1
			},
			576: {
				items: 2
			},
			768: {
				items: 3
			},
			1200: {
				items: 4
			}
		}
    }

}
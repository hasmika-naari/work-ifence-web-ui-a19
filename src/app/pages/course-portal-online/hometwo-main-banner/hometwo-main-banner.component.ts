import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-hometwo-main-banner',
    standalone: true,
    imports: [CarouselModule, RouterLink],
    templateUrl: './hometwo-main-banner.component.html',
    styleUrls: ['./hometwo-main-banner.component.scss']
})
export class HometwoMainBannerComponent {

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
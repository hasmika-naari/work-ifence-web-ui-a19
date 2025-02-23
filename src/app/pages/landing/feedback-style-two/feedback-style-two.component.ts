import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
// import { ThemeCustomizerService } from '../theme-customizer/theme-customizer.service';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-feedback-style-two',
    standalone: true,
    imports: [CarouselModule, RouterLink],
    templateUrl: './feedback-style-two.component.html',
    styleUrls: ['./feedback-style-two.component.scss']
})
export class FeedbackStyleTwoComponent implements OnInit {

    isToggled = false;
	isBrowser = false;

  private platformId: object =  inject(PLATFORM_ID);
    constructor(
        // public themeService: ThemeCustomizerService
    ) {
        // this.themeService.isToggled$.subscribe(isToggled => {
        //     this.isToggled = isToggled;
        // });
    }

    toggleTheme() {
        // this.themeService.toggleTheme();
    }

    testimonialsSlides: OwlOptions = {
		loop: true,
		nav: false,
		dots: true,
		autoplayHoverPause: true,
		smartSpeed: 500,
		autoplay: true,
		center: true,
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
				items: 2
			},
			1200: {
				items: 3
			}
		}
    }

	ngOnInit(): void {

		 if(isPlatformBrowser(this.platformId)){
			this.isBrowser = true
			this.testimonialsSlides = {
				loop: true,
				nav: false,
				dots: true,
				autoplayHoverPause: true,
				smartSpeed: 500,
				autoplay: false,
				center: true,
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
						items: 2
					},
					1200: {
						items: 3
					}
				}
			}
		 }
	}

}
import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { AfterRenderPhase, Component, Input, OnChanges, OnInit, PLATFORM_ID, SimpleChanges, afterNextRender, inject } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Category } from '../../../services/bee-compete.model';

@Component({
  selector: 'app-bee-compete-categories',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, CarouselModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnChanges {

	@Input() categories: Array<Category> = new Array<Category>();
	@Input() desktop: boolean = false;
	browser = false;
	private platformId: object =  inject(PLATFORM_ID);
	categoriesSlides: OwlOptions = {
		loop: true,
		nav: true,
		dots: false,
		autoplayHoverPause: true,
		autoplay: true,
		margin: 30,
		navText: [
			"<i class='bx bx-left-arrow-alt'></i>",
			"<i class='bx bx-right-arrow-alt'></i>"
		],
		responsive: {
			0: {
				items: 1.2
			},
			576: {
				items: 1.5
			},
			768: {
				items: 3
			},
			1200: {
				items: 4
			}
		}
    }
    constructor(

	) {
		
        afterNextRender(() => {
			// if(isPlatformBrowser(this.platformId)){
				this.browser = true;
				let showNav = false;
				if(this.desktop){
					showNav = true;
				}
				this.categoriesSlides = {
					loop: true,
					nav: showNav,
					dots: false,
					autoplayHoverPause: true,
					autoplay: true,
					margin: 30,
					navText: [
						"<i class='bx bx-left-arrow-alt'></i>",
						"<i class='bx bx-right-arrow-alt'></i>"
					],
					responsive: {
						0: {
							items: 1.2
						},
						576: {
							items: 1.5
						},
						768: {
							items: 3
						},
						1200: {
							items: 4
						}
					}
				}
			// }
		   },{phase: AfterRenderPhase.Write})
	 }

    ngOnInit(): void {
		// if(isPlatformBrowser(this.platformId)){
		// 	this.browser = true;
		// 	this.categoriesSlides = {
		// 		loop: true,
		// 		nav: true,
		// 		dots: false,
		// 		autoplayHoverPause: true,
		// 		autoplay: true,
		// 		margin: 30,
		// 		navText: [
		// 			"<i class='bx bx-left-arrow-alt'></i>",
		// 			"<i class='bx bx-right-arrow-alt'></i>"
		// 		],
		// 		responsive: {
		// 			0: {
		// 				items: 1
		// 			},
		// 			576: {
		// 				items: 2
		// 			},
		// 			768: {
		// 				items: 3
		// 			},
		// 			1200: {
		// 				items: 4
		// 			}
		// 		}
		// 	 }
		// }
    }

	ngOnChanges(changes: SimpleChanges): void {
		// afterNextRender(() => {
		// 	if(isPlatformBrowser(this.platformId)){
		// 		this.browser = true;
		// 		this.categoriesSlides = {
		// 			loop: true,
		// 			nav: true,
		// 			dots: false,
		// 			autoplayHoverPause: true,
		// 			autoplay: true,
		// 			margin: 30,
		// 			navText: [
		// 				"<i class='bx bx-left-arrow-alt'></i>",
		// 				"<i class='bx bx-right-arrow-alt'></i>"
		// 			],
		// 			responsive: {
		// 				0: {
		// 					items: 1
		// 				},
		// 				576: {
		// 					items: 2
		// 				},
		// 				768: {
		// 					items: 3
		// 				},
		// 				1200: {
		// 					items: 4
		// 				}
		// 			}
		// 		 }
		// 	}
		//    },{phase: AfterRenderPhase.Write})
	}

    

}
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HometwoCoursesComponent } from '../hometwo-courses/hometwo-courses.component';

@Component({
    selector: 'app-hometwelve-main-banner',
    standalone: true,
    imports: [RouterLink, NgIf, CarouselModule, MatButtonModule, MatIconModule, HometwoCoursesComponent ],
    templateUrl: './hometwelve-main-banner.component.html',
    styleUrls: ['./hometwelve-main-banner.component.scss']
})
export class HometwelveMainBannerComponent {

    isToggled = false;
      homeSlides: OwlOptions = {
            items: 1,
            nav: false,
            loop: true,
            dots: true,
            autoplay: true,
            smartSpeed: 500,
            autoHeight: true,
            autoplayHoverPause: true,
            // navText: [
            //     "<i class='bx bx-chevron-left'></i>",
            //     "<i class='bx bx-chevron-right'></i>"
            // ]
        }
	
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

    // Video Popup
    isOpen = false;
    openPopup(): void {
        this.isOpen = true;
    }
    closePopup(): void {
        this.isOpen = false;
    }

}
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { HeaderStyleTwoComponent } from 'src/app/common2/header-style-two/header-style-two.component';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { HeaderWorkIfenceComponent } from '../landing/header-wifence/header-wifence.component';
import { FooterWorkifenceComponent } from '../landing/footer-wifence/footer-wifence.component';

@Component({
    selector: 'app-courses-details-page',
    standalone: true,
    imports: [HeaderStyleTwoComponent, RouterLink,  
        NgxScrollTopModule,
        HeaderWorkIfenceComponent,
        FooterWorkifenceComponent],
    templateUrl: './courses-details-page.component.html',
    styleUrls: ['./courses-details-page.component.scss']
})
export class CoursesDetailsPageComponent {

    isToggled = false;
    hdrContainer = true;
	
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

}
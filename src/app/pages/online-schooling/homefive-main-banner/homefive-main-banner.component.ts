import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';

@Component({
    selector: 'app-homefive-main-banner',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './homefive-main-banner.component.html',
    styleUrls: ['./homefive-main-banner.component.scss']
})
export class HomefiveMainBannerComponent {

    isToggled = false;
	
    constructor(
        public themeService: ThemeCustomizerService
    ) {
        this.themeService.isToggled$.subscribe((isToggled: boolean) => {
            this.isToggled = isToggled;
        });
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

}
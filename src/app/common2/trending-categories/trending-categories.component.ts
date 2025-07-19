import { Component } from '@angular/core';
import { ThemeCustomizerService } from '../theme-customizer/theme-customizer.service';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-trending-categories',
    standalone: true,
    imports: [RouterLink],
	templateUrl: './trending-categories.component.html',
	styleUrls: ['./trending-categories.component.scss']
})
export class TrendingCategoriesComponent {

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

}
import { Component } from '@angular/core';
import { ThemeCustomizerService } from '../theme-customizer/theme-customizer.service';

@Component({
    selector: 'app-our-growth',
    standalone: true,
    imports: [],
    templateUrl: './our-growth.component.html',
    styleUrls: ['./our-growth.component.scss']
})
export class OurGrowthComponent {

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
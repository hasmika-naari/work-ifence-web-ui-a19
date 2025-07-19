import { Component } from '@angular/core';
import { ThemeCustomizerService } from '../theme-customizer/theme-customizer.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-categories-style-three',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './categories-style-three.component.html',
    styleUrls: ['./categories-style-three.component.scss']
})
export class CategoriesStyleThreeComponent {

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
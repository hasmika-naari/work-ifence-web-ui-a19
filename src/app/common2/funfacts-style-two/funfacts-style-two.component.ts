import { Component } from '@angular/core';
import { ThemeCustomizerService } from '../theme-customizer/theme-customizer.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-funfacts-style-two',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './funfacts-style-two.component.html',
    styleUrls: ['./funfacts-style-two.component.scss']
})
export class FunfactsStyleTwoComponent {

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
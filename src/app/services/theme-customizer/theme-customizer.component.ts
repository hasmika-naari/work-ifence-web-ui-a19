import { Component } from '@angular/core';
import { ThemeCustomizerService } from './theme-customizer.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-theme-customizer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './theme-customizer.component.html',
    styleUrls: ['./theme-customizer.component.scss']
})
export class ThemeCustomizerComponent {

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
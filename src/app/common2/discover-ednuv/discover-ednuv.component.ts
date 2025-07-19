import { Component } from '@angular/core';
import { ThemeCustomizerService } from '../theme-customizer/theme-customizer.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-discover-ednuv',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './discover-ednuv.component.html',
    styleUrls: ['./discover-ednuv.component.scss']
})
export class DiscoverEdnuvComponent {

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
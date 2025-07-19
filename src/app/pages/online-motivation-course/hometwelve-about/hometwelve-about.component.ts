import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';

@Component({
    selector: 'app-hometwelve-about',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './hometwelve-about.component.html',
    styleUrls: ['./hometwelve-about.component.scss']
})
export class HometwelveAboutComponent {

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
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';

@Component({
    selector: 'app-hometwelve-popular-courses',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './hometwelve-popular-courses.component.html',
    styleUrls: ['./hometwelve-popular-courses.component.scss']
})
export class HometwelvePopularCoursesComponent {

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
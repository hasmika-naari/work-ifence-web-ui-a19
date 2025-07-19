import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';

@Component({
    selector: 'app-hometwelve-courses',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './hometwelve-courses.component.html',
    styleUrls: ['./hometwelve-courses.component.scss']
})
export class HometwelveCoursesComponent {

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
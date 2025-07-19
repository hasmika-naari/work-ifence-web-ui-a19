import { Component } from '@angular/core';
import { ThemeCustomizerService } from '../theme-customizer/theme-customizer.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-become-instructor-partner',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './become-instructor-partner.component.html',
    styleUrls: ['./become-instructor-partner.component.scss']
})
export class BecomeInstructorPartnerComponent {

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
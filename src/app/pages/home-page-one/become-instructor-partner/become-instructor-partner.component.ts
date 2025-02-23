import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';

@Component({
    selector: 'app-become-instructor-partner',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './become-instructor-partner.component.html',
    styleUrls: ['./become-instructor-partner.component.scss']
})
export class BecomeInstructorPartnerComponent implements OnInit {

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

    ngOnInit(): void {}

}
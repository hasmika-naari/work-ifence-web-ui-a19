import { Component } from '@angular/core';
import { ThemeCustomizerService } from '../../../common2/theme-customizer/theme-customizer.service';
import { NgClass, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-hometwo-courses',
    standalone: true,
    imports: [NgClass, RouterLink, NgIf],
    templateUrl: './hometwo-courses.component.html',
    styleUrls: ['./hometwo-courses.component.scss']
})
export class HometwoCoursesComponent {

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

    // for tab click event
    currentTab = 'tab1';
    switchTab(event: MouseEvent, tab: string) {
        event.preventDefault();
        this.currentTab = tab;
    }

}
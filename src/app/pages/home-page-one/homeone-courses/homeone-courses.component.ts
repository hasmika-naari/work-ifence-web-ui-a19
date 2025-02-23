import { Component, OnInit } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';

@Component({
    selector: 'app-homeone-courses',
    standalone: true,
    imports: [NgClass, NgIf, RouterLink],
    templateUrl: './homeone-courses.component.html',
    styleUrls: ['./homeone-courses.component.scss']
})
export class HomeoneCoursesComponent implements OnInit {

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

    // for tab click event
    currentTab = 'tab1';
    switchTab(event: MouseEvent, tab: string) {
        event.preventDefault();
        this.currentTab = tab;
    }

}
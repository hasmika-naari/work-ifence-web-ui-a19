import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';

@Component({
    selector: 'resume-opti-flow-steps2',
    standalone: true,
    imports: [
              CommonModule, RouterLink,NgOptimizedImage
    ],
    templateUrl: './resume-opti-flow-steps2.component.html',
    styleUrls: ['./resume-opti-flow-steps2.component.scss']
})
export class ResumeOptiFlowSteps2Component implements OnInit {

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
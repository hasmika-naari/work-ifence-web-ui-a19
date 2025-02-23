import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';

@Component({
    selector: 'resume-opti-flow-steps',
    standalone: true,
    imports: [
              CommonModule, RouterLink,NgOptimizedImage
    ],
    templateUrl: './resume-opti-flow-steps.component.html',
    styleUrls: ['./resume-opti-flow-steps.component.scss']
})
export class ResumeOptiFlowStepsComponent implements OnInit {

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
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ResumeOptiFlowStepsComponent } from './resume-opti-flow-steps/resume-opti-flow-steps.component';
import { ResumeOptiFlowSteps2Component } from './resume-opti-flow-steps2/resume-opti-flow-steps2.component';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { FooterWorkifenceComponent } from '../../landing/footer-wifence/footer-wifence.component';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';

@Component({
    selector: 'job-app-manager-intro',
    standalone: true,
  imports: [
            CommonModule, RouterLink,NgOptimizedImage,  FooterWorkifenceComponent,
            HeaderWorkIfenceComponent, 
            ResumeOptiFlowStepsComponent, ResumeOptiFlowSteps2Component
          ],
    templateUrl: './job-app-manager-intro.component.html',
    styleUrls: ['./job-app-manager-intro.component.scss']
})
export class JobAppManagerIntroComponent implements OnInit {

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
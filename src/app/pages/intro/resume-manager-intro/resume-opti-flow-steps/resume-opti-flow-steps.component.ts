import { Component, OnInit } from '@angular/core';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';

@Component({
    selector: 'resume-manager-opti-flow-steps',
    standalone: true,
    templateUrl: './resume-opti-flow-steps.component.html',
    styleUrls: ['./resume-opti-flow-steps.component.scss']
})
export class ResumeManagerOptiFlowStepsComponent implements OnInit {

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
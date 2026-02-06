import { Component, OnInit } from '@angular/core';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';

@Component({
    selector: 'dashboard-opti-flow-steps2',
    standalone: true,
    templateUrl: './resume-opti-flow-steps2.component.html',
    styleUrls: ['./resume-opti-flow-steps2.component.scss']
})
export class DashboardOptiFlowSteps2Component implements OnInit {

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
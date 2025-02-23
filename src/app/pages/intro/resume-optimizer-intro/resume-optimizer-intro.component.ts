import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ResumeOptiFlowStepsComponent } from './resume-opti-flow-steps/resume-opti-flow-steps.component';
import { ResumeOptiFlowSteps2Component } from './resume-opti-flow-steps2/resume-opti-flow-steps2.component';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { FooterWorkifenceComponent } from '../../landing/footer-wifence/footer-wifence.component';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
    selector: 'resume-opti-intro',
    standalone: true,
  imports: [
            CommonModule, RouterLink,NgOptimizedImage,  FooterWorkifenceComponent,
            HeaderWorkIfenceComponent, 
            ResumeOptiFlowStepsComponent, ResumeOptiFlowSteps2Component
          ],
    templateUrl: './resume-optimizer-intro.component.html',
    styleUrls: ['./resume-optimizer-intro.component.scss']
})
export class ResumeOptimizerIntroComponent implements OnInit {

    isToggled = false;
	isMobile = false;
    isTablet = false;
    isDesktop = true;
    browser = false;

    private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);
    private platformId: object =  inject(PLATFORM_ID);

    constructor(
        public themeService: ThemeCustomizerService
    ) {
        this.browser = isPlatformBrowser(this.platformId);
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    ngOnInit(): void {
        if(this.browser){
            if(this.deviceService.isDesktop()){
              this.isDesktop = true;
              this.isMobile = false;
              this.isTablet = false;
            }else if(this.deviceService.isMobile()){
              this.isMobile = true;
              this.isDesktop = false;
              this.isTablet = false;
            }else if(this.deviceService.isTablet()){
              this.isTablet = true;
              this.isMobile = false;
              this.isDesktop = false;
            }
          } 
    }

}
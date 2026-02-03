import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { HeaderWorkIfenceComponent } from '../landing/header-wifence/header-wifence.component';
import { FooterWorkifenceComponent } from '../landing/footer-wifence/footer-wifence.component';
import { RemoteConfigFacadeService } from 'src/app/facades/remote-config-facade.service';

@Component({
    selector: 'app-courses-details-page',
    standalone: true,
    imports: [RouterLink,
        NgxScrollTopModule,
        HeaderWorkIfenceComponent,
        FooterWorkifenceComponent],
    templateUrl: './courses-details-page.component.html',
    styleUrls: ['./courses-details-page.component.scss']
})
export class CoursesDetailsPageComponent {

    isToggled = false;
    hdrContainer = true;

    private readonly remoteConfig = inject(RemoteConfigFacadeService);
    readonly courseCentralEnabled = computed(() => this.remoteConfig.isFlagEnabledSafe('COURSE_CENTRAL'));
	
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
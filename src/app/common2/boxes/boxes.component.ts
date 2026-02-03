import { Component, computed, inject } from '@angular/core';
import { ThemeCustomizerService } from '../theme-customizer/theme-customizer.service';
import { RouterLink } from '@angular/router';
import { RemoteConfigFacadeService } from 'src/app/facades/remote-config-facade.service';

@Component({
    selector: 'app-boxes',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './boxes.component.html',
    styleUrls: ['./boxes.component.scss']
})
export class BoxesComponent {

    isToggled = false;

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
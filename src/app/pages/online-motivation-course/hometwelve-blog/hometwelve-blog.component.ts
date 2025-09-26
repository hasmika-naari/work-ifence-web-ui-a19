import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { IconsModule } from 'src/app/shared/icons.module';

@Component({
    selector: 'app-hometwelve-blog',
    standalone: true,
    imports: [RouterLink, IconsModule],
    templateUrl: './hometwelve-blog.component.html',
    styleUrls: ['./hometwelve-blog.component.scss']
})
export class HometwelveBlogComponent {

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

}
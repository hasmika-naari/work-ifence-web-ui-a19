import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ThemeCustomizerService } from '../../../services/theme-customizer/theme-customizer.service';

@Component({
  selector: 'app-main-banner',
  standalone: true,
    imports: [CommonModule, NgOptimizedImage, CarouselModule],
  templateUrl: './main-banner.component.html',
  styleUrls: ['./main-banner.component.scss']
})
export class MainBannerComponent implements OnInit {
  @Input() browser: boolean = false;
  @Input() desktop: boolean = false;
  @Input() tablet: boolean = false;
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

  ngOnInit(): void {
  }

}

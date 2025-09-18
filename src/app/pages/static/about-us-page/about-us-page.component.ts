import { CommonModule, NgOptimizedImage, isPlatformBrowser, Location } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, inject, AfterViewInit, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as _ from 'lodash';
import { LanguageSubscribeComponent } from '../../language-subscribe/language-subscribe.component';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';
import { Category } from 'src/app/services/ifence.model';
import { PCategory } from 'src/app/services/bee-compete.model';
import { WorkifenceDataService } from 'src/app/services/bee-compete-data.service';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { FooterWorkifenceComponent } from '../../landing/footer-wifence/footer-wifence.component';
import { IconsModule } from 'src/app/shared/icons.module';

@Component({
  selector: 'app-about-us-page',
  standalone: true,
  imports: [CommonModule, RouterLink, LanguageSubscribeComponent,
      NgOptimizedImage, FooterWorkifenceComponent, HeaderWorkIfenceComponent, IconsModule],
  templateUrl: './about-us-page.component.html',
  styleUrls: ['./about-us-page.component.scss']
})
export class AboutUsPageComponent implements OnInit, AfterViewInit, OnDestroy {
  isToggled = false;
  public isSticky: boolean = false;
  private observer!: IntersectionObserver;
  @ViewChild('sentinel', { static: false }) sentinel!: ElementRef;
  @ViewChild('pageSection', { static: false }) pageSectionRef!: ElementRef;
  isMobile = false;
  isTablet = false;
  isDesktop = true;
  browser = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    public themeService: ThemeCustomizerService
  ) {
    this.browser = isPlatformBrowser(this.platformId);
    this.themeService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });
  }

  ngOnInit(): void {
    if (this.browser) {
      this.isMobile = window.innerWidth < 768;
      this.isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;
      this.isDesktop = window.innerWidth > 1024;
    }
  }

  ngAfterViewInit(): void {
    if (this.browser) {
      this.observer = new IntersectionObserver(
        ([e]) => {
          this.isSticky = e.intersectionRatio < 1;
        },
        { threshold: [1] }
      );

      if (this.sentinel && this.sentinel.nativeElement) {
        this.observer.observe(this.sentinel.nativeElement);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (this.browser) {
      this.isMobile = window.innerWidth < 768;
      this.isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;
      this.isDesktop = window.innerWidth > 1024;
    }
  }

  goBack(event: Event) {
    event.preventDefault();
    this.router.navigate(['/']);
  }
}
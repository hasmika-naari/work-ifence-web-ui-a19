import { Directive, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ScrollPositionService } from './scroll-position.service';

@Directive({
  selector: '[appScrollPosition]',
})
export class ScrollPositionDirective {
  constructor(private router: Router, private scrollService: ScrollPositionService) {
    // Restore scroll position on navigation
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const position = this.scrollService.getPosition(event.urlAfterRedirects);
        window.scrollTo(0, position);
      }
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const url = this.router.url;
    this.scrollService.savePosition(url, window.scrollY);
  }
}

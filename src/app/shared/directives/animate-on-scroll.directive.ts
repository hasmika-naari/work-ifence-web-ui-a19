import { CommonModule } from '@angular/common';
import { Directive, ElementRef, HostBinding, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[animateOnScroll]',
    standalone: true
})
export class AnimateOnScrollDirective implements OnInit {
  @Input() animationClass = 'animate__fadeInUp';
  @Input() animationDelay = '0s';
  @HostBinding('class') elementClass = 'opacity-0';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.elementClass = `animate__animated ${this.animationClass}`;
          this.el.nativeElement.style.setProperty('--animate-delay', this.animationDelay);
          observer.unobserve(this.el.nativeElement);
        }
      });
    });

    observer.observe(this.el.nativeElement);
  }
}

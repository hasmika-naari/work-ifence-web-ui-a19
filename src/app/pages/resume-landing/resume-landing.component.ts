import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  HostListener,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderWorkIfenceComponent } from '../landing/header-wifence/header-wifence.component';
import { FooterWorkifenceComponent } from '../landing/footer-wifence/footer-wifence.component';
import { IconsModule } from 'src/app/shared/icons.module';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { ResumeTemplateSelectionService } from 'src/app/services/resume-template-selection.service';
import { ResumeTemplateFacadeService } from 'src/app/resume-portal/data/resume-template-facade.service';
import type { ResumeTemplateUi } from 'src/app/resume-portal/data/resume-template.ui.model';
import type { ResumeTemplate } from 'src/app/services/bee-compete.model';

@Component({
  selector: 'app-resume-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IconsModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatSidenavModule,
    HeaderWorkIfenceComponent,
    FooterWorkifenceComponent,
  ],
  templateUrl: './resume-landing.component.html',
  styleUrl: './resume-landing.component.scss',
})
export class ResumeLandingComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly templateFacade = inject(ResumeTemplateFacadeService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  readonly themeService = inject(ThemeCustomizerService);
  private readonly access = inject(AccessFacadeService);
  private readonly selection = inject(ResumeTemplateSelectionService);

  @ViewChild('sentinel', { static: false }) sentinel!: ElementRef;
  @ViewChild('pageSection', { static: false }) pageSectionRef!: ElementRef;
  @ViewChild('templatesSection', { static: false }) templatesSectionRef!: ElementRef;

  public isSticky = false;
  private observer?: IntersectionObserver;
  private readonly destroy$ = new Subject<void>();

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  readonly isLoading = this.templateFacade.loading;
  readonly errorMessage = this.templateFacade.error;
  readonly templates = this.templateFacade.templates;
  readonly isLoggedIn = computed(() => this.access.isLoggedIn());

  readonly selectedCategory = signal<string>('All');
  readonly selectedStyle = signal<string>('All');
  readonly searchQuery = signal<string>('');

  readonly filterSheetOpen = signal<boolean>(false);

  readonly activeFilterCount = computed(() => {
    const categoryActive = this.selectedCategory() !== 'All';
    const styleActive = this.selectedStyle() !== 'All';
    const queryActive = this.searchQuery().trim().length > 0;
    return Number(categoryActive) + Number(styleActive) + Number(queryActive);
  });

  readonly filterSummary = computed(() => {
    const parts: string[] = [];
    const category = this.selectedCategory();
    const style = this.selectedStyle();
    const query = this.searchQuery().trim();

    if (category !== 'All') parts.push(`Category: ${category}`);
    if (style !== 'All') parts.push(`Style: ${style}`);
    if (query) parts.push(`Search: ${query}`);
    return parts.length ? parts.join(' • ') : 'All templates';
  });

  readonly activeTemplates = computed(() =>
    this.templates().filter(t => (t.status ?? '').toUpperCase() === 'ACTIVE')
  );

  readonly categoryOptions = computed(() => {
    const set = new Set(this.activeTemplates().map(t => t.category).filter(Boolean) as string[]);
    return ['All', ...Array.from(set).sort()];
  });

  readonly styleOptions = computed(() => {
    const set = new Set(this.activeTemplates().map(t => t.style).filter(Boolean) as string[]);
    return ['All', ...Array.from(set).sort()];
  });

  readonly filteredTemplates = computed(() => {
    const category = this.selectedCategory();
    const style = this.selectedStyle();
    const query = this.searchQuery().trim().toLowerCase();

    return this.activeTemplates().filter(t => {
      if (category !== 'All' && t.category !== category) return false;
      if (style !== 'All' && t.style !== style) return false;
      if (!query) return true;
      const inTitle = (t.title ?? '').toLowerCase().includes(query);
      const inTags = (t.tags ?? []).some(tag => tag.toLowerCase().includes(query));
      return inTitle || inTags;
    });
  });

  private readonly errorEffect = effect(() => {
    const err = this.templateFacade.error();
    if (err) {
      console.warn('[ResumeTemplateFacade]', err);
    }
  });

  ngOnInit(): void {
    this.templateFacade.loadTemplates('public');
    this.templateFacade.refresh(true);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd), takeUntil(this.destroy$))
      .subscribe(event => {
        const nav = event as NavigationEnd;
        const url = nav.urlAfterRedirects ?? nav.url;
        if (url.includes('/resume-builder')) {
          this.templateFacade.loadTemplates('public');
          this.templateFacade.refresh(true);
        }
      });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.sentinel?.nativeElement || !this.pageSectionRef?.nativeElement) {
      return;
    }

    this.observer = new IntersectionObserver(
      entries => {
        this.isSticky = !entries[0].isIntersecting;
      },
      { root: this.pageSectionRef.nativeElement }
    );
    this.observer.observe(this.sentinel.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.filterSheetOpen()) {
      this.closeFilterSheet();
    }
  }

  onPageScroll(event: Event): void {
    const el = event.target as HTMLElement | null;
    const scrollTop = el?.scrollTop ?? 0;
    this.isSticky = scrollTop > 16;
  }

  loadTemplates(): void {
    this.templateFacade.loadTemplates('public');
    this.templateFacade.refresh(true);
  }

  onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement)?.value ?? 'All';
    this.selectedCategory.set(value);
    this.scrollToTemplatesSection();
  }

  onStyleChange(event: Event): void {
    const value = (event.target as HTMLSelectElement)?.value ?? 'All';
    this.selectedStyle.set(value);
    this.scrollToTemplatesSection();
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement)?.value ?? '';
    this.searchQuery.set(value);
  }

  openFilterSheet(): void {
    this.filterSheetOpen.set(true);
  }

  closeFilterSheet(): void {
    this.filterSheetOpen.set(false);
  }

  clearFilters(): void {
    this.selectedCategory.set('All');
    this.selectedStyle.set('All');
    this.searchQuery.set('');
  }

  isLocked(item: ResumeTemplateUi): boolean {
    return this.templateFacade.isLocked(item);
  }

  private scrollToTemplatesSection(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const container = this.pageSectionRef?.nativeElement as HTMLElement | undefined;
    const target = this.templatesSectionRef?.nativeElement as HTMLElement | undefined;
    if (!container || !target) {
      return;
    }

    const rootStyles = getComputedStyle(document.documentElement);
    const headerVar = rootStyles.getPropertyValue('--wf-header-height').trim();
    const headerHeight = Number.parseFloat(headerVar) || 61;
    const topPadding = 16;
    const offset = headerHeight + topPadding;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const targetTop = targetRect.top - containerRect.top + container.scrollTop;
    const top = Math.max(0, targetTop - offset);

    if (typeof (container as any).scrollTo === 'function') {
      (container as any).scrollTo({ top, behavior: 'smooth' });
    } else {
      container.scrollTop = top;
    }
  }

  useTemplate(tpl: ResumeTemplateUi): void {
    this.persistSelection(tpl);
    this.selection.setSelection(this.toResumeTemplate(tpl));

    const targetUrl = `/user/resumes/resume?templateId=${encodeURIComponent(String(tpl.id ?? ''))}`;
    const gate = this.templateFacade.canUseTemplate(tpl);

    if (!gate.allowed) {
      this.templateFacade.handleDenied(gate.reason, targetUrl);
      return;
    }

    if (this.isLoggedIn()) {
      void this.router.navigateByUrl(targetUrl);
      return;
    }

    void this.router.navigate(['/sign-in'], {
      queryParams: { returnUrl: targetUrl },
    });
  }

  private toResumeTemplate(tpl: ResumeTemplateUi): ResumeTemplate {
    const templateId = Number(tpl.id ?? 0);
    return {
      id: templateId,
      name: tpl.title ?? '',
      companyName: '',
      template_name: tpl.componentKey || tpl.templateKey || `TEMPLATE_${templateId || ''}`,
      imgPath: tpl.imageUrl ?? '',
    };
  }

  private persistSelection(tpl: ResumeTemplateUi): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const legacyKey = tpl.componentKey || tpl.templateKey || '';
      this.selection.setCatalogSelection({
        templateId: tpl.id ?? '',
        templateKey: tpl.templateKey ?? legacyKey,
        componentKey: tpl.componentKey ?? legacyKey,
        version: tpl.version ?? '1.0',
      });
      sessionStorage.setItem('wif_selected_template_title', tpl.title ?? '');
      sessionStorage.setItem('wif_selected_template_doc', tpl.imageUrl ?? '');
    } catch {
      // ignore storage errors
    }
  }

  uploadResume(): void {
    void this.router.navigateByUrl('/user/resumes');
  }

  goBack(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.location.back();
  }
}

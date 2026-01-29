import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DrawerModule } from 'primeng/drawer';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { HeaderWorkIfenceComponent } from 'src/app/pages/landing/header-wifence/header-wifence.component';
import { FooterWorkifenceComponent } from 'src/app/pages/landing/footer-wifence/footer-wifence.component';
import { IconsModule } from 'src/app/shared/icons.module';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { ResumePortalPublicStore } from '../../state/resume-portal-public.store';
import { ResumeCardComponent } from '../../components/resume-card/resume-card.component';
import { ResumeFiltersSheetComponent } from '../../components/resume-filters-sheet/resume-filters-sheet.component';
import type { ResumeCard, ResumeFilters } from '../../models/resume-card.model';
import { AVAILABILITY_LABELS, WORK_AUTH_LABELS } from '../../utils/resume-portal.utils';

@Component({
  selector: 'app-resume-portal-browse',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    NgxPaginationModule,
    MatBottomSheetModule,
    MatIconModule,
    MatSidenavModule,
    DrawerModule,
    MatTooltipModule,
    MatProgressBarModule,
    RouterModule,
    IconsModule,
    HeaderWorkIfenceComponent,
    FooterWorkifenceComponent,
    ResumeCardComponent,
  ],
  templateUrl: './resume-portal-browse.component.html',
  styleUrl: './resume-portal-browse.component.scss',
})
export class ResumePortalBrowseComponent {
  private readonly store = inject(ResumePortalPublicStore);
  private readonly bottomSheet = inject(MatBottomSheet);
  readonly themeService = inject(ThemeCustomizerService);
  private readonly location = inject(Location);

  @ViewChild('sentinel', { static: false }) sentinel!: ElementRef;
  @ViewChild('pageSection', { static: false }) pageSectionRef!: ElementRef;
  @ViewChild('filterSidenav', { static: false }) filterSidenav!: any;

  public isSticky = false;
  private observer?: IntersectionObserver;

  readonly filters = this.store.filters;
  readonly roles = this.store.roles;
  readonly skills = this.store.skills;
  readonly domains = this.store.domains;
  readonly filtered = this.store.filtered;
  readonly total = this.store.total;
  page = 1;
  count = 20;
  maxSize = 5;
  autoHide = false;

  drawerOpen = false;

  readonly availabilityLabels = AVAILABILITY_LABELS;
  readonly workAuthLabels = WORK_AUTH_LABELS;

  readonly workAuthOptions: ResumeCard['workAuthorization'][] = ['US_CITIZEN', 'GC', 'H1B', 'EAD', 'OTHER'];
  readonly availabilityOptions: ResumeCard['availability'][] = ['IMMEDIATE', '2_WEEKS', '1_MONTH', 'NOT_LOOKING'];

  private readonly defaultFilters: ResumeFilters = {
    search: '',
    role: 'All',
    skills: [],
    yearsMin: null,
    yearsMax: null,
    location: '',
    workAuthorization: '',
    availability: '',
    domain: '',
    badges: {
      atsOptimized: false,
      verified: false,
      activelyLooking: false,
    },
  };

  pendingFilters: ResumeFilters = this.cloneFilters(this.filters());
  applyingFilters = false;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  openFilters(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.pendingFilters = this.cloneFilters(this.filters());
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      this.bottomSheet.open(ResumeFiltersSheetComponent, {
        panelClass: 'resume-filters-sheet-panel',
      });
      return;
    }

    this.drawerOpen = true;
  }

  clearFilters(): void {
    this.pendingFilters = this.cloneFilters(this.defaultFilters);
  }

  resetFiltersAndApply(): void {
    this.pendingFilters = this.cloneFilters(this.defaultFilters);
    this.applyFilters();
  }

  applyFilters(): void {
    this.applyingFilters = true;
    this.store.patchFilters(this.pendingFilters);
    this.page = 1;
    setTimeout(() => {
      this.applyingFilters = false;
    }, 300);
  }

  goBack(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.location.back();
  }

  onPageChanged(page: number): void {
    this.page = page;
    this.store.setPage({ pageIndex: page - 1, pageSize: this.count });
  }

  updateRole(value: string): void {
    this.pendingFilters = { ...this.pendingFilters, role: value };
  }

  updateSearch(value: string): void {
    const search = value ?? '';
    this.pendingFilters = { ...this.pendingFilters, search };
    this.store.patchFilters({ search });
    this.page = 1;
  }

  updateSkills(values: string[]): void {
    this.pendingFilters = { ...this.pendingFilters, skills: [...values] };
  }

  updateYearsMin(value: string): void {
    this.pendingFilters = { ...this.pendingFilters, yearsMin: value ? Number(value) : null };
  }

  updateYearsMax(value: string): void {
    this.pendingFilters = { ...this.pendingFilters, yearsMax: value ? Number(value) : null };
  }

  updateLocation(value: string): void {
    this.pendingFilters = { ...this.pendingFilters, location: value };
  }

  updateWorkAuth(value: string): void {
    this.pendingFilters = { ...this.pendingFilters, workAuthorization: value as ResumeCard['workAuthorization'] | '' };
  }

  updateAvailability(value: string): void {
    this.pendingFilters = { ...this.pendingFilters, availability: value as ResumeCard['availability'] | '' };
  }

  updateDomain(value: string): void {
    this.pendingFilters = { ...this.pendingFilters, domain: value as ResumeCard['badges']['domain'] | '' };
  }

  activeFilters(): string[] {
    const current = this.filters();
    const items: string[] = [];

    if (current.search?.trim()) items.push(`Search: ${current.search.trim()}`);
    if (current.role && current.role !== 'All') items.push(current.role);
    if (current.skills?.length) {
      const preview = current.skills.slice(0, 3).join(', ');
      const extra = current.skills.length > 3 ? ` +${current.skills.length - 3}` : '';
      items.push(`Skills: ${preview}${extra}`);
    }
    if (current.yearsMin || current.yearsMax) {
      const min = current.yearsMin ?? 0;
      const max = current.yearsMax ?? '∞';
      items.push(`${min}-${max} yrs`);
    }
    if (current.location) items.push(current.location);
    if (current.domain) items.push(current.domain);
    if (current.workAuthorization) items.push(this.workAuthLabels[current.workAuthorization]);
    if (current.availability) items.push(this.availabilityLabels[current.availability]);

    if (current.badges?.atsOptimized) items.push('ATS-Optimized');
    if (current.badges?.verified) items.push('Verified');
    if (current.badges?.activelyLooking) items.push('Actively Looking');

    return items;
  }

  activeFiltersDetailed(): Array<{ label: string; value: string }> {
    const current = this.filters();
    const items: Array<{ label: string; value: string }> = [];

    if (current.search?.trim()) items.push({ label: 'Search', value: current.search.trim() });
    if (current.role && current.role !== 'All') items.push({ label: 'Role', value: current.role });
    if (current.skills?.length) {
      const preview = current.skills.slice(0, 3).join(', ');
      const extra = current.skills.length > 3 ? ` +${current.skills.length - 3}` : '';
      items.push({ label: 'Skills', value: `${preview}${extra}` });
    }
    if (current.yearsMin || current.yearsMax) {
      const min = current.yearsMin ?? 0;
      const max = current.yearsMax ?? '∞';
      items.push({ label: 'Experience', value: `${min}-${max} yrs` });
    }
    if (current.location) items.push({ label: 'Location', value: current.location });
    if (current.domain) items.push({ label: 'Domain', value: current.domain });
    if (current.workAuthorization) {
      items.push({ label: 'Work Auth', value: this.workAuthLabels[current.workAuthorization] });
    }
    if (current.availability) {
      items.push({ label: 'Availability', value: this.availabilityLabels[current.availability] });
    }

    if (current.badges?.atsOptimized) items.push({ label: 'Badge', value: 'ATS-Optimized' });
    if (current.badges?.verified) items.push({ label: 'Badge', value: 'Verified' });
    if (current.badges?.activelyLooking) items.push({ label: 'Badge', value: 'Actively Looking' });

    return items;
  }

  activeFilterChips(): Array<{ type: string; value: string }> {
    const current = this.filters();
    const chips: Array<{ type: string; value: string }> = [];

    if (current.role && current.role !== 'All') chips.push({ type: 'role', value: current.role });
    if (current.skills?.length) {
      current.skills.forEach(skill => chips.push({ type: 'skill', value: skill }));
    }
    if (current.yearsMin !== null || current.yearsMax !== null) {
      const min = current.yearsMin ?? 0;
      const max = current.yearsMax ?? '∞';
      chips.push({ type: 'experience', value: `${min}-${max} yrs` });
    }
    if (current.location) chips.push({ type: 'location', value: current.location });
    if (current.domain) chips.push({ type: 'domain', value: current.domain });
    if (current.workAuthorization) chips.push({ type: 'workAuthorization', value: this.workAuthLabels[current.workAuthorization] });
    if (current.availability) chips.push({ type: 'availability', value: this.availabilityLabels[current.availability] });

    if (current.badges?.atsOptimized) chips.push({ type: 'badge:atsOptimized', value: 'ATS-Optimized' });
    if (current.badges?.verified) chips.push({ type: 'badge:verified', value: 'Verified' });
    if (current.badges?.activelyLooking) chips.push({ type: 'badge:activelyLooking', value: 'Actively Looking' });

    return chips;
  }

  clearFilterChip(type: string, value: string): void {
    const current = this.filters();

    switch (type) {
      case 'role':
        this.store.patchFilters({ role: 'All' });
        this.pendingFilters = { ...this.pendingFilters, role: 'All' };
        break;
      case 'skill':
        this.store.patchFilters({ skills: current.skills.filter(skill => skill !== value) });
        this.pendingFilters = { ...this.pendingFilters, skills: current.skills.filter(skill => skill !== value) };
        break;
      case 'experience':
        this.store.patchFilters({ yearsMin: null, yearsMax: null });
        this.pendingFilters = { ...this.pendingFilters, yearsMin: null, yearsMax: null };
        break;
      case 'location':
        this.store.patchFilters({ location: '' });
        this.pendingFilters = { ...this.pendingFilters, location: '' };
        break;
      case 'domain':
        this.store.patchFilters({ domain: '' });
        this.pendingFilters = { ...this.pendingFilters, domain: '' };
        break;
      case 'workAuthorization':
        this.store.patchFilters({ workAuthorization: '' });
        this.pendingFilters = { ...this.pendingFilters, workAuthorization: '' };
        break;
      case 'availability':
        this.store.patchFilters({ availability: '' });
        this.pendingFilters = { ...this.pendingFilters, availability: '' };
        break;
      case 'badge:atsOptimized':
        this.store.patchFilters({ badges: { ...current.badges, atsOptimized: false } });
        this.pendingFilters = { ...this.pendingFilters, badges: { ...this.pendingFilters.badges, atsOptimized: false } };
        break;
      case 'badge:verified':
        this.store.patchFilters({ badges: { ...current.badges, verified: false } });
        this.pendingFilters = { ...this.pendingFilters, badges: { ...this.pendingFilters.badges, verified: false } };
        break;
      case 'badge:activelyLooking':
        this.store.patchFilters({ badges: { ...current.badges, activelyLooking: false } });
        this.pendingFilters = { ...this.pendingFilters, badges: { ...this.pendingFilters.badges, activelyLooking: false } };
        break;
      default:
        break;
    }
    this.page = 1;
  }

  toggleBadge(key: 'atsOptimized' | 'verified' | 'activelyLooking', checked: boolean): void {
    this.pendingFilters = {
      ...this.pendingFilters,
      badges: {
        ...this.pendingFilters.badges,
        [key]: checked,
      },
    };
  }

  private cloneFilters(source: ResumeFilters): ResumeFilters {
    return {
      ...source,
      skills: [...source.skills],
      badges: { ...source.badges },
    };
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
  }

  onPageScroll(event: Event): void {
    const el = event.target as HTMLElement | null;
    const scrollTop = el?.scrollTop ?? 0;
    this.isSticky = scrollTop > 16;
  }
}

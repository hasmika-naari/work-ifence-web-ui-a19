import { Injectable, computed, effect, signal } from '@angular/core';
import { ResumePortalMockService } from '../services/resume-portal-mock.service';
import type { ResumeCard, ResumeFilters } from '../models/resume-card.model';

const DEFAULT_FILTERS: ResumeFilters = {
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

@Injectable({ providedIn: 'root' })
export class ResumePortalPublicStore {
  private readonly data = signal<ResumeCard[]>([]);
  readonly all = this.data.asReadonly();

  getAll(): ResumeCard[] {
    return this.data();
  }
  readonly filters = signal<ResumeFilters>({ ...DEFAULT_FILTERS });
  readonly pageIndex = signal(0);
  readonly pageSize = signal(20);

  readonly roles = computed(() => {
    const set = new Set(this.data().map(item => item.primaryRole));
    return ['All', ...Array.from(set).sort()];
  });

  readonly skills = computed(() => {
    const set = new Set(this.data().flatMap(item => item.topSkills));
    return Array.from(set).sort();
  });

  readonly domains = computed(() => {
    const set = new Set(this.data().map(item => item.badges.domain));
    return Array.from(set).sort();
  });

  readonly filtered = computed(() => {
    const filters = this.filters();
    const query = filters.location.trim().toLowerCase();
    const searchQuery = filters.search.trim().toLowerCase();

    return this.data().filter(item => {
      if (filters.role !== 'All' && item.primaryRole !== filters.role) return false;
      if (filters.skills.length > 0 && !filters.skills.some(skill => item.topSkills.includes(skill))) return false;
      if (filters.yearsMin !== null && item.yearsExperience < filters.yearsMin) return false;
      if (filters.yearsMax !== null && item.yearsExperience > filters.yearsMax) return false;
      if (query && !item.location.toLowerCase().includes(query)) return false;
      if (searchQuery) {
        const inName = `${item.firstName} ${item.lastName}`.toLowerCase().includes(searchQuery);
        const inHeadline = (item.headline ?? '').toLowerCase().includes(searchQuery);
        const inRole = (item.primaryRole ?? '').toLowerCase().includes(searchQuery);
        const inSkills = item.topSkills?.some(skill => skill.toLowerCase().includes(searchQuery));
        if (!inName && !inHeadline && !inRole && !inSkills) return false;
      }
      if (filters.workAuthorization && item.workAuthorization !== filters.workAuthorization) return false;
      if (filters.availability && item.availability !== filters.availability) return false;
      if (filters.domain && item.badges.domain !== filters.domain) return false;
      if (filters.badges.atsOptimized && !item.badges.atsOptimized) return false;
      if (filters.badges.verified && !item.badges.verified) return false;
      if (filters.badges.activelyLooking && !item.badges.activelyLooking) return false;
      return true;
    });
  });

  readonly total = computed(() => this.filtered().length);

  readonly paged = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  constructor(private readonly mock: ResumePortalMockService) {
    this.mock.getAllResumes().subscribe(list => this.data.set(list));

    effect(() => {
      this.filters();
      this.pageIndex.set(0);
    });
  }

  setPage(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  patchFilters(partial: Partial<ResumeFilters>): void {
    this.filters.set({ ...this.filters(), ...partial });
  }

  resetFilters(): void {
    this.filters.set({ ...DEFAULT_FILTERS });
  }
}

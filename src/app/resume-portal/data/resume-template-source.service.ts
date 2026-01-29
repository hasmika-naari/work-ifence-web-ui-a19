import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { ResumeTemplateDto } from './resume-template.dto';
import { ResumeTemplateUi } from './resume-template.ui.model';
import { adaptResumeTemplates } from './resume-template.adapter';
import { ResumeTemplateApiService } from './resume-template-api.service';

const CACHE_KEY_PREFIX = 'wif_resume_templates_cache_v1';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const staticTemplatesFallback: ResumeTemplateDto[] = [
  {
    id: 1,
    title: 'Atlantic Blue',
    templateKey: 'TEMPLATE_1',
    componentKey: 'TEMPLATE_1',
    accessLevel: 'BASIC',
    isDefault: true,
    category: 'Simple',
    status: 'ACTIVE',
    templateDocUrl: 'assets/img/templates/rt1.png',
  },
  {
    id: 2,
    title: 'Minimal',
    templateKey: 'TEMPLATE_2',
    componentKey: 'TEMPLATE_2',
    accessLevel: 'BASIC',
    category: 'Simple',
    status: 'ACTIVE',
    templateDocUrl: 'assets/img/templates/rt2.png',
  },
  {
    id: 3,
    title: 'Mono',
    templateKey: 'TEMPLATE_3',
    componentKey: 'TEMPLATE_3',
    accessLevel: 'PREMIUM',
    category: 'Simple',
    status: 'ACTIVE',
    templateDocUrl: 'assets/img/templates/rt3.png',
  },
  {
    id: 4,
    title: 'Modern Crisp',
    templateKey: 'TEMPLATE_4',
    componentKey: 'TEMPLATE_4',
    accessLevel: 'PREMIUM',
    category: 'Modern',
    status: 'ACTIVE',
    templateDocUrl: 'assets/img/templates/rt4.png',
  },
  {
    id: 5,
    title: 'Modern Split',
    templateKey: 'TEMPLATE_5',
    componentKey: 'TEMPLATE_5',
    accessLevel: 'PREMIUM',
    category: 'Modern',
    status: 'ACTIVE',
    templateDocUrl: 'assets/img/templates/rt5.png',
  },
  {
    id: 6,
    title: 'Creative Accent',
    templateKey: 'TEMPLATE_6',
    componentKey: 'TEMPLATE_6',
    accessLevel: 'PREMIUM',
    category: 'Creative',
    status: 'ACTIVE',
    templateDocUrl: 'assets/img/templates/rt6.png',
  },
  {
    id: 7,
    title: 'Creative Blocks',
    templateKey: 'TEMPLATE_7',
    componentKey: 'TEMPLATE_7',
    accessLevel: 'PREMIUM',
    category: 'Creative',
    status: 'ACTIVE',
    templateDocUrl: 'assets/img/templates/rt7.png',
  },
  {
    id: 9,
    title: 'DualEdge',
    templateKey: 'TEMPLATE_9',
    componentKey: 'TEMPLATE_9',
    accessLevel: 'PREMIUM',
    category: 'Modern',
    status: 'ACTIVE',
    templateDocUrl: 'assets/img/templates/template9.jpg',
  },
  {
    id: 10,
    title: 'Modern',
    templateKey: 'TEMPLATE_10',
    componentKey: 'TEMPLATE_10',
    accessLevel: 'PREMIUM',
    category: 'Modern',
    status: 'ACTIVE',
    templateDocUrl: 'assets/img/templates/template10.jpg',
  },
];

@Injectable({ providedIn: 'root' })
export class ResumeTemplateSourceService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly api = inject(ResumeTemplateApiService);
  private readonly storage = inject(LocalStorageService);
  private readonly useApi = signal(true);
  private readonly useMock = !!environment.useMockResumeTemplates;
  private activeMode: 'public' | 'available' = 'public';
  private cacheByMode: Record<'public' | 'available', { timestamp: number; data: ResumeTemplateDto[] } | null> = {
    public: null,
    available: null,
  };
  private hydrated = false;

  readonly templates = signal<ResumeTemplateUi[]>(this.useMock ? adaptResumeTemplates(staticTemplatesFallback) : []);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.hydrateCache('public');
    this.hydrateCache('available');
  }

  setUseApi(enabled: boolean): void {
    this.useApi.set(enabled);
  }

  loadTemplates(mode: 'public' | 'available' = 'public'): void {
    this.activeMode = mode;
    this.getTemplates({ forceRefresh: false });
  }

  refresh(forceRefresh = true): void {
    this.getTemplates({ forceRefresh });
  }

  getTemplates(options?: { forceRefresh?: boolean }): void {
    if (!this.useApi()) {
      if (this.useMock) {
        this.templates.set(adaptResumeTemplates(staticTemplatesFallback));
      } else {
        this.templates.set([]);
      }
      return;
    }

    if (this.useMock) {
      this.templates.set(adaptResumeTemplates(staticTemplatesFallback));
      return;
    }

    const isNodeRuntime =
      typeof (globalThis as any).process !== 'undefined' &&
      !!(globalThis as any).process?.versions?.node;

    if (!isPlatformBrowser(this.platformId) || isNodeRuntime) {
      return;
    }

    const forceRefresh = !!options?.forceRefresh;
    if (!forceRefresh && this.isCacheValid(this.activeMode)) {
      const cached = this.cacheByMode[this.activeMode]?.data ?? [];
      this.templates.set(adaptResumeTemplates(cached));
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const request = this.activeMode === 'available'
      ? this.api.listAvailable()
      : this.api.listPublic();

    request
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (items) => {
          const normalized = this.normalizeTemplates(items);
          if (normalized.length > 0) {
            this.setCache(this.activeMode, normalized);
            this.templates.set(adaptResumeTemplates(normalized));
            return;
          }
          this.templates.set([]);
        },
        error: (err) => {
          console.warn('[ResumeTemplateSource] API failed, using static fallback.', err);
          this.error.set(String(err?.message ?? 'Failed to load resume templates.'));
          const cached = this.cacheByMode[this.activeMode]?.data;
          if (cached && cached.length > 0) {
            this.templates.set(adaptResumeTemplates(cached));
          }
        },
      });
  }

  private normalizeTemplates(items: ResumeTemplateDto[]): ResumeTemplateDto[] {
    const active = items.filter(
      (item) => (item.status ?? '').toString().toUpperCase() === 'ACTIVE'
    );

    active.sort((a, b) => {
      const aOrder = Number.isFinite(Number(a.sortOrder)) ? Number(a.sortOrder) : Number.POSITIVE_INFINITY;
      const bOrder = Number.isFinite(Number(b.sortOrder)) ? Number(b.sortOrder) : Number.POSITIVE_INFINITY;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return (a.title ?? '').localeCompare(b.title ?? '');
    });

    return active;
  }

  private hydrateCache(mode: 'public' | 'available'): void {
    if (this.hydrated && this.cacheByMode[mode]) return;
    if (!this.hydrated) {
      this.hydrated = true;
    }

    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const raw = this.storage.getItemByName(this.getCacheKey(mode));
      if (!raw) return;
      const parsed = JSON.parse(raw) as { timestamp: number; data: ResumeTemplateDto[] };
      if (!parsed?.timestamp || !Array.isArray(parsed?.data)) return;
      if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return;
      const normalized = this.normalizeTemplates(parsed.data);
      this.cacheByMode[mode] = { timestamp: parsed.timestamp, data: normalized };
      if (normalized.length > 0 && this.activeMode === mode) {
        this.templates.set(adaptResumeTemplates(normalized));
      }
    } catch {
      // ignore cache hydration errors
    }
  }

  private isCacheValid(mode: 'public' | 'available'): boolean {
    const cached = this.cacheByMode[mode];
    if (!cached || cached.data.length === 0) return false;
    if (!cached.timestamp) return false;
    return Date.now() - cached.timestamp < CACHE_TTL_MS;
  }

  private setCache(mode: 'public' | 'available', data: ResumeTemplateDto[]): void {
    const timestamp = Date.now();
    this.cacheByMode[mode] = { timestamp, data };

    if (!isPlatformBrowser(this.platformId)) return;

    try {
      this.storage.setItem(this.getCacheKey(mode), { timestamp, data });
    } catch {
      // ignore cache persistence errors
    }
  }

  private getCacheKey(mode: 'public' | 'available'): string {
    return `${CACHE_KEY_PREFIX}_${mode}`;
  }
}

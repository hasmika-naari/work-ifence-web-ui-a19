import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import type { ResumeTemplateCard } from 'src/app/models/resume-template-card.model';
import { ResumeTemplateApiService } from './resume-template-api.service';

const staticTemplatesFallback: ResumeTemplateCard[] = [
  {
    id: 1,
    title: 'Atlantic Blue',
    imageUrl: 'assets/img/templates/rt1.png',
    category: 'Simple',
    status: 'ACTIVE',
  },
  {
    id: 2,
    title: 'Minimal',
    imageUrl: 'assets/img/templates/rt2.png',
    category: 'Simple',
    status: 'ACTIVE',
  },
  {
    id: 3,
    title: 'Mono',
    imageUrl: 'assets/img/templates/rt3.png',
    category: 'Simple',
    status: 'ACTIVE',
  },
  {
    id: 4,
    title: 'Modern Crisp',
    imageUrl: 'assets/img/templates/rt4.png',
    category: 'Modern',
    status: 'ACTIVE',
  },
  {
    id: 5,
    title: 'Modern Split',
    imageUrl: 'assets/img/templates/rt5.png',
    category: 'Modern',
    status: 'ACTIVE',
  },
  {
    id: 6,
    title: 'Creative Accent',
    imageUrl: 'assets/img/templates/rt6.png',
    category: 'Creative',
    status: 'ACTIVE',
  },
  {
    id: 7,
    title: 'Creative Blocks',
    imageUrl: 'assets/img/templates/rt7.png',
    category: 'Creative',
    status: 'ACTIVE',
  },
];

@Injectable({ providedIn: 'root' })
export class ResumeTemplateStoreService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly templates = signal<ResumeTemplateCard[]>(staticTemplatesFallback);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(private readonly api: ResumeTemplateApiService) {}

  loadTemplates(mode: 'public' | 'available'): void {
    const isNodeRuntime =
      typeof (globalThis as any).process !== 'undefined' &&
      !!(globalThis as any).process?.versions?.node;

    if (!isPlatformBrowser(this.platformId) || isNodeRuntime) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const request = mode === 'public'
      ? this.api.getPublicTemplates()
      : this.api.getAvailableTemplates();

    request
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (items) => {
          if (Array.isArray(items) && items.length > 0) {
            this.templates.set(items);
          }
        },
        error: (err) => {
          this.error.set(String(err?.message ?? 'Failed to load resume templates.'));
        },
      });
  }
}

import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import type { AccessMeDto } from '../models/access-me.model';

export type DashboardContext = 'PERSONAL' | 'ENTERPRISE';

@Injectable({ providedIn: 'root' })
export class DashboardContextService {
  private readonly storageKey = 'wif.dashboardContext';

  private readonly platformId = inject(PLATFORM_ID);
  private readonly storage = inject(LocalStorageService);

  private readonly fromStorage = signal(false);
  private readonly ctx = signal<DashboardContext>('PERSONAL');

  readonly context = computed(() => this.ctx());
  readonly isFromStorage = computed(() => this.fromStorage());

  constructor() {
    // Initialize from localStorage once (browser-only)
    if (isPlatformBrowser(this.platformId)) {
      const raw = this.storage.getItemByName(this.storageKey);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as unknown;
          if (parsed === 'PERSONAL' || parsed === 'ENTERPRISE') {
            this.ctx.set(parsed);
            this.fromStorage.set(true);
          }
        } catch {
          // ignore corrupt storage
        }
      }
    }

    // Persist any changes to localStorage
    effect(() => {
      const next = this.ctx();
      if (!isPlatformBrowser(this.platformId)) return;
      this.storage.setItem(this.storageKey, next);
    });
  }

  setPersonal(): void {
    this.ctx.set('PERSONAL');
  }

  setEnterprise(): void {
    this.ctx.set('ENTERPRISE');
  }

  /**
   * Applies an initial default based on access state.
   * Only runs if the user has not previously chosen a context.
   */
  ensureDefaultForAccess(me: AccessMeDto | undefined | null): void {
    if (this.fromStorage()) return;

    const mode = (me?.mode ?? 'PERSONAL').toString();
    const canEnterprise = mode === 'ENTERPRISE_EMPLOYEE' || mode === 'ENTERPRISE_ADMIN';

    this.ctx.set(canEnterprise ? 'ENTERPRISE' : 'PERSONAL');
  }
}

import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import type { AccessMeDto } from '../models/access-me.model';

export type DashboardContext = 'PERSONAL' | 'ENTERPRISE';

@Injectable({ providedIn: 'root' })
export class DashboardContextService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly fromStorage = signal(false);
  private readonly ctx = signal<DashboardContext>('PERSONAL');

  readonly context = computed(() => this.ctx());
  readonly isFromStorage = computed(() => this.fromStorage());

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.fromStorage.set(false);
    }
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

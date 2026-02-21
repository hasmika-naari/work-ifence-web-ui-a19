import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { AccessMeDto } from 'src/app/models/access-me.model';

@Injectable({ providedIn: 'root' })
export class ProfileContextStorageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'wifence.profileContext';
  private migrationChecked = false;
  private transientPlanTier = '';

  constructor() {}

  setProfileContext(activeRoleKey: string, mode: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.migrateLegacyOnce();

    const normalizedRole = this.normalizeRole(activeRoleKey);
    if (!normalizedRole) return;

    const normalizedMode = this.normalizeMode(mode) || this.inferModeFromRole(normalizedRole);
    const payload = {
      activeProfileKey: normalizedRole,
      mode: normalizedMode,
      updatedAt: Date.now(),
    };

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(payload));
      console.log('[PROFILE_CONTEXT_WRITE]', payload);
    } catch {
      // ignore storage failures
    }
  }

  syncFromAccessMe(accessMe: AccessMeDto | null | undefined): { activeRoleKey: string; mode: string } {
    const activeRoleKey = this.getActiveProfileKey(accessMe?.activeProfileKey);
    const mode = this.getMode(accessMe?.mode, activeRoleKey);

    this.setProfileContext(activeRoleKey, mode);
    return { activeRoleKey, mode };
  }

  getStoredRoleKey(): string {
    if (!isPlatformBrowser(this.platformId)) return '';

    this.migrateLegacyOnce();

    try {
      const context = this.readProfileContext();
      return this.normalizeRole(context?.activeProfileKey);
    } catch {
      return '';
    }
  }

  getActiveRoleKey(): string {
    return this.getStoredRoleKey();
  }

  getActiveProfileKey(inMemoryActiveProfileKey?: string | null | undefined): string {
    return this.normalizeRole(inMemoryActiveProfileKey) || this.getStoredRoleKey() || 'ROLE_USER';
  }

  getStoredMode(): string {
    if (!isPlatformBrowser(this.platformId)) return '';

    this.migrateLegacyOnce();

    try {
      const context = this.readProfileContext();
      return this.normalizeMode(context?.mode);
    } catch {
      return '';
    }
  }

  getCurrent(): { activeProfileKey: string; mode: string; updatedAt: number } | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    this.migrateLegacyOnce();

    try {
      return this.readProfileContext();
    } catch {
      return null;
    }
  }

  getMode(inMemoryMode?: string | null | undefined, activeProfileKey?: string | null | undefined): string {
    return (
      this.normalizeMode(inMemoryMode) ||
      this.getStoredMode() ||
      this.inferModeFromRole(this.normalizeRole(activeProfileKey) || this.getStoredRoleKey() || 'ROLE_USER')
    );
  }

  getPricingScope(): string {
    const mode = this.getStoredMode();
    return mode === 'ADMIN' ? 'enterprise' : 'individual';
  }

  setPlanTier(planTier: string | null | undefined): void {
    this.transientPlanTier = (planTier ?? '').toString().trim().toUpperCase();
  }

  getPlanTier(): string {
    return this.transientPlanTier;
  }

  clearRoleKeys(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.removeItem(this.storageKey);
      this.clearLegacyKeys();
      this.transientPlanTier = '';
    } catch {
      // ignore storage failures
    }
  }

  inferModeFromRole(roleKey: string): string {
    const normalizedRole = this.normalizeRole(roleKey);
    if (normalizedRole === 'ROLE_ADMIN' || normalizedRole === 'PLATFORM_ADMIN') return 'ADMIN';
    return 'PERSONAL';
  }

  private normalizeRole(value: unknown): string {
    return (value ?? '').toString().trim().toUpperCase();
  }

  private normalizeMode(value: unknown): string {
    const normalized = (value ?? '').toString().trim().toUpperCase();
    if (normalized === 'ADMIN' || normalized === 'PERSONAL') return normalized;
    return '';
  }

  private migrateLegacyOnce(): void {
    if (this.migrationChecked || !isPlatformBrowser(this.platformId)) {
      return;
    }

    this.migrationChecked = true;

    try {
      const existing = this.readProfileContext();
      if (existing?.activeProfileKey && existing?.mode) {
        this.clearLegacyKeys();
        return;
      }

      const legacyRole = this.normalizeRole(
        localStorage.getItem('wifence-activeRoleKey') || localStorage.getItem('activeRoleKey')
      );

      if (legacyRole) {
        const resolvedRole = legacyRole || 'ROLE_USER';
        const resolvedMode = this.inferModeFromRole(resolvedRole);
        localStorage.setItem(
          this.storageKey,
          JSON.stringify({
            activeProfileKey: resolvedRole,
            mode: resolvedMode,
            updatedAt: Date.now(),
          }),
        );
      }

      this.clearLegacyKeys();
    } catch {
      // ignore migration failures
    }
  }

  private readProfileContext(): { activeProfileKey: string; mode: string; updatedAt: number } | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as {
      activeProfileKey?: unknown;
      mode?: unknown;
      updatedAt?: unknown;
    };

    const activeProfileKey = this.normalizeRole(parsed?.activeProfileKey);
    const mode = this.normalizeMode(parsed?.mode);
    const updatedAt = Number(parsed?.updatedAt ?? 0);

    if (!activeProfileKey || !mode) return null;

    const profileContextObject = {
      activeProfileKey,
      mode,
      updatedAt: Number.isFinite(updatedAt) ? updatedAt : 0,
    };

    console.log('[PROFILE_CONTEXT_READ]', profileContextObject);
    return profileContextObject;
  }

  private clearLegacyKeys(): void {
    localStorage.removeItem('activeRoleKey');
    localStorage.removeItem('wifence-activeRoleKey');
    localStorage.removeItem('wifence-wif.dashboardContext');
    localStorage.removeItem('wif.dashboardContext');
  }
}

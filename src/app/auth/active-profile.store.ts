import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ProfileContextStorageService } from 'src/app/services/profile-context-storage.service';

export type ActiveRoleKey = string;

export interface ActiveProfileState {
  activeRoleKey: ActiveRoleKey;
  roles: string[];
  planCode: string;
  planTier: string;
  subscriptionStatus: string;
  entitlements: Set<string>;
}

type NavbarUserLike = {
  roleKey?: string;
  role?: string;
  roles?: string[];
  planCode?: string;
  planTier?: string;
  subscriptionStatus?: string;
  plan?: string;
};

@Injectable({ providedIn: 'root' })
export class ActiveProfileStore {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly profileContextStorage = inject(ProfileContextStorageService);

  private readonly state = signal<ActiveProfileState>({
    activeRoleKey: '',
    roles: [],
    planCode: '',
    planTier: '',
    subscriptionStatus: '',
    entitlements: new Set<string>(),
  });

  readonly activeRoleKey = computed(() => this.state().activeRoleKey);
  readonly roles = computed(() => this.state().roles);
  readonly planCode = computed(() => this.state().planCode);
  readonly planTier = computed(() => this.state().planTier);
  readonly subscriptionStatus = computed(() => this.state().subscriptionStatus);
  readonly entitlements = computed(() => this.state().entitlements);

  setActiveRole(roleKey: string): void {
    const normalizedRole = this.normalizeRole(roleKey);
    if (!normalizedRole) return;

    this.state.update((previous) => ({
      ...previous,
      activeRoleKey: normalizedRole,
      entitlements: new Set<string>(),
      roles: previous.roles.includes(normalizedRole)
        ? previous.roles
        : [...previous.roles, normalizedRole],
    }));

  }

  setFromNavbarResponse(navbarUser: NavbarUserLike | null | undefined): void {
    const user = navbarUser ?? {};

    const roles = Array.isArray(user.roles)
      ? user.roles.map((role) => this.normalizeRole(role)).filter((role) => !!role)
      : [];

    const currentRoleKey = this.activeRoleKey();

    this.state.update((previous) => ({
      ...previous,
      activeRoleKey: currentRoleKey,
      roles,
      planCode: (user.planCode ?? user.plan ?? '').toString().trim(),
      subscriptionStatus: (user.subscriptionStatus ?? '').toString().trim(),
    }));

  }

  setPlanTier(planTier: string | null | undefined): void {
    const normalized = (planTier ?? '').toString().trim().toUpperCase();

    this.state.update((previous) => ({
      ...previous,
      planTier: normalized,
    }));
  }

  setEntitlements(entitlements: Iterable<string> | null | undefined): void {
    const normalized = Array.from(entitlements ?? [])
      .map((entitlement) => this.normalizeRole(entitlement))
      .filter((entitlement) => !!entitlement);

    this.state.update((previous) => ({
      ...previous,
      entitlements: new Set<string>(normalized),
    }));
  }

  clear(): void {
    this.state.set({
      activeRoleKey: '',
      roles: [],
      planCode: '',
      planTier: '',
      subscriptionStatus: '',
      entitlements: new Set<string>(),
    });

    if (!isPlatformBrowser(this.platformId)) return;
    try {
      this.profileContextStorage.clearRoleKeys();
    } catch {
      // ignore
    }
  }

  restoreActiveRoleFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const stored = this.normalizeRole(this.profileContextStorage.getStoredRoleKey());
      if (!stored) return;

      this.state.update((previous) => ({
        ...previous,
        activeRoleKey: stored,
        roles: previous.roles.includes(stored)
          ? previous.roles
          : [...previous.roles, stored],
      }));
    } catch {
      // ignore
    }
  }

  private normalizeRole(role: string | null | undefined): string {
    return (role ?? '').toString().trim().toUpperCase();
  }
}
import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { WifRole } from './profile.model';
import { UserStoreService } from './store/user-store.service';

@Injectable({ providedIn: 'root' })
export class ActiveRoleService {
  private readonly storageKey = 'wif.activeRole';

  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly storage = inject(LocalStorageService);
  private readonly userStore = inject(UserStoreService);

  private readonly initialized = signal(false);

  constructor() {
    effect(() => {
      const roles = this.userStore.getUserRoles()();
      if (!roles || roles.length === 0) return;

      // If active role is already set (non-empty), just persist and exit.
      const current = this.userStore.getUserActiveRole()();
      if (current?.role) {
        this.persistRole(current);
        this.initialized.set(true);
        return;
      }

      if (this.initialized()) return;

      const fromStorage = this.restoreRole(roles);
      if (fromStorage) {
        this.userStore.updateActiveRole(fromStorage);
        this.initialized.set(true);
        return;
      }

      // Heuristic: if URL indicates admin dashboard, prefer admin role.
      const url = this.router.url || '';
      const adminRole = roles.find((r) => r.role === 'PLATFORM_ADMIN' || r.role === 'ROLE_ADMIN');
      if (url.includes('dashboard-admin') && adminRole) {
        this.userStore.updateActiveRole(adminRole);
        this.persistRole(adminRole);
        this.initialized.set(true);
        return;
      }

      // Default to first available role.
      this.userStore.updateActiveRole(roles[0]);
      this.persistRole(roles[0]);
      this.initialized.set(true);
    });
  }

  getActiveRole() {
    return this.userStore.getUserActiveRole();
  }

  setActiveRole(role: WifRole): void {
    this.userStore.updateActiveRole(role);
    this.persistRole(role);
  }

  private persistRole(role: WifRole): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!role?.role) return;

    // Store the role key only (stable + small).
    this.storage.setItem(this.storageKey, role.role);
  }

  private restoreRole(availableRoles: WifRole[]): WifRole | undefined {
    if (!isPlatformBrowser(this.platformId)) return undefined;

    const raw = this.storage.getItemByName(this.storageKey);
    if (!raw) return undefined;

    let storedRoleKey: string | undefined;
    try {
      storedRoleKey = JSON.parse(raw);
    } catch {
      return undefined;
    }

    if (!storedRoleKey) return undefined;

    return availableRoles.find((r) => r.role === storedRoleKey);
  }
}

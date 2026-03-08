import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { of } from 'rxjs';

import { NavbarApiService } from './navbar-api.service';
import { NavbarResponseDTO } from './navbar.model';
import { environment } from 'src/environments/environment';
import { ActiveProfileStore } from 'src/app/auth/active-profile.store';
import { AccessContextService } from 'src/app/services/access-context.service';
import { ProfileContextStorageService } from 'src/app/services/profile-context-storage.service';
import { NavApiSection } from 'src/app/core/nav/nav-api.model';
import { normalizeEntitlementKey } from 'src/app/entitlements/entitlement-key.util';

export type NavbarRefreshReason = 'profile-switch' | 'manual';

@Injectable({ providedIn: 'root' })
export class NavbarStoreService {
  private readonly navbarSubject = new BehaviorSubject<NavbarResponseDTO | null>(null);
  readonly navbar$: Observable<NavbarResponseDTO | null> = this.navbarSubject.asObservable();
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();
  private loaded = false;
  private loggedResolvedRole = false;

  constructor(
    private readonly navbarApi: NavbarApiService,
    private readonly activeProfileStore: ActiveProfileStore,
    private readonly accessContext: AccessContextService,
    private readonly profileContextStorage: ProfileContextStorageService,
  ) {}

  loadNavbar(force = false): void {
    if (force === true) {
      this.loaded = false;
      this.navbarSubject.next(null);
    }

    if (this.loadingSubject.value) {
      return;
    }

    if (force !== true && this.loaded) {
      return;
    }

    this.loadingSubject.next(true);
    this.resolveCurrentActiveRoleKey().subscribe((resolvedRoleKey) => {
      this.activeProfileStore.setActiveRole(resolvedRoleKey);

      this.navbarApi.getMyNavbar(resolvedRoleKey).subscribe({
        next: (navbar) => {
          // Sort sections and items if backend does not sort
          const sortedSections = (navbar.sections || []).slice().sort((a, b) => a.sortOrder - b.sortOrder);
          sortedSections.forEach(section => {
            section.items = (section.items || []).slice().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
          });
          this.navbarSubject.next({ ...navbar, sections: sortedSections });
          this.loaded = true;
          this.loadingSubject.next(false);
        },
        error: () => {
          // Fallback: empty menu
          this.navbarSubject.next({ sections: [] });
          this.loaded = false;
          this.loadingSubject.next(false);
        },
      });
    });
  }

  initOnce(): void {
    this.loadNavbar(false);
  }

  refresh(): void {
    this.loadNavbar(true);
  }

  refreshNavbar(reason: NavbarRefreshReason): void {
    this.loadNavbar(true);
  }

  clear(): void {
    this.navbarSubject.next(null);
    this.loaded = false;
    this.loadingSubject.next(false);
  }

  applySectionsFromAccessContext(sections: NavApiSection[], activeProfileKey?: string): void {
    const normalizedRoleKey = this.normalizeRole(activeProfileKey) || this.resolveActiveRoleKey();
    const nextSections = (sections ?? []).map((section) => ({
      sectionKey: (section?.id ?? '').toString().trim(),
      title: (section?.title ?? '').toString().trim(),
      icon: '',
        sortOrder: section?.sortOrder ?? 0,
      items: (section?.items ?? []).map((item) => ({
        itemKey: (item?.id ?? '').toString().trim(),
        title: (item?.title ?? '').toString().trim(),
        icon: (item?.icon ?? '').toString().trim(),
        route: (item?.route ?? '').toString().trim(),
        locked: item?.locked === true,
        allowed: item?.allowed !== false,
        lockReason: item?.locked === true ? 'Locked feature' : undefined,
        readOnly: false,
        featureStatus: 'ACTIVE' as 'ACTIVE',
        entitlementKey: normalizeEntitlementKey(item?.entitlementKey) || undefined,
        showWhenLocked: item?.showWhenLocked === true,
      })),
    }));

    this.navbarSubject.next({
      user: {
        userId: 0,
        role: normalizedRoleKey,
        plan: '',
      },
      sections: Array.isArray(nextSections) ? nextSections : [nextSections],
    });
    this.loaded = true;
    this.loadingSubject.next(false);
  }

  private collectEntitlements(navbar: NavbarResponseDTO | null): Set<string> {
    const values = new Set<string>();
    for (const section of navbar?.sections ?? []) {
      for (const item of section.items ?? []) {
        const entitlement = (item?.entitlementKey ?? '').toString().trim().toUpperCase();
        if (entitlement) {
          values.add(entitlement);
        }
      }
    }
    return values;
  }

  private logNavbarDebugDiagnostics(navbar: NavbarResponseDTO): void {
    if (!environment.debugNavbar) {
      return;
    }

    const user = (navbar.user ?? {}) as Record<string, unknown>;

    const allItems = (navbar.sections ?? []).flatMap((section) => section.items ?? []);
    const lockedItems = allItems.filter((item) => item.locked === true);
    const allowedItems = allItems.filter((item) => item.locked !== true && item.allowed !== false);
    const lockedEntitlementKeys = Array.from(
      new Set(
        lockedItems
          .map((item) => (item.entitlementKey ?? '').toString().trim())
          .filter((key) => key.length > 0),
      ),
    );

    console.info('[NavbarDebug] user access', {
      planCode: (navbar.user?.['plan'] ?? '').toString(),
      subscriptionStatus: (user['subscriptionStatus'] ?? '').toString(),
    });
    console.info('[NavbarDebug] item counts', {
      total: allItems.length,
      locked: lockedItems.length,
      allowed: allowedItems.length,
    });
    console.info('[NavbarDebug] locked entitlement keys', lockedEntitlementKeys);
  }

  private resolveActiveRoleKey(): string {
    const roleFromAccessMe = this.normalizeRole(this.accessContext.accessMe()?.activeProfileKey);
    if (roleFromAccessMe) {
      return roleFromAccessMe;
    }

    const roleFromStorage = this.normalizeRole(this.profileContextStorage.getActiveRoleKey());
    if (roleFromStorage) {
      return roleFromStorage;
    }

    return 'ROLE_USER';
  }

  private resolveCurrentActiveRoleKey(): Observable<string> {
    return of(this.resolveActiveRoleKey());
  }

  private normalizeRole(value: unknown): string {
    return (value ?? '').toString().trim().toUpperCase();
  }
}

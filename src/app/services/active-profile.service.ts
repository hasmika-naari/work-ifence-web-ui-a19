import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AccessApiService } from 'src/app/services/access-api.service';
import { getLandingRoute } from 'src/app/routing/landing-route.util';
import type { AccessMeDto, AvailableProfileDto } from 'src/app/models/access-me.model';
import { ProfileContextStorageService } from 'src/app/services/profile-context-storage.service';
import { Router } from '@angular/router';

export interface ActiveProfileContext {
  activeRoleKey: string;
  mode: string;
  homeRoute: string;
}

@Injectable({ providedIn: 'root' })
export class ActiveProfileService {
  constructor(
    private readonly accessApi: AccessApiService,
    private readonly profileContextStorage: ProfileContextStorageService,
    private readonly router: Router,
  ) {}

  navigateToActiveHome(accessMe: AccessMeDto | null | undefined): Promise<boolean> {
    const normalizedAccessMe = accessMe ?? null;
    const activeRoleKey = this.resolveRoleKeyFromAccessMe(normalizedAccessMe);
    const homeRoute = this.resolveHomeRoute(normalizedAccessMe, activeRoleKey);
    return this.router.navigateByUrl(homeRoute);
  }

  resolveActiveProfileContext(): Observable<ActiveProfileContext> {
    return this.accessApi.getAccessMe().pipe(
      map((accessMe) => {
        const synced = this.profileContextStorage.syncFromAccessMe(accessMe);
        const activeRoleKey = synced.activeRoleKey;
        const mode = synced.mode;
        const homeRoute = this.resolveHomeRoute(accessMe, activeRoleKey);

        return { activeRoleKey, mode, homeRoute };
      }),
      catchError(() => {
        const fallbackRoleKey = this.resolveRoleKeyFromAccessMe(null);
        const fallbackMode = this.resolveDashboardMode(null, fallbackRoleKey);
        const fallbackHomeRoute = getLandingRoute(fallbackRoleKey);

        this.profileContextStorage.setProfileContext(fallbackRoleKey, fallbackMode);
        return of({ activeRoleKey: fallbackRoleKey, mode: fallbackMode, homeRoute: fallbackHomeRoute });
      }),
    );
  }

  resolveActiveRoleKey(): Observable<string> {
    return this.resolveActiveProfileContext().pipe(map((context) => context.activeRoleKey));
  }

  private resolveRoleKeyFromAccessMe(accessMe: AccessMeDto | null): string {
    const backendActiveProfileKey = (accessMe?.activeProfileKey ?? '').toString().trim().toUpperCase();
    const storedRoleKey = this.profileContextStorage.getStoredRoleKey();
    return backendActiveProfileKey || storedRoleKey || 'ROLE_USER';
  }

  private resolveDashboardMode(accessMe: AccessMeDto | null, activeRoleKey: string): string {
    const backendMode = (accessMe?.mode ?? '').toString().trim().toUpperCase();
    const storedMode = this.profileContextStorage.getStoredMode();
    return backendMode || storedMode || this.profileContextStorage.inferModeFromRole(activeRoleKey);
  }

  private resolveHomeRoute(accessMe: AccessMeDto | null, activeRoleKey: string): string {
    const availableProfiles = (accessMe?.availableProfiles ?? []) as AvailableProfileDto[];
    const match = availableProfiles.find(
      (profile) => (profile?.key ?? '').toString().trim().toUpperCase() === activeRoleKey,
    );

    const homeRoute = (match?.homeRoute ?? '').toString().trim();
    if (homeRoute) return homeRoute;
    return getLandingRoute(activeRoleKey);
  }
}
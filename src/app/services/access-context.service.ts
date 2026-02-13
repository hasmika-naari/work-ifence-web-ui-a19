import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { EntitlementService } from './entitlement.service';
import { NavStore } from '../core/nav/nav.store';
import { AccessMeDto, OwnedProfileDto, SwitchProfileResponseDto } from '../models/access-me.model';
import { AccessApiService } from './access-api.service';
import { NavMenuService } from './nav-menu.service';

@Injectable({ providedIn: 'root' })
export class AccessContextService {
  readonly accessMe = signal<AccessMeDto | null>(null);
  entitlementsMe = signal<any>(null);
  navMenu = signal<any>(null);

  // Derived signals
  /** Source of truth: /api/access/me */
  readonly activeProfileKey = computed(() => this.accessMe()?.activeProfileKey ?? null);
  readonly ownedProfiles = computed<OwnedProfileDto[]>(() => this.accessMe()?.ownedProfiles ?? []);

  constructor(
    private http: HttpClient,
    private accessApi: AccessApiService,
    private navMenuService: NavMenuService,
    private entitlementService: EntitlementService,
    private navStore: NavStore
  ) {
    this.reloadAll();
  }

  reloadAll() {
    this.refreshAccessMe().subscribe();
    this.refreshEntitlements().subscribe();
    this.refreshNavMenu().subscribe();
  }

  /** Backend-standard profile switch endpoint. Updates accessMe immediately with the response payload. */
  switchProfileRequest(profileKey: string): Observable<SwitchProfileResponseDto> {
    return this.accessApi.switchProfile(profileKey).pipe(
      tap((resp) => {
        const current = this.accessMe();
        if (current) {
          this.accessMe.set({
            ...current,
            activeProfileKey: resp.activeProfileKey,
            ownedProfiles: resp.ownedProfiles,
          });
        } else {
          // Best-effort immediate update; refreshAccessMe() will populate the rest.
          this.accessMe.set({
            activeProfileKey: resp.activeProfileKey,
            ownedProfiles: resp.ownedProfiles,
          } as AccessMeDto);
        }
      })
    );
  }

  refreshAccessMe(): Observable<AccessMeDto> {
    return this.accessApi.getAccessMe().pipe(tap((me) => this.accessMe.set(me)));
  }

  refreshEntitlements(): Observable<any> {
    return this.http.get<any>('/api/entitlements/me').pipe(
      tap((ent) => {
        this.entitlementsMe.set(ent);
        this.entitlementService.applyBackendResponse(ent);
      })
    );
  }

  refreshNavMenu(): Observable<any> {
    // Invalidate menu state before refetch.
    this.navMenu.set(null);
    this.navStore.clear();

    return this.navMenuService.loadMenu().pipe(
      tap((menu) => {
        // Keep the raw response for any non-sidebar consumers.
        this.navMenu.set(menu);
      })
    );
  }

  /**
   * Refresh all role/profile-dependent context in a strict order:
   * 1) /api/access/me
   * 2) /api/entitlements/me
   * 3) /api/access/nav/menu
   *
   * Also invalidates any cached menu state before reloading it, and syncs
   * EntitlementService + NavStore so dependent UI updates immediately.
   */
  refreshAllContexts(): Observable<{ me: AccessMeDto; entitlements: any; navMenu: any }> {
    // Keep strict order to avoid transient mismatches (e.g. menu built for old profile).
    return this.refreshAccessMe().pipe(
      switchMap((me) =>
        this.refreshEntitlements().pipe(
          switchMap((entitlements) =>
            this.refreshNavMenu().pipe(map((navMenu) => ({ me, entitlements, navMenu })))
          )
        )
      )
    );
  }
}

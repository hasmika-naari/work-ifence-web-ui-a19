import { Injectable, effect, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { EntitlementService } from './entitlement.service';
import { NavStore } from '../core/nav/nav.store';
import { AccessMeDto, AccessProfileContextDto, OwnedProfileDto, SwitchProfileResponseDto } from '../models/access-me.model';
import { AccessApiService } from './access-api.service';
import { NavMenuService } from './nav-menu.service';
import { UserStoreService } from './store/user-store.service';
import { ProfileContextStorageService } from './profile-context-storage.service';
import { ActiveProfileStore } from 'src/app/auth/active-profile.store';

@Injectable({ providedIn: 'root' })
export class AccessContextService {
  readonly accessMe = signal<AccessMeDto | null>(null);
  entitlementsMe = signal<any>(null);
  navMenu = signal<any>(null);

  // Source of truth for profile switching context: /api/access/profile/context
  readonly activeProfileKey = signal<string | null>(null);
  readonly ownedProfiles = signal<OwnedProfileDto[]>([]);

  snapshotProfileContext(): { activeProfileKey: string | null; ownedProfiles: OwnedProfileDto[] } {
    return {
      activeProfileKey: this.activeProfileKey(),
      ownedProfiles: this.ownedProfiles(),
    };
  }

  revertProfileContext(snapshot: { activeProfileKey: string | null; ownedProfiles: OwnedProfileDto[] }): void {
    this.activeProfileKey.set(snapshot.activeProfileKey ?? null);
    this.ownedProfiles.set(snapshot.ownedProfiles ?? []);

    // Best-effort: keep accessMe snapshot aligned for any consumers using /api/access/me.
    const current = this.accessMe();
    if (current) {
      this.accessMe.set({
        ...current,
        activeProfileKey: snapshot.activeProfileKey ?? undefined,
        ownedProfiles: snapshot.ownedProfiles ?? undefined,
      });
    }
  }

  constructor(
    private http: HttpClient,
    private accessApi: AccessApiService,
    private navMenuService: NavMenuService,
    private entitlementService: EntitlementService,
    private navStore: NavStore,
    private userStore: UserStoreService,
    private profileContextStorage: ProfileContextStorageService,
    private activeProfileStore: ActiveProfileStore,
  ) {
    // Avoid firing authenticated endpoints before we know auth state.
    // Refresh once login is confirmed; clear context on logout.
    const loginStatus = this.userStore.getUserLoginStatus();
    effect(() => {
      const loggedIn = loginStatus();
      if (loggedIn) {
        this.reloadAll();
      } else {
        this.clearContext();
      }
    });
  }

  reloadAll() {
    this.refreshAccessMe().subscribe({ error: () => void 0 });
    this.refreshProfileContext().subscribe({ error: () => void 0 });
    this.refreshEntitlements().subscribe({ error: () => void 0 });
    this.refreshNavMenu().subscribe({ error: () => void 0 });
  }

  ensureAccessContextLoaded(): Observable<AccessMeDto> {
    const current = this.accessMe();
    const hasLoadedContext = !!current &&
      (
        !!(current.activeProfileKey ?? '').toString().trim() ||
        Array.isArray(current.availableProfiles) ||
        Array.isArray(current.ownedProfiles)
      );

    if (hasLoadedContext) {
      return of(current as AccessMeDto);
    }

    return this.accessApi.getAccessMe().pipe(
      tap((me) => {
        this.applyAccessMeSnapshot(me);
        this.profileContextStorage.syncFromAccessMe(me);
        this.debugProfileVsPlanTier();
      }),
      catchError((err: unknown) => {
        const httpErr = err as HttpErrorResponse;
        if (httpErr?.status === 401 || httpErr?.status === 403) {
          this.clearContext();
        }

        const fallback = this.accessMe() ?? ({} as AccessMeDto);
        if (fallback) {
          this.profileContextStorage.syncFromAccessMe(fallback);
        }
        return of(fallback as AccessMeDto);
      })
    );
  }

  ensureEntitlementsLoaded(): Observable<any> {
    const current = this.entitlementsMe();
    if (current) {
      return of(current);
    }

    return this.refreshEntitlements().pipe(
      catchError(() => of(this.entitlementsMe() ?? null))
    );
  }

  private clearContext(): void {
    this.accessMe.set(null);
    this.activeProfileKey.set(null);
    this.ownedProfiles.set([]);

    this.entitlementsMe.set(null);
    this.navMenu.set(null);

    this.entitlementService.invalidateCache();
    this.navStore.clear();
  }

  /** Backend-standard profile switch endpoint. Updates accessMe immediately with the response payload. */
  switchProfileRequest(profileKey: string): Observable<SwitchProfileResponseDto> {
    return this.accessApi.switchProfile(profileKey).pipe(
      tap((resp) => {
        // Update active key immediately for UI.
        // Note: labels/descriptions should come from /api/access/me (ownedProfiles).
        // Some switch responses may omit labels, so avoid clobbering existing labeled profiles.
        this.activeProfileKey.set(resp.activeProfileKey ?? null);

        // Best-effort sync: some consumers also read activeProfileKey from /api/access/me.
        const current = this.accessMe();
        if (current) {
          this.accessMe.set({
            ...current,
            activeProfileKey: resp.activeProfileKey,
          });
        } else {
          // Best-effort immediate update; refreshAccessMe() will populate the rest.
          this.accessMe.set({
            activeProfileKey: resp.activeProfileKey,
          } as AccessMeDto);
        }
      })
    );
  }

  refreshProfileContext(opts?: { strict?: boolean }): Observable<AccessProfileContextDto> {
    const strict = opts?.strict === true;
    const source$ = this.accessApi.getProfileContext().pipe(
      tap((ctx) => {
        this.activeProfileKey.set(ctx?.activeProfileKey ?? null);

        // IMPORTANT: /api/access/profile/context may not include the backend display labels.
        // Avoid clobbering the labeled list we get from /api/access/me.
        const ctxProfiles = Array.isArray(ctx?.ownedProfiles) ? ctx.ownedProfiles : [];
        const current = this.ownedProfiles();
        const ctxHasLabels = ctxProfiles.some((p) => (p?.label ?? '').toString().trim().length > 0);

        if (current.length === 0 || ctxHasLabels) {
          this.ownedProfiles.set(ctxProfiles);
        }
      })
    );

    if (strict) return source$;

    // Non-strict mode: allow UI to keep working even if backend hasn't deployed the endpoint yet.
    return source$.pipe(
      catchError(() => {
        const me = this.accessMe();
        this.activeProfileKey.set(me?.activeProfileKey ?? null);
        this.ownedProfiles.set(me?.ownedProfiles ?? []);
        return of({
          activeProfileKey: me?.activeProfileKey ?? '',
          ownedProfiles: me?.ownedProfiles ?? [],
        });
      })
    );
  }

  refreshAccessMe(): Observable<AccessMeDto> {
    return this.accessApi.getAccessMe().pipe(
      tap((me) => {
        this.applyAccessMeSnapshot(me);
        this.profileContextStorage.syncFromAccessMe(me);
        this.debugProfileVsPlanTier();
      }),
      catchError((err: unknown) => {
        // /api/access/me returns 401 when logged out; don't leave the service in a broken state.
        const httpErr = err as HttpErrorResponse;
        if (httpErr?.status === 401 || httpErr?.status === 403) {
          this.clearContext();
        }
        // Keep stream alive for callers.
        return of({} as AccessMeDto);
      })
    );
  }

  private applyAccessMeSnapshot(me: AccessMeDto): void {
    this.accessMe.set(me);

    if (me?.activeProfileKey !== undefined) {
      this.activeProfileKey.set(me?.activeProfileKey ?? null);
    }

    const owned = Array.isArray(me?.ownedProfiles) ? me.ownedProfiles : [];
    if (owned.length > 0) {
      this.ownedProfiles.set(owned);
      return;
    }

    const available = Array.isArray(me?.availableProfiles) ? me.availableProfiles : [];
    if (available.length > 0) {
      this.ownedProfiles.set(
        available.map((p: any) => ({
          key: String(p?.key ?? ''),
          label: String(p?.label ?? '').trim(),
        }))
      );
    }
  }

  refreshEntitlements(): Observable<any> {
    // Clear cached entitlement context before reload.
    this.entitlementsMe.set(null);
    this.entitlementService.invalidateCache();
    return this.http.get<any>('/api/entitlements/me').pipe(
      tap((ent) => {
        this.entitlementsMe.set(ent);
        this.entitlementService.applyBackendResponse(ent);

        const planTier = (ent?.planTier ?? '').toString().trim().toUpperCase();
        if (planTier) {
          this.activeProfileStore.setPlanTier(planTier);
          this.profileContextStorage.setPlanTier(planTier);
        }

        this.debugProfileVsPlanTier();
      })
    );
  }

  private debugProfileVsPlanTier(): void {
    const me = this.accessMe();
    const ent = this.entitlementsMe();
    if (!me || !ent) return;

    const activeProfileKey = (me?.activeProfileKey ?? '').toString().trim().toUpperCase();
    const mode = (me?.mode ?? '').toString().trim().toUpperCase();
    const planTier = (ent?.planTier ?? '').toString().trim().toUpperCase() || this.profileContextStorage.getPlanTier();

    console.debug('[ProfileContextDebug] access vs entitlements', {
      activeProfileKey,
      mode,
      planTier,
    });
  }

  refreshNavMenu(): Observable<any> {
    // Clear cached menu state before refetch.
    this.navMenu.set(null);
    this.navStore.clear();

    return this.navMenuService.loadMenu().pipe(
      tap((menu) => {
        // Keep the raw response for any non-sidebar consumers.
        this.navMenu.set(menu);
      })
    );
  }

  /** Optional legacy refresh: GET /api/account. Failures are ignored. */
  refreshAccountOptional(): Observable<unknown | null> {
    return this.accessApi.getAccount().pipe(catchError(() => of(null)));
  }

  /**
   * Refresh role/profile-dependent context after profile switching.
   * Required order:
   * 1) /api/entitlements/me
   * 2) /api/access/nav/menu
   * 3) /api/access/me
   * 4) /api/access/profile/context
   *
   * Also invalidates any cached menu state before reloading it, and syncs
   * EntitlementService + NavStore so dependent UI updates immediately.
   */
  refreshAllContexts(): Observable<{
    profileContext: AccessProfileContextDto;
    entitlements: any;
    navMenu: any;
    accessMe: AccessMeDto;
    account?: unknown | null;
  }> {
    // After profile switch: strict order and fail if any required call fails.
    // Ensure /api/access/me is refreshed so ownedProfiles labels are always current.
    return this.refreshProfileContext({ strict: true }).pipe(
      switchMap((profileContext) =>
        this.refreshEntitlements().pipe(
          switchMap((entitlements) =>
            this.refreshNavMenu().pipe(
              switchMap((navMenu) =>
                this.refreshAccessMe().pipe(
                  switchMap((accessMe) =>
                    this.refreshAccountOptional().pipe(
                      map((account) => ({ profileContext, entitlements, navMenu, accessMe, account }))
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  }
}

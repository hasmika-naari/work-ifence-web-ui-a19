import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { EntitlementService } from './entitlement.service';
import { NavStore } from '../core/nav/nav.store';
import { AccessMeDto, AccessProfileContextDto, OwnedProfileDto, SwitchProfileResponseDto } from '../models/access-me.model';
import { AccessApiService } from './access-api.service';
import { NavMenuService } from './nav-menu.service';

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
    private navStore: NavStore
  ) {
    this.reloadAll();
  }

  reloadAll() {
    this.refreshAccessMe().subscribe();
    this.refreshProfileContext().subscribe();
    this.refreshEntitlements().subscribe();
    this.refreshNavMenu().subscribe();
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
        this.accessMe.set(me);

        // Keep these signals aligned with /api/access/me so the header + right-sidenav
        // always have the backend-provided labels for ownedProfiles.
        if (me?.activeProfileKey !== undefined) {
          this.activeProfileKey.set(me?.activeProfileKey ?? null);
        }

        const owned = Array.isArray(me?.ownedProfiles) ? me.ownedProfiles : [];
        if (owned.length > 0) {
          this.ownedProfiles.set(owned);
          return;
        }

        // Fallback: some backends may omit ownedProfiles but provide availableProfiles with labels.
        const available = Array.isArray(me?.availableProfiles) ? me.availableProfiles : [];
        if (available.length > 0) {
          this.ownedProfiles.set(
            available.map((p: any) => ({
              key: String(p?.key ?? ''),
              label: String(p?.label ?? '').trim(),
            }))
          );
        }
      })
    );
  }

  refreshEntitlements(): Observable<any> {
    // Clear cached entitlement context before reload.
    this.entitlementsMe.set(null);
    this.entitlementService.invalidateCache();
    return this.http.get<any>('/api/entitlements/me').pipe(
      tap((ent) => {
        this.entitlementsMe.set(ent);
        this.entitlementService.applyBackendResponse(ent);
      })
    );
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

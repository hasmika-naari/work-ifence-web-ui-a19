import { Injectable, signal } from '@angular/core';
import { AccessContextService } from './access-context.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, filter, switchMap, take, tap, timeout } from 'rxjs/operators';
import { firstValueFrom, of } from 'rxjs';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';

@Injectable({ providedIn: 'root' })
export class ProfilePanelService {
  // Template expects plain values (not signals)
  isSwitching = false;
  switchingKey: string | null = null;

  // Reactive switching state for effects/guards.
  readonly switching = signal(false);

  constructor(
    private accessContext: AccessContextService,
    private accessFacade: AccessFacadeService,
    private snackBar: MatSnackBar
  ) {}

  async switchProfile(profileKey: string, closeSidenav?: () => void): Promise<boolean> {
    this.isSwitching = true;
    this.switchingKey = profileKey;
    this.switching.set(true);

    const prev = this.accessContext.snapshotProfileContext();

    // Reset feature flags (best-effort)
    const remoteConfig = (window as any).ng?.injector?.get?.('RemoteConfigFacadeService') || null;
    if (remoteConfig && typeof remoteConfig.resetToDefaults === 'function') {
      remoteConfig.resetToDefaults();
    }

    try {
      const ok = await firstValueFrom(
        this.accessContext.switchProfileRequest(profileKey).pipe(
          // Hard refresh all contexts in strict order. Only navigate after this succeeds.
          switchMap(() => this.accessContext.refreshAllContexts()),
          // Keep AccessFacadeService (used by dashboard shell/guards) in sync.
          // Without this, the dashboard shell can briefly see stale ADMIN mode and redirect.
          tap(() => this.accessFacade.reload()),
          switchMap(() =>
            this.accessFacade.accessMe$.pipe(
              filter((me) => (me?.activeProfileKey ?? '') === profileKey),
              take(1),
              timeout(4000)
            )
          ),
          tap(() => {
            this.snackBar.open('Switched profile', 'Dismiss', { duration: 2500 });
          }),
          switchMap(() => of(true)),
          catchError((_err) => {
            // Revert UI selection if any refresh failed.
            this.accessContext.revertProfileContext(prev);
            this.snackBar.open('Unable to switch profile', 'Dismiss', { duration: 3000 });
            return of(false);
          })
        )
      );

      if (ok && closeSidenav) closeSidenav();
      return ok;
    } finally {
      this.isSwitching = false;
      this.switchingKey = null;
      this.switching.set(false);
    }
  }
}

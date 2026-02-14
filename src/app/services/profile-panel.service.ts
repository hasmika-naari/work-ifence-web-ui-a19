import { Injectable } from '@angular/core';
import { AccessContextService } from './access-context.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { firstValueFrom, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilePanelService {
  // Template expects plain values (not signals)
  isSwitching = false;
  switchingKey: string | null = null;

  constructor(
    private accessContext: AccessContextService,
    private snackBar: MatSnackBar
  ) {}

  async switchProfile(profileKey: string, closeSidenav?: () => void): Promise<boolean> {
    this.isSwitching = true;
    this.switchingKey = profileKey;

    // Reset feature flags (best-effort)
    const remoteConfig = (window as any).ng?.injector?.get?.('RemoteConfigFacadeService') || null;
    if (remoteConfig && typeof remoteConfig.resetToDefaults === 'function') {
      remoteConfig.resetToDefaults();
    }

    try {
      const ok = await firstValueFrom(
        this.accessContext.switchProfileRequest(profileKey).pipe(
          // Refresh all role-dependent state in order.
          switchMap(() => this.accessContext.refreshAllContexts()),
          tap(() => {
            this.snackBar.open('Switched profile', 'Dismiss', { duration: 2500 });
          }),
          switchMap(() => of(true)),
          catchError((_err) => {
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
    }
  }
}

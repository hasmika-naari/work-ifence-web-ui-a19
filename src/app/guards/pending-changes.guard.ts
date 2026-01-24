import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { UserStoreService } from '../services/store/user-store.service';
import { ConfirmDialogComponent2 } from '../common/dialog/confirm-dialog/confirm-dialog.component';

export interface CanComponentDeactivate {
  hasPendingChanges?: () => boolean;
}

export const pendingChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  const store = inject(UserStoreService);
  const dialog = inject(MatDialog);
  const platformId = inject(PLATFORM_ID);

  // During SSR / non-browser rendering, never attempt to open a dialog.
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const componentHasChanges = typeof component?.hasPendingChanges === 'function' ? !!component.hasPendingChanges() : false;
  let storeHasChanges = false;
  try {
    const signalGetter = (store as any).getIsChangeInNewResume?.();
    // signalGetter is a Signal<boolean>; call it to get value
    storeHasChanges = typeof signalGetter === 'function' ? !!signalGetter() : false;
  } catch {
    storeHasChanges = false;
  }
  if (componentHasChanges || storeHasChanges) {
    const dialogRef = dialog.open(ConfirmDialogComponent2, {
      width: '420px',
      data: {
        title: 'Unsaved changes',
        message: 'You have unsaved changes. Do you really want to leave?',
        icon: 'warning_amber',
        cancelText: 'Stay here',
        confirmText: 'Leave',
        confirmColor: 'warn',
      },
      disableClose: true,
    });
    return dialogRef.afterClosed().pipe(map((result) => !!result));
  }
  return true;
};

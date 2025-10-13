import { Injectable, inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { UserStoreService } from '../services/store/user-store.service';

export interface CanComponentDeactivate {
  hasPendingChanges?: () => boolean;
}

export const pendingChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  const store = inject(UserStoreService);
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
    return confirm('You have unsaved changes. Do you really want to leave?');
  }
  return true;
};

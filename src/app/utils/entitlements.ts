import type { AccessMeDto } from 'src/app/models/access-me.model';
import { environment } from 'src/environments/environment';

declare const ngDevMode: boolean;

export type EntitlementKey =
  | 'jobTracking'
  | 'courseCentral'
  | 'alerts'
  | 'templatesPremium'
  | 'resumeCreate'
  | (string & {});

function isDevFallback(me: AccessMeDto | undefined | null): boolean {
  if (environment.production) return false;
  const ent: any = me?.entitlements as any;
  // Optional dev-only marker. Lives under the existing "features" bag to avoid API contract changes.
  return ent?.features?.isDevFallback === true;
}

function devWarn(message: string): void {
  if (typeof ngDevMode === 'undefined' || !ngDevMode) return;
  if (environment.production) return;
  console.warn(message);
}

export function isEntitled(me: AccessMeDto | undefined | null, key: EntitlementKey): boolean {
  if (!me) return false;

  // DEV/preview only: allow explicit backend-provided dev fallback marker.
  if (isDevFallback(me)) return true;

  const status = (me.subscription?.status ?? '').toString().toUpperCase();
  const subscriptionOk = status === 'ACTIVE' || status === 'TRIALING' || status === '';

  const ent = me.entitlements ?? {};

  switch (key) {
    case 'jobTracking':
      if (typeof ent.jobTrackingEnabled === 'undefined') {
        devWarn("[Entitlements] Missing backend field 'jobTrackingEnabled' for entitlement 'jobTracking'. Defaulting to denied.");
        return false;
      }
      return subscriptionOk && ent.jobTrackingEnabled === true;
    case 'courseCentral':
      if (typeof ent.courseCentralEnabled === 'undefined') {
        devWarn("[Entitlements] Missing backend field 'courseCentralEnabled' for entitlement 'courseCentral'. Defaulting to denied.");
        return false;
      }
      return subscriptionOk && ent.courseCentralEnabled === true;
    case 'alerts':
      if (typeof ent.alertsEnabled === 'undefined') {
        devWarn("[Entitlements] Missing backend field 'alertsEnabled' for entitlement 'alerts'. Defaulting to denied.");
        return false;
      }
      return subscriptionOk && ent.alertsEnabled === true;
    case 'templatesPremium': {
      if (!subscriptionOk) return false;
      if (typeof ent.templateAccessLevel === 'undefined') {
        devWarn("[Entitlements] Missing backend field 'templateAccessLevel' for entitlement 'templatesPremium'. Defaulting to denied.");
        return false;
      }
      const level = (ent.templateAccessLevel ?? '').toString().toUpperCase();
      return level === 'PREMIUM' || level === 'ALL';
    }
    case 'resumeCreate': {
      if (!subscriptionOk) return false;
      const limit = ent.resumeLimit;
      if (typeof limit !== 'number') {
        devWarn("[Entitlements] Missing backend field 'resumeLimit' for entitlement 'resumeCreate'. Defaulting to denied.");
        return false;
      }
      const used = me.counts?.resumeCount ?? 0;
      return used < limit;
    }
    default: {
      devWarn(`[Entitlements] Unknown entitlement key '${String(key)}'. Defaulting to denied.`);
      return false;
    }
  }
}

export function entitlementDenyReason(key: EntitlementKey): string {
  switch (key) {
    case 'jobTracking':
      return 'Upgrade to enable job tracking.';
    case 'courseCentral':
      return 'Upgrade to enable Course Central.';
    case 'alerts':
      return 'Upgrade to enable alerts.';
    case 'templatesPremium':
      return 'Upgrade to access premium templates.';
    case 'resumeCreate':
      return 'Resume limit reached. Upgrade to create more.';
    default:
      return 'Upgrade required.';
  }
}

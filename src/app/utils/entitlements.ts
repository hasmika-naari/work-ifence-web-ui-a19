import type { AccessMeDto } from 'src/app/models/access-me.model';
import { ENTITLEMENT_KEYS, type EntitlementKey as CanonicalEntitlementKey } from 'src/app/entitlements/entitlement-keys';
import { normalizeEntitlementKey } from 'src/app/entitlements/entitlement-key.util';
import { environment } from 'src/environments/environment';

declare const ngDevMode: boolean;

export type EntitlementKey =
  | CanonicalEntitlementKey
  | 'jobTracking'
  | 'courseCentral'
  | 'alerts'
  | 'templatesPremium'
  | 'resumeCreate'
  | (string & {});

const ENTITLEMENT_ALIASES: Record<string, string> = {
  JOB_TRACKING: ENTITLEMENT_KEYS.JOB_TRACKING,
  COURSE_CENTRAL: ENTITLEMENT_KEYS.LEARN_PORTAL,
  LEARN_PORTAL: ENTITLEMENT_KEYS.LEARN_PORTAL,
  ALERTS: ENTITLEMENT_KEYS.JOB_ALERTS,
  JOB_ALERTS: ENTITLEMENT_KEYS.JOB_ALERTS,
  TEMPLATES_PREMIUM: ENTITLEMENT_KEYS.RESUME_TEMPLATES_PREMIUM,
  RESUME_TEMPLATES_PREMIUM: ENTITLEMENT_KEYS.RESUME_TEMPLATES_PREMIUM,
  RESUME_CREATE: ENTITLEMENT_KEYS.RESUME_BUILDER,
  RESUME_BUILDER: ENTITLEMENT_KEYS.RESUME_BUILDER,
};

function resolveEntitlementKey(key: EntitlementKey): string {
  const normalizedKey = normalizeEntitlementKey(key);
  return ENTITLEMENT_ALIASES[normalizedKey] ?? normalizedKey;
}

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
  const resolvedKey = resolveEntitlementKey(key);

  switch (resolvedKey) {
    case ENTITLEMENT_KEYS.JOB_TRACKING:
      if (typeof ent.jobTrackingEnabled === 'undefined') {
        devWarn("[Entitlements] Missing backend field 'jobTrackingEnabled' for entitlement 'JOB_TRACKING'. Defaulting to denied.");
        return false;
      }
      return subscriptionOk && ent.jobTrackingEnabled === true;
    case ENTITLEMENT_KEYS.LEARN_PORTAL:
      if (typeof ent.courseCentralEnabled === 'undefined') {
        devWarn("[Entitlements] Missing backend field 'courseCentralEnabled' for entitlement 'LEARN_PORTAL'. Defaulting to denied.");
        return false;
      }
      return subscriptionOk && ent.courseCentralEnabled === true;
    case ENTITLEMENT_KEYS.JOB_ALERTS:
      if (typeof ent.alertsEnabled === 'undefined') {
        devWarn("[Entitlements] Missing backend field 'alertsEnabled' for entitlement 'JOB_ALERTS'. Defaulting to denied.");
        return false;
      }
      return subscriptionOk && ent.alertsEnabled === true;
    case ENTITLEMENT_KEYS.RESUME_TEMPLATES_PREMIUM: {
      if (!subscriptionOk) return false;
      if (typeof ent.templateAccessLevel === 'undefined') {
        devWarn("[Entitlements] Missing backend field 'templateAccessLevel' for entitlement 'RESUME_TEMPLATES_PREMIUM'. Defaulting to denied.");
        return false;
      }
      const level = (ent.templateAccessLevel ?? '').toString().toUpperCase();
      return level === 'PREMIUM' || level === 'ALL';
    }
    case ENTITLEMENT_KEYS.RESUME_BUILDER: {
      if (!subscriptionOk) return false;
      const limit = ent.resumeLimit;
      if (typeof limit !== 'number') {
        devWarn("[Entitlements] Missing backend field 'resumeLimit' for entitlement 'RESUME_BUILDER'. Defaulting to denied.");
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
  switch (resolveEntitlementKey(key)) {
    case ENTITLEMENT_KEYS.JOB_TRACKING:
      return 'Upgrade to enable job tracking.';
    case ENTITLEMENT_KEYS.LEARN_PORTAL:
      return 'Upgrade to enable Course Central.';
    case ENTITLEMENT_KEYS.JOB_ALERTS:
      return 'Upgrade to enable alerts.';
    case ENTITLEMENT_KEYS.RESUME_TEMPLATES_PREMIUM:
      return 'Upgrade to access premium templates.';
    case ENTITLEMENT_KEYS.RESUME_BUILDER:
      return 'Resume limit reached. Upgrade to create more.';
    default:
      return 'Upgrade required.';
  }
}

import type { AccessMeDto } from 'src/app/models/access-me.model';

export type EntitlementKey =
  | 'jobTracking'
  | 'courseCentral'
  | 'alerts'
  | 'templatesPremium'
  | 'resumeCreate'
  | (string & {});

export function isEntitled(me: AccessMeDto | undefined | null, key: EntitlementKey): boolean {
  if (!me) return false;

  const status = (me.subscription?.status ?? '').toString().toUpperCase();
  const subscriptionOk = status === 'ACTIVE' || status === 'TRIALING' || status === '';

  const ent = me.entitlements ?? {};

  switch (key) {
    case 'jobTracking':
      return subscriptionOk && ent.jobTrackingEnabled === true;
    case 'courseCentral':
      return subscriptionOk && ent.courseCentralEnabled === true;
    case 'alerts':
      return subscriptionOk && ent.alertsEnabled === true;
    case 'templatesPremium': {
      if (!subscriptionOk) return false;
      const level = (ent.templateAccessLevel ?? '').toString().toUpperCase();
      return level === 'PREMIUM' || level === 'ALL';
    }
    case 'resumeCreate': {
      if (!subscriptionOk) return false;
      const limit = ent.resumeLimit;
      if (typeof limit !== 'number') return true;
      const used = me.counts?.resumeCount ?? 0;
      return used < limit;
    }
    default: {
      // Unknown entitlements: allow by default so UI doesn't break.
      return true;
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

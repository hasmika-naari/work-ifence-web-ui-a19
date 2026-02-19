export const SubscriptionStatus = {
  TRIALING: 'TRIALING',
  ACTIVE: 'ACTIVE',
  PAST_DUE: 'PAST_DUE',
  CANCELED: 'CANCELED',
  EXPIRED: 'EXPIRED',
  SUSPENDED: 'SUSPENDED',
} as const;

export const AllowedSubscriptionStatuses = new Set<string>(Object.values(SubscriptionStatus));

export const HAS_TRIAL_STATUS = !!SubscriptionStatus.TRIALING;

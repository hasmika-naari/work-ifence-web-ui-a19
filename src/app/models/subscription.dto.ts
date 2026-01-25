export interface WifenceSubscriptionDto {
  id?: string;

  // Who/what owns the subscription
  subscriberType?: string; // INDIVIDUAL | ENTERPRISE | etc.
  subscriberId?: string;

  // Plan identification
  planId?: string;
  planCode?: string;

  // Lifecycle
  status?: string; // ACTIVE | TRIALING | CANCELED | etc.
  currentPeriodEnd?: string;
  trialEndDate?: string;
  cancelAtPeriodEnd?: boolean;

  // Optional fields some backends include directly on subscription
  resumeLimit?: number;
  templateAccessLevel?: string | number;
  jobTrackingEnabled?: boolean;
  courseCentralEnabled?: boolean;
  alertsEnabled?: boolean;
  enterpriseUsersLimit?: number;
  storageLimitMb?: number;

  // Raw extension point for forward-compat
  featuresJson?: any;
  metadata?: any;
}

export interface SubscriptionPlanDto {
  id?: string;
  code?: string;
  scope?: string; // INDIVIDUAL | ENTERPRISE
  billingInterval?: string; // MONTHLY | YEARLY
  price?: number;
  currency?: string;
  isActive?: boolean;
  trialDays?: number;

  // Entitlements
  resumeLimit?: number;
  templateAccessLevel?: string | number;
  jobTrackingEnabled?: boolean;
  courseCentralEnabled?: boolean;
  alertsEnabled?: boolean;
  enterpriseUsersLimit?: number;
  storageLimitMb?: number;

  // Raw extension point for forward-compat
  featuresJson?: any;
}

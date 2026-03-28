export type SubscriptionScope = 'INDIVIDUAL' | 'ENTERPRISE';

export interface SubscriptionPlan {
  id?: string | number;
  code?: string;
  name?: string;
  scope?: SubscriptionScope | string;
  billingInterval?: string; // MONTHLY | YEARLY
  price?: number;
  currency?: string;
  isActive?: boolean;
  trialDays?: number;

  marketingTitle?: string;
  marketingSubtitle?: string;
  sortOrder?: number;

  resumeLimit?: number;
  templateAccessLevel?: string | number;
  jobTrackingEnabled?: boolean;
  courseCentralEnabled?: boolean;
  alertsEnabled?: boolean;
  enterpriseUsersLimit?: number;
  storageLimitMb?: number;

  featuresJson?: any;
}

export interface WifenceSubscription {
  id?: string;

  subscriberType?: string;
  subscriberId?: string;

  planId?: string;
  planCode?: string;

  status?: string;
  startDate?: string;
  currentPeriodEnd?: string;
  nextBillingDate?: string;
  trialEndDate?: string;
  cancelAtPeriodEnd?: boolean;
  autoRenew?: boolean;
  provider?: string;
}

export interface StartSubscriptionRequest {
  scope: SubscriptionScope;
  subscriberId?: string;
  planCode: string;
  startTrial?: boolean;
}

export interface CreateSubscriptionUpgradeRequest {
  requestedPlanId: string | number;
  requestReason?: string;
}

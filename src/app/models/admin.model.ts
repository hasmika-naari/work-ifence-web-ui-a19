export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  number: number;
  size: number;
}

export interface AdminOnboardingRequestRow {
  id?: string;
  enterpriseName?: string;
  enterpriseType?: string;
  requesterUserName?: string;
  contactEmail?: string;
  contactPhone?: string;
  status?: string;
  createdDate?: string;
}

export interface AdminSubscriptionRow {
  id?: string;
  subscriberType?: string;
  subscriberId?: string;
  /** Display name for the subscriber (mapped from subscriberDisplayName or enterpriseName) */
  subscriberDisplayName?: string;
  planId?: string;
  planCode?: string;
  status?: string;
  startDate?: string;
  trialStartDate?: string;
  trialEndDate?: string;
  /**
   * Normalised period-end date.
   * Populated from `currentPeriodEnd` when present, otherwise falls back to
   * `nextBillingDate` which is how /api/wifence-subscriptions exposes the value.
   */
  currentPeriodEnd?: string;
  /** Raw field from /api/wifence-subscriptions – kept alongside currentPeriodEnd */
  nextBillingDate?: string;
  provider?: string;
  autoRenew?: boolean;
  cancelAtPeriodEnd?: boolean;
  createdDate?: string;
  lastModifiedDate?: string;
  /** Subscription provider's own subscription identifier */
  providerSubscriptionId?: string;
}

export interface AdminSubscriptionUpgradeRequestRow {
  id?: string | number;
  requestCode?: string;
  userName?: string;
  userLogin?: string;
  userEmail?: string;
  userDisplay?: string;
  currentPlan?: string;
  currentPlanCode?: string;
  requestedPlan?: string;
  requestedPlanCode?: string;
  status?: string;
  requestedDate?: string;
  reviewedDate?: string;
  adminRemarks?: string;
}

/**
 * Admin-facing row returned by GET /api/admin/subscription-plan-requests
 * and GET /api/admin/subscription-plan-requests/{id}.
 */
export interface AdminSubscriptionPlanRequestRow {
  id?: string | number;
  requestCode?: string;
  userName?: string;
  userLogin?: string;
  userEmail?: string;
  userDisplay?: string;
  currentPlanCode?: string;
  requestedPlanCode?: string;
  /** TRIAL_REQUEST | UPGRADE_REQUEST */
  requestType?: string;
  /** PENDING | APPROVED | REJECTED | CANCELLED */
  status?: string;
  requestReason?: string;
  requestedDate?: string;
  reviewedDate?: string;
  reviewedBy?: string;
  adminRemarks?: string;
  trialStartDate?: string;
  trialEndDate?: string;
  trialDays?: number;
}

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

// ---------------------------------------------------------------------------
// Trial flow – delta models
// ---------------------------------------------------------------------------

/**
 * Eligibility check result for resume creation.
 *
 * Mirrors the shape of ResumeCreateEligibilityResponse (resume.service.ts) but
 * lives in the models layer so it can be referenced without importing a service.
 * The service-local type is intentionally left in place (no breaking change).
 */
export interface ResumeCreateEligibility {
  /** Whether the user is allowed to create a resume right now. */
  allowed?: boolean;
  /** Alias for allowed – some backends use this key. */
  eligible?: boolean;
  /** True when the action is explicitly blocked (limit exceeded, plan expired, etc.). */
  blocked?: boolean;
  /** Machine-readable denial code, e.g. LIMIT_EXCEEDED | SUBSCRIPTION_REQUIRED. */
  code?: string;
  /** Short human-readable denial reason. */
  reason?: string;
  /** Dialog/toast title when denied. */
  title?: string;
  /** Full denial message shown to the user. */
  message?: string;
  /** Pricing scope that satisfies the requirement (individual | enterprise). */
  scope?: string;
  /** Forward-compat – allow extra keys returned by the backend. */
  [key: string]: unknown;
}

/**
 * Flexible request body for plan-related actions:
 * starting a trial, requesting an upgrade, or switching plans.
 *
 * More loosely typed than StartSubscriptionRequest (which enforces required
 * fields at compile time) – use this for partial / draft scenarios.
 */
export interface SubscriptionPlanRequest {
  planId?: string | number;
  planCode?: string;
  scope?: SubscriptionScope;
  /** Set to true when the plan includes a trial and the user wants to start it. */
  startTrial?: boolean;
  /** Optional reason supplied by the user when requesting a trial or upgrade. */
  requestReason?: string;
  subscriberId?: string;
  /** Discriminator expected by the backend: 'TRIAL_REQUEST' | 'UPGRADE_REQUEST' */
  requestType?: string;
}

/**
 * Computed usage summary for the active plan.
 * Built on the frontend from AccessMeDto.entitlements + counts.
 */
export interface PlanUsageSummary {
  scope?: SubscriptionScope;
  planCode?: string;
  /** null means unlimited. */
  resumeLimit?: number | null;
  resumeUsed?: number;
  /** null means unlimited. */
  resumeRemaining?: number | null;
  /** 0–100 progress percentage; null when the plan has no resume limit. */
  progressPercent?: number | null;
}

/**
 * Computed summary of the current trial state.
 * Derived from AccessSubscriptionDto so no extra API call is needed.
 */
export interface TrialStatusSummary {
  /** True while subscription.status === 'TRIALING'. */
  isTrialing: boolean;
  /** True when subscription.status is anything other than ACTIVE or TRIALING. */
  isExpired: boolean;
  /** ISO-8601 date string of trial end; undefined when not on a trial. */
  trialEndDate?: string;
  /** Calendar days remaining in the trial (0 on the last day); null when not trialing. */
  daysRemaining?: number | null;
  /**
   * The base/assigned plan code that becomes effective after the trial expires.
   * Populated from subscription.planCode when status === 'TRIALING'.
   */
  assignedPlanCode?: string;
  /**
   * The plan code active during the trial.
   * Populated from subscription.planCode when status === 'TRIALING',
   * or from the last known trial plan code when status === 'EXPIRED'.
   */
  trialPlanCode?: string;
}

/**
 * User-facing row returned by GET /api/subscription-plan-requests/my
 * and POST /api/subscription-plan-requests.
 */
export interface SubscriptionPlanRequestRow {
  id?: string | number;
  requestCode?: string;
  planCode?: string;
  planName?: string;
  /** PENDING | APPROVED | REJECTED | CANCELLED */
  status?: string;
  requestReason?: string;
  requestedDate?: string;
  reviewedDate?: string;
  /** Identity of the admin who reviewed the request. */
  reviewedBy?: string;
  /** Set by the backend when the request is approved as a trial. */
  trialEndDate?: string;
  /** Optional note added by the admin when rejecting or acting on a request. */
  adminRemarks?: string;
}

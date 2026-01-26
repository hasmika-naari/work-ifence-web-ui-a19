export type PlanScope = 'INDIVIDUAL' | 'ENTERPRISE' | string;

export interface SubscriptionPlanDto {
  id?: string | number;

  code?: string;
  name?: string;
  scope?: PlanScope;

  billingInterval?: string; // MONTHLY/YEARLY/etc
  price?: number;
  currency?: string;
  isActive?: boolean;
  trialDays?: number;

  // Entitlement-like plan fields
  resumeLimit?: number;
  templateAccessLevel?: 'BASIC' | 'PREMIUM' | 'ALL' | string;
  jobTrackingEnabled?: boolean;
  courseCentralEnabled?: boolean;
  alertsEnabled?: boolean;
  enterpriseUsersLimit?: number;
  storageLimitMb?: number;

  marketingTitle?: string;
  marketingSubtitle?: string;
  sortOrder?: number;

  featuresJson?: string;

  createdDate?: string;
  lastModifiedDate?: string;
}

export interface PlanEntitlementDto {
  id?: string | number;
  planId?: string | number;

  serviceId?: string | number;
  serviceCode?: string;

  included?: boolean;
  isAddonAllowed?: boolean;
  defaultQuantity?: number;

  notes?: string;
  status?: string;
}

export interface WifenceServiceDto {
  id?: string | number;
  code?: string;
  name?: string;
  cost?: number;
  status?: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  number: number;
  size: number;
}

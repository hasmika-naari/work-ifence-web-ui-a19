export type AccessMode = 'PERSONAL' | 'ENTERPRISE_EMPLOYEE' | 'ENTERPRISE_ADMIN' | 'ADMIN';

export interface EntitlementsDto {
  resumeLimit?: number;
  templateAccessLevel?: 'BASIC' | 'PREMIUM' | 'ALL' | string;
  jobTrackingEnabled?: boolean;
  courseCentralEnabled?: boolean;
  alertsEnabled?: boolean;
  enterpriseUsersLimit?: number;
  storageLimitMb?: number;
  features?: Record<string, any>;
}

export interface AccessSubscriptionDto {
  planCode?: string;
  status?: string; // TRIALING/ACTIVE/EXPIRED/etc
  trialEndDate?: string;
  currentPeriodEnd?: string;
}

export interface AccessMeDto {
  mode?: AccessMode;
  userId?: string;
  userName?: string;
  enterpriseId?: string;
  enterpriseRole?: string;
  subscription?: AccessSubscriptionDto;
  entitlements?: EntitlementsDto;
  counts?: {
    resumeCount?: number;
    jobApplicationCount?: number;
    ongoingApplicationsCount?: number;
    offeredCount?: number;
    rejectedApplicationsCount?: number;
  };
}

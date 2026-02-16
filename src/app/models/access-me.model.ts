export type AccessMode =
  | 'PERSONAL'
  | 'ADMIN'
  | 'ENTERPRISE'
  | 'ENTERPRISE_EMPLOYEE'
  | 'ENTERPRISE_ADMIN'
  | (string & {});

export interface OwnedProfileDto {
  key: string;
  label: string;
  description?: string;
}

export interface AvailableProfileDto {
  key: string;
  label: string;
  homeRoute: string;
  mode?: AccessMode;
}

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
  email?: string;
  fullName?: string;
  enterpriseId?: string;
  enterpriseRole?: string;
  activeProfileKey?: string;
  ownedProfiles?: OwnedProfileDto[];
  availableProfiles?: AvailableProfileDto[];
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

export interface SwitchProfileResponseDto {
  activeProfileKey: string;
  ownedProfiles: OwnedProfileDto[];
}

// GET /api/access/profile/context returns the same shape as switchProfile()
export type AccessProfileContextDto = SwitchProfileResponseDto;

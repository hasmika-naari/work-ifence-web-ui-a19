export interface DashboardMeDto {
  resumeCount?: number;
  jobApplicationCount?: number;
  ongoingApplicationsCount?: number;
  offeredCount?: number;
  rejectedApplicationsCount?: number;
  notifications?: Array<{
    title?: string;
    message?: string;
    createdDate?: string;
    type?: string;
  }>;
  subscriptionSummary?: {
    planCode?: string;
    status?: string;
    currentPeriodEnd?: string;
  };
}

export interface MyEnterpriseDto {
  enterpriseId?: string;
  role?: string; // ENTERPRISE_ADMIN / ENTERPRISE_EMPLOYEE
  membershipStatus?: string;
}

export interface DashboardVm {
  mode: 'PERSONAL' | 'ENTERPRISE_EMPLOYEE' | 'ENTERPRISE_ADMIN';
  me?: DashboardMeDto;
  loading: boolean;
  error?: string;
}

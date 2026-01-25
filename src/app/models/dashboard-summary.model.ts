export interface PersonalDashboardSummary {
  resumeCount?: number;
  jobApplicationCount?: number;
  ongoingApplications?: number;
  offeredCount?: number;
  rejectedCount?: number;
  lastUpdated?: string;
}

export interface EnterpriseDashboardSummary {
  membersActive?: number;
  membersInvited?: number;
  jobApplicationsTotal?: number;
  openRolesCount?: number;
  serviceRequestsOpen?: number;
  lastUpdated?: string;
}

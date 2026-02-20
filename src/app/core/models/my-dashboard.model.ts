export interface MyDashboardDTO {
  welcome: { firstName?: string; lastName?: string; login: string };
  statsCards: DashboardStatCardDTO[];
  details?: MyDashboardDetailsDTO;
}

export interface DashboardStatCardDTO {
  key: 'profileCompletion'|'resumes'|'jobApps'|'plan'|'exports'|'activity'|string;
  title: string;
  value: string;
  subValue?: string;
  severity?: 'neutral'|'info'|'success'|'warning'|'danger';
  isLocked?: boolean;
  actionRoute?: string;
  tooltip?: string;
}

export interface MyDashboardDetailsDTO {
  subscription?: any;
  recent?: {
    resumes?: Array<{ id: any; title?: string; lastModifiedDate?: string }>;
    jobApps?: Array<{ id: any; company?: string; jobTitle?: string; stage?: string; lastModifiedDate?: string }>;
  };
  recommendations?: Array<{ key: string; title: string; actionRoute?: string; isLocked?: boolean; lockedReason?: string }>;
  alerts?: Array<{ severity: 'info'|'warning'|'danger'|'success'|'neutral'; message: string; actionRoute?: string }>;
}

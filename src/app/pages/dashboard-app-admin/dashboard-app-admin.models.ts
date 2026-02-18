export type DashboardRowEditTab = 'requests' | 'subscriptions' | 'plans' | 'featureFlags' | 'audit';

export interface WorkQueueRequestRow {
  enterprise: string;
  avatarSrc: string;
  requestType: string;
  requestedBy: string;
  status: string;
  age: string;
  priority: string;
  sla: string;
}

export interface SubscriptionRow {
  enterprise: string;
  subscriptionType: string;
  status: string;
  startDate: string;
  endDate: string;
}

export interface PlanRow {
  enterprise: string;
  planType: string;
  status: string;
  startDate: string;
  endDate: string;
}

export interface FeatureFlagRow {
  enterprise: string;
  flagName: string;
  status: string;
  enabled: string;
}

export interface AuditRow {
  enterprise: string;
  eventType: string;
  status: string;
  date: string;
}

export type DashboardEditableRow = WorkQueueRequestRow | SubscriptionRow | PlanRow | FeatureFlagRow | AuditRow;

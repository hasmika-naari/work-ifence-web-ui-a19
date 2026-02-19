export type DashboardRowEditTab = 'requests' | 'subscriptions' | 'plans' | 'users' | 'auditLogs' | 'entitlements' | 'featureFlags' | 'audit';

export interface WorkQueueRequestRow {
  id?: string;
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
  id?: string;
  seeded?: boolean;
  createdBy?: string;
  providerSubscriptionId?: string;
  subscriberType?: string;
  subscriberId?: string;
  subscriberDisplayName?: string;
  planId?: string;
  planCode?: string;
  planDisplayName?: string;
  enterprise: string;
  plan: string;
  status: string;
  startDate: string;
  nextBilling?: string;
  nextBillingDate?: string;
  trialEndDate?: string;
  cancelAtPeriodEnd?: boolean;
  autoRenew?: boolean;
  createdDate?: string;
  lastModifiedDate?: string;
}

export interface PlanRow {
  id?: string;
  planCode: string;
  name: string;
  price: string;
  cycle: string;
  active: string;
}

export interface UserRow {
  id?: string;
  login: string;
  name: string;
  email: string;
  activated: string;
  roles: string;
}

export interface AuditLogRow {
  id?: string;
  when: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
}

export interface AuditRow {
  enterprise: string;
  eventType: string;
  status: string;
  date: string;
}

export interface FeatureFlagRow {
  enterprise: string;
  flagName: string;
  status: string;
  enabled: string;
}

export interface EntitlementRow {
  plan: string;
  sectionKey: string;
  title: string;
  roleKey: string;
  sortOrder: string;
  active: string;
}

export type DashboardEditableRow =
  | WorkQueueRequestRow
  | SubscriptionRow
  | PlanRow
  | UserRow
  | AuditLogRow
  | EntitlementRow
  | AuditRow
  | FeatureFlagRow;

export interface AuditFeedItem {
  id?: string | number;
  userName?: string;
  description?: string;
  timestamp?: string;
  eventType?: string;
  actor?: string;
  message?: string;
  createdAt?: string;
  retryLabel?: string;
  avatarUrl?: string;
}

export interface AppAdminDashboardSummary {
  pendingOnboardingsTotal?: number;
  activeSubscriptions?: number;
  trialSubscriptions?: number;
  plansConfigured?: number;
  totalEnterprises?: number;
  auditEventsLast24h?: number;
  onboardingStatusBreakdown?: {
    submitted?: number;
    inReview?: number;
    approved?: number;
    rejected?: number;
  } | null;
  subscriptionStatusBreakdown?: {
    trials?: number;
    active?: number;
    padQue?: number;
    canceling?: number;
    canceled?: number;
  } | null;
  recentAuditFeed?: AuditFeedItem[] | null;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

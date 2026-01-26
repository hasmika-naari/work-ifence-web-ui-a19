export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  number: number;
  size: number;
}

export interface AdminOnboardingRequestRow {
  id?: string;
  enterpriseName?: string;
  enterpriseType?: string;
  requesterUserName?: string;
  contactEmail?: string;
  contactPhone?: string;
  status?: string;
  createdDate?: string;
}

export interface AdminSubscriptionRow {
  id?: string;
  subscriberType?: string;
  subscriberId?: string;
  planCode?: string;
  status?: string;
  trialEndDate?: string;
  currentPeriodEnd?: string;
  provider?: string;
  createdDate?: string;
}

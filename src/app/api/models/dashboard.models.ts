export interface NotificationDto {
  id?: number | string;
  title: string;
  message: string;
  type?: string;
  createdDate?: string;
}

export interface SubscriptionSummaryDto {
  planCode: string;
  status: string;
  currentPeriodEnd?: string;
}

export interface DashboardMeDto {
  resumeCount: number;
  jobApplicationCount: number;
  upcomingInterviewsCount: number;
  notifications: NotificationDto[];
  subscriptionSummary?: SubscriptionSummaryDto;

  // Allow BE to add fields without breaking the FE.
  [key: string]: unknown;
}

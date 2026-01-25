import { SubscriptionPlanDto } from './subscription.dto';

export type AccessMode = 'PERSONAL' | 'ENTERPRISE_EMPLOYEE' | 'ENTERPRISE_ADMIN' | 'ADMIN';

export interface AccessVm {
  mode: AccessMode;

  subscriptionStatus?: string;
  planCode?: string;
  plan?: SubscriptionPlanDto;

  canBuildResume: boolean;
  canManageResumes: boolean;
  canUseJobTracking: boolean;
  canAccessCourseCentral: boolean;
  canAccessMultipleTemplates: boolean;

  resumeLimit?: number;
  resumeLimitRemaining?: number;

  showUpgrade: boolean;
  reasons?: string[];
}

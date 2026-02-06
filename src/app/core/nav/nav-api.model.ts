export interface NavApiResponse {
  user: NavUserContext;
  sections: NavApiSection[];
}

export interface NavUserContext {
  login: string;
  userId: string;
  roleKey: string;
  roles: string[];
  planTier: string;
  planCode?: string;
  subscriptionStatus?: string;
}

export interface NavApiSection {
  id: string;
  title?: string;
  sortOrder?: number;
  items: NavApiItem[];
}

export interface NavApiItem {
  id: string;
  title: string;
  icon: string;
  route?: string;
  featureFlag?: string;
  entitlementKey?: string;
  allowed?: boolean;
  locked?: boolean;
  showWhenLocked?: boolean;
  minPlan?: string;
  sortOrder?: number;
  externalUrl?: string;
  tooltip?: string;
  badge?: { text: string; type?: string };
  queryParams?: Record<string, any>;
  children?: NavApiItem[];
}

// Navigation models for entitlement-aware, feature-flagged sidebar

export enum PlanTier {
  FREE = 'FREE',
  PRO = 'PRO',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE'
}

export interface NavBadge {
  text: string;
  type?: 'info' | 'success' | 'warning' | 'danger' | 'pro' | 'premium';
}

export interface NavItem {
  id: string;
  title: string;
  icon: string;
  route?: string;
  externalUrl?: string;
  children?: NavItem[];
  requiredRoles?: string[];
  featureFlag?: string;
  entitlementKey?: string;
  minPlan?: PlanTier;
  showWhenLocked?: boolean;
  visible?: boolean;
  enabled?: boolean;
  lockedReason?: string;
  badge?: NavBadge;
  tooltip?: string;
  order?: number;
  dividerBefore?: boolean;
  dividerAfter?: boolean;
  queryParams?: Record<string, any>;
}

export interface NavSection {
  id: string;
  title?: string;
  items: NavItem[];
  dividerBefore?: boolean;
  dividerAfter?: boolean;
}

export interface EntitlementMap {
  [key: string]: boolean;
}

export interface UserEntitlements {
  plan: PlanTier;
  entitlements: EntitlementMap;
  entitlementKeys: string[];
  roles: string[];
  /**
   * Frontend-only marker indicating entitlements were populated from a fallback path.
   * This is not part of the backend API contract.
   */
  isFallback?: boolean;
}

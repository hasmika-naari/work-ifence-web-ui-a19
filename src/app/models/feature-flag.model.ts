export type FeatureFlagKey =
  | 'RESUME_PORTAL'
  | 'RESUME_BUILDER'
  | 'JOB_TRACKING'
  | 'COURSE_CENTRAL'
  | 'ALERTS'
  | 'ENTERPRISE_CONSOLE'
  | 'ADMIN_CONSOLE'
  | 'SUBSCRIPTIONS'
  | 'NAV_PLACEHOLDER'
  | 'PAYMENTS'
  | 'NEWS_FEED'
  | 'USER_DASHBOARD'
  | 'user.dashboard'
  | 'job.alerts'
  | 'nav.placeholder';

export interface FeatureFlag {
  key: FeatureFlagKey;
  enabled: boolean;

  /** Optional 0..100. If set, flag is enabled only for a stable cohort. */
  rolloutPercent?: number;

  /** If true and remote config is unavailable => treat as disabled. */
  failClosed?: boolean;

  notes?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface RemoteConfig {
  version?: string;

  /** Cache TTL in seconds. Default 600 (10 min). */
  ttlSeconds?: number;

  flags: FeatureFlag[];
}

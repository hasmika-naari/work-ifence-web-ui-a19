import type { RemoteConfig } from 'src/app/models/feature-flag.model';

export const FEATURE_FLAG_DEFAULTS: RemoteConfig = {
  version: 'local-default',
  ttlSeconds: 600,
  flags: [
    { key: 'RESUME_PORTAL', enabled: true },
    { key: 'RESUME_BUILDER', enabled: true },
    { key: 'JOB_TRACKING', enabled: true },
    { key: 'COURSE_CENTRAL', enabled: true },
    { key: 'ALERTS', enabled: true },
    { key: 'ENTERPRISE_CONSOLE', enabled: true },
    { key: 'ADMIN_CONSOLE', enabled: true },
    { key: 'NEWS_FEED', enabled: true },

    // Sensitive: fail-closed recommended even in FE-only mode
    { key: 'PAYMENTS', enabled: true, failClosed: true },
  ],
};

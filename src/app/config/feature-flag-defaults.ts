import type { RemoteConfig } from 'src/app/models/feature-flag.model';
import { environment } from 'src/environments/environment';

const DEFAULT_ENABLED = !environment.production;

export const FEATURE_FLAG_DEFAULTS: RemoteConfig = {
  version: 'local-default',
  ttlSeconds: 600,
  flags: [
    { key: 'RESUME_PORTAL', enabled: DEFAULT_ENABLED },
    { key: 'RESUME_BUILDER', enabled: DEFAULT_ENABLED },
    { key: 'JOB_TRACKING', enabled: DEFAULT_ENABLED },
    { key: 'COURSE_CENTRAL', enabled: DEFAULT_ENABLED },
    { key: 'ALERTS', enabled: DEFAULT_ENABLED },
    { key: 'ENTERPRISE_CONSOLE', enabled: DEFAULT_ENABLED },
    { key: 'ADMIN_CONSOLE', enabled: DEFAULT_ENABLED },
    { key: 'SUBSCRIPTIONS', enabled: DEFAULT_ENABLED },
    { key: 'NEWS_FEED', enabled: DEFAULT_ENABLED },

    // Internal: never enable; used to hide placeholder nav entries.
    { key: 'NAV_PLACEHOLDER', enabled: false, failClosed: true },

    // Sensitive: fail-closed recommended even in FE-only mode
    { key: 'PAYMENTS', enabled: DEFAULT_ENABLED, failClosed: true },
  ],
};

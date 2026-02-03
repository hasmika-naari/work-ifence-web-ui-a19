export {};

declare global {
  interface Window {
    /**
     * DEV-ONLY E2E hook.
     * Playwright can set this at runtime via `page.addInitScript()`.
     * Must never be used in production builds.
     */
    __E2E__?: {
      auth?: {
        authenticated?: boolean;
        activated?: boolean;
      };
      /** Map of feature-flag key -> enabled state. */
      flags?: Record<string, boolean>;
      /**
       * Entitlement overrides.
       * Provide either a boolean map or an allow-list of entitlement keys.
       */
      entitlements?: {
        plan?: string;
        roles?: string[];
        allowList?: string[];
        map?: Record<string, boolean>;
      };
    };
  }
}

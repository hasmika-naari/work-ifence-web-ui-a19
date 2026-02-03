import type { Page } from '@playwright/test';

type E2EOverrides = {
  auth?: {
    authenticated?: boolean;
    activated?: boolean;
  };
  flags?: Record<string, boolean>;
  entitlements?: {
    roles?: string[];
    allowList?: string[];
    map?: Record<string, boolean>;
  };
};

/**
 * Installs the DEV-only window.__E2E__ hook before any app code runs.
 * Call this before page.goto().
 */
export async function installE2E(page: Page, overrides: E2EOverrides): Promise<void> {
  await page.addInitScript((o: E2EOverrides) => {
    // Must run before any app code.
    try {
      delete (window as any).__E2E__;
    } catch {
      // ignore
    }
    (window as any).__E2E__ = o;

    // Align with LocalStorageService (prefix: "wifence-") so accessGuard/AccessFacade can run.
    try {
      const prefix = 'wifence-';
      const authKey = `${prefix}authenticated`;
      const tokenKey = `${prefix}authToken`;

      // Always reset auth keys first.
      localStorage.removeItem(authKey);
      localStorage.removeItem(tokenKey);

      const authenticated = o?.auth?.authenticated;
      if (authenticated === true) {
        localStorage.setItem(authKey, JSON.stringify(true));
        // Any non-empty token shape works for LocalStorageService.isLoggedIn().
        localStorage.setItem(tokenKey, JSON.stringify('e2e-token'));
      }
    } catch {
      // ignore
    }
  }, overrides);
}

export function entitled(keys: string[]): E2EOverrides {
  return {
    entitlements: {
      allowList: keys,
    },
  };
}

export function flags(map: Record<string, boolean>): E2EOverrides {
  return { flags: map };
}

export function auth(state: { authenticated: boolean; activated?: boolean }): E2EOverrides {
  return { auth: state };
}

export function mergeOverrides(...parts: Array<E2EOverrides | undefined | null>): E2EOverrides {
  const merged: E2EOverrides = {};

  for (const p of parts) {
    if (!p) continue;
    merged.auth = { ...(merged.auth ?? {}), ...(p.auth ?? {}) };
    merged.flags = { ...(merged.flags ?? {}), ...(p.flags ?? {}) };

    merged.entitlements = {
      ...(merged.entitlements ?? {}),
      ...(p.entitlements ?? {}),
      map: { ...(merged.entitlements?.map ?? {}), ...(p.entitlements?.map ?? {}) },
      allowList: p.entitlements?.allowList ?? merged.entitlements?.allowList,
    };
  }

  return merged;
}

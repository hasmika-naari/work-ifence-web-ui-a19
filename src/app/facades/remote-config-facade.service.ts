import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FEATURE_FLAG_DEFAULTS } from 'src/app/config/feature-flag-defaults';
import type { FeatureFlag, FeatureFlagKey, RemoteConfig } from 'src/app/models/feature-flag.model';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { environment } from 'src/environments/environment';

const LS_OVERRIDE = 'wif_remote_config_override';
const LS_CACHE = 'wif_remote_config_cache';
const LS_ANON_ID = 'wif_anon_id';

type CacheEnvelope = {
  expiresAt: number;
  config: RemoteConfig;
};

@Injectable({ providedIn: 'root' })
export class RemoteConfigFacadeService {
  private readonly platformId: object;
  private readonly userStore = inject(UserStoreService);
  private readonly http = inject(HttpClient);

  private readonly effectiveConfig = signal<RemoteConfig>(FEATURE_FLAG_DEFAULTS);

  /** Map of key -> flag (effective config). */
  readonly flagsMap = computed(() => {
    const cfg = this.effectiveConfig();
    const map = new Map<FeatureFlagKey, FeatureFlag>();

    for (const f of cfg.flags ?? []) {
      map.set(f.key, f);
    }

    // Ensure defaults exist (non-bloating, but stable list for UI)
    for (const d of FEATURE_FLAG_DEFAULTS.flags) {
      if (!map.has(d.key)) map.set(d.key, d);
    }

    return map;
  });

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.platformId = platformId;
    this.loadInitial();
    this.installDevHooks();
  }

  getFlag(key: FeatureFlagKey): FeatureFlag | undefined {
    return this.flagsMap().get(key);
  }

  /**
   * Flag enabled check with stable rollout (per-user or per-anon) and failClosed behavior.
   */
  isFlagEnabled(key: FeatureFlagKey): boolean {
    const e2eOverride = this.getE2EFlagOverride(key);
    if (e2eOverride !== null) return e2eOverride;

    const flag = this.getFlag(key);
    if (!flag) {
      // Fail-closed in production: missing flags must NOT enable functionality.
      if (environment.production) return false;

      // Dev/preview: keep UI usable, but warn loudly.
      console.warn(`[RemoteConfig] Missing feature flag key '${String(key)}' in dev. Defaulting to enabled.`);
      return true;
    }

    if (flag.enabled !== true) return false;

    const rollout = flag.rolloutPercent;
    if (typeof rollout === 'number') {
      const pct = Math.max(0, Math.min(100, rollout));
      if (pct >= 100) return true;
      if (pct <= 0) return false;

      const cohortId = this.getCohortId();
      const bucket = this.hashToBucket(`${cohortId}:${key}`);
      return bucket < pct;
    }

    return true;
  }

  /**
   * Safe flag check for dynamic keys.
   * - Production: missing/unknown keys evaluate to false.
   * - Dev: missing/unknown keys may evaluate to true (DEV fallback) and will warn.
   */
  isFlagEnabledSafe(flagKey: string): boolean {
    const key = (flagKey ?? '').trim();
    if (!key) {
      console.warn('[RemoteConfig] Missing feature flag key (empty). Defaulting to disabled.');
      return false;
    }

    const e2eOverride = this.getE2EFlagOverride(key);
    if (e2eOverride !== null) return e2eOverride;

    const map = this.flagsMap();
    const flag = map.get(key as FeatureFlagKey);
    if (!flag) {
      if (environment.production) {
        console.warn(`[RemoteConfig] Missing feature flag key '${key}' in production. Defaulting to disabled.`);
        return false;
      }

      console.warn(
        `[RemoteConfig] Missing feature flag key '${key}' in dev. DEV fallback used (defaulting to enabled).`
      );
      return true;
    }

    // Inline the same evaluation logic as isFlagEnabled() to avoid double lookups.
    if (flag.enabled !== true) return false;

    const rollout = flag.rolloutPercent;
    if (typeof rollout === 'number') {
      const pct = Math.max(0, Math.min(100, rollout));
      if (pct >= 100) return true;
      if (pct <= 0) return false;

      const cohortId = this.getCohortId();
      const bucket = this.hashToBucket(`${cohortId}:${key}`);
      return bucket < pct;
    }

    return true;
  }

  /** FE-only admin mutation (writes override). */
  setFlag(
    key: FeatureFlagKey,
    enabled: boolean,
    rolloutPercent?: number,
    failClosed?: boolean,
    notes?: string
  ): void {
    const cfg = this.buildNextOverrideConfig({
      key,
      enabled,
      rolloutPercent,
      failClosed,
      notes,
    });

    this.writeOverride(cfg);
    this.writeCache(cfg);
    this.effectiveConfig.set(cfg);
  }

  resetToDefaults(): void {
    if (!this.isBrowser()) {
      this.effectiveConfig.set(FEATURE_FLAG_DEFAULTS);
      return;
    }

    try {
      localStorage.removeItem(LS_OVERRIDE);
      localStorage.removeItem(LS_CACHE);
    } catch {
      // ignore
    }

    this.effectiveConfig.set(FEATURE_FLAG_DEFAULTS);
  }

  exportConfigJson(): string {
    return JSON.stringify(this.effectiveConfig(), null, 2);
  }

  /** Returns error string or null. */
  importConfigJson(json: string): string | null {
    const parsed = this.tryParseConfig(json);
    if (typeof parsed === 'string') return parsed;

    this.writeOverride(parsed);
    this.writeCache(parsed);
    this.effectiveConfig.set(parsed);
    return null;
  }

  /**
   * TODO: backend integration stub. No network calls are used yet.
   * When BE is ready, wire this into loadInitial() with caching.
   */
  fetchRemoteConfigFromBackend(): Observable<RemoteConfig> {
    // TODO: implement backend remote config endpoint.
    // Intentionally no network calls yet.
    void this.http;
    return of(FEATURE_FLAG_DEFAULTS);
  }

  // -------------------------
  // Internal
  // -------------------------

  private loadInitial(): void {
    if (!this.isBrowser()) {
      this.effectiveConfig.set(FEATURE_FLAG_DEFAULTS);
      return;
    }

    const override = this.readOverride();
    if (override) {
      this.effectiveConfig.set(override);
      return;
    }

    const cached = this.readCache();
    if (cached) {
      this.effectiveConfig.set(cached);
      return;
    }

    this.effectiveConfig.set(FEATURE_FLAG_DEFAULTS);
  }

  private readOverride(): RemoteConfig | null {
    try {
      const raw = localStorage.getItem(LS_OVERRIDE);
      if (!raw) return null;
      const parsed = this.tryParseConfig(raw);
      return typeof parsed === 'string' ? null : parsed;
    } catch {
      return null;
    }
  }

  private readCache(): RemoteConfig | null {
    try {
      const raw = localStorage.getItem(LS_CACHE);
      if (!raw) return null;
      const env = JSON.parse(raw) as CacheEnvelope;
      if (!env?.expiresAt || !env?.config) return null;
      if (Date.now() >= Number(env.expiresAt)) return null;

      const parsed = this.tryParseConfig(JSON.stringify(env.config));
      return typeof parsed === 'string' ? null : parsed;
    } catch {
      return null;
    }
  }

  private writeOverride(cfg: RemoteConfig): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(LS_OVERRIDE, JSON.stringify(cfg));
    } catch {
      // ignore
    }
  }

  private writeCache(cfg: RemoteConfig): void {
    if (!this.isBrowser()) return;
    try {
      const ttlSeconds = Math.max(1, Number(cfg.ttlSeconds ?? FEATURE_FLAG_DEFAULTS.ttlSeconds ?? 600));
      const env: CacheEnvelope = {
        expiresAt: Date.now() + ttlSeconds * 1000,
        config: cfg,
      };
      localStorage.setItem(LS_CACHE, JSON.stringify(env));
    } catch {
      // ignore
    }
  }

  private buildNextOverrideConfig(patch: {
    key: FeatureFlagKey;
    enabled: boolean;
    rolloutPercent?: number;
    failClosed?: boolean;
    notes?: string;
  }): RemoteConfig {
    const current = this.effectiveConfig();
    const map = new Map<FeatureFlagKey, FeatureFlag>();

    for (const f of FEATURE_FLAG_DEFAULTS.flags) map.set(f.key, { ...f });
    for (const f of current.flags ?? []) map.set(f.key, { ...f });

    const updated: FeatureFlag = {
      ...(map.get(patch.key) ?? { key: patch.key, enabled: true }),
      key: patch.key,
      enabled: patch.enabled,
      rolloutPercent:
        typeof patch.rolloutPercent === 'number'
          ? Math.max(0, Math.min(100, patch.rolloutPercent))
          : patch.rolloutPercent === undefined
            ? map.get(patch.key)?.rolloutPercent
            : undefined,
      failClosed: patch.failClosed ?? map.get(patch.key)?.failClosed,
      notes: patch.notes ?? map.get(patch.key)?.notes,
      updatedAt: new Date().toISOString(),
    };

    map.set(patch.key, updated);

    return {
      version: 'local-override',
      ttlSeconds: current.ttlSeconds ?? FEATURE_FLAG_DEFAULTS.ttlSeconds ?? 600,
      flags: Array.from(map.values()),
    };
  }

  private tryParseConfig(raw: string): RemoteConfig | string {
    let obj: any;
    try {
      obj = JSON.parse(raw);
    } catch (e: any) {
      return e?.message ?? 'Invalid JSON';
    }

    if (!obj || typeof obj !== 'object') return 'Invalid config object';
    if (!Array.isArray(obj.flags)) return 'Config.flags must be an array';

    const flags: FeatureFlag[] = [];
    const knownKeys = new Set<FeatureFlagKey>(FEATURE_FLAG_DEFAULTS.flags.map((f) => f.key));

    for (const f of obj.flags) {
      if (!f || typeof f !== 'object') return 'Each flag must be an object';
      const key = f.key as FeatureFlagKey;
      if (!knownKeys.has(key)) return `Unknown flag key: ${String(f.key)}`;
      if (typeof f.enabled !== 'boolean') return `Flag ${String(key)}.enabled must be boolean`;

      const rolloutPercent =
        f.rolloutPercent === undefined
          ? undefined
          : typeof f.rolloutPercent === 'number'
            ? Math.max(0, Math.min(100, f.rolloutPercent))
            : NaN;
      if (Number.isNaN(rolloutPercent as any)) return `Flag ${String(key)}.rolloutPercent must be number`;

      const failClosed = f.failClosed === undefined ? undefined : Boolean(f.failClosed);

      flags.push({
        key,
        enabled: f.enabled,
        rolloutPercent,
        failClosed,
        notes: typeof f.notes === 'string' ? f.notes : undefined,
        updatedAt: typeof f.updatedAt === 'string' ? f.updatedAt : undefined,
        updatedBy: typeof f.updatedBy === 'string' ? f.updatedBy : undefined,
      });
    }

    const ttlSeconds =
      obj.ttlSeconds === undefined
        ? FEATURE_FLAG_DEFAULTS.ttlSeconds
        : typeof obj.ttlSeconds === 'number'
          ? Math.max(1, obj.ttlSeconds)
          : NaN;
    if (Number.isNaN(ttlSeconds as any)) return 'ttlSeconds must be a number';

    const mergedMap = new Map<FeatureFlagKey, FeatureFlag>();
    for (const d of FEATURE_FLAG_DEFAULTS.flags) mergedMap.set(d.key, { ...d });
    for (const f of flags) mergedMap.set(f.key, f);

    return {
      version: typeof obj.version === 'string' ? obj.version : 'imported',
      ttlSeconds,
      flags: Array.from(mergedMap.values()),
    };
  }

  private getCohortId(): string {
    const profile = this.userStore.getUserBioProfile();
    const userId = profile()?.userId;
    if (userId) return String(userId);

    if (!this.isBrowser()) return 'server';

    try {
      const existing = localStorage.getItem(LS_ANON_ID);
      if (existing) return existing;

      const created = this.newAnonId();
      localStorage.setItem(LS_ANON_ID, created);
      return created;
    } catch {
      return 'anon';
    }
  }

  private newAnonId(): string {
    try {
      const c: any = (globalThis as any).crypto;
      if (c?.randomUUID) return c.randomUUID();
    } catch {
      // ignore
    }

    // Fallback: not cryptographically strong, but stable enough for cohort bucketing.
    return `anon_${Math.random().toString(16).slice(2)}_${Date.now()}`;
  }

  private hashToBucket(input: string): number {
    // FNV-1a 32-bit
    let hash = 0x811c9dc5;
    for (let i = 0; i < input.length; i++) {
      hash ^= input.charCodeAt(i);
      hash = (hash * 0x01000193) >>> 0;
    }
    return hash % 100;
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * DEV-only E2E hook: allow Playwright to override flag evaluation without BE.
   * If present, missing keys default to false (fail-closed) to keep tests explicit.
   */
  private getE2EFlagOverride(flagKey: string): boolean | null {
    if (environment.production) return null;
    if (!this.isBrowser()) return null;
    if (typeof window === 'undefined') return null;

    const overrides = (window as any).__E2E__?.flags as Record<string, boolean> | undefined;
    if (!overrides) return null;

    if (Object.prototype.hasOwnProperty.call(overrides, flagKey)) {
      return overrides[flagKey] === true;
    }

    return false;
  }

  private installDevHooks(): void {
    if (!this.isBrowser()) return;
    if (environment.production) return;
    if (typeof window === 'undefined') return;

    const w: any = window as any;
    w.__wifFlags = {
      export: () => this.exportConfigJson(),
      import: (json: string) => this.importConfigJson(json),
      reset: () => this.resetToDefaults(),
      enable: (key: FeatureFlagKey) => this.setFlag(key, true),
      disable: (key: FeatureFlagKey) => this.setFlag(key, false),
    };
  }
}

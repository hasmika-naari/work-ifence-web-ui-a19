#!/usr/bin/env node
/*
  Interactive helper for adding a new feature-gated page.
  - No runtime deps (Node built-ins only)
  - Outputs:
    - checklist entry (paste into docs/feature-gating-checklist.md)
    - suggested nav snippet
    - suggested route snippet
    - reminder to run npm run audit:nav:ci
*/

import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function usage() {
  return [
    'Generate feature-gated page snippets:',
    '  node tools/new-feature-gated-page.mjs',
    '',
    'Prompts for:',
    '  - feature name (e.g., "Resume Export")',
    '  - route path (e.g., /user/resume-export)',
    '  - entitlement key (ENTITLEMENT_KEYS member like RESUME_EXPORT, or canonical raw key like RESUME_EXPORT)',
    '  - feature flag key (optional) (FEATURE_FLAGS member like RESUME_PORTAL, or raw key like RESUME_PORTAL/ALERTS)',
    '  - min plan (optional) (FREE|PRO|PREMIUM|ENTERPRISE)',
    '',
    'Outputs ready-to-paste snippets and a reminder to run: npm run audit:nav:ci',
  ].join('\n');
}

function die(msg) {
  // eslint-disable-next-line no-console
  console.error(`[new-feature-gated-page] ${msg}`);
  process.exitCode = 1;
}

function readText(relPath) {
  return readFileSync(path.join(repoRoot, relPath), 'utf8');
}

function parseConstObjectMap(tsText) {
  // Very small parser for:
  //   export const X = { KEY: 'value', ... } as const;
  // Extracts KEY -> value.
  const map = new Map();
  const re = /^\s*([A-Z0-9_]+)\s*:\s*'([^']+)'\s*,?\s*$/gm;
  let m;
  while ((m = re.exec(tsText))) {
    map.set(m[1], m[2]);
  }
  return map;
}

function invertMapFirstKeyByValue(map) {
  /** @type {Map<string,string>} */
  const inv = new Map();
  for (const [k, v] of map.entries()) {
    if (!inv.has(v)) inv.set(v, k);
  }
  return inv;
}

function slugifyId(input) {
  const s = String(input ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return s || 'new-feature';
}

function normalizeRoutePath(input) {
  const raw = String(input ?? '').trim();
  if (!raw) return '';
  // Ensure leading slash.
  const withSlash = raw.startsWith('/') ? raw : `/${raw}`;
  // Collapse multiple slashes.
  return withSlash.replace(/\/+/g, '/');
}

function routeChildPathFromAbsolute(routePath) {
  // For app.routes.ts, /user is a parent route. Children should use paths relative to it.
  // Example: /user/resume-export -> resume-export
  const p = normalizeRoutePath(routePath);
  if (p.startsWith('/user/')) return p.slice('/user/'.length);
  if (p === '/user') return '';
  // If user passed something else, return without leading slash.
  return p.replace(/^\//, '');
}

function formatEntitlementRef(entInput, entitlementMap, entitlementInv) {
  const raw = String(entInput ?? '').trim();
  if (!raw) return { ref: null, note: 'Entitlement is required.' };

  // If they provided a constant member name.
  if (entitlementMap.has(raw)) {
    return { ref: `ENTITLEMENT_KEYS.${raw}`, note: null };
  }

  // If they provided a raw key value.
  const byValue = entitlementInv.get(raw);
  if (byValue) {
    return { ref: `ENTITLEMENT_KEYS.${byValue}`, note: null };
  }

  // Unknown: suggest adding to ENTITLEMENT_KEYS.
  return {
    ref: 'ENTITLEMENT_KEYS.<ADD_ME>',
    note: `Unknown entitlement key '${raw}'. Add it to src/app/entitlements/entitlement-keys.ts (and use that constant).`,
  };
}

function formatFlagRef(flagInput, flagMap, flagInv) {
  const raw = String(flagInput ?? '').trim();
  if (!raw) return { ref: null, note: null };

  if (flagMap.has(raw)) {
    return { ref: `FEATURE_FLAGS.${raw}`, note: null };
  }

  const byValue = flagInv.get(raw);
  if (byValue) {
    return { ref: `FEATURE_FLAGS.${byValue}`, note: null };
  }

  return {
    ref: 'FEATURE_FLAGS.<ADD_ME>',
    note: `Unknown feature flag key '${raw}'. Add it to src/app/config/feature-flags.ts (and ensure FeatureFlagKey supports it if used in routes).`,
  };
}

function formatMinPlan(planInput) {
  const raw = String(planInput ?? '').trim();
  if (!raw) return { ref: null, note: null };

  const v = raw.toUpperCase();
  const ok = ['FREE', 'PRO', 'PREMIUM', 'ENTERPRISE'];
  if (!ok.includes(v)) {
    return { ref: null, note: `Invalid min plan '${raw}'. Use one of: ${ok.join(', ')}` };
  }

  return { ref: `PlanTier.${v}`, note: null };
}

function block(title, body) {
  return `\n---\n\n## ${title}\n\n${body}\n`;
}

async function main() {
  const args = new Set(process.argv.slice(2));
  if (args.has('--help') || args.has('-h')) {
    // eslint-disable-next-line no-console
    console.log(usage());
    return;
  }

  // Load known constants (no TS runtime import).
  const featureFlags = parseConstObjectMap(readText('src/app/config/feature-flags.ts'));
  const featureFlagsInv = invertMapFirstKeyByValue(featureFlags);

  const entitlementKeys = parseConstObjectMap(readText('src/app/entitlements/entitlement-keys.ts'));
  const entitlementKeysInv = invertMapFirstKeyByValue(entitlementKeys);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const ask = async (label, { required = false } = {}) => {
    while (true) {
      const v = (await rl.question(`${label}: `)).trim();
      if (v) return v;
      if (!required) return '';
      // eslint-disable-next-line no-console
      console.log('  (required)');
    }
  };

  try {
    const featureName = await ask('Feature name (e.g., "Resume Export")', { required: true });
    const routePath = normalizeRoutePath(await ask('Route path (e.g., /user/resume-export)', { required: true }));
    const entitlementInput = await ask(
      'Entitlement key (ENTITLEMENT_KEYS member like RESUME_EXPORT, or canonical raw like RESUME_EXPORT)',
      { required: true }
    );
    const flagInput = await ask(
      'Feature flag key (optional) (FEATURE_FLAGS member like RESUME_PORTAL, or raw like RESUME_PORTAL/ALERTS)'
    );
    const minPlanInput = await ask('Min plan (optional) (FREE|PRO|PREMIUM|ENTERPRISE)');

    const entitlement = formatEntitlementRef(entitlementInput, entitlementKeys, entitlementKeysInv);
    const flag = formatFlagRef(flagInput, featureFlags, featureFlagsInv);

    const minPlan = formatMinPlan(minPlanInput);
    if (minPlan.note) {
      // keep going but warn; min plan is optional.
      // eslint-disable-next-line no-console
      console.log(`Warning: ${minPlan.note}`);
    }

    const featureId = slugifyId(featureName);
    const childPath = routeChildPathFromAbsolute(routePath);

    const warnings = [entitlement.note, flag.note].filter(Boolean);

    const checklist = [
      `### ${featureName} (${routePath})`,
      '',
      '- [ ] Route added under the /user parent (path: `' + childPath + '`)',
      '- [ ] Route uses `entitlementRouteGuard` and declares `data.entitlementKey`',
      flag.ref ? '- [ ] Route declares `data.requireFlag` (' + flag.ref + ')' : '- [ ] No feature flag gating required',
      minPlan.ref ? '- [ ] Route declares `data.minPlan` (' + minPlan.ref + ')' : '- [ ] No min plan gating required',
      '- [ ] Nav item added using constants (no raw strings)',
      '- [ ] Run `npm run audit:nav:ci`',
    ].join('\n');

    const navSnippetLines = [
      '{',
      `  id: '${featureId}',`,
      `  title: '${featureName}',`,
      "  icon: '<pick-icon>',",
      `  route: '${routePath}',`,
      ...(flag.ref ? [`  featureFlag: ${flag.ref},`] : []),
      `  entitlementKey: ${entitlement.ref ?? 'ENTITLEMENT_KEYS.<ADD_ME>'},`,
      ...(minPlan.ref ? [`  minPlan: ${minPlan.ref},`] : []),
      '}',
    ];

    const navSnippet = [
      '```ts',
      '// Paste into src/app/nav/nav-config.service.ts (inside the appropriate role/section)',
      ...navSnippetLines,
      '```',
    ].join('\n');

    const routeDataParts = [
      `breadcrumb: '${featureName}'`,
      `entitlementKey: ${entitlement.ref ?? 'ENTITLEMENT_KEYS.<ADD_ME>'}`,
    ];
    if (flag.ref) routeDataParts.push(`requireFlag: ${flag.ref}`);
    if (minPlan.ref) routeDataParts.push(`minPlan: ${minPlan.ref}`);

    const routeSnippet = [
      '```ts',
      '// Paste under the /user route children in src/app/app.routes.ts',
      '{',
      `  path: '${childPath}',`,
      '  canActivate: [entitlementRouteGuard, accessGuard],',
      '  loadComponent: () =>',
      "    import('<path-to-component>').then(m => m.<ComponentName>),",
      `  data: { ${routeDataParts.join(', ')} },`,
      '}',
      '```',
    ].join('\n');

    const reminder = [
      'Reminder:',
      '',
      '- Run: `npm run audit:nav:ci`',
    ].join('\n');

    // eslint-disable-next-line no-console
    console.log('');
    // eslint-disable-next-line no-console
    console.log('========================================');
    // eslint-disable-next-line no-console
    console.log('Feature-gated page output');
    // eslint-disable-next-line no-console
    console.log('========================================');

    if (warnings.length) {
      // eslint-disable-next-line no-console
      console.log('\nWarnings:');
      for (const w of warnings) {
        // eslint-disable-next-line no-console
        console.log(`- ${w}`);
      }
    }

    // eslint-disable-next-line no-console
    console.log(block('Checklist Entry', checklist));
    // eslint-disable-next-line no-console
    console.log(block('Suggested Nav Snippet', navSnippet));
    // eslint-disable-next-line no-console
    console.log(block('Suggested Route Snippet', routeSnippet));
    // eslint-disable-next-line no-console
    console.log(block('Audit Reminder', reminder));
  } finally {
    rl.close();
  }
}

main().catch((e) => {
  die(e?.stack ?? String(e));
});

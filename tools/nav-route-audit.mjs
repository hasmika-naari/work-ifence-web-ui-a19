import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const repoRoot = process.cwd();
const argv = new Set(process.argv.slice(2));
const isCi = argv.has('--ci');

function readText(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), 'utf8');
}

function parseTs(relPath) {
  const text = readText(relPath);
  return ts.createSourceFile(relPath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
}

function unwrapConstInitializer(expr) {
  let e = expr;
  while (e && (ts.isAsExpression(e) || ts.isSatisfiesExpression?.(e) || ts.isParenthesizedExpression(e))) {
    e = e.expression;
  }
  return e;
}

function findConstObjectMap(sourceFile, constName) {
  /** @type {Record<string, string>} */
  const map = {};

  function visit(node) {
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.name.text === constName && decl.initializer) {
          const init = unwrapConstInitializer(decl.initializer);
          if (!init || !ts.isObjectLiteralExpression(init)) continue;

          for (const prop of init.properties) {
            if (!ts.isPropertyAssignment(prop)) continue;
            const name = ts.isIdentifier(prop.name)
              ? prop.name.text
              : ts.isStringLiteralLike(prop.name)
                ? prop.name.text
                : null;
            if (!name) continue;

            if (ts.isStringLiteralLike(prop.initializer)) {
              map[name] = prop.initializer.text;
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return map;
}

function unwrapParen(expr) {
  let e = expr;
  while (e && ts.isParenthesizedExpression(e)) e = e.expression;
  return e;
}

function resolveKey(expr, maps) {
  const e = unwrapParen(expr);
  if (!e) return undefined;

  if (ts.isStringLiteralLike(e)) return e.text;

  if (ts.isPropertyAccessExpression(e)) {
    const base = e.expression.getText();
    const propName = e.name.getText();
    if (base === 'FEATURE_FLAGS') return maps.featureFlags[propName] ?? propName;
    if (base === 'ENTITLEMENT_KEYS') return maps.entitlements[propName] ?? propName;
    if (base === 'PlanTier') return `PlanTier.${propName}`;
    return e.getText();
  }

  if (ts.isIdentifier(e)) return e.getText();

  return e.getText();
}

function getObjectProp(obj, propName) {
  for (const prop of obj.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const name = ts.isIdentifier(prop.name)
      ? prop.name.text
      : ts.isStringLiteralLike(prop.name)
        ? prop.name.text
        : null;
    if (name === propName) return prop.initializer;
  }
  return undefined;
}

function collectNavItemsFromArray(arrayExpr, role, maps) {
  /** @type {Array<any>} */
  const items = [];

  function parseItems(itemsExpr, ctx) {
    if (!itemsExpr || !ts.isArrayLiteralExpression(itemsExpr)) return;

    for (const el of itemsExpr.elements) {
      const e = unwrapParen(el);
      if (!e || !ts.isObjectLiteralExpression(e)) continue;

      const id = resolveKey(getObjectProp(e, 'id'), maps);
      const title = resolveKey(getObjectProp(e, 'title'), maps);
      const route = resolveKey(getObjectProp(e, 'route'), maps);

      const featureFlag = resolveKey(getObjectProp(e, 'featureFlag'), maps);
      const entitlementKey = resolveKey(getObjectProp(e, 'entitlementKey'), maps);
      const minPlan = resolveKey(getObjectProp(e, 'minPlan'), maps);
      const showWhenLocked = resolveKey(getObjectProp(e, 'showWhenLocked'), maps);

      const childItemsExpr = getObjectProp(e, 'items');

      const isGroup = !!childItemsExpr && ts.isArrayLiteralExpression(childItemsExpr) && !route;

      items.push({
        role,
        sectionId: ctx.sectionId,
        sectionTitle: ctx.sectionTitle,
        parentId: ctx.parentId,
        parentTitle: ctx.parentTitle,
        id,
        title,
        route,
        featureFlag,
        entitlementKey,
        minPlan,
        showWhenLocked,
        isGroup,
      });

      if (childItemsExpr && ts.isArrayLiteralExpression(childItemsExpr)) {
        parseItems(childItemsExpr, {
          ...ctx,
          parentId: id ?? ctx.parentId,
          parentTitle: title ?? ctx.parentTitle,
        });
      }
    }
  }

  for (const sectionEl of arrayExpr.elements) {
    const sec = unwrapParen(sectionEl);
    if (!sec || !ts.isObjectLiteralExpression(sec)) continue;

    const sectionId = resolveKey(getObjectProp(sec, 'id'), maps);
    const sectionTitle = resolveKey(getObjectProp(sec, 'title'), maps);
    const sectionItemsExpr = getObjectProp(sec, 'items');

    parseItems(sectionItemsExpr, {
      sectionId,
      sectionTitle,
      parentId: undefined,
      parentTitle: undefined,
    });
  }

  return items;
}

function extractNav(maps) {
  const sourceFile = parseTs('src/app/nav/nav-config.service.ts');

  let adminMenuArray;
  let userMenuArray;

  function visit(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
      if (node.name.text === 'adminMenu') adminMenuArray = node.initializer;
      if (node.name.text === 'userMenu') userMenuArray = node.initializer;
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  if (!adminMenuArray) throw new Error('Failed to find adminMenu array in nav-config.service.ts');
  if (!userMenuArray) throw new Error('Failed to find userMenu array in nav-config.service.ts');

  const adminItems = collectNavItemsFromArray(adminMenuArray, 'admin', maps);
  const userItems = collectNavItemsFromArray(userMenuArray, 'user', maps);

  return [...adminItems, ...userItems];
}

function nodeArrayToTextArray(expr) {
  const out = [];
  if (!expr || !ts.isArrayLiteralExpression(expr)) return out;

  for (const el of expr.elements) {
    const e = unwrapParen(el);
    if (ts.isIdentifier(e)) out.push(e.text);
    else out.push(e.getText());
  }

  return out;
}

function flattenRoutes(maps) {
  /** @type {Record<string, any>} */
  const routeMap = {};

  function visitRouteArray(arrayExpr, parentSegments, inheritedGuards) {
    for (const el of arrayExpr.elements) {
      const e = unwrapParen(el);
      if (!e || !ts.isObjectLiteralExpression(e)) continue;

      const pathExpr = getObjectProp(e, 'path');
      const pathSeg = resolveKey(pathExpr, maps) ?? '';
      const segs = pathSeg && pathSeg !== '' ? [...parentSegments, pathSeg] : [...parentSegments];
      const absPath = '/' + segs.filter(Boolean).join('/');

      const canActivate = nodeArrayToTextArray(getObjectProp(e, 'canActivate'));
      const canActivateChild = nodeArrayToTextArray(getObjectProp(e, 'canActivateChild'));
      const effectiveGuards = [...new Set([...inheritedGuards, ...canActivate, ...canActivateChild])];

      const dataExpr = getObjectProp(e, 'data');
      let requireFlag;
      let entitlementKey;
      let minPlan;
      if (dataExpr && ts.isObjectLiteralExpression(dataExpr)) {
        requireFlag = resolveKey(getObjectProp(dataExpr, 'requireFlag'), maps);
        entitlementKey = resolveKey(getObjectProp(dataExpr, 'entitlementKey'), maps);
        minPlan = resolveKey(getObjectProp(dataExpr, 'minPlan'), maps);
      }

      const redirectTo = getObjectProp(e, 'redirectTo');
      const hasComponentOrLoader = !!(getObjectProp(e, 'component') || getObjectProp(e, 'loadComponent') || getObjectProp(e, 'loadChildren'));

      if (!redirectTo && hasComponentOrLoader) {
        routeMap[absPath] = {
          absPath,
          requireFlag,
          entitlementKey,
          minPlan,
          guards: effectiveGuards,
        };
      }

      const childrenExpr = getObjectProp(e, 'children');
      if (childrenExpr && ts.isArrayLiteralExpression(childrenExpr)) {
        visitRouteArray(childrenExpr, segs, effectiveGuards);
      }
    }
  }

  const appRoutesFile = parseTs('src/app/app.routes.ts');

  let routesArray;
  function findRoutesConst(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'routes' && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
      routesArray = node.initializer;
    }
    ts.forEachChild(node, findRoutesConst);
  }
  findRoutesConst(appRoutesFile);

  if (!routesArray) throw new Error('Failed to find export const routes: Routes = [...] in app.routes.ts');

  visitRouteArray(routesArray, [], []);
  return routeMap;
}

function normalizePath(p) {
  if (!p) return undefined;
  // Keep query/hash out
  const q = p.split('?')[0].split('#')[0];
  if (q === '') return '/';
  if (q.startsWith('/')) return q;
  return '/' + q;
}

function audit() {
  const featureFlags = findConstObjectMap(parseTs('src/app/config/feature-flags.ts'), 'FEATURE_FLAGS');
  const entitlements = findConstObjectMap(parseTs('src/app/entitlements/entitlement-keys.ts'), 'ENTITLEMENT_KEYS');
  const maps = { featureFlags, entitlements };

  const navItems = extractNav(maps)
    // We care about clickable items for bypass/dead links; keep groups in output but mark route missing.
    .map((i) => ({ ...i, route: normalizePath(i.route) }));

  const routeMap = flattenRoutes(maps);

  const entitlementGuardRoutesMissingKey = Object.values(routeMap)
    .filter((r) => (r.guards ?? []).some((g) => g.includes('entitlementRouteGuard')))
    .filter((r) => !r.entitlementKey)
    .map((r) => ({ absPath: r.absPath, guards: (r.guards ?? []).join(', ') }));

  const rows = navItems
    .filter((i) => i.route || i.isGroup)
    .map((i) => {
      const routeInfo = i.route ? routeMap[i.route] : undefined;
      const navFlag = i.featureFlag;
      const navEnt = i.entitlementKey;
      const navPlan = i.minPlan;

      const isHiddenPlaceholder = navFlag === 'NAV_PLACEHOLDER';

      const exists = !!routeInfo;
      const routeFlag = routeInfo?.requireFlag;
      const routeEnt = routeInfo?.entitlementKey;
      const routePlan = routeInfo?.minPlan;
      const guards = routeInfo?.guards ?? [];

      // Strict equivalence (for items that are not placeholder-hidden)
      const flagMatches = (navFlag ?? undefined) === (routeFlag ?? undefined);
      const entMatches = (navEnt ?? undefined) === (routeEnt ?? undefined);
      const planMatches = (navPlan ?? undefined) === (routePlan ?? undefined);

      const routeHasAccessGuard = guards.some((g) => g.includes('accessGuard'));
      const routeHasEntGuard = guards.some((g) => g.includes('entitlementRouteGuard'));

      const shouldHaveAccessGuard = !!navFlag && navFlag !== 'NAV_PLACEHOLDER';
      const shouldHaveEntGuard = !!navEnt || !!navPlan;

      const accessGuardOk = !shouldHaveAccessGuard || routeHasAccessGuard;
      const entGuardOk = !shouldHaveEntGuard || routeHasEntGuard;

      let status;
      let notes = [];

      if (i.isGroup && !i.route) {
        status = 'GROUP';
      } else if (isHiddenPlaceholder) {
        status = exists ? 'HIDDEN (route exists)' : 'HIDDEN (no route)';
        if (exists) notes.push('Nav hidden via NAV_PLACEHOLDER; route still present');
        else notes.push('Nav hidden via NAV_PLACEHOLDER; prevents dead link');
      } else if (!exists) {
        status = 'FAIL (no route)';
      } else if (!flagMatches || !entMatches || !planMatches || !accessGuardOk || !entGuardOk) {
        status = 'FAIL (mismatch)';
        if (!flagMatches) notes.push(`Flag mismatch nav=${navFlag ?? ''} route=${routeFlag ?? ''}`);
        if (!entMatches) notes.push(`Entitlement mismatch nav=${navEnt ?? ''} route=${routeEnt ?? ''}`);
        if (!planMatches) notes.push(`MinPlan mismatch nav=${navPlan ?? ''} route=${routePlan ?? ''}`);
        if (!accessGuardOk) notes.push('Missing accessGuard on route');
        if (!entGuardOk) notes.push('Missing entitlementRouteGuard on route');
      } else {
        status = 'PASS';
      }

      return {
        role: i.role,
        section: i.sectionTitle,
        parent: i.parentTitle,
        title: i.title,
        route: i.route,
        navFlag,
        navEnt,
        navPlan,
        routeFlag,
        routeEnt,
        routePlan,
        routeGuards: guards.join(', '),
        exists,
        status,
        notes: notes.join('; '),
      };
    });

  const summary = {
    total: rows.length,
    pass: rows.filter((r) => r.status === 'PASS').length,
    fail: rows.filter((r) => r.status.startsWith('FAIL')).length,
    hidden: rows.filter((r) => r.status.startsWith('HIDDEN')).length,
    group: rows.filter((r) => r.status === 'GROUP').length,
  };

  return { summary, rows, entitlementGuardRoutesMissingKey };
}

function toMarkdownTable(rows) {
  const cols = [
    'role',
    'section',
    'parent',
    'title',
    'route',
    'navFlag',
    'navEnt',
    'routeFlag',
    'routeEnt',
    'status',
    'notes',
  ];

  const header = `| ${cols.join(' | ')} |`;
  const sep = `| ${cols.map(() => '---').join(' | ')} |`;

  const lines = rows.map((r) => {
    const esc = (v) => String(v ?? '').replaceAll('|', '\\|');
    return `| ${cols.map((c) => esc(r[c])).join(' | ')} |`;
  });

  return [header, sep, ...lines].join('\n');
}

const { summary, rows, entitlementGuardRoutesMissingKey } = audit();

fs.mkdirSync(path.join(repoRoot, 'audit'), { recursive: true });

fs.writeFileSync(
  path.join(repoRoot, 'audit/nav-route-audit.json'),
  JSON.stringify({ summary, rows, entitlementGuardRoutesMissingKey }, null, 2),
);
fs.writeFileSync(
  path.join(repoRoot, 'audit/nav-route-audit.md'),
  `# Nav/Route Gating Audit\n\nSummary: ${JSON.stringify(summary)}\n\n${toMarkdownTable(rows)}\n`,
);

const failed = rows.filter((r) => r.status.startsWith('FAIL'));

const visibleDeadLinks = rows.filter((r) => r.status === 'FAIL (no route)');

if (isCi) {
  const ciErrors = [];
  if (failed.length) ciErrors.push(`FAIL rows: ${failed.length}`);
  if (visibleDeadLinks.length) ciErrors.push(`Visible dead links: ${visibleDeadLinks.length}`);
  if (entitlementGuardRoutesMissingKey.length) {
    ciErrors.push(`entitlementRouteGuard missing data.entitlementKey: ${entitlementGuardRoutesMissingKey.length}`);
  }

  if (ciErrors.length) {
    console.error(`Audit CI FAIL: ${ciErrors.join(' | ')}. See audit/nav-route-audit.md/json`);
    if (entitlementGuardRoutesMissingKey.length) {
      console.error('Routes missing entitlementKey (guarded by entitlementRouteGuard):');
      for (const r of entitlementGuardRoutesMissingKey) console.error(`- ${r.absPath}`);
    }
    process.exitCode = 1;
  } else {
    console.log(`Audit CI PASS: ${summary.pass} PASS, ${summary.hidden} hidden, ${summary.group} groups.`);
  }
} else if (failed.length) {
  console.error(`Audit FAIL: ${failed.length} items failing. See audit/nav-route-audit.md`);
  process.exitCode = 2;
} else {
  console.log(`Audit PASS: ${summary.pass} PASS, ${summary.hidden} hidden, ${summary.group} groups. See audit/nav-route-audit.md`);
}

export function normalizeEntitlementKey(value: unknown): string {
  const text = String(value ?? '').trim();
  if (!text) {
    return '';
  }

  return text.replace(/\./g, '_').toUpperCase();
}

export function normalizeEntitlementMap(
  source: Record<string, boolean> | null | undefined,
): Record<string, boolean> {
  if (!source) {
    return {};
  }

  const normalized: Record<string, boolean> = {};
  for (const [key, value] of Object.entries(source)) {
    const normalizedKey = normalizeEntitlementKey(key);
    if (!normalizedKey || value !== true) {
      continue;
    }

    normalized[normalizedKey] = true;
  }

  return normalized;
}

export function hasEntitlementKey(
  source: Record<string, boolean> | null | undefined,
  key: unknown,
): boolean {
  const normalizedKey = normalizeEntitlementKey(key);
  if (!normalizedKey) {
    return false;
  }

  return normalizeEntitlementMap(source)[normalizedKey] === true;
}

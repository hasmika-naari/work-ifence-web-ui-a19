export type ResumeTemplateIdentityInput = {
  id?: string | number | null;
  templateKey?: string | null;
  componentKey?: string | null;
  template_name?: string | null;
  imageUrl?: string | null;
  imgPath?: string | null;
};

const LEGACY_TEMPLATE_KEYS = new Set([
  'TEMPLATE_DEFAULT',
  'TEMPLATE_1',
  'TEMPLATE_2',
  'TEMPLATE_3',
  'TEMPLATE_4',
  'TEMPLATE_5',
  'TEMPLATE_6',
  'TEMPLATE_7',
  'TEMPLATE_8',
  'TEMPLATE_9',
  'TEMPLATE_10',
]);

const LEGACY_TEMPLATE_BY_KEY: Record<string, string> = {
  classic_ats: 'TEMPLATE_1',
  resume_classic_ats: 'TEMPLATE_1',
  modern_professional: 'TEMPLATE_2',
  resume_modern_pro: 'TEMPLATE_2',
  minimal_clean: 'TEMPLATE_3',
  resume_minimal_clean: 'TEMPLATE_3',
  executive_serif: 'TEMPLATE_4',
  resume_executive_serif: 'TEMPLATE_4',
  tech_modern: 'TEMPLATE_5',
  resume_tech_modern: 'TEMPLATE_5',
  student_simple: 'TEMPLATE_6',
  resume_student_simple: 'TEMPLATE_6',
};

const LEGACY_TEMPLATE_BY_PREVIEW: Array<{ pattern: RegExp; legacyKey: string }> = [
  { pattern: /(?:^|[\\/])rt1\.png(?:$|\?)/i, legacyKey: 'TEMPLATE_1' },
  { pattern: /(?:^|[\\/])rt2\.png(?:$|\?)/i, legacyKey: 'TEMPLATE_2' },
  { pattern: /(?:^|[\\/])rt3\.png(?:$|\?)/i, legacyKey: 'TEMPLATE_3' },
  { pattern: /(?:^|[\\/])rt4\.png(?:$|\?)/i, legacyKey: 'TEMPLATE_4' },
  { pattern: /(?:^|[\\/])rt5\.png(?:$|\?)/i, legacyKey: 'TEMPLATE_5' },
  { pattern: /(?:^|[\\/])rt6\.png(?:$|\?)/i, legacyKey: 'TEMPLATE_6' },
  { pattern: /(?:^|[\\/])rt7\.png(?:$|\?)/i, legacyKey: 'TEMPLATE_7' },
  { pattern: /(?:^|[\\/])template9\.jpg(?:$|\?)/i, legacyKey: 'TEMPLATE_9' },
  { pattern: /(?:^|[\\/])template10\.jpg(?:$|\?)/i, legacyKey: 'TEMPLATE_10' },
];

function hasText(value?: string | null): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeKey(value?: string | null): string {
  return hasText(value) ? value.trim().toLowerCase() : '';
}

function resolveLegacyFromKey(value?: string | null): string | null {
  if (!hasText(value)) {
    return null;
  }

  const trimmed = value.trim();
  const upper = trimmed.toUpperCase();
  if (LEGACY_TEMPLATE_KEYS.has(upper)) {
    return upper;
  }

  const normalized = normalizeKey(trimmed);
  if (normalized in LEGACY_TEMPLATE_BY_KEY) {
    return LEGACY_TEMPLATE_BY_KEY[normalized];
  }

  const templateNumberMatch = normalized.match(/^template_(\d+)$/);
  if (templateNumberMatch) {
    const legacyKey = `TEMPLATE_${templateNumberMatch[1]}`;
    return LEGACY_TEMPLATE_KEYS.has(legacyKey) ? legacyKey : null;
  }

  return null;
}

function resolveLegacyFromPreview(imageUrl?: string | null): string | null {
  if (!hasText(imageUrl)) {
    return null;
  }

  for (const entry of LEGACY_TEMPLATE_BY_PREVIEW) {
    if (entry.pattern.test(imageUrl)) {
      return entry.legacyKey;
    }
  }

  return null;
}

export function isLegacyTemplateKey(value?: string | null): boolean {
  return !!resolveLegacyFromKey(value);
}

export function resolveLegacyTemplateName(input: ResumeTemplateIdentityInput): string {
  const directMatch =
    resolveLegacyFromKey(input.template_name) ||
    resolveLegacyFromKey(input.templateKey) ||
    resolveLegacyFromKey(input.componentKey);

  if (directMatch) {
    return directMatch;
  }

  const previewMatch = resolveLegacyFromPreview(input.imageUrl) || resolveLegacyFromPreview(input.imgPath);
  if (previewMatch) {
    return previewMatch;
  }

  const numericId = Number(input.id ?? 0);
  if (Number.isFinite(numericId) && numericId > 0) {
    const legacyKey = `TEMPLATE_${numericId}`;
    if (LEGACY_TEMPLATE_KEYS.has(legacyKey)) {
      return legacyKey;
    }
  }

  return 'TEMPLATE_1';
}

export function resolveCanonicalTemplateKey(input: ResumeTemplateIdentityInput): string {
  const candidates = [input.templateKey, input.componentKey, input.template_name];

  for (const candidate of candidates) {
    if (hasText(candidate) && !isLegacyTemplateKey(candidate)) {
      return candidate.trim();
    }
  }

  return resolveLegacyTemplateName(input);
}

export function buildResumeTemplateIdentity(input: ResumeTemplateIdentityInput): {
  templateKey: string;
  componentKey: string;
  template_name: string;
} {
  const template_name = resolveLegacyTemplateName(input);
  const templateKey = resolveCanonicalTemplateKey({ ...input, template_name });
  const componentKey = hasText(input.componentKey) ? input.componentKey.trim() : templateKey;

  return {
    templateKey,
    componentKey,
    template_name,
  };
}
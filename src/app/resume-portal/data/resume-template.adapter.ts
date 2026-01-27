import { ResumeTemplateDto } from './resume-template.dto';
import { ResumeTemplateUi } from './resume-template.ui.model';

const FALLBACK_IMAGE_BY_ID: Record<number, string> = {
  1: 'assets/img/templates/rt1.png',
  2: 'assets/img/templates/rt2.png',
  3: 'assets/img/templates/rt3.png',
  4: 'assets/img/templates/rt4.png',
  5: 'assets/img/templates/rt5.png',
  6: 'assets/img/templates/rt6.png',
  7: 'assets/img/templates/rt7.png',
  9: 'assets/img/templates/template9.jpg',
  10: 'assets/img/templates/template10.jpg',
};

const coalesceString = (...values: Array<string | null | undefined>): string | undefined => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
};

const normalizeTags = (tags: unknown): string[] => {
  if (Array.isArray(tags)) {
    return tags.map(tag => String(tag).trim()).filter(Boolean);
  }
  if (typeof tags === 'string') {
    return tags.split(',').map(tag => tag.trim()).filter(Boolean);
  }
  return [];
};

const normalizeAccessLevel = (value: unknown): string => {
  const level = (value ?? '').toString().trim().toUpperCase();
  return level || 'FREE';
};

const normalizeStatus = (value: unknown): string | undefined => {
  const status = (value ?? '').toString().trim().toUpperCase();
  return status || undefined;
};

const toNumericId = (value: unknown): number | null => {
  const id = Number(value);
  return Number.isFinite(id) && id > 0 ? id : null;
};

export function adaptResumeTemplate(dto: ResumeTemplateDto): ResumeTemplateUi {
  const numericId = toNumericId(dto.id);
  const templateKey = coalesceString(
    dto.templateKey,
    dto.componentKey,
    dto.template_name,
    numericId ? `TEMPLATE_${numericId}` : undefined
  );
  const componentKey = coalesceString(dto.componentKey, templateKey);
  const id = coalesceString(dto.id?.toString(), templateKey) ?? '';
  const title =
    coalesceString(
      dto.title,
      dto.name,
      templateKey ? templateKey.replace('TEMPLATE_', 'Template ') : undefined,
      numericId ? `Template ${numericId}` : undefined
    ) ?? 'Template';
  const imageUrl =
    coalesceString(
      dto.templateDocUrl ?? undefined,
      dto.imageUrl ?? undefined,
      numericId ? FALLBACK_IMAGE_BY_ID[numericId] : undefined
    ) ?? '';

  return {
    id,
    title,
    imageUrl,
    category: dto.category ?? undefined,
    style: dto.style ?? undefined,
    tags: normalizeTags(dto.tags),
    status: normalizeStatus(dto.status),
    templateKey: templateKey ?? undefined,
    componentKey: componentKey ?? undefined,
    version: dto.version ?? undefined,
    accessLevel: normalizeAccessLevel(dto.accessLevel),
    sortOrder: Number.isFinite(Number(dto.sortOrder)) ? Number(dto.sortOrder) : undefined,
    isDefault: !!dto.isDefault,
    configJson: dto.configJson ?? undefined,
  };
}

export function adaptResumeTemplates(list: ResumeTemplateDto[]): ResumeTemplateUi[] {
  return list.map(adaptResumeTemplate);
}

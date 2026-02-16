import { HttpParams } from '@angular/common/http';

export type CriteriaPrimitive = string | number | boolean;
export type CriteriaValue = CriteriaPrimitive | readonly CriteriaPrimitive[];

/**
 * Builds JHipster Criteria query params.
 *
 * Conventions:
 * - boolean/enum/string/number => <field>.equals=<value>
 * - list/array => <field>.in=a,b,c
 *
 * Skips null/undefined and empty lists.
 */
export function buildCriteriaParams(
  filters: Record<string, CriteriaValue | null | undefined>,
  base: HttpParams = new HttpParams()
): HttpParams {
  let params = base;

  for (const [field, raw] of Object.entries(filters ?? {})) {
    if (!field) continue;
    if (raw === undefined || raw === null) continue;

    if (Array.isArray(raw)) {
      const values = raw
        .filter((v) => v !== undefined && v !== null)
        .map((v) => String(v))
        .filter((v) => v.length > 0);

      if (values.length === 0) continue;
      params = params.set(`${field}.in`, values.join(','));
      continue;
    }

    params = params.set(`${field}.equals`, String(raw));
  }

  return params;
}

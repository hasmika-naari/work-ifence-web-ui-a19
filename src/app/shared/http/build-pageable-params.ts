import { HttpParams } from '@angular/common/http';

export type SortDirection = 'asc' | 'desc';
export type SortParam =
  | string // e.g. 'timestamp,desc'
  | {
      property: string;
      direction?: SortDirection;
    };

export type FilterValue = string | number | boolean;
export type FilterValueOrArray = FilterValue | readonly FilterValue[];

export interface BuildPageableParamsArgs {
  page?: number | null;
  size?: number | null;
  sort?: SortParam | readonly SortParam[] | null;
  filters?: Record<string, FilterValueOrArray | null | undefined> | null;
}

/**
 * Builds Spring-Data-style pageable params.
 *
 * Examples:
 * - page=0&size=20
 * - sort=timestamp,desc&sort=id,asc
 * - status=PENDING&isActive=true
 */
export function buildPageableParams({
  page,
  size,
  sort,
  filters,
}: BuildPageableParamsArgs): HttpParams {
  let params = new HttpParams();

  if (page !== undefined && page !== null) {
    params = params.set('page', String(page));
  }

  if (size !== undefined && size !== null) {
    params = params.set('size', String(size));
  }

  const sorts: readonly SortParam[] =
    sort === undefined || sort === null ? [] : Array.isArray(sort) ? sort : [sort];

  for (const entry of sorts) {
    if (entry === undefined || entry === null) continue;

    const value =
      typeof entry === 'string'
        ? entry
        : `${entry.property},${entry.direction ?? 'asc'}`;

    if (!value) continue;
    params = params.append('sort', value);
  }

  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || value === null) continue;

      if (Array.isArray(value)) {
        for (const v of value) {
          if (v === undefined || v === null) continue;
          params = params.append(key, String(v));
        }
        continue;
      }

      params = params.set(key, String(value));
    }
  }

  return params;
}

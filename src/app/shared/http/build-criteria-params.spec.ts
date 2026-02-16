import { HttpParams } from '@angular/common/http';
import { buildCriteriaParams } from './build-criteria-params';

describe('buildCriteriaParams', () => {
  it('builds .equals params for booleans/enums', () => {
    const params = buildCriteriaParams({
      isActive: true,
      scope: 'INDIVIDUAL',
    });

    expect(params.toString()).toBe('isActive.equals=true&scope.equals=INDIVIDUAL');
  });

  it('builds .in params for lists', () => {
    const params = buildCriteriaParams({
      id: [1, 2, 3] as const,
    });

    expect(params.toString()).toBe('id.in=1,2,3');
  });

  it('skips null/undefined and empty arrays', () => {
    const base = new HttpParams().set('page', '0');
    const params = buildCriteriaParams(
      {
        isActive: undefined,
        scope: null,
        code: [],
      },
      base
    );

    expect(params.toString()).toBe('page=0');
  });
});

import { isPublicRoute, PUBLIC_ROUTE_PREFIXES, PUBLIC_ROUTE_EXACT } from './public-routes';

describe('isPublicRoute', () => {
  it('matches exact public routes', () => {
    for (const route of PUBLIC_ROUTE_EXACT) {
      expect(isPublicRoute(route)).toBe(true);
      expect(isPublicRoute(route + '?foo=bar')).toBe(true);
      expect(isPublicRoute(route + '#section')).toBe(true);
    }
  });

  it('matches public route prefixes', () => {
    for (const prefix of PUBLIC_ROUTE_PREFIXES) {
      expect(isPublicRoute(prefix)).toBe(true);
      expect(isPublicRoute(prefix + '/something')).toBe(true);
      expect(isPublicRoute(prefix + '/other?x=1')).toBe(true);
    }
  });

  it('returns false for non-public routes', () => {
    expect(isPublicRoute('/user/dashboard')).toBe(false);
    expect(isPublicRoute('/central/job-central')).toBe(false);
    expect(isPublicRoute('/resume-marketplace')).toBe(false);
    expect(isPublicRoute('/random')).toBe(false);
  });

  it('handles empty and malformed input', () => {
    expect(isPublicRoute('')).toBe(false);
    expect(isPublicRoute(undefined as any)).toBe(false);
    expect(isPublicRoute(null as any)).toBe(false);
  });
});

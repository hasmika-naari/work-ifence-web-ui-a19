export const PUBLIC_ROUTE_PREFIXES = [
  '/auth',
  '/authentication',
  '/sign-in',
  '/public'
];

export const PUBLIC_ROUTE_EXACT = [
  '/',
  '/pricing'
];

export function isPublicRoute(url: string): boolean {
  if (!url) return false;
  const normalized = url.split('?')[0].split('#')[0];
  if (PUBLIC_ROUTE_EXACT.includes(normalized)) return true;
  return PUBLIC_ROUTE_PREFIXES.some(prefix => normalized.startsWith(prefix));
}

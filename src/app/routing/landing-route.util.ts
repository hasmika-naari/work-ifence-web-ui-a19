export function getLandingRoute(activeRoleKey: string): string {
  const normalized = (activeRoleKey ?? '').toString().trim().toUpperCase();
  return normalized === 'ROLE_ADMIN' ? '/user/dashboard-admin' : '/user/dashboard';
}
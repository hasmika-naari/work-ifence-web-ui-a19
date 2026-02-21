import { NavbarResponseDTO } from './navbar.model';

export interface MenuDiagnosticsSnapshot {
  user: NavbarResponseDTO['user'] | null;
  sectionsCount: number;
  itemsCount: number;
  lockedCount: number;
  allowedCount: number;
  lockedItems: Array<{
    itemKey: string;
    title: string;
    lockReason: string;
  }>;
  lastRefreshTime: string;
}

export function shouldShowMenuDiagnostics(production: boolean, debugMenuFlag: string | null): boolean {
  if (!production) {
    return true;
  }

  return (debugMenuFlag ?? '').toString().trim().toLowerCase() === 'true';
}

export function buildMenuDiagnosticsSnapshot(
  navbar: NavbarResponseDTO | null,
  lastRefreshTime: string,
): MenuDiagnosticsSnapshot {
  const sections = navbar?.sections ?? [];
  const items = sections.flatMap((section) => section.items ?? []);
  const lockedItems = items.filter((item) => item.locked === true);

  return {
    user: navbar?.user ?? null,
    sectionsCount: sections.length,
    itemsCount: items.length,
    lockedCount: lockedItems.length,
    allowedCount: items.filter((item) => item.allowed !== false).length,
    lockedItems: lockedItems.map((item) => ({
      itemKey: item.itemKey,
      title: item.title,
      lockReason: (item.lockReason ?? '').toString().trim() || 'N/A',
    })),
    lastRefreshTime,
  };
}

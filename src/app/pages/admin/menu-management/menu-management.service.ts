import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export type RoleKey = 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_APP_ADMIN';

export interface MenuSection {
  title: string;
  sectionKey: string;
  sortOrder: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  sectionKey: string;
  title: string;
  roleKey: RoleKey;
  sortOrder: number;
  isActive: boolean;
  lastUpdated: string;
  route: string;
  icon: string;
}

export interface MenuItemCreateInput {
  sectionKey: string;
  title: string;
  roleKey: RoleKey;
  sortOrder: number;
  isActive: boolean;
  route?: string;
  icon?: string;
}

@Injectable({ providedIn: 'root' })
export class MenuManagementService {
  private sections: MenuSection[] = [
    { title: 'Dashboard', sectionKey: 'dashboard', sortOrder: 1, isActive: true },
    { title: 'Admin', sectionKey: 'admin', sortOrder: 2, isActive: true },
    { title: 'Learning', sectionKey: 'learning', sortOrder: 3, isActive: false },
  ];

  private items: MenuItem[] = [
    { id: 'm1', sectionKey: 'dashboard', title: 'Home Dashboard', roleKey: 'ROLE_USER', sortOrder: 1, isActive: true, lastUpdated: '2026-02-18', route: '/user/dashboard', icon: 'dashboard' },
    { id: 'm2', sectionKey: 'admin', title: 'Feature Flags', roleKey: 'ROLE_ADMIN', sortOrder: 1, isActive: true, lastUpdated: '2026-02-19', route: '/user/admin/feature-flags', icon: 'flag' },
    { id: 'm3', sectionKey: 'admin', title: 'Plans & Entitlements', roleKey: 'ROLE_APP_ADMIN', sortOrder: 2, isActive: true, lastUpdated: '2026-02-17', route: '/user/admin/plans', icon: 'sell' },
    { id: 'm4', sectionKey: 'learning', title: 'Course Central', roleKey: 'ROLE_USER', sortOrder: 1, isActive: false, lastUpdated: '2026-02-12', route: '/course-central', icon: 'school' },
  ];

  getSections(): Observable<MenuSection[]> {
    // TODO: replace with GET /api/admin/menu/sections
    return of(this.cloneSections(this.sections));
  }

  getItems(sectionKey?: string): Observable<MenuItem[]> {
    // TODO: replace with GET /api/admin/menu/items?sectionKey={sectionKey}
    const scoped = sectionKey ? this.items.filter((item) => item.sectionKey === sectionKey) : this.items;
    return of(this.cloneItems(scoped));
  }

  createSection(section: MenuSection): Observable<MenuSection> {
    // TODO: replace with POST /api/admin/menu/sections
    this.sections = [...this.sections, { ...section }];
    return of({ ...section });
  }

  updateSection(section: MenuSection, originalSectionKey?: string): Observable<MenuSection> {
    // TODO: replace with PUT /api/admin/menu/sections/{sectionKey}
    const lookupKey = originalSectionKey ?? section.sectionKey;

    this.sections = this.sections.map((row) =>
      row.sectionKey === lookupKey ? { ...section } : row
    );

    if (lookupKey !== section.sectionKey) {
      this.items = this.items.map((item) =>
        item.sectionKey === lookupKey ? { ...item, sectionKey: section.sectionKey } : item
      );
    }

    return of({ ...section });
  }

  deleteSection(sectionKey: string): Observable<void> {
    // TODO: replace with DELETE /api/admin/menu/sections/{sectionKey}
    this.sections = this.sections.filter((row) => row.sectionKey !== sectionKey);
    this.items = this.items.filter((item) => item.sectionKey !== sectionKey);
    return of(void 0);
  }

  createItem(item: MenuItemCreateInput): Observable<MenuItem> {
    // TODO: replace with POST /api/admin/menu/items
    const created: MenuItem = {
      ...item,
      route: item.route ?? '/',
      icon: item.icon ?? 'menu',
      id: `m${Date.now()}`,
      lastUpdated: this.todayIso(),
    };

    this.items = [...this.items, created];
    return of({ ...created });
  }

  updateItem(item: MenuItem): Observable<MenuItem> {
    // TODO: replace with PUT /api/admin/menu/items/{id}
    const updated: MenuItem = {
      ...item,
      lastUpdated: this.todayIso(),
    };

    this.items = this.items.map((row) => (row.id === item.id ? updated : row));
    return of({ ...updated });
  }

  deleteItem(itemId: string): Observable<void> {
    // TODO: replace with DELETE /api/admin/menu/items/{id}
    this.items = this.items.filter((row) => row.id !== itemId);
    return of(void 0);
  }

  private cloneSections(rows: MenuSection[]): MenuSection[] {
    return rows.map((row) => ({ ...row }));
  }

  private cloneItems(rows: MenuItem[]): MenuItem[] {
    return rows.map((row) => ({ ...row }));
  }

  private todayIso(): string {
    return new Date().toISOString().slice(0, 10);
  }
}

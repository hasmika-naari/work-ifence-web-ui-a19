import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  constructor(private http: HttpClient) {}

  // EXT endpoints
  getNavbarMy(): Observable<any> {
    return this.http.get('/api/ext/navbar/my');
  }

  getMenuMaster(): Observable<any> {
    return this.http.get('/api/ext/admin/menu/master');
  }

  createMenuMaster(payload: any): Observable<any> {
    return this.http.post('/api/ext/admin/menu/master', payload);
  }

  updateMenuMaster(itemKey: string, payload: any): Observable<any> {
    return this.http.put(`/api/ext/admin/menu/master/${itemKey}`, payload);
  }

  getEnterpriseMenuConfig(enterpriseId: string): Observable<any> {
    return this.http.get(`/api/ext/enterprises/${enterpriseId}/menu-config`);
  }

  updateEnterpriseMenuConfig(enterpriseId: string, payload: any): Observable<any> {
    return this.http.put(`/api/ext/enterprises/${enterpriseId}/menu-config`, payload);
  }

  // ...existing code...

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

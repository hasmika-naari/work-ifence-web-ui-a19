import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MasterMenuResponseDTO {
  sections: MasterMenuSectionDTO[];
  items: MasterMenuItemDTO[];
}

export interface MasterMenuSectionDTO {
  id: number;
  roleKey: string;
  sectionKey: string;
  title: string;
  sortOrder: number;
  isActive: boolean;
}

export interface MasterMenuItemDTO {
  itemKey: string;
  id: number; // Updated to use id instead of sectionId
  title: string;
  icon?: string;
  route: string;
  entitlementKey?: string | null;
  featureFlag?: string | null;
  featureFlagKey?: string | null;
  showWhenLocked?: boolean | null;
  minPlan?: string | null;
  sortOrder?: number | null;
  isActiveByRole: Record<string, boolean>;
}

export interface MasterMenuUpsertDTO {
  itemKey?: string;
  id: number; // Updated to use id instead of sectionId
  title: string;
  icon?: string;
  route: string;
  entitlementKey?: string | null;
  featureFlag?: string | null;
  featureFlagKey?: string | null;
  showWhenLocked?: boolean;
  minPlan?: string | null;
  sortOrder?: number;
  roleActiveMap: Record<string, boolean>;
  reason?: string;
}

export interface TenantMenuConfigDTO {
  itemKey: string;
  isVisible: boolean;
  isLocked: boolean;
}

export interface TenantMenuConfigBulkUpdateDTO {
  items: TenantMenuConfigDTO[];
  reason?: string;
}

@Injectable({ providedIn: 'root' })
export class MenuManagementApiService {
  constructor(private http: HttpClient) {}

  getMasterMenu(): Observable<MasterMenuResponseDTO> {
    return this.http.get<MasterMenuResponseDTO>('/api/ext/admin/menu/master');
  }

  createMasterItem(dto: MasterMenuUpsertDTO): Observable<MasterMenuItemDTO> {
    return this.http.post<MasterMenuItemDTO>('/api/ext/admin/menu/master', dto);
  }

  updateMasterItem(itemKey: string, dto: MasterMenuUpsertDTO): Observable<MasterMenuItemDTO> {
    return this.http.put<MasterMenuItemDTO>(`/api/ext/admin/menu/master/${itemKey}`, dto);
  }

  getEnterpriseMenuConfig(enterpriseId: string): Observable<TenantMenuConfigDTO[]> {
    return this.http.get<TenantMenuConfigDTO[]>(`/api/ext/enterprises/${enterpriseId}/menu-config`);
  }

  updateEnterpriseMenuConfig(enterpriseId: string, dto: TenantMenuConfigBulkUpdateDTO): Observable<TenantMenuConfigDTO[]> {
    return this.http.put<TenantMenuConfigDTO[]>(`/api/ext/enterprises/${enterpriseId}/menu-config`, dto);
  }
}

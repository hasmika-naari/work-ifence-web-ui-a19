
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


export interface MasterMenuSectionDTO {
// removed stray curly brace
  id: string;
  key?: string;
  title: string;
}

export interface DropdownOption {
  value: string;
  label: string;
}
export interface MasterMenuItemDTO {
  id?: string;
  roleKey?: string;
  isActive?: boolean;
  itemKey: string;
  title: string;
  route: string;
  icon: string;
  sectionId: string;
  sortOrder: number;
  entitlementKey: string;
  featureFlag: boolean;
  featureFlagKey: string;
  showWhenLocked: boolean;
  minPlan: string;
  roleActiveMap: Record<string, boolean>;
}
export interface MasterMenuResponseDTO {
  items: MasterMenuItemDTO[];
  sections: MasterMenuSectionDTO[];
}
export interface MasterMenuUpsertDTO {
  itemKey: string;
  title: string;
  route: string;
  icon: string;
  sectionId: string;
  sortOrder: number;
  entitlementKey: string;
  featureFlag: boolean;
  featureFlagKey: string;
  showWhenLocked: boolean;
  minPlan: string;
  isActive?: boolean;
  roleActiveMap: Record<string, boolean>;
  reason: string;
}

export interface MasterMenuFlatUpdateDTO {
  title: string;
  route: string;
  icon: string;
  sectionId: string;
  sortOrder: number;
  entitlementKey: string;
  featureFlag: boolean;
  featureFlagKey: string;
  showWhenLocked: boolean;
  minPlan: string;
  isActive: boolean;
  reason: string;
}
export interface TenantMenuConfigDTO {
  itemKey: string;
  isVisible: boolean;
  isLocked: boolean;
}
export interface TenantMenuConfigBulkUpdateDTO {
  items: TenantMenuConfigDTO[];
  reason: string;
}

// removed stray curly brace
@Injectable({ providedIn: 'root' })
export class MenuManagementApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMasterMenu(): Observable<MasterMenuResponseDTO> {
    return this.http.get<MasterMenuResponseDTO>(`${this.apiUrl}/api/ext/admin/menu/master`);
  }

  createMasterItem(dto: MasterMenuUpsertDTO): Observable<MasterMenuItemDTO> {
    return this.http.post<MasterMenuItemDTO>(`${this.apiUrl}/api/ext/admin/menu/master`, dto);
  }


  getEntitlementKeys(): Observable<DropdownOption[]> {
    return this.http.get<DropdownOption[]>(`${this.apiUrl}/api/admin/dropdowns/entitlement-keys`);
  }

  getPlans(): Observable<DropdownOption[]> {
    return this.http.get<DropdownOption[]>(`${this.apiUrl}/api/admin/dropdowns/plans`);
  }

  updateMasterItem(id: string, dto: MasterMenuUpsertDTO | MasterMenuFlatUpdateDTO): Observable<MasterMenuItemDTO> {
    return this.http.put<MasterMenuItemDTO>(`${this.apiUrl}/api/ext/admin/menu/master/${id}`, dto);
  }

  deleteMasterItem(id: string, reason: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/ext/admin/menu/master/${id}?reason=${encodeURIComponent(reason)}`);
  }

  getEnterpriseMenuConfig(enterpriseId: string): Observable<TenantMenuConfigDTO[]> {
    return this.http.get<TenantMenuConfigDTO[]>(`${this.apiUrl}/api/ext/enterprises/${enterpriseId}/menu-config`);
  }

  updateEnterpriseMenuConfig(enterpriseId: string, dto: TenantMenuConfigBulkUpdateDTO): Observable<TenantMenuConfigDTO[]> {
    return this.http.put<TenantMenuConfigDTO[]>(`${this.apiUrl}/api/ext/enterprises/${enterpriseId}/menu-config`, dto);
  }

  deleteEnterpriseOverride(enterpriseId: string, itemKey: string, reason: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/ext/enterprises/${enterpriseId}/menu-config/${itemKey}?reason=${encodeURIComponent(reason)}`);
  }
}

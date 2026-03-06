import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MenuManagementApiService, MasterMenuItemDTO, MasterMenuSectionDTO, MasterMenuUpsertDTO, TenantMenuConfigBulkUpdateDTO } from 'src/app/services/menu-management/menu-management-api.service';

const ROLE_KEYS = ['ROLE_ADMIN','ROLE_USER','ROLE_ENTERPRISE_ADMIN','ROLE_ENTERPRISE_EMPLOYEE'];

@Component({
  selector: 'admin-menu-management-shell',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-menu-management-shell.component.html',
  styleUrls: ['./admin-menu-management-shell.component.scss']
})
export class AdminMenuManagementShellComponent {
  activeTab: 'masterMenu' | 'enterpriseOverrides' = 'masterMenu';
  ROLE_KEYS = ROLE_KEYS;
  objectKeys(obj: any): string[] { return Object.keys(obj); }

  // Master Menu State
  masterMenuItems: MasterMenuItemDTO[] = [];
  masterMenuSections: MasterMenuSectionDTO[] = [];
  masterMenuLoading = false;
  masterMenuError: string | null = null;
  showMasterMenuModal = false;
  masterMenuForm: FormGroup;
  editingMasterMenuIndex: number | null = null;
  masterMenuSaveLoading = false;
  masterMenuSaveSuccess = false;
  masterMenuSaveError: string | null = null;

  // Enterprise Overrides State
  enterpriseId = '';
  enterpriseOverridesLoading = false;
  enterpriseOverridesError: string | null = null;
  mergedOverrideRows: Array<{ itemKey: string; title: string; isVisible: boolean; isLocked: boolean }> = [];
  overrideDirtyMap: Record<string, { isVisible: boolean; isLocked: boolean }> = {};
  overrideReason = '';
  overrideSaveLoading = false;
  overrideSaveSuccess = false;
  overrideSaveError: string | null = null;

  constructor(private api: MenuManagementApiService, private fb: FormBuilder) {
    this.masterMenuForm = this.fb.group({
      itemKey: ['', Validators.required],
      title: ['', [Validators.required]],
      route: ['', [Validators.required, Validators.pattern(/^\//)]],
      icon: [''],
      sectionId: ['', Validators.required],
      sortOrder: [0],
      entitlementKey: [''],
      featureFlag: [false],
      featureFlagKey: [''],
      showWhenLocked: [false],
      minPlan: [''],
      roleActiveMap: this.fb.group({
        ROLE_ADMIN: [false],
        ROLE_USER: [false],
        ROLE_ENTERPRISE_ADMIN: [false],
        ROLE_ENTERPRISE_EMPLOYEE: [false],
      }),
      reason: ['']
    });
  }

  // Dummy methods for now (to be replaced with real logic if needed)
  selectTab(tab: 'masterMenu' | 'enterpriseOverrides') { this.activeTab = tab; }
  openMasterMenuModal(i?: number) { this.showMasterMenuModal = true; this.editingMasterMenuIndex = i ?? null; }
  closeMasterMenuModal() { this.showMasterMenuModal = false; this.editingMasterMenuIndex = null; }
  saveMasterMenu() { this.masterMenuSaveLoading = true; setTimeout(() => { this.masterMenuSaveLoading = false; this.masterMenuSaveSuccess = true; }, 1000); }
  getRoleControl(role: string) { return (this.masterMenuForm.get('roleActiveMap') as FormGroup).get(role) as FormControl; }
  loadEnterpriseOverrides() { this.enterpriseOverridesLoading = true; setTimeout(() => { this.enterpriseOverridesLoading = false; }, 1000); }
  onOverrideRowChange(itemKey: string, field: 'isVisible' | 'isLocked', value: boolean) { this.overrideDirtyMap[itemKey] = { ...(this.overrideDirtyMap[itemKey] || {}), [field]: value }; }
  saveEnterpriseOverrides() { this.overrideSaveLoading = true; setTimeout(() => { this.overrideSaveLoading = false; this.overrideSaveSuccess = true; }, 1000); }
}

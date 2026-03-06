
 
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { Component, OnDestroy, OnInit, ViewChild, inject, effect, EffectRef } from '@angular/core';
import { DashboardRowEditStore } from './dashboard-row-edit.store';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MenuManagementApiService, MasterMenuItemDTO, MasterMenuSectionDTO, MasterMenuUpsertDTO, MasterMenuFlatUpdateDTO, TenantMenuConfigBulkUpdateDTO, DropdownOption } from 'src/app/services/menu-management/menu-management-api.service';
import { forkJoin } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';


const ROLE_KEYS = ['ROLE_ADMIN','ROLE_USER','ROLE_ENTERPRISE_ADMIN','ROLE_ENTERPRISE_EMPLOYEE'];
const ROLE_LABELS: Record<string, string> = {
  ROLE_ADMIN: 'Admin',
  ROLE_USER: 'User',
  ROLE_ENTERPRISE_ADMIN: 'Enterprise Admin',
  ROLE_ENTERPRISE_EMPLOYEE: 'Enterprise Employee'
};

interface MenuTableRow {
  roleKey: string;
  roleLabel: string;
  itemKey: string;
  sectionId: string;
  id: string;
  title: string;
  icon: string;
  route: string;
  entitlementKey: string;
  featureFlag: boolean;
  featureFlagKey: string;
  showWhenLocked: boolean;
  minPlan: string;
  sortOrder: number;
  isActive: boolean;
  [key: string]: any; // allow filter access
}
  
  // ...existing code...

type HeaderFilters = {
  itemKey: string;
  title: string;
  route: string;
  icon: string;
  section: string;
  sort: string;
  entitlement: string;
  subscription: string;
  featureFlag: string;
  lockedView: string;
  roles: string;
};




@Component({
  selector: 'db-app-admin-menu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FeathericonsModule,
    DrawerModule, AutoCompleteModule, InputTextModule, ButtonModule, MenuModule, MatSidenavModule, MatSnackBarModule],
  templateUrl: './dashboard-app-admin-menu.component.html',
  styleUrls: ['./dashboard-app-admin-menu.component.scss']
})
export class DashboardAppAdminMenuComponent implements OnInit, OnDestroy {
      // Getter for filteredSections used in template
      public get filteredSections(): MasterMenuSectionDTO[] {
        // Sections are not role-specific, so return all
        return this.masterMenuSections;
      }
    // Map MenuTableRow to MasterMenuItemDTO (for edit)
    private mapTableRowToMasterMenuItem(row: MenuTableRow): MasterMenuItemDTO {
      return {
        id: row.id,
        itemKey: row.itemKey,
        title: row.title,
        route: row.route,
        icon: row.icon,
        sectionId: row.sectionId,
        sortOrder: row.sortOrder,
        entitlementKey: row.entitlementKey,
        featureFlag: row.featureFlag,
        featureFlagKey: row.featureFlagKey,
        showWhenLocked: row.showWhenLocked,
        minPlan: row.minPlan,
        roleActiveMap: row['roleActiveMap'] || {},
      };
    }

  private rowEditStore = inject(DashboardRowEditStore);
  private signalEffectCleanup: EffectRef | null = null;
  // For context menu actions
  menuItems: any[] = [];

  setMenuItems(row: MenuTableRow) {
    this.menuItems = [
      {
        label: row.isActive ? 'Disable' : 'Enable',
        icon: row.isActive ? 'pi pi-ban' : 'pi pi-check',
        command: () => {
          if (row.isActive) {
            this.disableItem(this.getMasterMenuItemByKey(row.itemKey)!);
          } else {
            this.enableItem(this.getMasterMenuItemByKey(row.itemKey)!);
          }
        }
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          this.deleteMasterMenuItem(row.itemKey);
        }
      }
    ];
  }

    getSectionTitle(sectionId: string): string {
    const section = this.masterMenuSections.find(s => s.id === sectionId);
    return section ? section.title : sectionId;
  }

      disableItem(item: MasterMenuItemDTO) {
        // Implement disable logic
        this.saveMasterMenuStatus(item, false);
      }

      enableItem(item: MasterMenuItemDTO) {
        // Implement enable logic
        this.saveMasterMenuStatus(item, true);
      }

      private saveMasterMenuStatus(item: MasterMenuItemDTO, isActive: boolean) {
        if (!item.id) {
          alert('Missing menu item id for status update');
          return;
        }
        // Only include fields that exist in MasterMenuUpsertDTO and add required 'reason'
        const upsert: MasterMenuUpsertDTO = {
          itemKey: item.itemKey,
          title: item.title,
          route: item.route,
          icon: item.icon,
          sectionId: item.sectionId,
          sortOrder: item.sortOrder,
          entitlementKey: item.entitlementKey,
          featureFlag: item.featureFlag,
          featureFlagKey: item.featureFlagKey,
          showWhenLocked: item.showWhenLocked,
          minPlan: item.minPlan,
          roleActiveMap: item.roleActiveMap,
          reason: 'Status change', // or prompt for a reason if needed
        };
        console.debug('[MenuManagement] saveMasterMenuStatus', {
          isEditMode: true,
          editingRowId: item.id,
          method: 'PUT',
          path: `/api/ext/admin/menu/master/${item.id}`
        });
        this.api.updateMasterItem(item.id, upsert).subscribe({
          next: () => this.loadMaster(),
          error: () => alert('Failed to update status')
        });
      }
    // Add ViewChild for paginator
    @ViewChild('masterMenuPaginator', { static: false }) masterMenuPaginator: any;

    ngAfterViewInit() {
      // Attach paginator after view is initialized
      setTimeout(() => {
        if (this.masterMenuPaginator) {
          this.paginator = this.masterMenuPaginator;
          this.attachPaginator();
        }
      });
    }

    private attachPaginator() {
      if (this.dataSource && this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    }
  public columnFilters: { [key: string]: string } = {};
  public dataSource: any = { data: [], paginator: null, filter: '' };
  public paginator: any = null;
  public sort: any = null; // Added to fix TS2339 error
  public setupFilterPredicate(): void {
    this.dataSource.filterPredicate = (row: MenuTableRow, filter: string) => {
      let criteria: { [key: string]: string } = {};
      try { criteria = JSON.parse(filter); } catch { return true; }
      // Role filter: match both code and label
      if (criteria['roleKey']) {
        const val = criteria['roleKey'].trim().toLowerCase();
        if (
          !row.roleKey.toLowerCase().includes(val) &&
          !row.roleLabel.toLowerCase().includes(val)
        ) return false;
      }
      // Status filter: match both code and label
      if (criteria['isActive']) {
        const val = criteria['isActive'].trim().toLowerCase();
        const status = row.isActive ? 'enabled' : 'disabled';
        if (
          !status.includes(val) &&
          !(row.isActive ? 'true' : 'false').includes(val)
        ) return false;
      }
      // Other filters (itemKey, title, etc.)
      for (const key of Object.keys(criteria)) {
        if (['roleKey', 'isActive'].includes(key)) continue;
        const val = criteria[key].trim().toLowerCase();
        if (val && !(row[key]?.toString().toLowerCase().includes(val))) return false;
      }
      return true;
    };
  }
          showHelpDrawer = false;

  selectedRow: MenuTableRow | null = null;
  isEditMode = false;
  editingRowId: string | null = null;
  editSidenavOpen = false;
  tableRows: MenuTableRow[] = [];

        private readonly emptyFilterState = {
          itemKey: '',
          title: '',
          route: '',
          icon: '',
          sortOrder: '',
          featureFlagKey: '',
        };

  private readonly emptyHeaderFilters: HeaderFilters = {
    itemKey: '',
    title: '',
    route: '',
    icon: '',
    section: '',
    sort: '',
    entitlement: '',
    subscription: '',
    featureFlag: '',
    lockedView: '',
    roles: '',
  };

  headerFilters: HeaderFilters = { ...this.emptyHeaderFilters };

  private resetEditModeState(): void {
    this.selectedRow = null;
    this.isEditMode = false;
    this.editingRowId = null;
    this.editingMasterMenuIndex = null;
  }


  private appliedFilterItemsCache: MasterMenuItemDTO[] = [];
  private headerFilterTimer: ReturnType<typeof setTimeout> | null = null;

  // Filtering logic - must be inside the class, not inside any method

    getMasterMenuItemByKey(itemKey: string): MasterMenuItemDTO | undefined {
    return this.masterMenuItems.find(i => i.itemKey === itemKey);
  }

  // Explode master items into one row per role
  private adaptMenuItems(items: any[]): MenuTableRow[] {
    const rows: MenuTableRow[] = [];
    for (const item of items) {
      // Normalize featureFlag to boolean
      const featureFlag = typeof item.featureFlag === 'string' ? item.featureFlag === 'true' : !!item.featureFlag;
      if ('roleKey' in item && item.roleKey) {
        // Already flat row
        const roleKey = String(item.roleKey);
        rows.push({
          ...item,
          roleKey,
          featureFlag,
          roleLabel: ROLE_LABELS[roleKey] || roleKey,
          isActive: typeof item.isActive === 'boolean' ? item.isActive : !!item.isActive,
        });
      } else if ('isActiveByRole' in item && item.isActiveByRole && typeof item.isActiveByRole === 'object') {
        for (const rk of Object.keys(item.isActiveByRole)) {
          const roleKey = String(rk);
          rows.push({
            ...item,
            roleKey,
            featureFlag,
            roleLabel: ROLE_LABELS[roleKey] || roleKey,
            isActive: !!item.isActiveByRole[roleKey],
          });
        }
      } else if ('roleActiveMap' in item && item.roleActiveMap && typeof item.roleActiveMap === 'object') {
        for (const rk of Object.keys(item.roleActiveMap)) {
          const roleKey = String(rk);
          rows.push({
            ...item,
            roleKey,
            featureFlag,
            roleLabel: ROLE_LABELS[roleKey] || roleKey,
            isActive: !!item.roleActiveMap[roleKey],
          });
        }
      }
    }
    return rows;
  }

  get filteredTableRows(): MenuTableRow[] {
    // Filter by both roleKey and roleLabel for the Roles column
    const rolesFilter = (this.headerFilters.roles || '').trim().toLowerCase();
    if (!rolesFilter) return this.dataSource.data;
    return this.dataSource.data.filter((row: MenuTableRow) => {
      return (
        row.roleKey.toLowerCase().includes(rolesFilter) ||
        row.roleLabel.toLowerCase().includes(rolesFilter)
      );
    });
  }

  pageSize = 15;
  currentPage = 1;

  paginationPages: number[] = [1];

  trackPage(index: number, page: number): number {
    return page;
  }


  get pagedTableRows(): MenuTableRow[] {
    const filtered = this.filteredTableRows;
    const start = (this.currentPage - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return this.paginationPages.length || 1;
  }

  getEditIndex(itemKey: string): number {
    return this.masterMenuItems.findIndex(i => i.itemKey === itemKey);
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }
  nextPage() { this.setPage(this.currentPage + 1); }
  prevPage() { this.setPage(this.currentPage - 1); }

  clearFilters() {
    if (this.headerFilterTimer) {
      clearTimeout(this.headerFilterTimer);
      this.headerFilterTimer = null;
    }

    this.headerFilters = { ...this.emptyHeaderFilters };
    this.currentPage = 1;
    this.recomputeFilteredItems();
  }

  clearHeaderFilter(key: keyof HeaderFilters): void {
    if (this.headerFilterTimer) {
      clearTimeout(this.headerFilterTimer);
      this.headerFilterTimer = null;
    }

    this.headerFilters = { ...this.headerFilters, [key]: '' };
    this.currentPage = 1;
    this.recomputeFilteredItems();
  }

  onHeaderFilterInput(): void {
    if (this.headerFilterTimer) {
      clearTimeout(this.headerFilterTimer);
    }

    // small debounce so we don't recompute on every keypress synchronously
    this.headerFilterTimer = setTimeout(() => {
      this.currentPage = 1;
      this.recomputeFilteredItems();
    }, 150);
  }

  getRoleLabel(roleKey: string): string {
    return ROLE_LABELS[roleKey] ?? roleKey;
  }

  getPlanLabel(planValue: string): string {
    return this.planOptions.find(opt => opt.value === planValue)?.label ?? planValue;
  }

  getActiveRoleSummary(item: MasterMenuItemDTO): string {
    const activeRoles = ROLE_KEYS.filter(role => item.roleActiveMap?.[role]).map(role => this.getRoleLabel(role));
    return activeRoles.length ? activeRoles.join(', ') : '-';
  }

  private buildRoleActiveMap(item: any): Record<string, boolean> {
    const src: Record<string, boolean> = item?.roleActiveMap ?? item?.isActiveByRole ?? {};
    return ROLE_KEYS.reduce((acc, role) => {
      acc[role] = !!src[role];
      return acc;
    }, {} as Record<string, boolean>);
  }

  private recomputeFilteredItems(): void {
    this.appliedFilterItemsCache = this.computeHeaderFilteredItems();
    this.syncPaginationPages();
  }

  private computeHeaderFilteredItems(): MasterMenuItemDTO[] {
    const itemKey = (this.headerFilters.itemKey || '').trim().toLowerCase();
    const title = (this.headerFilters.title || '').trim().toLowerCase();
    const route = (this.headerFilters.route || '').trim().toLowerCase();
    const icon = (this.headerFilters.icon || '').trim().toLowerCase();
    const section = (this.headerFilters.section || '').trim().toLowerCase();
    const sort = (this.headerFilters.sort || '').trim().toLowerCase();
    const entitlement = (this.headerFilters.entitlement || '').trim().toLowerCase();
    const subscription = (this.headerFilters.subscription || '').trim().toLowerCase();
    const featureFlag = (this.headerFilters.featureFlag || '').trim().toLowerCase();
    const lockedView = (this.headerFilters.lockedView || '').trim().toLowerCase();
    const roles = (this.headerFilters.roles || '').trim().toLowerCase();

    const any = Boolean(
      itemKey || title || route || icon || section || sort || entitlement || subscription || featureFlag || lockedView || roles,
    );
    if (!any) {
      return this.masterMenuItems;
    }

    const out: MasterMenuItemDTO[] = [];
    for (const item of this.masterMenuItems) {
      if (itemKey && !(item.itemKey || '').toLowerCase().includes(itemKey)) continue;
      if (title && !(item.title || '').toLowerCase().includes(title)) continue;
      if (route && !(item.route || '').toLowerCase().includes(route)) continue;
      if (icon && !(item.icon || '').toLowerCase().includes(icon)) continue;

      if (section) {
        const sectionText = `${item.sectionId || ''} ${(this.masterMenuSections.find(s => s.id === item.sectionId)?.title) || ''}`.toLowerCase();
        if (!sectionText.includes(section)) continue;
      }

      if (sort && !String(item.sortOrder ?? '').toLowerCase().includes(sort)) continue;
      if (entitlement && !(item.entitlementKey || '').toLowerCase().includes(entitlement)) continue;
      if (subscription && !(item.minPlan || '').toLowerCase().includes(subscription)) continue;

      if (featureFlag) {
        const statusText = item.isActive ? 'enabled true yes' : 'disabled false no';
        if (!statusText.includes(featureFlag)) continue;
      }

      if (lockedView) {
        const lvText = item.showWhenLocked ? 'yes true locked' : 'no false';
        if (!lvText.includes(lockedView)) continue;
      }

      if (roles) {
        const roleKeys = ROLE_KEYS.filter((role) => item.roleActiveMap?.[role]);
        const roleText = `${roleKeys.join(' ')} ${roleKeys.map(r => this.getRoleLabel(r)).join(' ')}`.toLowerCase();
        if (!roleText.includes(roles)) continue;
      }

      out.push(item);
    }

    return out;
  }

  private syncPaginationPages(): void {
    const nextTotal = Math.ceil(this.filteredTableRows.length / Math.max(1, this.pageSize)) || 1;
    this.paginationPages = Array.from({ length: nextTotal }, (_, idx) => idx + 1);
    if (this.currentPage > nextTotal) {
      this.currentPage = nextTotal;
    }
  }

  ngOnDestroy(): void {
    if (this.headerFilterTimer) {
      clearTimeout(this.headerFilterTimer);
      this.headerFilterTimer = null;
    }
    if (this.signalEffectCleanup) {
      this.signalEffectCleanup.destroy();
      this.signalEffectCleanup = null;
    }
    this.dismissMasterMenuSaveSuccess();
    this.dismissMasterMenuSaveError();
    this.dismissMasterMenuError();
  }
  entitlementOptions: DropdownOption[] = [];
  planOptions: DropdownOption[] = [];
  dropdownsLoading = false;


  ngOnInit() {
    this.tableRows = [];
    this.columnFilters = {};
    this.loadDropdowns();
    this.refreshMenuList();
  }

  // Load master and explode rows
  loadMaster() {
    this.masterMenuLoading = true;
    this.dismissMasterMenuError();
    this.api.getMasterMenu().subscribe({
      next: (res) => {
        // Map each item to a single row (no expansion)
        const rows: MenuTableRow[] = (res.items || []).map((item: any) => {
          const roleKey = item.roleKey || item.role_key || item.isActiveRoleKey || '';
          return {
            roleKey,
            roleLabel: ROLE_LABELS[roleKey] || roleKey,
            isActive: typeof item.isActive === 'boolean' ? item.isActive : !!item.is_active,
            itemKey: item.itemKey,
            title: item.title,
            route: item.route,
            icon: item.icon,
            sectionId: item.sectionId,
            id: item.id ?? item.sectionId,
            sortOrder: item.sortOrder,
            entitlementKey: item.entitlementKey,
            featureFlag: typeof item.featureFlag === 'string' ? item.featureFlag === 'true' : !!item.featureFlag,
            featureFlagKey: item.featureFlagKey,
            showWhenLocked: item.showWhenLocked,
            minPlan: item.minPlan
          };
        });
        this.masterMenuItems = (res.items || []).map((item: any) => ({
          ...item,
          id: item.id ?? item.sectionId,
        }));
        // Use plain array for dataSource
        this.dataSource = { data: rows, paginator: null, filter: '' };
        this.attachPaginator();
        this.masterMenuSections = res.sections || [];
        this.setupFilterPredicate();
        this.syncPaginationPages();
        this.masterMenuLoading = false;
      },
      error: () => {
        this.masterMenuError = 'Failed to load master menu.';
        this.autoHideMasterMenuSaveError();
        this.masterMenuLoading = false;
      }
    });
  }

  loadDropdowns() {
    this.dropdownsLoading = true;
    forkJoin({
      entitlements: this.api.getEntitlementKeys(),
      plans: this.api.getPlans()
    }).subscribe({
      next: ({ entitlements, plans }) => {
        this.entitlementOptions = entitlements || [];
        this.planOptions = plans || [];
        this.dropdownsLoading = false;
      },
      error: (err) => {
        // Log error, keep dropdowns empty
        console.error('Dropdown load failed', err);
        this.entitlementOptions = [];
        this.planOptions = [];
        this.dropdownsLoading = false;
      }
    });
  }
    openEditDrawer(row?: MenuTableRow) {
      if (row) {
        this.openEdit(row);
        return;
      }
      this.resetEditModeState();
      // Add button: open empty form for new item (via signal store)
      this.rowEditStore.startEditing('entitlements', -1, {
        plan: '',
        sectionKey: '',
        title: '',
        roleKey: '',
        sortOrder: '',
        isActive: true,
        active: '',
      } as any);
    }
    closeEditDrawer() {
      this.rowEditStore.closeEditing();
      this.resetEditModeState();
      this.closeMasterMenuModal();
    }
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
  // Filtering logic - must be inside the class, not inside any method
  overrideReason = '';
  overrideSaveLoading = false;
  overrideSaveSuccess = false;
  overrideSaveError: string | null = null;

  private masterMenuSaveSuccessTimer: ReturnType<typeof setTimeout> | null = null;
  private masterMenuSaveErrorTimer: ReturnType<typeof setTimeout> | null = null;
  private masterMenuErrorTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private api: MenuManagementApiService, private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.masterMenuForm = this.fb.group({
      itemKey: ['', Validators.required],
      title: ['', [Validators.required]],
      route: ['', [Validators.required, Validators.pattern(/^\//)]],
      icon: [''],
      sectionKey: ['', Validators.required],
      sortOrder: [0],
      entitlementKey: [''],
      featureFlag: [false],
      featureFlagKey: [''],
      showWhenLocked: [false],
      isActive: [true],
      minPlan: [''],
      roleActiveMap: this.fb.group(
        ROLE_KEYS.reduce((acc, role) => {
          acc[role] = [false];
          return acc;
        }, {} as Record<string, any>)
      ),
      reason: ['', Validators.required]
    });
    this.loadMaster();

    // Effect: keep form in sync with signal store's editingRowData
    this.signalEffectCleanup = effect(() => {
      const rowData = this.rowEditStore.editingRowData();
      console.log('[signalEffect] editingMasterMenuIndex:', this.editingMasterMenuIndex, 'rowData:', rowData);
      if (rowData) {
        console.log('[signalEffect] Opening sidenav with rowData:', rowData, 'editingMasterMenuIndex:', this.editingMasterMenuIndex);
        // Patch form with row data (Edit or New)
        const roleActiveMap = this.buildRoleActiveMap(rowData);
        this.masterMenuForm.patchValue({ ...rowData, roleActiveMap, reason: '' });
        // If editingMasterMenuIndex is null, it's a new item, so enable itemKey; else, disable for edit
        if (this.editingMasterMenuIndex === null) {
          this.masterMenuForm.get('itemKey')?.enable();
        } else {
          this.masterMenuForm.get('itemKey')?.disable();
        }
        this.editSidenavOpen = true;
      } else {
        console.log('[signalEffect] Closing sidenav (no rowData)');
        // No row selected (Add or close)
        this.masterMenuForm.reset();
        this.masterMenuForm.get('itemKey')?.enable();
        this.editSidenavOpen = false;
      }
    });
  }

  openEdit(row: MenuTableRow): void {
    this.selectedRow = row;
    this.isEditMode = true;
    this.editingRowId = row.id || null;
    // Build roleActiveMap so only the row's roleKey is true
    const roleActiveMap: Record<string, boolean> = {};
    (this.ROLE_KEYS || []).forEach(role => {
      roleActiveMap[role] = role === row.roleKey;
    });
    // Determine sectionKey for dropdown selection
    let sectionKey = row['sectionKey'] || '';
    if (!sectionKey && row.sectionId) {
      const section = this.masterMenuSections.find(s => s.id === row.sectionId);
      if (section) {
        sectionKey = section.id || '';
      } else {
        sectionKey = row.sectionId;
      }
    }
    this.rowEditStore.startEditing('entitlements', -1, {
      id: row.id || '',
      itemKey: row.itemKey || '',
      sectionId: row.sectionId || '',
      sectionKey,
      title: row.title || '',
      route: row.route || '',
      icon: row.icon || '',
      sortOrder: (row.sortOrder !== undefined && row.sortOrder !== null) ? String(row.sortOrder) : '',
      entitlementKey: row.entitlementKey || '',
      featureFlag: row.featureFlag ?? false,
      featureFlagKey: row.featureFlagKey || '',
      showWhenLocked: row.showWhenLocked ?? false,
      isActive: row.isActive ?? false,
      minPlan: row.minPlan || '',
      reason: '',
      // For legacy compatibility with EntitlementRow shape
      plan: row.minPlan || '',
      roleKey: row.roleKey || '',
      active: row.isActive ? 'true' : 'false',
      ['roleActiveMap']: roleActiveMap,
    } as any);
    const editIndex = this.masterMenuItems.findIndex(i => (i.id ?? i.itemKey) === (row.id ?? row.itemKey));
    this.editingMasterMenuIndex = editIndex > -1 ? editIndex : 0;
  }

  closeEditSidenav(): void {
    this.editSidenavOpen = false;
    this.resetEditModeState();
    this.closeMasterMenuModal();
  }

  saveSelectedRow(): void {
    // Always use form value from signal-driven form
    if (this.masterMenuForm.invalid) {
      this.masterMenuForm.markAllAsTouched();
      return;
    }
    this.masterMenuSaveLoading = true;
    this.dismissMasterMenuSaveSuccess();
    this.dismissMasterMenuSaveError();
    const formValue = this.masterMenuForm.getRawValue();
    const selectedRoleKey = this.selectedRow?.roleKey || '';
    const sectionId = formValue.sectionKey;
    const isActive = !!formValue.isActive;
    let req$;
    if (this.isEditMode && this.editingRowId) {
      const updatePayload: MasterMenuFlatUpdateDTO = {
        title: formValue.title,
        route: formValue.route,
        icon: formValue.icon,
        sectionId,
        sortOrder: Number(formValue.sortOrder ?? 0),
        entitlementKey: formValue.entitlementKey,
        featureFlag: !!formValue.featureFlag,
        featureFlagKey: formValue.featureFlagKey,
        showWhenLocked: !!formValue.showWhenLocked,
        minPlan: formValue.minPlan,
        isActive,
        reason: formValue.reason,
      };
      console.debug('[MenuManagement] saveSelectedRow', {
        isEditMode: this.isEditMode,
        editingRowId: this.editingRowId,
        payloadSectionId: updatePayload.sectionId,
        payloadIsActive: updatePayload.isActive,
        selectedRoleKey,
        selectedItemKey: this.selectedRow?.itemKey,
        method: 'PUT',
        path: `/api/ext/admin/menu/master/${this.editingRowId}`
      });
      req$ = this.api.updateMasterItem(this.editingRowId, updatePayload);
    } else {
      const currentMaster = this.masterMenuItems.find(i => i.itemKey === formValue.itemKey);
      const baseMap = currentMaster?.roleActiveMap || {};
      const newMap: Record<string, boolean> = {};
      for (const role of ROLE_KEYS) {
        newMap[role] = formValue.roleActiveMap?.[role] ?? baseMap[role] ?? false;
      }
      const upsert: MasterMenuUpsertDTO = {
        itemKey: formValue.itemKey,
        title: formValue.title,
        route: formValue.route,
        icon: formValue.icon,
        sectionId,
        sortOrder: Number(formValue.sortOrder ?? 0),
        entitlementKey: formValue.entitlementKey,
        featureFlag: !!formValue.featureFlag,
        featureFlagKey: formValue.featureFlagKey,
        showWhenLocked: !!formValue.showWhenLocked,
        minPlan: formValue.minPlan,
        isActive,
        roleActiveMap: newMap,
        reason: formValue.reason,
      };
      console.debug('[MenuManagement] saveSelectedRow', {
        isEditMode: this.isEditMode,
        editingRowId: this.editingRowId,
        payloadSectionId: upsert.sectionId,
        payloadIsActive: isActive,
        selectedRoleKey,
        selectedItemKey: this.selectedRow?.itemKey,
        method: 'POST',
        path: '/api/ext/admin/menu/master'
      });
      req$ = this.api.createMasterItem(upsert);
    }
    req$.subscribe({
      next: () => {
        this.masterMenuSaveLoading = false;
        this.masterMenuSaveSuccess = true;
        this.autoHideMasterMenuSaveSuccess();
        this.closeEditDrawer();
        this.loadMaster();
      },
      error: () => {
        this.masterMenuSaveLoading = false;
        this.masterMenuSaveError = 'Failed to save.';
        this.autoHideMasterMenuSaveError();
      }
    });
  }

  getRoleControl(role: string): FormControl {
    return (this.masterMenuForm.get('roleActiveMap')?.get(role) as FormControl) ?? this.fb.control(false);
  }

  selectTab(tab: 'masterMenu' | 'enterpriseOverrides') {
    this.activeTab = tab;
    this.dismissMasterMenuSaveSuccess();
    this.overrideSaveSuccess = false;
    this.dismissMasterMenuSaveError();
    this.overrideSaveError = null;
  }

  dismissMasterMenuSaveSuccess(): void {
    if (this.masterMenuSaveSuccessTimer) {
      clearTimeout(this.masterMenuSaveSuccessTimer);
      this.masterMenuSaveSuccessTimer = null;
    }
    this.masterMenuSaveSuccess = false;
  }

  dismissMasterMenuSaveError(): void {
    if (this.masterMenuSaveErrorTimer) {
      clearTimeout(this.masterMenuSaveErrorTimer);
      this.masterMenuSaveErrorTimer = null;
    }
    this.masterMenuSaveError = null;
  }

  dismissMasterMenuError(): void {
    if (this.masterMenuErrorTimer) {
      clearTimeout(this.masterMenuErrorTimer);
      this.masterMenuErrorTimer = null;
    }
    this.masterMenuError = null;
  }

  private autoHideMasterMenuSaveSuccess(ms = 5000): void {
    if (this.masterMenuSaveSuccessTimer) clearTimeout(this.masterMenuSaveSuccessTimer);
    this.masterMenuSaveSuccessTimer = setTimeout(() => {
      this.masterMenuSaveSuccess = false;
      this.masterMenuSaveSuccessTimer = null;
    }, ms);
  }

  private autoHideMasterMenuSaveError(ms = 5000): void {
    if (this.masterMenuErrorTimer) clearTimeout(this.masterMenuErrorTimer);
    this.masterMenuErrorTimer = setTimeout(() => {
      this.masterMenuError = null;
      this.masterMenuErrorTimer = null;
    }, ms);
  }

  closeMasterMenuModal(options?: { resetEditState?: boolean; resetForm?: boolean }) {
    const { resetEditState = true, resetForm = true } = options ?? {};
    this.showMasterMenuModal = false;
    if (resetEditState && !this.editSidenavOpen) {
      this.resetEditModeState();
    }
    if (resetForm) {
      this.masterMenuForm.reset({ featureFlag: false, showWhenLocked: false, isActive: true, sortOrder: 0 });
      this.masterMenuForm.get('itemKey')?.enable();
    }
  }

  saveMasterMenu() {
    if (this.masterMenuForm.invalid) {
      this.masterMenuForm.markAllAsTouched();
      return;
    }
    this.masterMenuSaveLoading = true;
    this.dismissMasterMenuSaveSuccess();
    this.dismissMasterMenuSaveError();
    const formValue = this.masterMenuForm.getRawValue();
    const sectionId = formValue.sectionKey;
    const isActive = !!formValue.isActive;
    let req$;
    if (this.isEditMode && this.editingRowId) {
      const updatePayload: MasterMenuFlatUpdateDTO = {
        title: formValue.title,
        route: formValue.route,
        icon: formValue.icon,
        sectionId,
        sortOrder: Number(formValue.sortOrder ?? 0),
        entitlementKey: formValue.entitlementKey,
        featureFlag: !!formValue.featureFlag,
        featureFlagKey: formValue.featureFlagKey,
        showWhenLocked: !!formValue.showWhenLocked,
        minPlan: formValue.minPlan,
        isActive,
        reason: formValue.reason
      };
      console.debug('[MenuManagement] saveMasterMenu', {
        isEditMode: this.isEditMode,
        editingRowId: this.editingRowId,
        payloadSectionId: updatePayload.sectionId,
        payloadIsActive: updatePayload.isActive,
        selectedRoleKey: this.selectedRow?.roleKey,
        selectedItemKey: this.selectedRow?.itemKey,
        method: 'PUT',
        path: `/api/ext/admin/menu/master/${this.editingRowId}`
      });
      req$ = this.api.updateMasterItem(this.editingRowId, updatePayload);
    } else {
      const upsert: MasterMenuUpsertDTO = {
        itemKey: formValue.itemKey,
        title: formValue.title,
        route: formValue.route,
        icon: formValue.icon,
        sectionId,
        sortOrder: Number(formValue.sortOrder ?? 0),
        entitlementKey: formValue.entitlementKey,
        featureFlag: !!formValue.featureFlag,
        featureFlagKey: formValue.featureFlagKey,
        showWhenLocked: !!formValue.showWhenLocked,
        minPlan: formValue.minPlan,
        isActive,
        roleActiveMap: formValue.roleActiveMap,
        reason: formValue.reason
      };
      console.debug('[MenuManagement] saveMasterMenu', {
        isEditMode: this.isEditMode,
        editingRowId: this.editingRowId,
        payloadSectionId: upsert.sectionId,
        payloadIsActive: isActive,
        selectedRoleKey: this.selectedRow?.roleKey,
        selectedItemKey: this.selectedRow?.itemKey,
        method: 'POST',
        path: '/api/ext/admin/menu/master'
      });
      req$ = this.api.createMasterItem(upsert);
    }
    req$.subscribe({
      next: () => {
        this.masterMenuSaveLoading = false;
        this.masterMenuSaveSuccess = true;
        this.autoHideMasterMenuSaveSuccess();
        this.closeEditDrawer();
        this.loadMaster();
      },
      error: () => {
        this.masterMenuSaveLoading = false;
        this.masterMenuSaveError = 'Save failed.';
        this.autoHideMasterMenuSaveError();
      }
    });
  }

  deleteMasterMenuItem(itemKey: string) {
    const reason = prompt('Enter reason for delete:');
    if (!reason) return;
    this.masterMenuSaveLoading = true;
    this.api.deleteMasterItem(itemKey, reason).subscribe({
      next: () => {
        this.masterMenuSaveLoading = false;
        this.loadMaster();
      },
      error: () => {
        this.masterMenuSaveLoading = false;
        this.masterMenuSaveError = 'Delete failed.';
        this.autoHideMasterMenuSaveError();
      }
    });
  }

  // --- Enterprise Overrides ---
  loadEnterpriseOverrides() {
    if (!this.enterpriseId) return;
    this.enterpriseOverridesLoading = true;
    this.enterpriseOverridesError = null;
    this.api.getMasterMenu().subscribe({
      next: (masterRes) => {
        this.api.getEnterpriseMenuConfig(this.enterpriseId).subscribe({
          next: (overrideArr) => {
            const overrideMap = (overrideArr || []).reduce((acc: any, item: any) => {
              acc[item.itemKey] = item;
              return acc;
            }, {});
            this.mergedOverrideRows = (masterRes.items || []).map((item: any) => {
              const override = overrideMap[item.itemKey] || {};
              return {
                itemKey: item.itemKey,
                title: item.title,
                isVisible: override.isVisible ?? true,
                isLocked: override.isLocked ?? false
              };
            });
            this.enterpriseOverridesLoading = false;
          },
          error: () => {
            this.enterpriseOverridesError = 'Failed to load overrides.';
            this.enterpriseOverridesLoading = false;
          }
        });
      },
      error: () => {
        this.enterpriseOverridesError = 'Failed to load master menu.';
        this.enterpriseOverridesLoading = false;
      }
    });
  }

  onOverrideRowChange(itemKey: string, field: 'isVisible' | 'isLocked', value: boolean) {
    this.overrideDirtyMap[itemKey] = {
      ...(this.overrideDirtyMap[itemKey] || {}),
      [field]: value
    };
    const row = this.mergedOverrideRows.find(r => r.itemKey === itemKey);
    if (row) row[field] = value;
  }

  saveEnterpriseOverrides() {
    if (!this.enterpriseId || !this.overrideReason || this.objectKeys(this.overrideDirtyMap).length === 0) return;
    this.overrideSaveLoading = true;
    this.overrideSaveSuccess = false;
    this.overrideSaveError = null;
    const payload: TenantMenuConfigBulkUpdateDTO = {
      items: this.objectKeys(this.overrideDirtyMap).map(itemKey => ({
        itemKey,
        ...this.overrideDirtyMap[itemKey]
      })),
      reason: this.overrideReason
    };
    this.api.updateEnterpriseMenuConfig(this.enterpriseId, payload).subscribe({
      next: () => {
        this.overrideSaveLoading = false;
        this.overrideSaveSuccess = true;
        this.overrideDirtyMap = {};
        this.loadEnterpriseOverrides();
      },
      error: () => {
        this.overrideSaveLoading = false;
        this.overrideSaveError = 'Save failed.';
      }
    });
  }

  deleteEnterpriseOverride(itemKey: string) {
    const reason = prompt('Enter reason for delete:');
    if (!reason || !this.enterpriseId) return;
    this.overrideSaveLoading = true;
    this.api.deleteEnterpriseOverride(this.enterpriseId, itemKey, reason).subscribe({
      next: () => {
        this.overrideSaveLoading = false;
        this.loadEnterpriseOverrides();
      },
      error: () => {
        this.overrideSaveLoading = false;
        this.overrideSaveError = 'Delete override failed.';
      }
    });
  }

  public refreshMenuList(): void {
    this.masterMenuLoading = true;
    this.api.getMasterMenu().subscribe({
      next: (res) => {
        this.masterMenuItems = (res.items || []).map((item: any) => ({
          ...item,
          id: item.id ?? item.sectionId,
        }));
        const rows = this.adaptMenuItems(res.items || []);
        this.dataSource.data = rows;
        this.setupFilterPredicate();
        this.dataSource.filter = JSON.stringify(this.columnFilters);
        this.attachPaginator();
        this.syncPaginationPages();
        this.masterMenuLoading = false;
      },
      error: () => {
        this.masterMenuError = 'Failed to load master menu.';
        this.masterMenuLoading = false;
      }
    });
  }
}

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NavbarStateService } from '../../../core/navbar/navbar-state.service';
import { AdminBulkActionConfirmDialogComponent } from './admin-bulk-action-confirm-dialog.component';
import { environment } from 'src/environments/environment';
import { NavbarResponseDTO } from '../../../core/navbar/navbar.model';
import { buildMenuDiagnosticsSnapshot, shouldShowMenuDiagnostics } from '../../../core/navbar/menu-diagnostics.util';

interface AdminMenuRow {
  id: string;
  title: string;
  icon: string;
  role: string;
  route: string;
  entitlementKey: string;
  updatedAt: string;
  featureStatus?: 'ACTIVE' | 'READ_ONLY' | 'DISABLED';
  statusReason?: string;
  isActive?: boolean;
  showWhenLocked?: boolean;
  minPlan?: string;
  sortOrder?: number;
}

type AdminMenuTabKey = 'sections' | 'items' | 'tenantConfig' | 'userPrefs' | 'auditLogs';

interface AdminMenuTabConfig {
  key: AdminMenuTabKey;
  label: string;
  rows: AdminMenuRow[];
}

type MenuHealthFilterKey =
  | 'total-sections'
  | 'total-items'
  | 'missing-entitlement'
  | 'missing-route'
  | 'inactive-feature'
  | 'role-zero-items';

interface MenuHealthCard {
  key: MenuHealthFilterKey;
  label: string;
  count: number;
  toneClass: string;
  targetTab: AdminMenuTabKey;
}

@Component({
  selector: 'app-admin-menu-management-shell',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatDialogModule,
  ],
  templateUrl: './admin-menu-management-shell.component.html',
  styleUrls: ['./admin-menu-management-shell.component.scss'],
})
export class AdminMenuManagementShellComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly formBuilder = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly navbarStateService = inject(NavbarStateService);

  readonly displayedColumns: string[] = [
    'icon',
    'title',
    'role',
    'route',
    'entitlementKey',
    'updatedAt',
  ];

  readonly featureStatusOptions = ['ACTIVE', 'READ_ONLY', 'DISABLED'] as const;
  readonly minPlanOptions = ['FREE', 'PRO', 'PREMIUM', 'ENTERPRISE'];
  readonly bulkVisibilityOptions = ['visible', 'hidden'] as const;
  readonly previewRoleOptions = ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_ENTERPRISE_ADMIN', 'ROLE_ENTERPRISE_EMPLOYEE'] as const;
  readonly previewPlanOptions = ['FREE_INDIVIDUAL', 'INDIVIDUAL_FREE', 'FREE', 'PRO', 'PREMIUM', 'ENTERPRISE'] as const;

  tabs: AdminMenuTabConfig[] = [
    {
      key: 'sections',
      label: 'Sections',
      rows: [
        { id: 'sec-admin', title: 'Admin', icon: 'admin_panel_settings', role: 'ROLE_ADMIN', route: '/user/admin', entitlementKey: 'ADMIN_CONSOLE', updatedAt: '2026-02-12 10:35' },
        { id: 'sec-jobs', title: 'Jobs', icon: 'work', role: 'ROLE_USER', route: '/user/job-applications', entitlementKey: 'JOB_TRACKING', updatedAt: '2026-02-10 08:20' },
      ],
    },
    {
      key: 'items',
      label: 'Items',
      rows: [
        { id: 'itm-flags', title: 'Feature Flags', icon: 'flag', role: 'ROLE_ADMIN', route: '/user/admin/feature-flags', entitlementKey: 'ADMIN_FEATUREFLAGS', updatedAt: '2026-02-15 09:40', featureStatus: 'ACTIVE', statusReason: '', isActive: true, showWhenLocked: false, minPlan: 'PRO', sortOrder: 10 },
        { id: 'itm-plans', title: 'Plans', icon: 'sell', role: 'ROLE_ADMIN', route: '/user/admin/plans', entitlementKey: 'ADMIN_BILLING_PLANS', updatedAt: '2026-02-15 09:42', featureStatus: 'READ_ONLY', statusReason: 'Plan rollout in progress', isActive: true, showWhenLocked: true, minPlan: 'PREMIUM', sortOrder: 20 },
      ],
    },
    {
      key: 'tenantConfig',
      label: 'Tenant Config',
      rows: [
        { id: 'ten-default', title: 'Default Tenant Menu', icon: 'apartment', role: 'ROLE_ENTERPRISE', route: '/user/enterprise/org', entitlementKey: 'ENTERPRISE_CONSOLE', updatedAt: '2026-02-11 12:10', showWhenLocked: true },
        { id: 'ten-admin', title: 'Admin Tenant Override', icon: 'settings_applications', role: 'ROLE_ADMIN', route: '/user/dashboard-admin', entitlementKey: 'ADMIN_CONSOLE', updatedAt: '2026-02-09 16:05', showWhenLocked: false },
      ],
    },
    {
      key: 'userPrefs',
      label: 'User Prefs',
      rows: [
        { id: 'pref-hide-analytics', title: 'Hide Analytics Item', icon: 'visibility_off', role: 'ROLE_USER', route: '/user/job-analytics', entitlementKey: 'JOB_ANALYTICS', updatedAt: '2026-02-14 07:15' },
        { id: 'pref-show-templates', title: 'Show Templates Item', icon: 'description', role: 'ROLE_ADMIN', route: '/user/admin/resume-templates', entitlementKey: 'ADMIN_RESUME_TEMPLATES', updatedAt: '2026-02-14 07:18' },
      ],
    },
    {
      key: 'auditLogs',
      label: 'Audit Logs',
      rows: [
        { id: 'aud-001', title: 'Menu Item Created', icon: 'history', role: 'ROLE_ADMIN', route: '/user/admin/menu-management', entitlementKey: 'ADMIN_CONSOLE', updatedAt: '2026-02-16 13:10' },
        { id: 'aud-002', title: 'Role Mapping Updated', icon: 'manage_accounts', role: 'ROLE_ADMIN', route: '/user/admin/menu-management', entitlementKey: 'ADMIN_CONSOLE', updatedAt: '2026-02-16 13:55' },
      ],
    },
  ];

  readonly tabIndex = signal(0);
  readonly drawerOpen = signal(false);
  readonly selectedRow = signal<AdminMenuRow | null>(null);
  readonly selectedTabLabel = signal('');
  readonly selectedTabKey = signal<AdminMenuTabKey | null>(null);
  readonly healthFilter = signal<MenuHealthFilterKey | null>(null);
  readonly saving = signal(false);
  readonly refreshingNavbar = signal(false);
  readonly selectedItemIds = signal<Set<string>>(new Set<string>());
  readonly bulkFeatureStatus = signal<'ACTIVE' | 'READ_ONLY' | 'DISABLED'>('ACTIVE');
  readonly bulkVisibility = signal<(typeof this.bulkVisibilityOptions)[number]>('visible');
  readonly bulkInProgress = signal(false);
  readonly bulkProgress = signal(0);
  readonly previewRole = signal<(typeof this.previewRoleOptions)[number]>('ROLE_USER');
  readonly previewPlan = signal<(typeof this.previewPlanOptions)[number]>('FREE_INDIVIDUAL');
  readonly previewShowOnlyLocked = signal(false);
  readonly previewShowOnlyVisible = signal(false);
  readonly navbar = signal<NavbarResponseDTO | null>(null);
  readonly lastNavbarRefreshAt = signal<string>('N/A');
  readonly showDiagnosticsPanel = signal(false);

  readonly itemEditForm = this.formBuilder.group(
    {
      featureStatus: this.formBuilder.control<'ACTIVE' | 'READ_ONLY' | 'DISABLED'>('ACTIVE', { nonNullable: true, validators: [Validators.required] }),
      statusReason: this.formBuilder.control<string>('', { nonNullable: true }),
      isActive: this.formBuilder.control<boolean>(true, { nonNullable: true }),
      showWhenLocked: this.formBuilder.control<boolean>(false, { nonNullable: true }),
      minPlan: this.formBuilder.control<string>('FREE', { nonNullable: true }),
      sortOrder: this.formBuilder.control<number>(0, { nonNullable: true, validators: [Validators.required] }),
      title: this.formBuilder.control<string>('', { nonNullable: true, validators: [Validators.required] }),
      icon: this.formBuilder.control<string>('', { nonNullable: true, validators: [Validators.required] }),
      route: this.formBuilder.control<string>('', { nonNullable: true, validators: [Validators.required, this.routeStartsWithSlashValidator()] }),
    },
    { validators: [this.statusReasonRequiredValidator()] }
  );

  readonly tenantVisibilityForm = this.formBuilder.group({
    showWhenLocked: this.formBuilder.control<boolean>(false, { nonNullable: true }),
  });

  constructor() {
    const debugMenuFlag = isPlatformBrowser(this.platformId)
      ? localStorage.getItem('debugMenu')
      : null;
    this.showDiagnosticsPanel.set(shouldShowMenuDiagnostics(environment.production, debugMenuFlag));

    this.navbarStateService.refreshing$.subscribe((refreshing) => {
      this.refreshingNavbar.set(refreshing);
    });

    this.navbarStateService.navbar$.subscribe((navbar) => {
      this.navbar.set(navbar);
      if (navbar) {
        this.lastNavbarRefreshAt.set(new Date().toISOString());
      }
    });

    this.navbarStateService.initOnce();
  }

  readonly diagnosticsSnapshot = computed(() =>
    buildMenuDiagnosticsSnapshot(this.navbar(), this.lastNavbarRefreshAt()),
  );

  readonly searchByTab = signal<Record<AdminMenuTabKey, string>>({
    sections: '',
    items: '',
    tenantConfig: '',
    userPrefs: '',
    auditLogs: '',
  });

  readonly roleByTab = signal<Record<AdminMenuTabKey, string>>({
    sections: 'ALL',
    items: 'ALL',
    tenantConfig: 'ALL',
    userPrefs: 'ALL',
    auditLogs: 'ALL',
  });

  readonly roleOptionsByTab = computed<Record<AdminMenuTabKey, string[]>>(() => {
    const options: Record<AdminMenuTabKey, string[]> = {
      sections: ['ALL'],
      items: ['ALL'],
      tenantConfig: ['ALL'],
      userPrefs: ['ALL'],
      auditLogs: ['ALL'],
    };

    for (const tab of this.tabs) {
      const unique = Array.from(new Set(tab.rows.map((row) => row.role))).sort();
      options[tab.key] = ['ALL', ...unique];
    }

    return options;
  });

  onTabIndexChange(index: number): void {
    this.tabIndex.set(index);
    if (this.tabs[index]?.key !== 'items') {
      this.clearItemSelection();
    }
  }

  updateSearch(tabKey: AdminMenuTabKey, value: string): void {
    this.searchByTab.update((current) => ({
      ...current,
      [tabKey]: value,
    }));
  }

  updateRole(tabKey: AdminMenuTabKey, role: string): void {
    this.roleByTab.update((current) => ({
      ...current,
      [tabKey]: role,
    }));

    if (tabKey === 'items') {
      this.clearItemSelection();
    }
  }

  updateBulkFeatureStatus(status: 'ACTIVE' | 'READ_ONLY' | 'DISABLED'): void {
    this.bulkFeatureStatus.set(status);
  }

  updateBulkVisibility(value: (typeof this.bulkVisibilityOptions)[number]): void {
    this.bulkVisibility.set(value);
  }

  getDisplayedColumns(tabKey: AdminMenuTabKey): string[] {
    return tabKey === 'items' ? ['select', ...this.displayedColumns] : this.displayedColumns;
  }

  isItemSelected(rowId: string): boolean {
    return this.selectedItemIds().has(rowId);
  }

  toggleItemSelection(rowId: string, checked: boolean): void {
    this.selectedItemIds.update((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(rowId);
      } else {
        next.delete(rowId);
      }
      return next;
    });
  }

  areAllVisibleItemsSelected(rows: AdminMenuRow[]): boolean {
    if (!rows.length) {
      return false;
    }

    const selected = this.selectedItemIds();
    return rows.every((row) => selected.has(row.id));
  }

  hasAnyVisibleItemSelected(rows: AdminMenuRow[]): boolean {
    const selected = this.selectedItemIds();
    return rows.some((row) => selected.has(row.id));
  }

  toggleAllVisibleItems(rows: AdminMenuRow[], checked: boolean): void {
    this.selectedItemIds.update((current) => {
      const next = new Set(current);
      for (const row of rows) {
        if (checked) {
          next.add(row.id);
        } else {
          next.delete(row.id);
        }
      }
      return next;
    });
  }

  selectedItemCount(): number {
    return this.selectedItemIds().size;
  }

  hasTenantConfigRows(): boolean {
    return this.getRowsByTab('tenantConfig').length > 0;
  }

  applyBulkFeatureStatus(): void {
    const rows = this.getSelectedItemRows();
    if (!rows.length || this.bulkInProgress()) {
      return;
    }

    const targetStatus = this.bulkFeatureStatus();
    const dialogRef = this.dialog.open(AdminBulkActionConfirmDialogComponent, {
      width: '520px',
      data: {
        title: 'Confirm Bulk Feature Status Update',
        itemCount: rows.length,
        summaryLines: [
          `Set featureStatus to ${targetStatus}.`,
          targetStatus === 'ACTIVE'
            ? 'Items become active and fully enabled in menu previews.'
            : 'Items may become locked/limited depending on current menu rules.',
        ],
        confirmText: 'Apply Status',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) {
        return;
      }

      const requests = rows.map((row) => {
        const payload = {
          id: row.id,
          featureStatus: targetStatus,
          statusReason:
            targetStatus === 'ACTIVE'
              ? ''
              : row.statusReason || 'Updated by bulk action',
          isActive: targetStatus !== 'DISABLED',
          showWhenLocked: row.showWhenLocked ?? false,
          minPlan: row.minPlan ?? 'FREE',
          sortOrder: row.sortOrder ?? 0,
          title: row.title,
          icon: row.icon,
          route: row.route,
        };

        return this.http.put(`/api/nav-menu-items/${encodeURIComponent(row.id)}`, payload).pipe(
          map(() => true),
          catchError(() => of(false)),
        );
      });

      this.runBulkOperation(requests, rows, (row) => ({
        ...row,
        featureStatus: targetStatus,
        isActive: targetStatus !== 'DISABLED',
        statusReason:
          targetStatus === 'ACTIVE'
            ? ''
            : row.statusReason || 'Updated by bulk action',
      }));
    });
  }

  applyBulkTenantVisibility(): void {
    if (!this.hasTenantConfigRows()) {
      this.snackBar.open('Tenant config not found. Visibility bulk action unavailable.', 'Dismiss', { duration: 2600 });
      return;
    }

    const rows = this.getSelectedItemRows();
    if (!rows.length || this.bulkInProgress()) {
      return;
    }

    const target = this.bulkVisibility();
    const showWhenLocked = target === 'visible';

    const dialogRef = this.dialog.open(AdminBulkActionConfirmDialogComponent, {
      width: '520px',
      data: {
        title: 'Confirm Bulk Tenant Visibility Update',
        itemCount: rows.length,
        summaryLines: [
          `Set tenant visibility to ${target.toUpperCase()}.`,
          showWhenLocked
            ? 'Locked items stay visible when tenant visibility allows.'
            : 'Locked items become hidden for tenant menu previews.',
        ],
        confirmText: 'Apply Visibility',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) {
        return;
      }

      const requests = rows.map((row) => {
        const payload = {
          id: row.id,
          featureStatus: row.featureStatus ?? 'ACTIVE',
          statusReason: row.statusReason ?? '',
          isActive: row.isActive ?? true,
          showWhenLocked,
          minPlan: row.minPlan ?? 'FREE',
          sortOrder: row.sortOrder ?? 0,
          title: row.title,
          icon: row.icon,
          route: row.route,
        };

        return this.http.put(`/api/nav-menu-items/${encodeURIComponent(row.id)}`, payload).pipe(
          map(() => true),
          catchError(() => of(false)),
        );
      });

      this.runBulkOperation(requests, rows, (row) => ({
        ...row,
        showWhenLocked,
      }));
    });
  }

  updatePreviewRole(role: (typeof this.previewRoleOptions)[number]): void {
    this.previewRole.set(role);
  }

  updatePreviewPlan(plan: (typeof this.previewPlanOptions)[number]): void {
    this.previewPlan.set(plan);
  }

  updatePreviewShowOnlyLocked(value: boolean): void {
    this.previewShowOnlyLocked.set(value);
  }

  updatePreviewShowOnlyVisible(value: boolean): void {
    this.previewShowOnlyVisible.set(value);
  }

  getFilteredRows(tab: AdminMenuTabConfig): AdminMenuRow[] {
    const search = (this.searchByTab()[tab.key] ?? '').trim().toLowerCase();
    const role = tab.key === 'items' ? 'ALL' : (this.roleByTab()[tab.key] ?? 'ALL');

    const filtered = tab.rows.filter((row) => {
      const matchesRole = role === 'ALL' || row.role === role;
      const matchesSearch =
        !search ||
        row.title.toLowerCase().includes(search) ||
        row.id.toLowerCase().includes(search);

      return matchesRole && matchesSearch;
    });

    const healthFiltered = this.applyHealthFilter(tab, filtered);

    if (tab.key !== 'items') {
      return healthFiltered;
    }

    return this.applyPreviewFilters(healthFiltered);
  }

  getMenuHealthCards(): MenuHealthCard[] {
    const sections = this.getRowsByTab('sections');
    const items = this.getRowsByTab('items');

    const rolesWithItems = new Set(items.map((item) => item.role).filter(Boolean));
    const roleZeroItemsCount = sections.filter((section) => !rolesWithItems.has(section.role)).length;

    return [
      {
        key: 'total-sections',
        label: 'Total Sections',
        count: sections.length,
        toneClass: 'text-bg-success',
        targetTab: 'sections',
      },
      {
        key: 'total-items',
        label: 'Total Items',
        count: items.length,
        toneClass: 'text-bg-success',
        targetTab: 'items',
      },
      {
        key: 'missing-entitlement',
        label: 'Items missing entitlementKey',
        count: items.filter((item) => !String(item.entitlementKey ?? '').trim()).length,
        toneClass: 'text-bg-warning',
        targetTab: 'items',
      },
      {
        key: 'missing-route',
        label: 'Items missing route',
        count: items.filter((item) => !String(item.route ?? '').trim()).length,
        toneClass: 'text-bg-warning',
        targetTab: 'items',
      },
      {
        key: 'inactive-feature',
        label: 'Items with featureStatus != ACTIVE',
        count: items.filter((item) => (item.featureStatus ?? 'ACTIVE') !== 'ACTIVE').length,
        toneClass: 'text-bg-danger',
        targetTab: 'items',
      },
      {
        key: 'role-zero-items',
        label: 'ROLE sections with zero items',
        count: roleZeroItemsCount,
        toneClass: 'text-bg-danger',
        targetTab: 'sections',
      },
    ];
  }

  onHealthCardClick(card: MenuHealthCard): void {
    const current = this.healthFilter();
    this.healthFilter.set(current === card.key ? null : card.key);
    this.tabIndex.set(this.getTabIndex(card.targetTab));
  }

  isHealthCardActive(key: MenuHealthFilterKey): boolean {
    return this.healthFilter() === key;
  }

  openDetails(tab: AdminMenuTabConfig, row: AdminMenuRow): void {
    this.selectedRow.set(row);
    this.selectedTabLabel.set(tab.label);
    this.selectedTabKey.set(tab.key);

    if (tab.key === 'items') {
      this.itemEditForm.reset({
        featureStatus: row.featureStatus ?? 'ACTIVE',
        statusReason: row.statusReason ?? '',
        isActive: row.isActive ?? true,
        showWhenLocked: row.showWhenLocked ?? false,
        minPlan: row.minPlan ?? 'FREE',
        sortOrder: row.sortOrder ?? 0,
        title: row.title,
        icon: row.icon,
        route: row.route,
      });
      this.itemEditForm.markAsPristine();
    }

    if (tab.key === 'tenantConfig') {
      this.tenantVisibilityForm.reset({
        showWhenLocked: row.showWhenLocked ?? false,
      });
      this.tenantVisibilityForm.markAsPristine();
    }

    this.drawerOpen.set(true);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  saveItemChanges(): void {
    if (this.selectedTabKey() !== 'items') {
      return;
    }

    const selected = this.selectedRow();
    if (!selected) {
      return;
    }

    this.itemEditForm.markAllAsTouched();
    if (this.itemEditForm.invalid || this.saving()) {
      return;
    }

    const payload = {
      id: selected.id,
      featureStatus: this.itemEditForm.controls.featureStatus.value,
      statusReason: this.itemEditForm.controls.statusReason.value,
      isActive: this.itemEditForm.controls.isActive.value,
      showWhenLocked: this.itemEditForm.controls.showWhenLocked.value,
      minPlan: this.itemEditForm.controls.minPlan.value,
      sortOrder: this.itemEditForm.controls.sortOrder.value,
      title: this.itemEditForm.controls.title.value,
      icon: this.itemEditForm.controls.icon.value,
      route: this.itemEditForm.controls.route.value,
    };

    this.saving.set(true);
    this.http.put(`/api/nav-menu-items/${encodeURIComponent(selected.id)}`, payload).subscribe({
      next: (updated) => {
        this.applyItemUpdate(selected.id, payload, updated as Partial<AdminMenuRow> | undefined);
        this.refreshItemsTable();
        this.navbarStateService.initOnce();
        this.saving.set(false);
        this.snackBar.open('Menu item saved.', 'Dismiss', { duration: 2200 });
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open('Failed to save menu item.', 'Dismiss', { duration: 3000 });
      },
    });
  }

  saveTenantVisibility(): void {
    if (this.selectedTabKey() !== 'tenantConfig') {
      return;
    }

    const selected = this.selectedRow();
    if (!selected || this.saving()) {
      return;
    }

    const payload = {
      id: selected.id,
      showWhenLocked: this.tenantVisibilityForm.controls.showWhenLocked.value,
    };

    this.saving.set(true);
    this.http.put('/api/tenant-menu-config', payload).subscribe({
      next: () => {
        this.applyTenantUpdate(selected.id, payload.showWhenLocked);
        this.navbarStateService.initOnce();
        this.saving.set(false);
        this.snackBar.open('Tenant visibility saved.', 'Dismiss', { duration: 2200 });
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open('Failed to save tenant visibility.', 'Dismiss', { duration: 3000 });
      },
    });
  }

  get showStatusReasonError(): boolean {
    const touched = this.itemEditForm.controls.statusReason.touched || this.itemEditForm.touched;
    return touched && this.itemEditForm.hasError('statusReasonRequired');
  }

  trackTab(_index: number, tab: AdminMenuTabConfig): string {
    return tab.key;
  }

  trackRole(_index: number, role: string): string {
    return role;
  }

  trackPreviewRole(_index: number, role: (typeof this.previewRoleOptions)[number]): string {
    return role;
  }

  trackPreviewPlan(_index: number, plan: (typeof this.previewPlanOptions)[number]): string {
    return plan;
  }

  trackRow(_index: number, row: AdminMenuRow): string {
    return row.id;
  }

  copyDiagnosticsAsJson(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const payload = JSON.stringify(this.diagnosticsSnapshot(), null, 2);
    navigator.clipboard
      .writeText(payload)
      .then(() => this.snackBar.open('Diagnostics JSON copied.', 'Dismiss', { duration: 2200 }))
      .catch(() => this.snackBar.open('Failed to copy diagnostics JSON.', 'Dismiss', { duration: 3000 }));
  }

  private clearItemSelection(): void {
    this.selectedItemIds.set(new Set<string>());
  }

  private getSelectedItemRows(): AdminMenuRow[] {
    const selected = this.selectedItemIds();
    const itemRows = this.getRowsByTab('items');
    return itemRows.filter((row) => selected.has(row.id));
  }

  private runBulkOperation(
    requests: Observable<boolean>[],
    selectedRows: AdminMenuRow[],
    mutate: (row: AdminMenuRow) => AdminMenuRow,
  ): void {
    if (!requests.length) {
      return;
    }

    this.bulkInProgress.set(true);
    this.bulkProgress.set(0);

    let completed = 0;
    const tracked = requests.map((request) =>
      request.pipe(
        finalize(() => {
          completed += 1;
          this.bulkProgress.set(Math.round((completed / requests.length) * 100));
        }),
      ),
    );

    forkJoin(tracked).subscribe({
      next: (results) => {
        const successfulIds = new Set<string>();
        selectedRows.forEach((row, index) => {
          if (results[index]) {
            successfulIds.add(row.id);
          }
        });

        this.tabs = this.tabs.map((tab) => {
          if (tab.key !== 'items') {
            return tab;
          }

          return {
            ...tab,
            rows: tab.rows.map((row) => {
              if (!successfulIds.has(row.id)) {
                return row;
              }
              return mutate(row);
            }),
          };
        });

        this.refreshItemsTable();
  this.navbarStateService.initOnce();
        this.clearItemSelection();

        const successCount = successfulIds.size;
        const failedCount = Math.max(0, selectedRows.length - successCount);
        if (failedCount > 0) {
          this.snackBar.open(`Bulk action completed: ${successCount} succeeded, ${failedCount} failed.`, 'Dismiss', { duration: 3600 });
        } else {
          this.snackBar.open(`Bulk action completed for ${successCount} item(s).`, 'Dismiss', { duration: 2600 });
        }
      },
      error: () => {
        this.snackBar.open('Bulk action failed.', 'Dismiss', { duration: 3200 });
      },
      complete: () => {
        this.bulkInProgress.set(false);
      },
    });
  }

  private refreshItemsTable(): void {
    this.tabs = this.tabs.map((tab) =>
      tab.key === 'items'
        ? { ...tab, rows: [...tab.rows] }
        : tab
    );
  }

  private getRowsByTab(tabKey: AdminMenuTabKey): AdminMenuRow[] {
    return this.tabs.find((tab) => tab.key === tabKey)?.rows ?? [];
  }

  private getTabIndex(tabKey: AdminMenuTabKey): number {
    const index = this.tabs.findIndex((tab) => tab.key === tabKey);
    return index >= 0 ? index : 0;
  }

  private applyHealthFilter(tab: AdminMenuTabConfig, rows: AdminMenuRow[]): AdminMenuRow[] {
    const filter = this.healthFilter();
    if (!filter) {
      return rows;
    }

    const itemRoles = new Set(this.getRowsByTab('items').map((item) => item.role).filter(Boolean));

    switch (filter) {
      case 'total-sections':
        return tab.key === 'sections' ? rows : [];
      case 'total-items':
        return tab.key === 'items' ? rows : [];
      case 'missing-entitlement':
        return tab.key === 'items'
          ? rows.filter((row) => !String(row.entitlementKey ?? '').trim())
          : [];
      case 'missing-route':
        return tab.key === 'items'
          ? rows.filter((row) => !String(row.route ?? '').trim())
          : [];
      case 'inactive-feature':
        return tab.key === 'items'
          ? rows.filter((row) => (row.featureStatus ?? 'ACTIVE') !== 'ACTIVE')
          : [];
      case 'role-zero-items':
        return tab.key === 'sections'
          ? rows.filter((row) => !itemRoles.has(row.role))
          : [];
      default:
        return rows;
    }
  }

  private applyPreviewFilters(rows: AdminMenuRow[]): AdminMenuRow[] {
    return rows.filter((row) => {
      const state = this.evaluatePreviewState(row);
      if (this.previewShowOnlyLocked() && !state.locked) {
        return false;
      }
      if (this.previewShowOnlyVisible() && !state.visible) {
        return false;
      }
      return true;
    });
  }

  private evaluatePreviewState(row: AdminMenuRow): { locked: boolean; visible: boolean } {
    const previewRole = this.previewRole();
    const selectedPlanRank = this.getPlanRank(this.previewPlan());
    const minPlanRank = this.getPlanRank(row.minPlan ?? 'FREE');
    const featureStatus = (row.featureStatus ?? 'ACTIVE').toUpperCase();
    const roleAllowed = this.roleMatches(row.role, previewRole);
    const hasEntitlementKey = String(row.entitlementKey ?? '').trim().length > 0;
    const entitled = !hasEntitlementKey || roleAllowed;
    const planAllowed = selectedPlanRank >= minPlanRank;
    const disabledByStatus = featureStatus === 'DISABLED' || row.isActive === false;
    const readOnlyLocked = featureStatus === 'READ_ONLY';
    const locked = !entitled || !planAllowed || readOnlyLocked || disabledByStatus;
    const tenantAllowsLockedVisibility = this.tenantAllowsLockedVisibility(previewRole);
    const canShowLocked = (row.showWhenLocked ?? false) && tenantAllowsLockedVisibility;
    const visible = roleAllowed && !disabledByStatus && (!locked || canShowLocked);

    return { locked, visible };
  }

  private roleMatches(rowRole: string, previewRole: string): boolean {
    if (rowRole === previewRole) {
      return true;
    }

    if (rowRole === 'ROLE_ENTERPRISE') {
      return previewRole === 'ROLE_ENTERPRISE_ADMIN' || previewRole === 'ROLE_ENTERPRISE_EMPLOYEE';
    }

    return false;
  }

  private tenantAllowsLockedVisibility(previewRole: string): boolean {
    const tenantRows = this.getRowsByTab('tenantConfig');
    const roleCandidates =
      previewRole === 'ROLE_ENTERPRISE_ADMIN' || previewRole === 'ROLE_ENTERPRISE_EMPLOYEE'
        ? [previewRole, 'ROLE_ENTERPRISE']
        : [previewRole];

    const match = tenantRows.find((row) => roleCandidates.includes(row.role));
    return match?.showWhenLocked ?? true;
  }

  private getPlanRank(planCode: string): number {
    const normalized = String(planCode ?? '').trim().toUpperCase();
    const map: Record<string, number> = {
      FREE_INDIVIDUAL: 0,
      INDIVIDUAL_FREE: 0,
      FREE: 0,
      PRO: 1,
      PREMIUM: 2,
      ENTERPRISE: 3,
    };

    return map[normalized] ?? 0;
  }

  private applyItemUpdate(itemId: string, payload: Record<string, unknown>, updated?: Partial<AdminMenuRow>): void {
    this.tabs = this.tabs.map((tab) => {
      if (tab.key !== 'items') {
        return tab;
      }

      return {
        ...tab,
        rows: tab.rows.map((row) => {
          if (row.id !== itemId) {
            return row;
          }

          const merged: AdminMenuRow = {
            ...row,
            ...payload,
            ...updated,
          } as AdminMenuRow;

          this.selectedRow.set(merged);
          return merged;
        }),
      };
    });
  }

  private applyTenantUpdate(itemId: string, showWhenLocked: boolean): void {
    this.tabs = this.tabs.map((tab) => {
      if (tab.key !== 'tenantConfig') {
        return tab;
      }

      return {
        ...tab,
        rows: tab.rows.map((row) => {
          if (row.id !== itemId) {
            return row;
          }
          const merged = { ...row, showWhenLocked };
          this.selectedRow.set(merged);
          return merged;
        }),
      };
    });
  }

  private routeStartsWithSlashValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = String(control.value ?? '').trim();
      if (!value || value.startsWith('/')) {
        return null;
      }
      return { routeMustStartWithSlash: true };
    };
  }

  private statusReasonRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const featureStatus = String(control.get('featureStatus')?.value ?? 'ACTIVE');
      const statusReason = String(control.get('statusReason')?.value ?? '').trim();
      if (featureStatus !== 'ACTIVE' && !statusReason) {
        return { statusReasonRequired: true };
      }
      return null;
    };
  }
}

import { CommonModule } from '@angular/common';
import { Component, Signal, inject, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation, HostListener, effect, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { DrawerModule } from 'primeng/drawer';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { BioProfile } from 'src/app/services/profile.model';
import { AdminOnboardingRequestsComponent } from 'src/app/pages/admin/onboarding/admin-onboarding-requests.component';
import { AdminSubscriptionsComponent } from 'src/app/pages/admin/subscriptions/admin-subscriptions.component';
import { AdminPlansEntitlementsComponent } from 'src/app/pages/admin/plans/admin-plans-entitlements.component';
import { AdminAuditLogComponent } from 'src/app/pages/admin/audit/admin-audit-log.component';
import { AdminFeatureFlagsComponent } from 'src/app/pages/admin/feature-flags/admin-feature-flags.component';
import Chart from 'chart.js/auto';
import {
  AuditLogRow,
  DashboardEditableRow,
  DashboardRowEditTab,
  PlanRow,
  SubscriptionRow,
  UserRow,
  WorkQueueRequestRow,
} from './dashboard-app-admin.models';
import { DashboardRowEditStore } from './dashboard-row-edit.store';
import { RequestRowEditFormComponent } from './row-edit-forms/request-row-edit-form.component';
import { SubscriptionRowEditFormComponent } from './row-edit-forms/subscription-row-edit-form.component';
import { PlanRowEditFormComponent } from './row-edit-forms/plan-row-edit-form.component';
import { UserRowEditFormComponent } from './row-edit-forms/user-row-edit-form.component';
import { FeatureFlagRowEditFormComponent } from './row-edit-forms/feature-flag-row-edit-form.component';
import { AuditRowEditFormComponent } from './row-edit-forms/audit-row-edit-form.component';
import { AppAdminDashboardService } from './app-admin-dashboard.service';
import { AppAdminDashboardSummary, AuditFeedItem, PagedResponse } from './app-admin-dashboard.api.models';
import { catchError, finalize, of } from 'rxjs';
import { HAS_TRIAL_STATUS, SubscriptionStatus } from './subscription-status.constants';

type DashboardTableTab = 'requests' | 'subscriptions' | 'plans' | 'users' | 'auditLogs';

interface TableState {
  page: number;
  size: number;
  sort: string;
  direction: 'asc' | 'desc';
  filters: { [key: string]: string };
}

@Component({
  selector: 'db-app-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    DrawerModule,
    AdminOnboardingRequestsComponent,
    AdminSubscriptionsComponent,
    AdminPlansEntitlementsComponent,
    AdminAuditLogComponent,
    AdminFeatureFlagsComponent,
    RequestRowEditFormComponent,
    SubscriptionRowEditFormComponent,
    PlanRowEditFormComponent,
    UserRowEditFormComponent,
    FeatureFlagRowEditFormComponent,
    AuditRowEditFormComponent,
  ],
  templateUrl: './dashboard-app-admin.component.html',
  styleUrls: ['./dashboard-app-admin.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardAppAdminComponent implements OnInit, AfterViewInit {
  private readonly userStore = inject(UserStoreService);
  private readonly rowEditStore = inject(DashboardRowEditStore);
  private readonly dashboardService = inject(AppAdminDashboardService);
  private readonly fb = inject(FormBuilder);
  bioProfile: Signal<BioProfile> = this.userStore.getUserBioProfile();

  activeTab: DashboardTableTab = 'requests';
  showFilterPanel: boolean = false;
  showRowEditDrawer: boolean = false;
  activeFilters: { [key: string]: string } = {};
  filterForm: FormGroup = this.fb.group({
    enterprise: [''],
    requestType: [''],
    status: [''],
    search: [''],
    plan: [''],
    planCode: [''],
    login: [''],
    actor: [''],
  });
  Object = Object; // Expose Object to template
  openActionMenuIndex: number | null = null;

  summaryLoading = true;
  summaryLoadFailed = false;
  tableLoading: Record<DashboardTableTab, boolean> = {
    requests: false,
    subscriptions: false,
    plans: false,
    users: false,
    auditLogs: false,
  };
  tableLoadFailed: Record<DashboardTableTab, boolean> = {
    requests: false,
    subscriptions: false,
    plans: false,
    users: false,
    auditLogs: false,
  };

  tableState: Record<DashboardTableTab, TableState> = {
    requests: { page: 0, size: 8, sort: 'createdDate', direction: 'desc', filters: {} },
    subscriptions: { page: 0, size: 8, sort: 'startDate', direction: 'desc', filters: {} },
    plans: { page: 0, size: 8, sort: 'planCode', direction: 'asc', filters: {} },
    users: { page: 0, size: 8, sort: 'login', direction: 'asc', filters: {} },
    auditLogs: { page: 0, size: 8, sort: 'when', direction: 'desc', filters: {} },
  };

  tableTotals: Record<DashboardTableTab, number> = {
    requests: 0,
    subscriptions: 0,
    plans: 0,
    users: 0,
    auditLogs: 0,
  };

  summary: AppAdminDashboardSummary = {
    pendingOnboardingsTotal: 0,
    activeSubscriptions: 0,
    trialSubscriptions: 0,
    plansConfigured: 0,
    totalEnterprises: 0,
    auditEventsLast24h: 0,
    onboardingStatusBreakdown: {
      submitted: 0,
      inReview: 0,
      approved: 0,
      rejected: 0,
    },
    subscriptionStatusBreakdown: {
      trials: 0,
      active: 0,
      padQue: 0,
      canceling: 0,
      canceled: 0,
    },
    recentAuditFeed: [],
  };

  auditFeedItems: AuditFeedItem[] = [];

  private readonly subscriptionPlanNameByCode = new Map<string, string>();
  private readonly subscriptionPlanNameById = new Map<string, string>();
  private readonly allowedPlanSortFields = ['id', 'planCode', 'name', 'price', 'isActive', 'createdDate'];

  requestRows: WorkQueueRequestRow[] = [
    {
      enterprise: 'TechCorp',
      avatarSrc: '/public/images/avatar1.png',
      requestType: 'Internal ERP System',
      requestedBy: 'Mark Allen',
      status: 'Submitted',
      age: '20 mins',
      priority: 'Normal',
      sla: 'OK',
    },
    {
      enterprise: 'BlueWave Inc.',
      avatarSrc: '/public/images/avatar2.png',
      requestType: 'SSO Integration',
      requestedBy: 'Sarah Wong',
      status: 'Submitted',
      age: '3 hours',
      priority: 'Normal',
      sla: 'OK',
    },
    {
      enterprise: 'MedSync',
      avatarSrc: '/public/images/avatar3.png',
      requestType: 'Feature Enablement',
      requestedBy: 'James Ng',
      status: 'Submitted',
      age: '3 hours',
      priority: 'Low',
      sla: 'OK',
    },
    {
      enterprise: 'FinSecure',
      avatarSrc: '/public/images/avatar4.png',
      requestType: 'Data Migration',
      requestedBy: 'John Smith',
      status: 'Submitted',
      age: '3 hours',
      priority: 'Breached',
      sla: 'OK',
    },
    {
      enterprise: 'EduLink',
      avatarSrc: '/public/images/avatar5.png',
      requestType: 'API Integration',
      requestedBy: 'David Lee',
      status: 'Submitted',
      age: '3 hours',
      priority: 'Low',
      sla: 'OK',
    },
    {
      enterprise: 'HealthPlus',
      avatarSrc: '/public/images/avatar6.png',
      requestType: 'Custom Application',
      requestedBy: 'Amanda Chen',
      status: 'Submitted',
      age: '3 hours',
      priority: 'Low',
      sla: 'OK',
    },
    {
      enterprise: 'DataSphere',
      avatarSrc: '/public/images/avatar7.png',
      requestType: 'Entitlements Sync',
      requestedBy: 'Emily Carter',
      status: 'Submitted',
      age: '3 hours',
      priority: 'Low',
      sla: 'OK',
    },
    {
      enterprise: 'CloudNova',
      avatarSrc: '/public/images/avatar8.png',
      requestType: 'Identity Federation',
      requestedBy: 'Nina Patel',
      status: 'Submitted',
      age: '1 hour',
      priority: 'Normal',
      sla: 'OK',
    },
  ];

  filteredRequestRows: WorkQueueRequestRow[] = [...this.requestRows];

  subscriptionRows: SubscriptionRow[] = [];
  hideSeededSubscriptions = true;

  planRows: PlanRow[] = [
    {
      planCode: 'STD-001',
      name: 'Standard',
      price: '$99',
      cycle: 'Monthly',
      active: 'Yes',
    },
    {
      planCode: 'MIG-100',
      name: 'Data Migration',
      price: '$499',
      cycle: 'Yearly',
      active: 'Yes',
    },
    {
      planCode: 'API-220',
      name: 'API Integration',
      price: '$199',
      cycle: 'Monthly',
      active: 'Yes',
    },
    {
      planCode: 'CST-330',
      name: 'Custom Application',
      price: '$999',
      cycle: 'Yearly',
      active: 'Yes',
    },
    {
      planCode: 'ENT-009',
      name: 'Entitlements Sync',
      price: '$149',
      cycle: 'Monthly',
      active: 'Yes',
    },
  ];

  userRows: UserRow[] = [
    {
      login: 'fsmith',
      name: 'Frank Smith',
      email: 'frank.smith@finsecure.com',
      activated: 'Yes',
      roles: 'ROLE_ADMIN',
    },
    {
      login: 'maria',
      name: 'Maria Diaz',
      email: 'maria@edulink.com',
      activated: 'Yes',
      roles: 'ROLE_USER',
    },
    {
      login: 'harry',
      name: 'Harry Nguyen',
      email: 'harry@healthplus.com',
      activated: 'No',
      roles: 'ROLE_MANAGER',
    },
    {
      login: 'jlee',
      name: 'Jin Lee',
      email: 'jin.lee@datasphere.com',
      activated: 'Yes',
      roles: 'ROLE_ADMIN',
    },
  ];

  auditLogRows: AuditLogRow[] = [
    {
      when: '2026-02-16T10:23:00Z',
      actor: 'edulink-admin',
      action: 'LOGIN_SUCCESS',
      entity: 'User',
      entityId: '1021',
    },
    {
      when: '2026-02-15T13:06:00Z',
      actor: 'system',
      action: 'MIGRATION_EXECUTED',
      entity: 'Subscription',
      entityId: 'SUB-922',
    },
    {
      when: '2026-02-14T08:48:00Z',
      actor: 'healthplus-admin',
      action: 'PLAN_UPDATED',
      entity: 'Plan',
      entityId: 'PLN-44',
    },
    {
      when: '2026-02-13T16:12:00Z',
      actor: 'datasphere-admin',
      action: 'ENTITLEMENT_SYNC',
      entity: 'Enterprise',
      entityId: 'ENT-11',
    },
  ];

  constructor() {
    effect(() => {
      const tab = this.rowEditStore.editingTab();
      if (tab === null) {
        this.showRowEditDrawer = false;
      }
    });

    effect(() => {
      const saved = this.rowEditStore.savedRow();
      if (!saved) {
        return;
      }

      const mergedRowData = this.mergeSavedRowData(saved.tab, saved.rowIndex, saved.rowData);
      this.persistEditedRow(saved.tab, saved.rowIndex, mergedRowData);
    });
  }

  ngOnInit(): void {
    this.loadSummaryWidget();
    this.loadOnboardings();
    this.loadSubscriptionPlanLookup();
  }

  get onboardingBreakdown() {
    return this.summary.onboardingStatusBreakdown;
  }

  get subscriptionBreakdown() {
    return this.summary.subscriptionStatusBreakdown;
  }

  get hasOnboardingBreakdown(): boolean {
    return !!this.summary.onboardingStatusBreakdown;
  }

  get hasOnboardingChartData(): boolean {
    const breakdown = this.summary.onboardingStatusBreakdown ?? {};
    if (!breakdown) {
      return false;
    }

    const total =
      (breakdown.submitted ?? 0) +
      (breakdown.inReview ?? 0) +
      (breakdown.approved ?? 0) +
      (breakdown.rejected ?? 0);

    return total > 0;
  }

  get hasSubscriptionBreakdown(): boolean {
    return !!this.summary.subscriptionStatusBreakdown;
  }

  get showTrialWidgets(): boolean {
    return HAS_TRIAL_STATUS;
  }

  get hasRecentAuditFeed(): boolean {
    return Array.isArray(this.summary.recentAuditFeed);
  }

  get requestTablePlaceholders(): number[] {
    const targetRowCount = 8;
    const missingRows = Math.max(0, targetRowCount - this.filteredRequestRows.length);
    return Array.from({ length: missingRows }, (_, index) => index);
  }

  getTablePlaceholders(currentRowCount: number, targetRowCount: number = 8): number[] {
    const missingRows = Math.max(0, targetRowCount - currentRowCount);
    return Array.from({ length: missingRows }, (_, index) => index);
  }

  isRequestsTabActive(): boolean {
    return this.activeTab === 'requests';
  }

  selectTab(tab: DashboardTableTab): void {
    this.activeTab = tab;
    this.activeFilters = { ...this.tableState[tab].filters };
    this.filterForm.patchValue(this.activeFilters, { emitEvent: false });
    this.loadActiveTabData();
  }

  getPriorityClass(priority: string): string {
    const normalizedPriority = priority.toLowerCase();
    return normalizedPriority === 'breached' ? 'breached' : normalizedPriority;
  }

  getStatusClass(status: string): string {
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus === 'in progress') {
      return 'in-progress';
    }

    if (normalizedStatus === 'completed') {
      return 'completed';
    }

    return 'submitted';
  }

  getSubscriberLabel(row: SubscriptionRow): string {
    if ((row.subscriberType || '').toUpperCase() === 'ENTERPRISE') {
      const enterpriseLabel = this.toText(row.subscriberDisplayName);
      if (enterpriseLabel) {
        return enterpriseLabel;
      }

      const enterpriseId = this.toText(row.subscriberId);
      return enterpriseId ? `Enterprise #${enterpriseId}` : '—';
    }

    return this.toText(row.subscriberId) || '—';
  }

  getSubscriberSecondary(row: SubscriptionRow): string {
    if ((row.subscriberType || '').toUpperCase() === 'ENTERPRISE') {
      return this.toText(row.subscriberId) || '—';
    }

    return 'Individual';
  }

  getPlanLabel(row: SubscriptionRow): string {
    return this.toText(row.planDisplayName) || this.toText(row.planCode) || this.toText(row.planId) || '—';
  }

  getPlanSecondary(row: SubscriptionRow): string {
    if (this.toText(row.planDisplayName)) {
      return this.toText(row.planCode) || '—';
    }

    return '';
  }

  get visibleSubscriptionRows(): SubscriptionRow[] {
    if (!this.hideSeededSubscriptions) {
      return this.subscriptionRows;
    }

    return this.subscriptionRows.filter((row) => !row.seeded);
  }

  formatDate(isoString?: string): string {
    const value = this.toText(isoString);
    if (!value) {
      return '—';
    }

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return '—';
    }

    return parsedDate.toLocaleString(undefined, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  statusClass(status?: string): string {
    switch ((status || '').toUpperCase()) {
      case SubscriptionStatus.ACTIVE:
        return 'text-bg-primary';
      case SubscriptionStatus.TRIALING:
        return 'subscription-status-trial';
      case SubscriptionStatus.PAST_DUE:
        return 'subscription-status-past-due';
      case SubscriptionStatus.CANCELED:
        return 'text-bg-secondary';
      case SubscriptionStatus.EXPIRED:
        return 'text-bg-secondary';
      case SubscriptionStatus.SUSPENDED:
        return 'subscription-status-canceling';
      default:
        return 'text-bg-light text-dark';
    }
  }

  statusLabel(status?: string): string {
    const normalized = this.toText(status);
    if (!normalized) {
      return '—';
    }

    if (normalized.toUpperCase() === SubscriptionStatus.TRIALING) {
      return 'Trial';
    }

    return normalized.toUpperCase();
  }

  subscriberTypeClass(subscriberType?: string): string {
    return (subscriberType || '').toUpperCase() === 'ENTERPRISE' ? 'text-bg-primary' : 'text-bg-secondary';
  }

  displayOrDash(value: unknown): string {
    return this.toText(value) || '—';
  }

  boolBadgeClass(value: boolean | undefined, variant: 'success' | 'danger' = 'success'): string {
    if (value === undefined || value === null) {
      return 'text-bg-light text-dark';
    }

    if (value) {
      return variant === 'danger' ? 'text-bg-danger' : 'text-bg-success';
    }

    return 'text-bg-secondary';
  }

  boolBadgeLabel(value: boolean | undefined): string {
    if (value === undefined || value === null) {
      return '—';
    }

    return value ? 'Yes' : 'No';
  }

  onEditSubscriptionRow(event: Event, row: SubscriptionRow): void {
    event.stopPropagation();
    const rowIndex = this.subscriptionRows.findIndex((item) => (item.id && row.id ? item.id === row.id : item === row));
    if (rowIndex >= 0) {
      this.openRowEditor('subscriptions', rowIndex, this.subscriptionRows[rowIndex]);
    }
  }

  toggleActionMenu(event: Event, rowIndex: number): void {
    event.stopPropagation();
    this.openActionMenuIndex = this.openActionMenuIndex === rowIndex ? null : rowIndex;
  }

  closeActionMenu(): void {
    this.openActionMenuIndex = null;
  }

  onEditRow(event: Event, row: WorkQueueRequestRow): void {
    event.stopPropagation();
    const rowIndex = this.requestRows.findIndex((item) => this.isSameRow(item, row));
    if (rowIndex >= 0) {
      this.openRowEditor('requests', rowIndex, this.requestRows[rowIndex]);
    }
    this.openActionMenuIndex = null;
  }

  onEditTabRow(event: Event, tab: DashboardRowEditTab, rowIndex: number): void {
    event.stopPropagation();

    switch (tab) {
      case 'subscriptions':
        this.openRowEditor(tab, rowIndex, this.subscriptionRows[rowIndex]);
        break;
      case 'plans':
        this.openRowEditor(tab, rowIndex, this.planRows[rowIndex]);
        break;
      case 'users':
        this.openRowEditor(tab, rowIndex, this.userRows[rowIndex]);
        break;
      case 'auditLogs':
        this.openRowEditor(tab, rowIndex, this.auditLogRows[rowIndex]);
        break;
      default:
        break;
    }
  }

  getCurrentEditTab(): DashboardRowEditTab | null {
    return this.rowEditStore.editingTab();
  }

  getEditDrawerTitle(): string {
    const tab = this.getCurrentEditTab();
    switch (tab) {
      case 'requests':
        return 'Edit Onboarding Request';
      case 'subscriptions':
        return 'Edit Subscription';
      case 'plans':
        return 'Edit Plan';
      case 'users':
        return 'Edit User';
      case 'auditLogs':
        return 'Edit Audit Record';
      default:
        return 'Edit Row';
    }
  }

  closeRowEditDrawer(): void {
    this.showRowEditDrawer = false;
    this.rowEditStore.closeEditing();
  }

  onDeleteRow(event: Event, row: WorkQueueRequestRow): void {
    event.stopPropagation();
    this.requestRows = this.requestRows.filter((item) => !this.isSameRow(item, row));
    this.filteredRequestRows = [...this.requestRows];
    this.openActionMenuIndex = null;
  }

  onUpdateRowStatus(event: Event, row: WorkQueueRequestRow, status: string): void {
    event.stopPropagation();
    this.requestRows = this.requestRows.map((item) =>
      this.isSameRow(item, row)
        ? {
            ...item,
            status,
          }
        : item,
    );
    this.filteredRequestRows = [...this.requestRows];
    this.openActionMenuIndex = null;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeActionMenu();
  }

  @ViewChild('insightsPieChart') insightsPieChartRef!: ElementRef<HTMLCanvasElement>;
  insightsPieChartInstance: Chart | null = null;

  toggleFilterPanel() {
    if (!this.showFilterPanel) {
      this.filterForm.patchValue(this.activeFilters, { emitEvent: false });
    }

    this.showFilterPanel = !this.showFilterPanel;
  }

  closeFilterPanel() {
    this.filterForm.patchValue(this.activeFilters, { emitEvent: false });
    this.showFilterPanel = false;
  }

  private openRowEditor(tab: DashboardRowEditTab, rowIndex: number, rowData: WorkQueueRequestRow | SubscriptionRow | PlanRow | UserRow | AuditLogRow): void {
    this.rowEditStore.startEditing(tab, rowIndex, rowData);
    this.showRowEditDrawer = true;
  }

  applyFilters() {
    this.activeFilters = this.normalizeFilters(this.filterForm.getRawValue() as { [key: string]: string });
    this.tableState[this.activeTab].filters = { ...this.activeFilters };
    this.tableState[this.activeTab].page = 0;
    this.loadActiveTabData();
    this.showFilterPanel = false;
  }

  updateFilter(filterKey: string, value: string) {
    if (!value || value.trim() === '') {
      delete this.activeFilters[filterKey];
    } else {
      this.activeFilters[filterKey] = value;
    }
  }

  clearFilter(filterKey: string) {
    delete this.activeFilters[filterKey];
    this.filterForm.patchValue({ [filterKey]: '' }, { emitEvent: false });
    this.tableState[this.activeTab].filters = { ...this.activeFilters };
    this.tableState[this.activeTab].page = 0;
    this.loadActiveTabData();
  }

  clearAllFilters() {
    this.activeFilters = {};
    this.filterForm.reset(
      {
        enterprise: '',
        requestType: '',
        status: '',
        search: '',
        plan: '',
        planCode: '',
        login: '',
        actor: '',
      },
      { emitEvent: false },
    );
    this.tableState[this.activeTab].filters = {};
    this.tableState[this.activeTab].page = 0;
    this.loadActiveTabData();
  }

  getCurrentPage(tab: DashboardTableTab): number {
    return this.tableState[tab].page + 1;
  }

  getTotalPages(tab: DashboardTableTab): number {
    const total = this.tableTotals[tab] || 0;
    const size = this.tableState[tab].size;
    return Math.max(1, Math.ceil(total / Math.max(1, size)));
  }

  canPrev(tab: DashboardTableTab): boolean {
    return this.tableState[tab].page > 0;
  }

  canNext(tab: DashboardTableTab): boolean {
    return this.getCurrentPage(tab) < this.getTotalPages(tab);
  }

  prevPage(tab: DashboardTableTab): void {
    if (!this.canPrev(tab)) return;
    this.tableState[tab].page -= 1;
    this.loadTabData(tab);
  }

  nextPage(tab: DashboardTableTab): void {
    if (!this.canNext(tab)) return;
    this.tableState[tab].page += 1;
    this.loadTabData(tab);
  }

  onSort(tab: DashboardTableTab, sortField: string): void {
    const state = this.tableState[tab];
    if (state.sort === sortField) {
      state.direction = state.direction === 'asc' ? 'desc' : 'asc';
    } else {
      state.sort = sortField;
      state.direction = 'asc';
    }
    state.page = 0;
    this.loadTabData(tab);
  }

  getSortClass(tab: DashboardTableTab, sortField: string): string {
    const state = this.tableState[tab];
    if (state.sort !== sortField) return '';
    return state.direction === 'asc' ? 'sort-asc' : 'sort-desc';
  }

  isActionRouteAvailable(_tab: DashboardTableTab): boolean {
    return true;
  }

  private persistEditedRow(tab: DashboardRowEditTab, rowIndex: number, rowData: DashboardEditableRow): void {
    this.updateRowOnServer(tab, rowData)
      .pipe(
        catchError(() => {
          this.applyLocalRowUpdate(tab, rowIndex, rowData);
          return of(null);
        }),
        finalize(() => {
          this.showRowEditDrawer = false;
          this.rowEditStore.clearSavedRow();
          this.rowEditStore.closeEditing();

          if (this.isTableTab(tab)) {
            this.loadTabData(tab);
          }
        }),
      )
      .subscribe();
  }

  private mergeSavedRowData(tab: DashboardRowEditTab, rowIndex: number, savedRowData: DashboardEditableRow): DashboardEditableRow {
    switch (tab) {
      case 'requests':
        return { ...(this.requestRows[rowIndex] || {}), ...(savedRowData as WorkQueueRequestRow) } as WorkQueueRequestRow;
      case 'subscriptions':
        return { ...(this.subscriptionRows[rowIndex] || {}), ...(savedRowData as SubscriptionRow) } as SubscriptionRow;
      case 'plans':
        return { ...(this.planRows[rowIndex] || {}), ...(savedRowData as PlanRow) } as PlanRow;
      case 'users':
        return { ...(this.userRows[rowIndex] || {}), ...(savedRowData as UserRow) } as UserRow;
      case 'auditLogs':
        return { ...(this.auditLogRows[rowIndex] || {}), ...(savedRowData as AuditLogRow) } as AuditLogRow;
      default:
        return savedRowData;
    }
  }

  private updateRowOnServer(tab: DashboardRowEditTab, rowData: DashboardEditableRow) {
    switch (tab) {
      case 'requests': {
        const row = rowData as WorkQueueRequestRow;
        if (!row.id) {
          return of(null);
        }

        return this.dashboardService.updateOnboarding(row.id, {
          id: row.id,
          enterprise: row.enterprise,
          requestType: row.requestType,
          requestedBy: row.requestedBy,
          status: row.status,
          age: row.age,
          priority: row.priority,
          sla: row.sla,
        });
      }
      case 'subscriptions': {
        const row = rowData as SubscriptionRow;
        if (!row.id) {
          return of(null);
        }

        return this.dashboardService.updateSubscription(row.id, {
          id: row.id,
          subscriberType: row.subscriberType,
          subscriberId: row.subscriberId,
          planId: row.planId,
          planCode: row.planCode || row.plan,
          status: row.status,
          startDate: row.startDate,
          nextBillingDate: row.nextBilling || row.nextBillingDate,
          trialEndDate: row.trialEndDate,
          cancelAtPeriodEnd: row.cancelAtPeriodEnd,
          autoRenew: row.autoRenew,
        });
      }
      case 'plans': {
        const row = rowData as PlanRow;
        if (!row.id) {
          return of(null);
        }

        const parsedPrice = Number(String(row.price ?? '').replace(/[^0-9.-]/g, ''));

        return this.dashboardService.updatePlan(row.id, {
          id: row.id,
          planCode: row.planCode,
          code: row.planCode,
          name: row.name,
          price: Number.isFinite(parsedPrice) ? parsedPrice : undefined,
          billingCycle: row.cycle,
          isActive: (row.active || '').toLowerCase() === 'yes',
        });
      }
      case 'users': {
        const row = rowData as UserRow;
        const userId = row.id || row.login;
        if (!userId) {
          return of(null);
        }

        return this.dashboardService.updateUser(userId, {
          id: row.id,
          login: row.login,
          name: row.name,
          email: row.email,
          activated: (row.activated || '').toLowerCase() === 'yes',
          roles: row.roles,
        });
      }
      case 'auditLogs': {
        const row = rowData as AuditLogRow;
        if (!row.id) {
          return of(null);
        }

        return this.dashboardService.updateAuditLog(row.id, {
          id: row.id,
          when: row.when,
          actor: row.actor,
          action: row.action,
          entity: row.entity,
          entityId: row.entityId,
        });
      }
      default:
        return of(null);
    }
  }

  private applyLocalRowUpdate(tab: DashboardRowEditTab, rowIndex: number, rowData: DashboardEditableRow): void {
    switch (tab) {
      case 'requests':
        this.requestRows = this.requestRows.map((row, index) => (index === rowIndex ? { ...(rowData as WorkQueueRequestRow) } : row));
        this.filteredRequestRows = [...this.requestRows];
        break;
      case 'subscriptions':
        this.subscriptionRows = this.subscriptionRows.map((row, index) => (index === rowIndex ? { ...(rowData as SubscriptionRow) } : row));
        break;
      case 'plans':
        this.planRows = this.planRows.map((row, index) => (index === rowIndex ? { ...(rowData as PlanRow) } : row));
        break;
      case 'users':
        this.userRows = this.userRows.map((row, index) => (index === rowIndex ? { ...(rowData as UserRow) } : row));
        break;
      case 'auditLogs':
        this.auditLogRows = this.auditLogRows.map((row, index) => (index === rowIndex ? { ...(rowData as AuditLogRow) } : row));
        break;
      default:
        break;
    }
  }

  private isTableTab(tab: DashboardRowEditTab): tab is DashboardTableTab {
    return tab === 'requests' || tab === 'subscriptions' || tab === 'plans' || tab === 'users' || tab === 'auditLogs';
  }

  private normalizeFilters(filters: { [key: string]: string }) {
    return Object.entries(filters).reduce((acc, [key, value]) => {
      const normalized = (value ?? '').toString().trim();
      if (normalized) {
        acc[key] = normalized;
      }
      return acc;
    }, {} as { [key: string]: string });
  }

  private loadActiveTabData(): void {
    this.loadTabData(this.activeTab);
  }

  private loadTabData(tab: DashboardTableTab): void {
    switch (tab) {
      case 'requests':
        this.loadOnboardings();
        break;
      case 'subscriptions':
        this.loadSubscriptions();
        break;
      case 'plans':
        this.loadPlans();
        break;
      case 'users':
        this.loadUsers();
        break;
      case 'auditLogs':
        this.loadAuditLogs();
        break;
      default:
        break;
    }
  }

  private buildRequestParams(tab: DashboardTableTab): { [key: string]: unknown } {
    const state = this.tableState[tab];
    const apiSortField = this.getApiSortField(tab, state.sort);
    return {
      page: state.page,
      size: state.size,
      sort: `${apiSortField},${state.direction}`,
      ...state.filters,
    };
  }

  private getApiSortField(tab: DashboardTableTab, uiSortField: string): string {
    const sortFieldMap: Partial<Record<DashboardTableTab, Record<string, string>>> = {
      subscriptions: {
        subscriber: 'subscriberId',
        plan: 'planCode',
        nextBilling: 'nextBillingDate',
      },
      plans: {
        planCode: 'planCode',
        active: 'isActive',
      },
    };

    if (tab === 'plans') {
      const mappedField = sortFieldMap[tab]?.[uiSortField] || uiSortField;
      const allowedSortFields = new Set(this.allowedPlanSortFields);
      return allowedSortFields.has(mappedField) ? mappedField : 'id';
    }

    return sortFieldMap[tab]?.[uiSortField] || uiSortField;
  }

  private loadSummaryWidget(): void {
    this.summaryLoading = true;
    this.summaryLoadFailed = false;

    this.dashboardService
      .getSummary()
      .pipe(
        catchError(() => {
          this.summaryLoadFailed = true;
          return of(this.summary);
        }),
        finalize(() => {
          this.summaryLoading = false;
        }),
      )
      .subscribe((data) => {
        this.summary = {
          ...this.summary,
          ...data,
        };
        this.auditFeedItems = (this.summary.recentAuditFeed || []).map((item) => ({
          ...item,
          userName: item.userName || item.actor || 'System',
          description: item.description || item.message || item.eventType || 'Audit event',
          timestamp: item.timestamp || item.createdAt || '—',
        }));
        this.renderInsightsPieChart();
      });
  }

  private loadOnboardings(): void {
    this.tableLoading.requests = true;
    this.tableLoadFailed.requests = false;

    this.dashboardService
      .getOnboardings(this.buildRequestParams('requests'))
      .pipe(
        catchError(() => {
          this.tableLoadFailed.requests = true;
          return of(this.emptyPagedResponse<any>());
        }),
        finalize(() => {
          this.tableLoading.requests = false;
        }),
      )
      .subscribe((res) => {
        this.tableTotals.requests = res.totalElements || 0;
        this.requestRows = (res.items || []).map((row: any) => ({
          id: row.id,
          enterprise: row.enterprise || row.enterpriseName || '—',
          avatarSrc: row.avatarSrc || '/assets/avatar-default.png',
          requestType: row.requestType || row.type || '—',
          requestedBy: row.requestedBy || row.requestor || '—',
          status: row.status || 'Submitted',
          age: row.age || row.ageText || '—',
          priority: row.priority || 'Normal',
          sla: row.sla || 'OK',
        }));
        this.filteredRequestRows = [...this.requestRows];
      });
  }

  private loadSubscriptions(): void {
    this.tableLoading.subscriptions = true;
    this.tableLoadFailed.subscriptions = false;

    this.dashboardService
      .getSubscriptions(this.buildRequestParams('subscriptions'))
      .pipe(
        catchError(() => {
          this.tableLoadFailed.subscriptions = true;
          return of(this.emptyPagedResponse<any>());
        }),
        finalize(() => {
          this.tableLoading.subscriptions = false;
        }),
      )
      .subscribe((res) => {
        this.tableTotals.subscriptions = res.totalElements || 0;
        this.subscriptionRows = (res.items || []).map((row: any) => this.toSubscriptionRow(row));
      });
  }

  private loadSubscriptionPlanLookup(): void {
    this.dashboardService
      .getPlans({
        page: 0,
        size: 500,
        sort: 'planCode,asc',
        active: true,
      })
      .pipe(catchError(() => of(this.emptyPagedResponse<any>())))
      .subscribe((res) => {
        this.subscriptionPlanNameByCode.clear();
        this.subscriptionPlanNameById.clear();

        (res.items || []).forEach((item: any) => {
          const planName = this.toText(item.name) || this.toText(item.planName);
          if (!planName) {
            return;
          }

          const planCode = this.toText(item.code) || this.toText(item.planCode);
          const planId = this.toText(item.id) || this.toText(item.planId);

          if (planCode) {
            this.subscriptionPlanNameByCode.set(planCode, planName);
          }

          if (planId) {
            this.subscriptionPlanNameById.set(planId, planName);
          }
        });

        if (this.subscriptionRows.length > 0) {
          this.subscriptionRows = this.subscriptionRows.map((row) => ({
            ...row,
            planDisplayName: this.resolvePlanDisplayName(row.planCode, row.planId),
          }));
        }
      });
  }

  private toSubscriptionRow(row: any): SubscriptionRow {
    const planCode = this.toText(row.planCode) || this.toText(row.code) || '';
    const planId = this.toText(row.planId) || this.toText(row.subscriptionPlanId) || '';

    const mapped: SubscriptionRow = {
      id: this.toText(row.id) || '',
      seeded: this.resolveSeeded(row),
      createdBy: this.toText(row.createdBy) || '',
      providerSubscriptionId: this.toText(row.providerSubscriptionId) || '',
      subscriberType: this.toText(row.subscriberType) || '',
      subscriberId: this.toText(row.subscriberId) || '',
      subscriberDisplayName: this.toText(row.subscriberDisplayName) || this.toText(row.enterpriseName) || '',
      planId,
      planCode,
      planDisplayName: this.resolvePlanDisplayName(planCode, planId),
      status: this.toText(row.status) || '—',
      startDate: this.toText(row.startDate) || '',
      nextBillingDate: this.toText(row.nextBillingDate) || '',
      trialEndDate: this.toText(row.trialEndDate) || '',
      cancelAtPeriodEnd: !!row.cancelAtPeriodEnd,
      autoRenew: row.autoRenew === undefined || row.autoRenew === null ? undefined : !!row.autoRenew,
      createdDate: this.toText(row.createdDate) || '',
      lastModifiedDate: this.toText(row.lastModifiedDate) || '',
      enterprise: this.toText(row.subscriberId) || '—',
      plan: this.toText(row.planCode) || this.toText(row.planId) || '—',
      nextBilling: this.toText(row.nextBillingDate) || '',
    };

    return mapped;
  }

  private resolveSeeded(row: any): boolean {
    if (typeof row?.seeded === 'boolean') {
      return row.seeded;
    }

    const createdBy = (this.toText(row?.createdBy) || '').toLowerCase();
    const providerSubscriptionId = this.toText(row?.providerSubscriptionId);
    return createdBy === 'system' && !providerSubscriptionId;
  }

  private resolvePlanDisplayName(planCode?: string, planId?: string): string {
    const normalizedCode = this.toText(planCode);
    if (normalizedCode && this.subscriptionPlanNameByCode.has(normalizedCode)) {
      return this.subscriptionPlanNameByCode.get(normalizedCode) || '';
    }

    const normalizedId = this.toText(planId);
    if (normalizedId && this.subscriptionPlanNameById.has(normalizedId)) {
      return this.subscriptionPlanNameById.get(normalizedId) || '';
    }

    return '';
  }

  private toText(value: unknown): string | null {
    if (value === null || value === undefined) {
      return null;
    }

    const normalized = String(value).trim();
    return normalized ? normalized : null;
  }

  private loadPlans(): void {
    this.tableLoading.plans = true;
    this.tableLoadFailed.plans = false;

    this.dashboardService
      .getPlans(this.buildRequestParams('plans'))
      .pipe(
        catchError(() => {
          this.tableLoadFailed.plans = true;
          return of(this.emptyPagedResponse<any>());
        }),
        finalize(() => {
          this.tableLoading.plans = false;
        }),
      )
      .subscribe((res) => {
        this.tableTotals.plans = res.totalElements || 0;
        this.planRows = (res.items || []).map((row: any) => ({
          id: row.id,
          planCode: row.planCode || row.code || '—',
          name: row.name || row.planName || '—',
          price: row.price ? `${row.price}` : '—',
          cycle: row.cycle || row.billingCycle || '—',
          active: row.active === false ? 'No' : 'Yes',
        }));
      });
  }

  private loadUsers(): void {
    this.tableLoading.users = true;
    this.tableLoadFailed.users = false;

    this.dashboardService
      .getUsers(this.buildRequestParams('users'))
      .pipe(
        catchError(() => {
          this.tableLoadFailed.users = true;
          return of(this.emptyPagedResponse<any>());
        }),
        finalize(() => {
          this.tableLoading.users = false;
        }),
      )
      .subscribe((res) => {
        this.tableTotals.users = res.totalElements || 0;
        this.userRows = (res.items || []).map((row: any) => ({
          id: row.id,
          login: row.login || row.username || '—',
          name: row.name || [row.firstName, row.lastName].filter(Boolean).join(' ') || '—',
          email: row.email || '—',
          activated: row.activated === false ? 'No' : 'Yes',
          roles: Array.isArray(row.roles) ? row.roles.join(', ') : row.roles || '—',
        }));
      });
  }

  private loadAuditLogs(): void {
    this.tableLoading.auditLogs = true;
    this.tableLoadFailed.auditLogs = false;

    this.dashboardService
      .getAuditLogs(this.buildRequestParams('auditLogs'))
      .pipe(
        catchError(() => {
          this.tableLoadFailed.auditLogs = true;
          return of(this.emptyPagedResponse<any>());
        }),
        finalize(() => {
          this.tableLoading.auditLogs = false;
        }),
      )
      .subscribe((res) => {
        this.tableTotals.auditLogs = res.totalElements || 0;
        this.auditLogRows = (res.items || []).map((row: any) => ({
          id: row.id,
          when: row.when || row.timestamp || row.createdDate || '—',
          actor: row.actor || row.userName || '—',
          action: row.action || row.eventType || '—',
          entity: row.entity || row.entityName || '—',
          entityId: row.entityId || row.id || '—',
        }));
      });
  }

  private emptyPagedResponse<T>(): PagedResponse<T> {
    return {
      items: [],
      page: 0,
      size: 0,
      totalElements: 0,
      totalPages: 0,
    };
  }

  private isSameRow(a: WorkQueueRequestRow, b: WorkQueueRequestRow): boolean {
    return a.enterprise === b.enterprise && a.requestType === b.requestType && a.requestedBy === b.requestedBy;
  }

  ngAfterViewInit() {
    this.renderInsightsPieChart();
  }

  renderInsightsPieChart() {
    if (this.insightsPieChartInstance) {
      this.insightsPieChartInstance.destroy();
    }
    if (!this.insightsPieChartRef) return;
    if (!this.hasOnboardingChartData) return;

    const breakdown = this.summary.onboardingStatusBreakdown ?? {};
    const ctx = this.insightsPieChartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    this.insightsPieChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Submitted', 'In Review', 'Approved', 'Rejected'],
        datasets: [
          {
            data: [
              breakdown.submitted ?? 0,
              breakdown.inReview ?? 0,
              breakdown.approved ?? 0,
              breakdown.rejected ?? 0,
            ],
            backgroundColor: [
              '#5B6BFF', // Submitted
              '#FFD600', // In Review
              '#00C853', // Approved
              '#FF5252', // Rejected
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
}



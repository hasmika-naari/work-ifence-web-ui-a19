import { CommonModule } from '@angular/common';
import { Component, Signal, inject, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation, HostListener, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  AuditRow,
  DashboardRowEditTab,
  FeatureFlagRow,
  PlanRow,
  SubscriptionRow,
  WorkQueueRequestRow,
} from './dashboard-app-admin.models';
import { DashboardRowEditStore } from './dashboard-row-edit.store';
import { RequestRowEditFormComponent } from './row-edit-forms/request-row-edit-form.component';
import { SubscriptionRowEditFormComponent } from './row-edit-forms/subscription-row-edit-form.component';
import { PlanRowEditFormComponent } from './row-edit-forms/plan-row-edit-form.component';
import { FeatureFlagRowEditFormComponent } from './row-edit-forms/feature-flag-row-edit-form.component';
import { AuditRowEditFormComponent } from './row-edit-forms/audit-row-edit-form.component';

@Component({
  selector: 'db-app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    FeatureFlagRowEditFormComponent,
    AuditRowEditFormComponent,
  ],
  templateUrl: './dashboard-app-admin.component.html',
  styleUrls: ['./dashboard-app-admin.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardAppAdminComponent implements AfterViewInit {
  private readonly userStore = inject(UserStoreService);
  private readonly rowEditStore = inject(DashboardRowEditStore);
  bioProfile: Signal<BioProfile> = this.userStore.getUserBioProfile();

  activeTab: string = 'requests';
  showFilterPanel: boolean = false;
  showRowEditDrawer: boolean = false;
  activeFilters: { [key: string]: string } = {};
  draftFilters: { [key: string]: string } = {};
  Object = Object; // Expose Object to template
  openActionMenuIndex: number | null = null;

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

  subscriptionRows: SubscriptionRow[] = [
    {
      enterprise: 'TechCorp',
      subscriptionType: 'Premium',
      status: 'Active',
      startDate: '2026-01-01',
      endDate: '2027-01-01',
    },
    {
      enterprise: 'BlueWave Inc.',
      subscriptionType: 'Standard',
      status: 'Active',
      startDate: '2026-02-01',
      endDate: '2027-02-01',
    },
    {
      enterprise: 'MedSync',
      subscriptionType: 'Feature Enablement',
      status: 'Active',
      startDate: '2026-03-01',
      endDate: '2027-03-01',
    },
    {
      enterprise: 'FinSecure',
      subscriptionType: 'Data Migration',
      status: 'Active',
      startDate: '2026-04-01',
      endDate: '2027-04-01',
    },
    {
      enterprise: 'EduLink',
      subscriptionType: 'API Integration',
      status: 'Active',
      startDate: '2026-05-01',
      endDate: '2027-05-01',
    },
    {
      enterprise: 'HealthPlus',
      subscriptionType: 'Custom Application',
      status: 'Active',
      startDate: '2026-06-01',
      endDate: '2027-06-01',
    },
    {
      enterprise: 'DataSphere',
      subscriptionType: 'Entitlements Sync',
      status: 'Active',
      startDate: '2026-07-01',
      endDate: '2027-07-01',
    },
  ];

  planRows: PlanRow[] = [
    {
      enterprise: 'BlueWave Inc.',
      planType: 'Standard',
      status: 'Active',
      startDate: '2026-02-01',
      endDate: '2027-02-01',
    },
    {
      enterprise: 'FinSecure',
      planType: 'Data Migration',
      status: 'Active',
      startDate: '2026-04-01',
      endDate: '2027-04-01',
    },
    {
      enterprise: 'EduLink',
      planType: 'API Integration',
      status: 'Active',
      startDate: '2026-05-01',
      endDate: '2027-05-01',
    },
    {
      enterprise: 'HealthPlus',
      planType: 'Custom Application',
      status: 'Active',
      startDate: '2026-06-01',
      endDate: '2027-06-01',
    },
    {
      enterprise: 'DataSphere',
      planType: 'Entitlements Sync',
      status: 'Active',
      startDate: '2026-07-01',
      endDate: '2027-07-01',
    },
  ];

  featureFlagRows: FeatureFlagRow[] = [
    {
      enterprise: 'FinSecure',
      flagName: 'BetaAccess',
      status: 'Enabled',
      enabled: 'Yes',
    },
    {
      enterprise: 'EduLink',
      flagName: 'API Integration',
      status: 'Enabled',
      enabled: 'Yes',
    },
    {
      enterprise: 'HealthPlus',
      flagName: 'Custom Application',
      status: 'Enabled',
      enabled: 'Yes',
    },
    {
      enterprise: 'DataSphere',
      flagName: 'Entitlements Sync',
      status: 'Enabled',
      enabled: 'Yes',
    },
  ];

  auditRows: AuditRow[] = [
    {
      enterprise: 'EduLink',
      eventType: 'Login',
      status: 'Success',
      date: '2026-02-16',
    },
    {
      enterprise: 'FinSecure',
      eventType: 'Data Migration',
      status: 'Success',
      date: '2026-02-15',
    },
    {
      enterprise: 'HealthPlus',
      eventType: 'Custom Application',
      status: 'Success',
      date: '2026-02-14',
    },
    {
      enterprise: 'DataSphere',
      eventType: 'Entitlements Sync',
      status: 'Success',
      date: '2026-02-13',
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

      switch (saved.tab) {
        case 'requests':
          this.requestRows = this.requestRows.map((row, index) => (index === saved.rowIndex ? { ...(saved.rowData as WorkQueueRequestRow) } : row));
          this.applyRequestFilters();
          break;
        case 'subscriptions':
          this.subscriptionRows = this.subscriptionRows.map((row, index) => (index === saved.rowIndex ? { ...(saved.rowData as SubscriptionRow) } : row));
          break;
        case 'plans':
          this.planRows = this.planRows.map((row, index) => (index === saved.rowIndex ? { ...(saved.rowData as PlanRow) } : row));
          break;
        case 'featureFlags':
          this.featureFlagRows = this.featureFlagRows.map((row, index) => (index === saved.rowIndex ? { ...(saved.rowData as FeatureFlagRow) } : row));
          break;
        case 'audit':
          this.auditRows = this.auditRows.map((row, index) => (index === saved.rowIndex ? { ...(saved.rowData as AuditRow) } : row));
          break;
      }

      this.showRowEditDrawer = false;
      this.rowEditStore.clearSavedRow();
      this.rowEditStore.closeEditing();
    });
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
      case 'featureFlags':
        this.openRowEditor(tab, rowIndex, this.featureFlagRows[rowIndex]);
        break;
      case 'audit':
        this.openRowEditor(tab, rowIndex, this.auditRows[rowIndex]);
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
      case 'featureFlags':
        return 'Edit Feature Flag';
      case 'audit':
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
    this.applyRequestFilters();
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
    this.applyRequestFilters();
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
      this.draftFilters = { ...this.activeFilters };
    }

    this.showFilterPanel = !this.showFilterPanel;
  }

  closeFilterPanel() {
    this.draftFilters = { ...this.activeFilters };
    this.showFilterPanel = false;
  }

  private openRowEditor(tab: DashboardRowEditTab, rowIndex: number, rowData: WorkQueueRequestRow | SubscriptionRow | PlanRow | FeatureFlagRow | AuditRow): void {
    this.rowEditStore.startEditing(tab, rowIndex, rowData);
    this.showRowEditDrawer = true;
  }

  applyFilters() {
    this.activeFilters = this.normalizeFilters(this.draftFilters);
    this.applyRequestFilters();
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
    delete this.draftFilters[filterKey];
    this.applyRequestFilters();
  }

  clearAllFilters() {
    this.activeFilters = {};
    this.draftFilters = {};
    this.applyRequestFilters();
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

  private applyRequestFilters() {
    const enterprise = (this.activeFilters['enterprise'] || '').toLowerCase();
    const requestType = (this.activeFilters['requestType'] || '').toLowerCase();
    const status = (this.activeFilters['status'] || '').toLowerCase();
    const search = (this.activeFilters['search'] || '').toLowerCase();

    this.filteredRequestRows = this.requestRows.filter((row) => {
      const matchesEnterprise = !enterprise || row.enterprise.toLowerCase().includes(enterprise);
      const matchesRequestType = !requestType || row.requestType.toLowerCase().includes(requestType);
      const matchesStatus = !status || row.status.toLowerCase() === status;
      const matchesSearch = !search ||
        row.enterprise.toLowerCase().includes(search) ||
        row.requestType.toLowerCase().includes(search) ||
        row.requestedBy.toLowerCase().includes(search);

      return matchesEnterprise && matchesRequestType && matchesStatus && matchesSearch;
    });
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
    const ctx = this.insightsPieChartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    this.insightsPieChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Submitted', 'In Review', 'Approved', 'Rejected'],
        datasets: [
          {
            data: [8, 6, 12, 2],
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



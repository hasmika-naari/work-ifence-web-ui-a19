import { CommonModule } from '@angular/common';
import { Component, Signal, inject, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
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

interface WorkQueueRequestRow {
  enterprise: string;
  avatarSrc: string;
  requestType: string;
  requestedBy: string;
  status: string;
  age: string;
  priority: string;
  sla: string;
}

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
  ],
  templateUrl: './dashboard-app-admin.component.html',
  styleUrls: ['./dashboard-app-admin.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardAppAdminComponent implements AfterViewInit {
  private readonly userStore = inject(UserStoreService);
  bioProfile: Signal<BioProfile> = this.userStore.getUserBioProfile();

  activeTab: string = 'requests';
  showFilterPanel: boolean = false;
  activeFilters: { [key: string]: string } = {};
  draftFilters: { [key: string]: string } = {};
  Object = Object; // Expose Object to template

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



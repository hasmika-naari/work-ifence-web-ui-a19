import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

type QueueTab = 'onboarding' | 'subscriptions' | 'flags' | 'risk';

type Priority = 'Low' | 'Normal' | 'High';
type Sla = 'OK' | 'Breached';

type QueueStatus =
  | 'Submitted'
  | 'In Review'
  | 'Approved'
  | 'Rejected'
  | 'Trial Expiring'
  | 'Cancel at Period End'
  | 'Flag Pending'
  | 'Security Alert';

interface QueueRow {
  enterprise: string;
  requestType: string;
  requestedBy: string;
  ageLabel: string;       // e.g., "20 mins", "3 hours"
  priority: Priority;
  status: QueueStatus;
  sla: Sla;
  tab: QueueTab;
}

interface KpiCard {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  tone: 'peach' | 'lavender' | 'rose' | 'mint' | 'sky';
}

interface AuditItem {
  title: string;
  subtitle: string;
  time: string;
  icon: string;
  tone: 'info' | 'warn' | 'ok';
}

@Component({
  selector: 'app-app-admin-ops-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatDividerModule
  ],
  templateUrl: './app-admin-ops-dashboard.component.html',
  styleUrls: ['./app-admin-ops-dashboard.component.scss']
})
export class AppAdminOpsDashboardComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // -----------------------------
  // Signals (simple state)
  // -----------------------------
  activeTab = signal<QueueTab>('onboarding');

  // Filters (match screenshot-like)
  filterEnterprise = signal<string>('All');
  filterRequestType = signal<string>('All');
  filterRequestedBy = signal<string>('All');
  filterStatus = signal<string>('All');
  searchText = signal<string>('');

  // -----------------------------
  // Mock data (replace later with APIs)
  // -----------------------------
  kpis = signal<KpiCard[]>([
    {
      title: 'Pending Onboarding',
      value: '14',
      subtitle: '8 submitted • 6 in review',
      icon: 'check_circle',
      tone: 'peach'
    },
    {
      title: 'Trials Expiring (7 days)',
      value: '6',
      subtitle: 'Needs renewal decision',
      icon: 'schedule',
      tone: 'lavender'
    },
    {
      title: 'Cancel at Period End',
      value: '2',
      subtitle: 'Monitor retention actions',
      icon: 'event_busy',
      tone: 'rose'
    },
    {
      title: 'Entitlement Health',
      value: 'OK',
      subtitle: 'Last sync: 2 hours ago',
      icon: 'verified_user',
      tone: 'mint'
    },
    {
      title: 'Security Events (24h)',
      value: '5',
      subtitle: '3 failures • 2 lockouts',
      icon: 'shield',
      tone: 'sky'
    }
  ]);

  queueRows = signal<QueueRow[]>([
    // Onboarding
    { tab: 'onboarding', enterprise: 'TechCorp',      requestType: 'Internal ERP System',  requestedBy: 'Mark Allen',   ageLabel: '20 mins', priority: 'Normal', status: 'Submitted',  sla: 'OK' },
    { tab: 'onboarding', enterprise: 'BlueWave Inc.', requestType: 'SSO Integration',     requestedBy: 'Sarah Wong',   ageLabel: '3 hours',  priority: 'Normal', status: 'Submitted',  sla: 'OK' },
    { tab: 'onboarding', enterprise: 'MedSync',       requestType: 'Feature Enablement',  requestedBy: 'James Ng',     ageLabel: '3 hours',  priority: 'Low',    status: 'Submitted',  sla: 'OK' },
    { tab: 'onboarding', enterprise: 'FinSecure',     requestType: 'Data Migration',      requestedBy: 'John Smith',   ageLabel: '3 hours',  priority: 'High',   status: 'In Review',   sla: 'Breached' },
    { tab: 'onboarding', enterprise: 'EduLink',       requestType: 'API Integration',     requestedBy: 'David Lee',    ageLabel: '3 hours',  priority: 'Low',    status: 'Submitted',  sla: 'OK' },
    { tab: 'onboarding', enterprise: 'HealthPlus',    requestType: 'Custom Application',  requestedBy: 'Amanda Chen',  ageLabel: '2 hours',  priority: 'Low',    status: 'Submitted',  sla: 'OK' },
    { tab: 'onboarding', enterprise: 'DataSphere',    requestType: 'Entitlements Sync',   requestedBy: 'Emily Carter', ageLabel: '2 hours',  priority: 'Low',    status: 'In Review',   sla: 'OK' },

    // Subscription Ops
    { tab: 'subscriptions', enterprise: 'TechCorp',      requestType: 'Trial Expiring',          requestedBy: 'System', ageLabel: '2 days', priority: 'High',   status: 'Trial Expiring',        sla: 'OK' },
    { tab: 'subscriptions', enterprise: 'BlueWave Inc.', requestType: 'Cancel at Period End',    requestedBy: 'System', ageLabel: '1 day',  priority: 'Normal', status: 'Cancel at Period End',  sla: 'OK' },
    { tab: 'subscriptions', enterprise: 'FinSecure',     requestType: 'Trial Expiring',          requestedBy: 'System', ageLabel: '5 days', priority: 'High',   status: 'Trial Expiring',        sla: 'OK' },

    // Feature Flags
    { tab: 'flags', enterprise: 'MedSync',    requestType: 'Enable Flag: new-ui',     requestedBy: 'James Ng',    ageLabel: '1 hour', priority: 'Normal', status: 'Flag Pending', sla: 'OK' },
    { tab: 'flags', enterprise: 'EduLink',    requestType: 'Disable Flag: beta-api',  requestedBy: 'David Lee',   ageLabel: '6 hours', priority: 'Low',    status: 'Flag Pending', sla: 'OK' },

    // Risk Events
    { tab: 'risk', enterprise: 'BlueWave Inc.', requestType: 'Lockout Event',   requestedBy: 'Auth Service', ageLabel: '25 mins', priority: 'High', status: 'Security Alert', sla: 'OK' },
    { tab: 'risk', enterprise: 'FinSecure',     requestType: 'Login Failures',  requestedBy: 'Auth Service', ageLabel: '2 hours',  priority: 'High', status: 'Security Alert', sla: 'OK' }
  ]);

  auditFeed = signal<AuditItem[]>([
    { title: 'Role change approved', subtitle: 'Access & Roles updated for TechCorp', time: '10 mins ago', icon: 'manage_accounts', tone: 'ok' },
    { title: 'Entitlement sync completed', subtitle: 'Plan entitlements reconciled', time: '2 hours ago', icon: 'sync', tone: 'info' },
    { title: 'Login lockout detected', subtitle: 'BlueWave Inc. (non-admin account)', time: '3 hours ago', icon: 'warning', tone: 'warn' }
  ]);

  // -----------------------------
  // Derived lists for filter dropdowns
  // -----------------------------
  enterprises = computed(() => ['All', ...Array.from(new Set(this.queueRows().map(r => r.enterprise))).sort()]);
  requestTypes = computed(() => ['All', ...Array.from(new Set(this.queueRows().map(r => r.requestType))).sort()]);
  requestedBys = computed(() => ['All', ...Array.from(new Set(this.queueRows().map(r => r.requestedBy))).sort()]);
  statuses = computed(() => ['All', ...Array.from(new Set(this.queueRows().map(r => r.status))).sort()]);

  // -----------------------------
  // Table data (filtered)
  // -----------------------------
  displayedColumns: string[] = ['enterprise', 'requestType', 'requestedBy', 'status', 'ageLabel', 'priority', 'sla', 'actions'];

  filteredRows = computed(() => {
    const tab = this.activeTab();
    const e = this.filterEnterprise();
    const rt = this.filterRequestType();
    const rb = this.filterRequestedBy();
    const st = this.filterStatus();
    const q = this.searchText().trim().toLowerCase();

    return this.queueRows()
      .filter(r => r.tab === tab)
      .filter(r => e === 'All' ? true : r.enterprise === e)
      .filter(r => rt === 'All' ? true : r.requestType === rt)
      .filter(r => rb === 'All' ? true : r.requestedBy === rb)
      .filter(r => st === 'All' ? true : r.status === st)
      .filter(r => {
        if (!q) return true;
        return (
          r.enterprise.toLowerCase().includes(q) ||
          r.requestType.toLowerCase().includes(q) ||
          r.requestedBy.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q)
        );
      });
  });

  // -----------------------------
  // Insights (computed from mock data)
  // -----------------------------
  onboardingBreakdown = computed(() => {
    // Only count onboarding tab statuses
    const rows = this.queueRows().filter(r => r.tab === 'onboarding');
    const counts = {
      submitted: rows.filter(r => r.status === 'Submitted').length,
      inReview: rows.filter(r => r.status === 'In Review').length,
      approved: rows.filter(r => r.status === 'Approved').length,
      rejected: rows.filter(r => r.status === 'Rejected').length
    };
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

    return {
      ...counts,
      total,
      // mock metric; later you can compute from createdDate/approvedDate
      avgTimeToApproval: '14 hrs',
      pct: {
        submitted: Math.round((counts.submitted / total) * 100),
        inReview: Math.round((counts.inReview / total) * 100),
        approved: Math.round((counts.approved / total) * 100),
        rejected: Math.round((counts.rejected / total) * 100)
      }
    };
  });

  subscriptionLifecycle = computed(() => {
    // Mock distribution (replace with API summary)
    return {
      trials: 39,
      active: 24,
      pastDue: 1,
      canceling: 3,
      canceled: 6
    };
  });

  // -----------------------------
  // Lifecycle helper
  // -----------------------------
  lifecycleMax = computed(() => {
    const s = this.subscriptionLifecycle();
    return Math.max(s.trials, s.active, s.pastDue, s.canceling, s.canceled, 1);
  });

  ngAfterViewInit(): void {
    // no paginator binding needed unless you wire MatTableDataSource
  }

  // -----------------------------
  // Tab change handler
  // -----------------------------
  setTab(tab: QueueTab) {
    this.activeTab.set(tab);
    // reset quick filters per tab (keeps UX predictable)
    this.filterEnterprise.set('All');
    this.filterRequestType.set('All');
    this.filterRequestedBy.set('All');
    this.filterStatus.set('All');
    this.searchText.set('');
  }

  // -----------------------------
  // Action buttons (mock)
  // -----------------------------
  onReview(row: QueueRow) {
    // In real app: open right sidenav drawer
    console.log('Review row:', row);
    alert(`Open Ops Drawer for: ${row.enterprise} • ${row.requestType}`);
  }

  onRetry(item: AuditItem) {
    console.log('Retry item:', item);
    alert(`Retry triggered for: ${item.title}`);
  }

  // simple chips styles
  statusTone(status: QueueStatus): 'neutral' | 'info' | 'ok' | 'warn' | 'danger' {
    switch (status) {
      case 'Submitted': return 'info';
      case 'In Review': return 'warn';
      case 'Approved': return 'ok';
      case 'Rejected': return 'danger';
      case 'Trial Expiring': return 'warn';
      case 'Cancel at Period End': return 'neutral';
      case 'Flag Pending': return 'info';
      case 'Security Alert': return 'danger';
      default: return 'neutral';
    }
  }

  priorityTone(p: Priority): 'low' | 'normal' | 'high' {
    if (p === 'High') return 'high';
    if (p === 'Low') return 'low';
    return 'normal';
  }
}

import { CommonModule } from '@angular/common';
import { Component, Injector, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DrawerModule } from 'primeng/drawer';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  finalize,
  firstValueFrom,
  of,
  startWith,
  Subject,
  switchMap,
  tap,
  type Observable,
} from 'rxjs';
import type { AdminSubscriptionPlanRequestRow, AdminSubscriptionRow, PagedResponse } from 'src/app/models/admin.model';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { AdminApiService } from 'src/app/services/admin-api.service';
import { GateDeniedTelemetryService } from 'src/app/services/gate-denied-telemetry.service';
import { AdminApproveTrialDialogComponent } from '../dialogs/admin-approve-trial-dialog.component';
import { AdminConfirmDialogComponent } from '../dialogs/admin-confirm-dialog.component';
import { AdminExtendPlanTrialDialogComponent, AdminExtendPlanTrialDialogData } from '../dialogs/admin-extend-plan-trial-dialog.component';
import { AdminExtendTrialDialogComponent } from '../dialogs/admin-extend-trial-dialog.component';
import { AdminNotesDialogComponent } from '../dialogs/admin-notes-dialog.component';
import { AdminPlanRequestDetailDialogComponent } from '../dialogs/admin-plan-request-detail-dialog.component';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

type SubscriberType = 'INDIVIDUAL' | 'ENTERPRISE' | '' | string;

@Component({
  selector: 'app-admin-subscriptions',
  standalone: true,
  imports: [
    CommonModule,
    DrawerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatTooltipModule,
  ],
  templateUrl: './admin-subscriptions.component.html',
  styleUrls: ['./admin-subscriptions.component.scss'],
})
export class AdminSubscriptionsComponent {
  private readonly injector = inject(Injector);
  private readonly api = inject(AdminApiService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly accessFacade = inject(AccessFacadeService);
  private readonly telemetry = inject(GateDeniedTelemetryService);
  private readonly fb         = inject(FormBuilder);

  // ── Filter panel (PrimeNG drawer) ─────────────────────────────────────────
  showFilterPanel = false;
  toggleFilterPanel(): void { this.showFilterPanel = !this.showFilterPanel; }
  closeFilterPanel(): void  { this.showFilterPanel = false; }

  clearCurrentFilters(): void {
    const t = this.selectedTab();
    if (t === 0) {
      // Reset to ACTIVE (not empty) to maintain the separation: TRIALING stays in the Trials tab.
      this.subSubscriberType.set(''); this.subStatus.set('ACTIVE'); this.subQ.set(''); this.subPageIndex.set(0);
    } else if (t === 1) {
      this.trialSubscriberType.set(''); this.trialQ.set(''); this.trialPageIndex.set(0);
    } else {
      this.reqStatus.set(''); this.reqType.set(''); this.reqPlan.set(''); this.reqPageIndex.set(0);
    }
  }

  // ── Active tab ────────────────────────────────────────────────────────────
  readonly selectedTab = signal<number>(0);

  // ── Tab 1: Active Subscriptions ──────────────────────────────────────────
  // Default to ACTIVE so only real current subscriptions appear.
  // TRIALING is intentionally excluded here – those rows belong in the Active Trials tab.
  // BASIC free users appear here because they have status=ACTIVE with planCode=BASIC.
  readonly subSubscriberType = signal<SubscriberType>('');
  readonly subStatus = signal<string>('ACTIVE');
  readonly subQ = signal<string>('');
  readonly subPageIndex = signal<number>(0);
  readonly subPageSize = signal<number>(20);
  readonly subLoading = signal<boolean>(false);
  private readonly subBusyMap = signal<Record<string, boolean>>({});
  readonly isSubBusy = (id?: string) => !!(id && this.subBusyMap()[id]);
  private readonly subRefresh$ = new Subject<void>();

  readonly subPage = toSignal(
    combineLatest({
      subscriberType: toObservable(this.subSubscriberType),
      status: toObservable(this.subStatus),
      q: toObservable(this.subQ).pipe(debounceTime(250), distinctUntilChanged()),
      pageIndex: toObservable(this.subPageIndex),
      pageSize: toObservable(this.subPageSize),
      refresh: this.subRefresh$.pipe(startWith(void 0)),
    }).pipe(
      tap(() => this.subLoading.set(true)),
      switchMap(({ subscriberType, status, q, pageIndex, pageSize }) =>
        this.api.listSubscriptions({
          subscriberType: subscriberType || undefined,
          status: status || undefined,
          q: q?.trim() || undefined,
          page: pageIndex,
          size: pageSize,
        }).pipe(
          catchError((err) => {
            this.showError(err);
            return of({ content: [], totalElements: 0, number: pageIndex, size: pageSize } as PagedResponse<AdminSubscriptionRow>);
          }),
          finalize(() => this.subLoading.set(false))
        )
      )
    ),
    { injector: this.injector, initialValue: { content: [], totalElements: 0, number: 0, size: 20 } as PagedResponse<AdminSubscriptionRow> }
  );

  // ── Tab 2: Active Trials ─────────────────────────────────────────────────
  readonly trialSubscriberType = signal<SubscriberType>('');
  readonly trialQ = signal<string>('');
  readonly trialPageIndex = signal<number>(0);
  readonly trialPageSize = signal<number>(20);
  readonly trialLoading = signal<boolean>(false);
  private readonly trialBusyMap = signal<Record<string, boolean>>({});
  readonly isTrialBusy = (id?: string) => !!(id && this.trialBusyMap()[id]);
  private readonly trialRefresh$ = new Subject<void>();

  readonly trialPage = toSignal(
    combineLatest({
      subscriberType: toObservable(this.trialSubscriberType),
      q: toObservable(this.trialQ).pipe(debounceTime(250), distinctUntilChanged()),
      pageIndex: toObservable(this.trialPageIndex),
      pageSize: toObservable(this.trialPageSize),
      refresh: this.trialRefresh$.pipe(startWith(void 0)),
    }).pipe(
      tap(() => this.trialLoading.set(true)),
      switchMap(({ subscriberType, q, pageIndex, pageSize }) =>
        this.api.listSubscriptions({
          status: 'TRIALING',
          subscriberType: subscriberType || undefined,
          q: q?.trim() || undefined,
          page: pageIndex,
          size: pageSize,
        }).pipe(
          catchError((err) => {
            this.showError(err);
            return of({ content: [], totalElements: 0, number: pageIndex, size: pageSize } as PagedResponse<AdminSubscriptionRow>);
          }),
          finalize(() => this.trialLoading.set(false))
        )
      )
    ),
    { injector: this.injector, initialValue: { content: [], totalElements: 0, number: 0, size: 20 } as PagedResponse<AdminSubscriptionRow> }
  );

  // ── Tab 3: Subscription Requests ─────────────────────────────────────────
  readonly reqStatus = signal<string>('');
  readonly reqPlan = signal<string>('');
  readonly reqType = signal<string>('');
  readonly reqPageIndex = signal<number>(0);
  readonly reqPageSize = signal<number>(20);
  readonly reqLoading = signal<boolean>(false);
  private readonly reqBusyMap = signal<Record<string, boolean>>({});
  readonly isReqBusy = (id?: string | number) => !!(id !== undefined && this.reqBusyMap()[String(id)]);
  private readonly reqRefresh$ = new Subject<void>();

  readonly reqPage = toSignal(
    combineLatest({
      status: toObservable(this.reqStatus),
      plan: toObservable(this.reqPlan).pipe(debounceTime(250), distinctUntilChanged()),
      requestType: toObservable(this.reqType),
      pageIndex: toObservable(this.reqPageIndex),
      pageSize: toObservable(this.reqPageSize),
      refresh: this.reqRefresh$.pipe(startWith(void 0)),
    }).pipe(
      tap(() => this.reqLoading.set(true)),
      switchMap(({ status, plan, requestType, pageIndex, pageSize }) =>
        this.api.listPlanRequests({
          status: status || undefined,
          planCode: plan?.trim() || undefined,
          requestType: requestType || undefined,
          page: pageIndex,
          size: pageSize,
        }).pipe(
          catchError((err) => {
            this.showError(err);
            return of({ content: [], totalElements: 0, number: pageIndex, size: pageSize } as PagedResponse<AdminSubscriptionPlanRequestRow>);
          }),
          finalize(() => this.reqLoading.set(false))
        )
      )
    ),
    { injector: this.injector, initialValue: { content: [], totalElements: 0, number: 0, size: 20 } as PagedResponse<AdminSubscriptionPlanRequestRow> }
  );

  // ── Shell proxies (outer AdminTableShellComponent binds to active tab) ────
  readonly activeLoading = computed(() => {
    const t = this.selectedTab();
    if (t === 0) return this.subLoading();
    if (t === 1) return this.trialLoading();
    return this.reqLoading();
  });

  readonly activeTotal = computed(() => {
    const t = this.selectedTab();
    if (t === 0) return this.subPage().totalElements ?? 0;
    if (t === 1) return this.trialPage().totalElements ?? 0;
    return this.reqPage().totalElements ?? 0;
  });

  readonly activePageIndex = computed(() => {
    const t = this.selectedTab();
    if (t === 0) return this.subPageIndex();
    if (t === 1) return this.trialPageIndex();
    return this.reqPageIndex();
  });

  readonly activePageSize = computed(() => {
    const t = this.selectedTab();
    if (t === 0) return this.subPageSize();
    if (t === 1) return this.trialPageSize();
    return this.reqPageSize();
  });

  // ── Column definitions ────────────────────────────────────────────────────
  readonly subColumns = [
    'subscriber', 'planCode', 'status', 'currentPeriodEnd', 'trialEndDate', 'createdDate', 'actions',
  ];

  readonly trialColumns = [
    'subscriber', 'planCode', 'trialStartDate', 'trialEndDate', 'daysRemaining', 'actions',
  ];

  readonly reqColumns = [
    'user', 'currentPlan', 'requestedPlan', 'status', 'requestedDate', 'trialEndDate', 'actions',
  ];

  // ── Options ───────────────────────────────────────────────────────────────
  readonly subscriberTypeOptions: Array<{ label: string; value: SubscriberType }> = [
    { label: 'All', value: '' },
    { label: 'Individual', value: 'INDIVIDUAL' },
    { label: 'Enterprise', value: 'ENTERPRISE' },
  ];

  /**
   * Status options for the Active Subscriptions tab.
   * TRIALING is intentionally omitted – use the Active Trials tab for those records.
   * An empty value removes the status filter so admins can inspect suspended/cancelled
   * records alongside active ones when needed.
   */
  readonly subStatusOptions: Array<{ label: string; value: string }> = [
    { label: 'Active (default)', value: 'ACTIVE' },
    { label: 'Suspended',        value: 'SUSPENDED' },
    { label: 'Cancelled',        value: 'CANCELLED' },
    { label: 'Pending queue',    value: 'PENDING_QUEUE' },
    { label: 'All statuses',     value: '' },
  ];

  readonly reqStatusOptions = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  readonly reqTypeOptions = [
    { label: 'All types', value: '' },
    { label: 'Trial request', value: 'TRIAL_REQUEST' },
    { label: 'Upgrade request', value: 'UPGRADE_REQUEST' },
  ];

  // ── Subscription drawer ──────────────────────────────────────────────────
  readonly drawerOpen   = signal(false);
  readonly drawerMode   = signal<'create' | 'edit'>('create');
  readonly drawerRow    = signal<AdminSubscriptionRow | null>(null);
  readonly drawerSaving = signal(false);

  // ── Request detail drawer ─────────────────────────────────────────────────
  readonly reqDrawerOpen = signal(false);
  readonly reqDrawerRow  = signal<AdminSubscriptionPlanRequestRow | null>(null);

  readonly userSearchCtrl      = new FormControl('');
  private readonly userSearchQuery = signal<string>('');
  readonly userOptions = toSignal(
    toObservable(this.userSearchQuery).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((q) =>
        q.length >= 2
          ? this.api.searchUsers(q).pipe(catchError(() => of([])))
          : of([])
      )
    ),
    {
      injector: this.injector,
      initialValue: [] as Array<{ login: string; firstName?: string; lastName?: string; email?: string }>,
    }
  );

  readonly editForm = this.fb.group({
    subscriberType:         ['INDIVIDUAL'],
    subscriberId:           [''],
    planCode:               [''],
    status:                 ['ACTIVE'],
    startDate:              [''],
    trialStartDate:         [''],
    trialEndDate:           [''],
    nextBillingDate:        [''],
    autoRenew:              [true],
    cancelAtPeriodEnd:      [false],
    providerSubscriptionId: [''],
  });

  // ── Pagination helpers ────────────────────────────────────────────────────
  prevPageActive(): void {
    const t = this.selectedTab();
    if (t === 0 && this.subPageIndex() > 0) this.subPageIndex.update(p => p - 1);
    else if (t === 1 && this.trialPageIndex() > 0) this.trialPageIndex.update(p => p - 1);
    else if (t === 2 && this.reqPageIndex() > 0) this.reqPageIndex.update(p => p - 1);
  }
  nextPageActive(): void {
    const t = this.selectedTab();
    if (t === 0 && this.currentSubPage() < this.totalSubPages() - 1) this.subPageIndex.update(p => p + 1);
    else if (t === 1 && this.currentTrialPage() < this.totalTrialPages() - 1) this.trialPageIndex.update(p => p + 1);
    else if (t === 2 && this.currentReqPage() < this.totalReqPages() - 1) this.reqPageIndex.update(p => p + 1);
  }
  canPrevActive = computed(() => {
    const t = this.selectedTab();
    if (t === 0) return this.subPageIndex() > 0;
    if (t === 1) return this.trialPageIndex() > 0;
    return this.reqPageIndex() > 0;
  });
  canNextActive = computed(() => {
    const t = this.selectedTab();
    if (t === 0) return this.currentSubPage() < this.totalSubPages() - 1;
    if (t === 1) return this.currentTrialPage() < this.totalTrialPages() - 1;
    return this.currentReqPage() < this.totalReqPages() - 1;
  });
  private currentSubPage   = computed(() => this.subPageIndex());
  private totalSubPages    = computed(() => Math.max(1, Math.ceil((this.subPage().totalElements ?? 0)  / this.subPageSize())));
  private currentTrialPage = computed(() => this.trialPageIndex());
  private totalTrialPages  = computed(() => Math.max(1, Math.ceil((this.trialPage().totalElements ?? 0) / this.trialPageSize())));
  private currentReqPage   = computed(() => this.reqPageIndex());
  private totalReqPages    = computed(() => Math.max(1, Math.ceil((this.reqPage().totalElements ?? 0)  / this.reqPageSize())));
  getCurrentPageActive = computed(() => {
    const t = this.selectedTab();
    if (t === 0) return this.currentSubPage() + 1;
    if (t === 1) return this.currentTrialPage() + 1;
    return this.currentReqPage() + 1;
  });
  getTotalPagesActive = computed(() => {
    const t = this.selectedTab();
    if (t === 0) return this.totalSubPages();
    if (t === 1) return this.totalTrialPages();
    return this.totalReqPages();
  });

  getStatusClass(status: string | undefined): string {
    const s = (status || '').toUpperCase();
    if (s === 'ACTIVE')        return 'chip status-active';
    if (s === 'TRIALING')      return 'chip status-trialing';
    if (s === 'SUSPENDED')     return 'chip status-suspended';
    if (s === 'CANCELLED' || s === 'CANCELED') return 'chip status-cancelled';
    if (s === 'PENDING_QUEUE') return 'chip status-pending';
    if (s === 'APPROVED')      return 'chip status-approved';
    if (s === 'REJECTED')      return 'chip status-rejected';
    if (s === 'NEEDS_INFO')    return 'chip status-needs-info';
    if (s === 'IN_REVIEW')     return 'chip status-in-review';
    return 'chip';
  }

  getTypeClass(type: string | undefined): string {
    const t = (type || '').toLowerCase();
    if (t === 'individual')  return 'chip type-individual';
    if (t === 'enterprise')  return 'chip type-enterprise';
    return 'chip';
  }

  getPlanName(code: string | undefined): string {
    if (!code) return '\u2014';
    const MAP: Record<string, string> = {
      FREE_INDIVIDUAL:      'Free',
      PRO_INDIVIDUAL:       'Pro',
      PREMIUM_INDIVIDUAL:   'Premium',
      FREE_ENTERPRISE:      'Free Enterprise',
      PRO_ENTERPRISE:       'Pro Enterprise',
      PREMIUM_ENTERPRISE:   'Premium Enterprise',
      ENTERPRISE:           'Enterprise',
      BASIC:                'Basic',
      STANDARD:             'Standard',
      STARTER:              'Starter',
    };
    return MAP[code.toUpperCase()] ??
      code.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  onTabChange(index: number): void {
    this.selectedTab.set(index);
  }

  // ── Tab 1 handlers ───────────────────────────────────────────────────────
  onSubSubscriberTypeChange(value: SubscriberType): void { this.subSubscriberType.set(value); this.subPageIndex.set(0); }
  onSubStatusChange(value: string): void { this.subStatus.set(value); this.subPageIndex.set(0); }
  onSubSearchChange(value: string): void { this.subQ.set(value); this.subPageIndex.set(0); }
  refreshSub(): void { this.subRefresh$.next(); }

  extendTrial(row: AdminSubscriptionRow): void {
    if (!row.id) return;
    const ref = this.dialog.open(AdminExtendTrialDialogComponent, { width: '520px' });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.runSubAction(row.id!, 'EXTEND_TRIAL',
        () => this.api.extendTrial(row.id!, { days: result.days, reason: result.reason }),
        { days: result.days, reason: result.reason }
      );
    });
  }

  endTrial(row: AdminSubscriptionRow): void {
    if (!row.id) return;
    const ref = this.dialog.open(AdminConfirmDialogComponent, {
      width: '480px',
      data: { title: 'End trial now', message: 'This will end the trial immediately.', confirmLabel: 'End trial' },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.runSubAction(row.id!, 'END_TRIAL', () => this.api.endTrial(row.id!));
    });
  }

  activate(row: AdminSubscriptionRow): void {
    if (!row.id) return;
    const ref = this.dialog.open(AdminConfirmDialogComponent, {
      width: '480px',
      data: { title: 'Activate subscription', message: 'This will mark the subscription as active.', confirmLabel: 'Activate' },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.runSubAction(row.id!, 'ACTIVATE_SUBSCRIPTION', () => this.api.activate(row.id!));
    });
  }

  suspend(row: AdminSubscriptionRow): void {
    if (!row.id) return;
    const ref = this.dialog.open(AdminConfirmDialogComponent, {
      width: '480px',
      data: { title: 'Suspend subscription', message: 'This will suspend the subscription.', confirmLabel: 'Suspend' },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.runSubAction(row.id!, 'SUSPEND_SUBSCRIPTION', () => this.api.suspend(row.id!));
    });
  }

  // ── Tab 2 handlers ───────────────────────────────────────────────────────
  onTrialSubscriberTypeChange(value: SubscriberType): void { this.trialSubscriberType.set(value); this.trialPageIndex.set(0); }
  onTrialSearchChange(value: string): void { this.trialQ.set(value); this.trialPageIndex.set(0); }
  refreshTrials(): void { this.trialRefresh$.next(); }

  daysRemaining(trialEndDate: string | undefined): number | null {
    if (!trialEndDate) return null;
    return Math.max(0, Math.ceil((new Date(trialEndDate).getTime() - Date.now()) / 86_400_000));
  }

  extendTrialRow(row: AdminSubscriptionRow): void {
    if (!row.id) return;
    const ref = this.dialog.open(AdminExtendTrialDialogComponent, { width: '520px' });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.runTrialAction(row.id!, 'EXTEND_TRIAL',
        () => this.api.extendTrial(row.id!, { days: result.days, reason: result.reason }),
        { days: result.days, reason: result.reason }
      );
    });
  }

  endTrialRow(row: AdminSubscriptionRow): void {
    if (!row.id) return;
    const ref = this.dialog.open(AdminConfirmDialogComponent, {
      width: '480px',
      data: { title: 'End trial now', message: 'This will end the trial immediately.', confirmLabel: 'End trial' },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.runTrialAction(row.id!, 'END_TRIAL', () => this.api.endTrial(row.id!));
    });
  }

  // ── Tab 3 handlers ───────────────────────────────────────────────────────
  onReqStatusChange(value: string): void { this.reqStatus.set(value); this.reqPageIndex.set(0); }
  onReqPlanChange(value: string): void { this.reqPlan.set(value); this.reqPageIndex.set(0); }
  onReqTypeChange(value: string): void { this.reqType.set(value); this.reqPageIndex.set(0); }
  refreshReq(): void { this.reqRefresh$.next(); }

  reqUserLabel(row: AdminSubscriptionPlanRequestRow): string {
    return row.userDisplay || row.userName || row.userLogin || row.userEmail || '-';
  }

  canReview(row: AdminSubscriptionPlanRequestRow): boolean {
    return (row.status ?? '').toUpperCase() === 'PENDING';
  }

  canExtendPlanTrial(row: AdminSubscriptionPlanRequestRow): boolean {
    return (row.status ?? '').toUpperCase() === 'APPROVED';
  }

  async viewDetail(row: AdminSubscriptionPlanRequestRow): Promise<void> {
    if (row.id === undefined || row.id === null) return;
    try {
      this.setReqBusy(row.id, true);
      const detail = await firstValueFrom(this.api.getPlanRequest(row.id)) as AdminSubscriptionPlanRequestRow;
      this.dialog.open(AdminPlanRequestDetailDialogComponent, { width: '600px', data: { detail: detail ?? row } });
    } catch (err: any) {
      this.showError(err);
    } finally {
      this.setReqBusy(row.id, false);
    }
  }

  approveTrialAction(row: AdminSubscriptionPlanRequestRow): void {
    if (row.id === undefined || row.id === null || !this.canReview(row)) return;
    const ref = this.dialog.open(AdminApproveTrialDialogComponent, { width: '520px' });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.runReqAction(
        row.id!,
        () => this.api.approveTrial(row.id!, {
          trialDays: result.trialDays,
          trialStartDate: result.trialStartDate,
          trialEndDate: result.trialEndDate,
          adminRemarks: result.adminRemarks,
        }),
        'Trial approved.'
      );
    });
  }

  rejectPlanRequestAction(row: AdminSubscriptionPlanRequestRow): void {
    if (row.id === undefined || row.id === null || !this.canReview(row)) return;
    const ref = this.dialog.open(AdminNotesDialogComponent, {
      width: '520px',
      data: {
        title: 'Reject request',
        message: 'Provide a reason for rejecting this request. This will be visible to the user.',
        confirmLabel: 'Reject',
        notesRequired: true,
      },
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.runReqAction(row.id!, () => this.api.rejectPlanRequest(row.id!, { adminRemarks: result.notes }), 'Request rejected.');
    });
  }

  extendPlanTrialAction(row: AdminSubscriptionPlanRequestRow): void {
    if (row.id === undefined || row.id === null || !this.canExtendPlanTrial(row)) return;
    const ref = this.dialog.open(AdminExtendPlanTrialDialogComponent, {
      width: '520px',
      data: { currentTrialEndDate: row.trialEndDate } satisfies AdminExtendPlanTrialDialogData,
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.runReqAction(
        row.id!,
        () => this.api.extendPlanTrial(row.id!, { trialDays: result.trialDays, trialEndDate: result.trialEndDate, reason: result.reason }),
        'Trial extended.'
      );
    });
  }

  // ── Add Subscription ──────────────────────────────────────────────────────
  addSubscription(): void {
    this.drawerMode.set('create');
    this.drawerRow.set(null);
    this.editForm.reset({
      subscriberType: 'INDIVIDUAL', subscriberId: '', planCode: '', status: 'ACTIVE',
      startDate: '', trialStartDate: '', trialEndDate: '', nextBillingDate: '',
      autoRenew: true, cancelAtPeriodEnd: false, providerSubscriptionId: '',
    });
    this.userSearchCtrl.setValue('');
    this.drawerOpen.set(true);
  }

  // ── Drawer handlers ───────────────────────────────────────────────────────
  openViewDrawer(row: AdminSubscriptionRow): void {
    this.drawerMode.set('edit');
    this.drawerRow.set(row);
    this.editForm.patchValue({
      subscriberType:         row.subscriberType ?? 'INDIVIDUAL',
      subscriberId:           row.subscriberId   ?? '',
      planCode:               row.planCode       ?? '',
      status:                 row.status         ?? 'ACTIVE',
      startDate:              this.toDateInput(row.startDate),
      trialStartDate:         this.toDateInput(row.trialStartDate),
      trialEndDate:           this.toDateInput(row.trialEndDate),
      nextBillingDate:        this.toDateInput(row.nextBillingDate || row.currentPeriodEnd),
      autoRenew:              row.autoRenew      ?? true,
      cancelAtPeriodEnd:      row.cancelAtPeriodEnd ?? false,
      providerSubscriptionId: row.providerSubscriptionId ?? '',
    });
    this.userSearchCtrl.setValue(row.subscriberDisplayName || row.subscriberId || '');
    this.drawerOpen.set(true);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
    this.drawerRow.set(null);
  }

  openReqViewDrawer(row: AdminSubscriptionPlanRequestRow): void {
    this.reqDrawerRow.set(row);
    this.reqDrawerOpen.set(true);
  }

  closeReqDrawer(): void {
    this.reqDrawerOpen.set(false);
    this.reqDrawerRow.set(null);
  }

  onUserSearchInput(q: string): void {
    this.userSearchQuery.set(q);
  }

  onUserSelected(event: MatAutocompleteSelectedEvent): void {
    this.editForm.controls['subscriberId'].setValue(event.option.value as string);
  }

  async saveDrawer(): Promise<void> {
    const raw = this.editForm.getRawValue();
    const body: Partial<AdminSubscriptionRow> = {
      subscriberType:         raw.subscriberType         || undefined,
      subscriberId:           raw.subscriberId           || undefined,
      planCode:               raw.planCode               || undefined,
      status:                 raw.status                 || undefined,
      startDate:              raw.startDate              || undefined,
      trialStartDate:         raw.trialStartDate         || undefined,
      trialEndDate:           raw.trialEndDate           || undefined,
      nextBillingDate:        raw.nextBillingDate        || undefined,
      autoRenew:              raw.autoRenew              ?? undefined,
      cancelAtPeriodEnd:      raw.cancelAtPeriodEnd      ?? undefined,
      providerSubscriptionId: raw.providerSubscriptionId || undefined,
    };
    try {
      this.drawerSaving.set(true);
      if (this.drawerMode() === 'create') {
        await firstValueFrom(this.api.createSubscription(body));
        this.snackBar.open('Subscription created.', 'OK', { duration: 3000 });
      } else {
        await firstValueFrom(this.api.updateSubscription(this.drawerRow()!.id!, body));
        this.snackBar.open('Subscription updated.', 'OK', { duration: 3000 });
      }
      this.closeDrawer();
      this.subRefresh$.next();
      this.trialRefresh$.next();
    } catch (err: any) {
      this.showError(err);
    } finally {
      this.drawerSaving.set(false);
    }
  }

  // ── Private helpers ───────────────────────────────────────────────────────
  private runSubAction(id: string, action: string, call: () => Observable<void>, details?: Record<string, any>): void {
    this.setSubBusy(id, true);
    call().pipe(finalize(() => this.setSubBusy(id, false))).subscribe({
      next: () => {
        this.telemetry.recordAdminAction({ action, entityType: 'Subscription', entityId: id, outcome: 'SUCCESS', message: 'Action completed.', details });
        this.snackBar.open('Action completed.', 'OK', { duration: 3000 });
        this.subRefresh$.next();
        this.accessFacade.reload();
      },
      error: (err: any) => {
        this.telemetry.recordAdminAction({ action, entityType: 'Subscription', entityId: id, outcome: 'FAILURE', message: this.friendlyError(err), details: { ...(details ?? {}), status: err?.status } });
        this.showError(err);
      },
    });
  }

  private runTrialAction(id: string, action: string, call: () => Observable<void>, details?: Record<string, any>): void {
    this.setTrialBusy(id, true);
    call().pipe(finalize(() => this.setTrialBusy(id, false))).subscribe({
      next: () => {
        this.telemetry.recordAdminAction({ action, entityType: 'Subscription', entityId: id, outcome: 'SUCCESS', message: 'Action completed.', details });
        this.snackBar.open('Action completed.', 'OK', { duration: 3000 });
        this.trialRefresh$.next();
        this.accessFacade.reload();
      },
      error: (err: any) => { this.showError(err); },
    });
  }

  private runReqAction(id: string | number, call: () => Observable<void>, successMessage: string): void {
    this.setReqBusy(id, true);
    call().pipe(finalize(() => this.setReqBusy(id, false))).subscribe({
      next: () => { this.snackBar.open(successMessage, 'OK', { duration: 3000 }); this.reqRefresh$.next(); },
      error: (err: any) => { this.showError(err); },
    });
  }

  private setSubBusy(id: string, busy: boolean): void {
    const c = this.subBusyMap(); this.subBusyMap.set({ ...c, [id]: busy });
  }

  private setTrialBusy(id: string, busy: boolean): void {
    const c = this.trialBusyMap(); this.trialBusyMap.set({ ...c, [id]: busy });
  }

  private setReqBusy(id: string | number, busy: boolean): void {
    const c = this.reqBusyMap(); this.reqBusyMap.set({ ...c, [String(id)]: busy });
  }

  private toDateInput(iso: string | undefined): string {
    return iso ? iso.substring(0, 10) : '';
  }

  private showError(err: any): void {
    this.snackBar.open(this.friendlyError(err), 'OK', { duration: 4000 });
  }

  private friendlyError(err: any): string {
    const status = err?.status;
    if (status === 403) return 'Admin access required.';
    if (status === 404) return 'Item not found.';
    if (status === 0) return 'Network error. Please try again.';
    return err?.error?.message || 'Something went wrong.';
  }
}

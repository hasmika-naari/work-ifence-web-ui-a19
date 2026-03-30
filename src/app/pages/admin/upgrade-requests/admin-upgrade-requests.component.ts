import { CommonModule } from '@angular/common';
import { Component, Injector, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  finalize,
  firstValueFrom,
  interval,
  merge,
  of,
  startWith,
  Subject,
  switchMap,
  tap,
  type Observable,
} from 'rxjs';
import type { AdminSubscriptionPlanRequestRow, PagedResponse } from 'src/app/models/admin.model';
import { AdminApiService } from 'src/app/services/admin-api.service';
import { AdminApproveTrialDialogComponent } from '../dialogs/admin-approve-trial-dialog.component';
import { AdminExtendPlanTrialDialogComponent, AdminExtendPlanTrialDialogData } from '../dialogs/admin-extend-plan-trial-dialog.component';
import { AdminNotesDialogComponent } from '../dialogs/admin-notes-dialog.component';
import { AdminPlanRequestDetailDialogComponent } from '../dialogs/admin-plan-request-detail-dialog.component';
import { AdminTableShellComponent } from '../shared/admin-table-shell.component';

type UpgradeRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | '' | string;

@Component({
  selector: 'app-admin-upgrade-requests',
  standalone: true,
  imports: [
    CommonModule,
    AdminTableShellComponent,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './admin-upgrade-requests.component.html',
  styleUrls: ['./admin-upgrade-requests.component.scss'],
})
export class AdminUpgradeRequestsComponent {
  private readonly injector = inject(Injector);
  private readonly api = inject(AdminApiService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly status = signal<UpgradeRequestStatus>('');
  readonly plan = signal<string>('');
  readonly requestType = signal<string>('');
  readonly pageIndex = signal<number>(0);
  readonly pageSize = signal<number>(20);

  private readonly manualRefresh$ = new Subject<void>();
  /** Fires on manual refresh and automatically every 30 s so expiring trials are reflected without admin action. */
  private readonly refresh$ = merge(
    this.manualRefresh$,
    interval(30_000)
  ).pipe(takeUntilDestroyed());

  readonly loading = signal<boolean>(false);

  private readonly rowBusyMap = signal<Record<string, boolean>>({});
  readonly isRowBusy = (id?: string | number) => !!(id !== undefined && this.rowBusyMap()[String(id)]);

  readonly displayedColumns = [
    'requestCode',
    'user',
    'currentPlan',
    'requestedPlan',
    'requestType',
    'status',
    'requestedDate',
    'reviewedDate',
    'reviewedBy',
    'trialEndDate',
    'adminRemarks',
    'actions',
  ];

  readonly page = toSignal(
    combineLatest({
      status: toObservable(this.status),
      plan: toObservable(this.plan).pipe(debounceTime(250), distinctUntilChanged()),
      requestType: toObservable(this.requestType),
      pageIndex: toObservable(this.pageIndex),
      pageSize: toObservable(this.pageSize),
      refresh: this.refresh$.pipe(startWith(void 0)),
    }).pipe(
      tap(() => this.loading.set(true)),
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
            return of({
              content: [],
              totalElements: 0,
              number: pageIndex,
              size: pageSize,
            } as PagedResponse<AdminSubscriptionPlanRequestRow>);
          }),
          finalize(() => this.loading.set(false))
        )
      )
    ),
    {
      injector: this.injector,
      initialValue: { content: [], totalElements: 0, number: 0, size: 20 } as PagedResponse<AdminSubscriptionPlanRequestRow>,
    }
  );

  readonly total = computed(() => this.page().totalElements ?? 0);

  readonly statusOptions: Array<{ label: string; value: UpgradeRequestStatus }> = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  readonly requestTypeOptions: Array<{ label: string; value: string }> = [
    { label: 'All types', value: '' },
    { label: 'Trial request', value: 'TRIAL_REQUEST' },
    { label: 'Upgrade request', value: 'UPGRADE_REQUEST' },
  ];

  async viewDetail(row: AdminSubscriptionPlanRequestRow): Promise<void> {
    if (row.id === undefined || row.id === null) return;

    try {
      this.setRowBusy(row.id, true);
      const detail = await firstValueFrom(
        this.api.getPlanRequest(row.id)
      ) as AdminSubscriptionPlanRequestRow;
      this.dialog.open(AdminPlanRequestDetailDialogComponent, {
        width: '600px',
        data: { detail: detail ?? row },
      });
    } catch (err: any) {
      this.showError(err);
    } finally {
      this.setRowBusy(row.id, false);
    }
  }

  onPageChange(ev: PageEvent): void {
    this.pageIndex.set(ev.pageIndex);
    this.pageSize.set(ev.pageSize);
  }

  onStatusChange(value: UpgradeRequestStatus): void {
    this.status.set(value);
    this.pageIndex.set(0);
  }

  onPlanChange(value: string): void {
    this.plan.set(value);
    this.pageIndex.set(0);
  }

  onRequestTypeChange(value: string): void {
    this.requestType.set(value);
    this.pageIndex.set(0);
  }

  refresh(): void {
    this.manualRefresh$.next();
  }

  canReview(row: AdminSubscriptionPlanRequestRow): boolean {
    return (row.status ?? '').toString().trim().toUpperCase() === 'PENDING';
  }

  canExtendTrial(row: AdminSubscriptionPlanRequestRow): boolean {
    return (row.status ?? '').toString().trim().toUpperCase() === 'APPROVED';
  }

  extendTrialAction(row: AdminSubscriptionPlanRequestRow): void {
    if (row.id === undefined || row.id === null || !this.canExtendTrial(row)) return;

    const ref = this.dialog.open(AdminExtendPlanTrialDialogComponent, {
      width: '520px',
      data: { currentTrialEndDate: row.trialEndDate } satisfies AdminExtendPlanTrialDialogData,
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.runRowAction(
        row.id!,
        () => this.api.extendPlanTrial(row.id!, {
          trialDays: result.trialDays,
          trialEndDate: result.trialEndDate,
          reason: result.reason,
        }),
        'Trial extended.'
      );
    });
  }

  approveTrialAction(row: AdminSubscriptionPlanRequestRow): void {
    if (row.id === undefined || row.id === null || !this.canReview(row)) return;

    const ref = this.dialog.open(AdminApproveTrialDialogComponent, { width: '520px' });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.runRowAction(
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
      this.runRowAction(
        row.id!,
        () => this.api.rejectPlanRequest(row.id!, { adminRemarks: result.notes }),
        'Request rejected.'
      );
    });
  }

  userLabel(row: AdminSubscriptionPlanRequestRow): string {
    return row.userDisplay || row.userName || row.userLogin || row.userEmail || '-';
  }

  currentPlanLabel(row: AdminSubscriptionPlanRequestRow): string {
    return row.currentPlanCode || '-';
  }

  requestedPlanLabel(row: AdminSubscriptionPlanRequestRow): string {
    return row.requestedPlanCode || '-';
  }

  private runRowAction(id: string | number, call: () => Observable<void>, successMessage: string): void {
    this.setRowBusy(id, true);

    call()
      .pipe(finalize(() => this.setRowBusy(id, false)))
      .subscribe({
        next: () => {
          this.snackBar.open(successMessage, 'OK', { duration: 3000 });
          this.refresh();
        },
        error: (err: any) => {
          this.showError(err);
        },
      });
  }

  private setRowBusy(id: string | number, busy: boolean): void {
    const current = this.rowBusyMap();
    this.rowBusyMap.set({ ...current, [String(id)]: busy });
  }

  private showError(err: any): void {
    this.snackBar.open(this.friendlyError(err), 'OK', { duration: 4000 });
  }

  private friendlyError(err: any): string {
    return err?.error?.detail || err?.error?.message || err?.message || 'Unable to load upgrade requests.';
  }
}
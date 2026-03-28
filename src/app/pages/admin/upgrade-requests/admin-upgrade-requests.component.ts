import { CommonModule } from '@angular/common';
import { Component, Injector, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
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
  of,
  startWith,
  Subject,
  switchMap,
  tap,
  type Observable,
} from 'rxjs';
import type { AdminSubscriptionUpgradeRequestRow, PagedResponse } from 'src/app/models/admin.model';
import { AdminApiService } from 'src/app/services/admin-api.service';
import { AdminNotesDialogComponent } from '../dialogs/admin-notes-dialog.component';
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
  readonly pageIndex = signal<number>(0);
  readonly pageSize = signal<number>(20);

  private readonly refresh$ = new Subject<void>();

  readonly loading = signal<boolean>(false);

  private readonly rowBusyMap = signal<Record<string, boolean>>({});
  readonly isRowBusy = (id?: string | number) => !!(id !== undefined && this.rowBusyMap()[String(id)]);

  readonly displayedColumns = [
    'requestCode',
    'user',
    'currentPlan',
    'requestedPlan',
    'status',
    'requestedDate',
    'reviewedDate',
    'adminRemarks',
    'actions',
  ];

  readonly page = toSignal(
    combineLatest({
      status: toObservable(this.status),
      plan: toObservable(this.plan).pipe(debounceTime(250), distinctUntilChanged()),
      pageIndex: toObservable(this.pageIndex),
      pageSize: toObservable(this.pageSize),
      refresh: this.refresh$.pipe(startWith(void 0)),
    }).pipe(
      tap(() => this.loading.set(true)),
      switchMap(({ status, plan, pageIndex, pageSize }) =>
        this.api.listSubscriptionUpgradeRequests({
          status: status || undefined,
          plan: plan?.trim() || undefined,
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
            } as PagedResponse<AdminSubscriptionUpgradeRequestRow>);
          }),
          finalize(() => this.loading.set(false))
        )
      )
    ),
    {
      injector: this.injector,
      initialValue: { content: [], totalElements: 0, number: 0, size: 20 } as PagedResponse<AdminSubscriptionUpgradeRequestRow>,
    }
  );

  readonly total = computed(() => this.page().totalElements ?? 0);

  readonly statusOptions: Array<{ label: string; value: UpgradeRequestStatus }> = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

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

  refresh(): void {
    this.refresh$.next();
  }

  canReview(row: AdminSubscriptionUpgradeRequestRow): boolean {
    return (row.status ?? '').toString().trim().toUpperCase() === 'PENDING';
  }

  approve(row: AdminSubscriptionUpgradeRequestRow): void {
    if (row.id === undefined || row.id === null || !this.canReview(row)) {
      return;
    }

    const ref = this.dialog.open(AdminNotesDialogComponent, {
      width: '520px',
      data: {
        title: 'Approve upgrade request',
        message: 'You can optionally add remarks before approving this request.',
        confirmLabel: 'Approve',
        notesRequired: false,
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.runRowAction(
        row.id!,
        () => this.api.approveSubscriptionUpgradeRequest(row.id!, { adminRemarks: result.notes || undefined }),
        'Upgrade request approved.'
      );
    });
  }

  reject(row: AdminSubscriptionUpgradeRequestRow): void {
    if (row.id === undefined || row.id === null || !this.canReview(row)) {
      return;
    }

    const ref = this.dialog.open(AdminNotesDialogComponent, {
      width: '520px',
      data: {
        title: 'Reject upgrade request',
        message: 'You can optionally add remarks before rejecting this request.',
        confirmLabel: 'Reject',
        notesRequired: false,
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.runRowAction(
        row.id!,
        () => this.api.rejectSubscriptionUpgradeRequest(row.id!, { adminRemarks: result.notes || undefined }),
        'Upgrade request rejected.'
      );
    });
  }

  userLabel(row: AdminSubscriptionUpgradeRequestRow): string {
    return row.userDisplay || row.userName || row.userLogin || row.userEmail || '-';
  }

  currentPlanLabel(row: AdminSubscriptionUpgradeRequestRow): string {
    return row.currentPlan || row.currentPlanCode || '-';
  }

  requestedPlanLabel(row: AdminSubscriptionUpgradeRequestRow): string {
    return row.requestedPlan || row.requestedPlanCode || '-';
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
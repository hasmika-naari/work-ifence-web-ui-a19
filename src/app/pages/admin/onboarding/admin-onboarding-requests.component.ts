import { CommonModule } from '@angular/common';
import { Component, Injector, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
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
  of,
  startWith,
  Subject,
  switchMap,
  tap,
  type Observable,
} from 'rxjs';
import type { AdminOnboardingRequestRow, PagedResponse } from 'src/app/models/admin.model';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { AdminApiService } from 'src/app/services/admin-api.service';
import { GateDeniedTelemetryService } from 'src/app/services/gate-denied-telemetry.service';
import { AdminConfirmDialogComponent } from '../dialogs/admin-confirm-dialog.component';
import { AdminDetailDialogComponent } from '../dialogs/admin-detail-dialog.component';
import { AdminNotesDialogComponent } from '../dialogs/admin-notes-dialog.component';
import { AdminTableShellComponent } from '../shared/admin-table-shell.component';

type OnboardingStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'NEED_MORE_INFO'
  | 'APPROVED'
  | 'REJECTED'
  | string;

@Component({
  selector: 'app-admin-onboarding-requests',
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
  templateUrl: './admin-onboarding-requests.component.html',
  styleUrls: ['./admin-onboarding-requests.component.scss'],
})
export class AdminOnboardingRequestsComponent {
  private readonly injector = inject(Injector);
  private readonly api = inject(AdminApiService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly accessFacade = inject(AccessFacadeService);
  private readonly telemetry = inject(GateDeniedTelemetryService);

  readonly status = signal<OnboardingStatus>('SUBMITTED');
  readonly q = signal<string>('');
  readonly pageIndex = signal<number>(0);
  readonly pageSize = signal<number>(20);

  private readonly refresh$ = new Subject<void>();

  readonly loading = signal<boolean>(false);

  private readonly rowBusyMap = signal<Record<string, boolean>>({});
  readonly isRowBusy = (id?: string) => !!(id && this.rowBusyMap()[id]);

  readonly displayedColumns = ['enterpriseName', 'enterpriseType', 'requesterUserName', 'status', 'createdDate', 'actions'];

  readonly page = toSignal(
    combineLatest({
      status: toObservable(this.status),
      q: toObservable(this.q).pipe(debounceTime(250), distinctUntilChanged()),
      pageIndex: toObservable(this.pageIndex),
      pageSize: toObservable(this.pageSize),
      refresh: this.refresh$.pipe(startWith(void 0)),
    }).pipe(
      tap(() => this.loading.set(true)),
      switchMap(({ status, q, pageIndex, pageSize }) =>
        this.api
          .listOnboardingRequests({
            status: status || undefined,
            q: q?.trim() || undefined,
            page: pageIndex,
            size: pageSize,
          })
          .pipe(
            catchError((err) => {
              this.showError(err);
              return of({
                content: [],
                totalElements: 0,
                number: pageIndex,
                size: pageSize,
              } as PagedResponse<AdminOnboardingRequestRow>);
            }),
            finalize(() => this.loading.set(false)),
          )
      )
    ),
    {
      injector: this.injector,
      initialValue: { content: [], totalElements: 0, number: 0, size: 20 } as PagedResponse<AdminOnboardingRequestRow>,
    }
  );

  readonly total = computed(() => this.page().totalElements ?? 0);

  readonly statusOptions: Array<{ label: string; value: OnboardingStatus }> = [
    { label: 'Submitted', value: 'SUBMITTED' },
    { label: 'Under Review', value: 'UNDER_REVIEW' },
    { label: 'Need More Info', value: 'NEED_MORE_INFO' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  onPageChange(ev: PageEvent): void {
    this.pageIndex.set(ev.pageIndex);
    this.pageSize.set(ev.pageSize);
  }

  onStatusChange(value: OnboardingStatus): void {
    this.status.set(value);
    this.pageIndex.set(0);
  }

  onSearchChange(value: string): void {
    this.q.set(value);
    this.pageIndex.set(0);
  }

  refresh(): void {
    this.refresh$.next();
  }

  async viewDetails(row: AdminOnboardingRequestRow): Promise<void> {
    if (!row.id) return;

    try {
      this.setRowBusy(row.id, true);
      const detail = await firstValueFrom(this.api.getOnboardingRequest(row.id));
      this.dialog.open(AdminDetailDialogComponent, {
        width: '760px',
        data: {
          title: `Onboarding Request ${row.id}`,
          data: detail ?? row,
        },
      });
    } catch (err: any) {
      this.showError(err);
    } finally {
      this.setRowBusy(row.id, false);
    }
  }

  approve(row: AdminOnboardingRequestRow): void {
    if (!row.id) return;

    const ref = this.dialog.open(AdminNotesDialogComponent, {
      width: '520px',
      data: {
        title: 'Approve onboarding request',
        message: 'Optionally add admin notes for the requester.',
        confirmLabel: 'Approve',
        notesRequired: false,
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.runRowAction(
        row.id!,
        'APPROVE_ONBOARDING',
        () => this.api.approveOnboarding(row.id!, { adminNotes: result.notes }),
        { adminNotes: result.notes }
      );
    });
  }

  needMoreInfo(row: AdminOnboardingRequestRow): void {
    if (!row.id) return;

    const ref = this.dialog.open(AdminNotesDialogComponent, {
      width: '520px',
      data: {
        title: 'Request more info',
        message: 'Notes are required so the requester knows what to provide.',
        confirmLabel: 'Send request',
        notesRequired: true,
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.runRowAction(
        row.id!,
        'ONBOARDING_NEED_MORE_INFO',
        () => this.api.needMoreInfoOnboarding(row.id!, { adminNotes: result.notes }),
        { adminNotes: result.notes }
      );
    });
  }

  reject(row: AdminOnboardingRequestRow): void {
    if (!row.id) return;

    const ref = this.dialog.open(AdminNotesDialogComponent, {
      width: '520px',
      data: {
        title: 'Reject onboarding request',
        message: 'Notes are required for a rejection.',
        confirmLabel: 'Reject',
        notesRequired: true,
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;

      const confirmRef = this.dialog.open(AdminConfirmDialogComponent, {
        width: '480px',
        data: {
          title: 'Confirm rejection',
          message: 'This will mark the onboarding request as rejected.',
          confirmLabel: 'Reject',
        },
      });

      confirmRef.afterClosed().subscribe((confirmed) => {
        if (!confirmed) return;
        this.runRowAction(
          row.id!,
          'REJECT_ONBOARDING',
          () => this.api.rejectOnboarding(row.id!, { adminNotes: result.notes }),
          { adminNotes: result.notes }
        );
      });
    });
  }

  private runRowAction(
    id: string,
    action: string,
    call: () => Observable<void>,
    details?: Record<string, any>
  ): void {
    this.setRowBusy(id, true);

    call()
      .pipe(
        finalize(() => this.setRowBusy(id, false))
      )
      .subscribe({
        next: () => {
          this.telemetry.recordAdminAction({
            action,
            entityType: 'OnboardingRequest',
            entityId: id,
            outcome: 'SUCCESS',
            message: 'Action completed.',
            details,
          });
          this.snackBar.open('Action completed.', 'OK', { duration: 3000 });
          this.refresh();
          this.accessFacade.reload();
        },
        error: (err: any) => {
          this.telemetry.recordAdminAction({
            action,
            entityType: 'OnboardingRequest',
            entityId: id,
            outcome: 'FAILURE',
            message: this.friendlyError(err),
            details: { ...(details ?? {}), status: err?.status },
          });
          this.showError(err);
        },
      });
  }

  private setRowBusy(id: string, busy: boolean): void {
    const current = this.rowBusyMap();
    this.rowBusyMap.set({ ...current, [id]: busy });
  }

  private showError(err: any): void {
    const msg = this.friendlyError(err);
    this.snackBar.open(msg, 'OK', { duration: 4000 });
  }

  private friendlyError(err: any): string {
    const status = err?.status;
    if (status === 403) return 'Admin access required.';
    if (status === 404) return 'Item not found.';
    if (status === 0) return 'Network error. Please try again.';
    return err?.error?.message || 'Something went wrong.';
  }
}

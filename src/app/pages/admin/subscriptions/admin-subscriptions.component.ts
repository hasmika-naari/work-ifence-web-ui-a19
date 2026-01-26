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
  of,
  startWith,
  Subject,
  switchMap,
  tap,
  type Observable,
} from 'rxjs';
import type { AdminSubscriptionRow, PagedResponse } from 'src/app/models/admin.model';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { AdminApiService } from 'src/app/services/admin-api.service';
import { GateDeniedTelemetryService } from 'src/app/services/gate-denied-telemetry.service';
import { AdminConfirmDialogComponent } from '../dialogs/admin-confirm-dialog.component';
import { AdminExtendTrialDialogComponent } from '../dialogs/admin-extend-trial-dialog.component';
import { AdminTableShellComponent } from '../shared/admin-table-shell.component';

type SubscriberType = 'INDIVIDUAL' | 'ENTERPRISE' | '' | string;

type SubscriptionStatus = string;

@Component({
  selector: 'app-admin-subscriptions',
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

  readonly subscriberType = signal<SubscriberType>('');
  readonly status = signal<SubscriptionStatus>('');
  readonly q = signal<string>('');
  readonly pageIndex = signal<number>(0);
  readonly pageSize = signal<number>(20);

  private readonly refresh$ = new Subject<void>();

  readonly loading = signal<boolean>(false);

  private readonly rowBusyMap = signal<Record<string, boolean>>({});
  readonly isRowBusy = (id?: string) => !!(id && this.rowBusyMap()[id]);

  readonly displayedColumns = [
    'subscriberType',
    'subscriberId',
    'planCode',
    'status',
    'trialEndDate',
    'currentPeriodEnd',
    'provider',
    'actions',
  ];

  readonly page = toSignal(
    combineLatest({
      subscriberType: toObservable(this.subscriberType),
      status: toObservable(this.status),
      q: toObservable(this.q).pipe(debounceTime(250), distinctUntilChanged()),
      pageIndex: toObservable(this.pageIndex),
      pageSize: toObservable(this.pageSize),
      refresh: this.refresh$.pipe(startWith(void 0)),
    }).pipe(
      tap(() => this.loading.set(true)),
      switchMap(({ subscriberType, status, q, pageIndex, pageSize }) =>
        this.api
          .listSubscriptions({
            subscriberType: subscriberType || undefined,
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
              } as PagedResponse<AdminSubscriptionRow>);
            }),
            finalize(() => this.loading.set(false))
          )
      )
    ),
    {
      injector: this.injector,
      initialValue: { content: [], totalElements: 0, number: 0, size: 20 } as PagedResponse<AdminSubscriptionRow>,
    }
  );

  readonly total = computed(() => this.page().totalElements ?? 0);

  readonly subscriberTypeOptions: Array<{ label: string; value: SubscriberType }> = [
    { label: 'All', value: '' },
    { label: 'Individual', value: 'INDIVIDUAL' },
    { label: 'Enterprise', value: 'ENTERPRISE' },
  ];

  onPageChange(ev: PageEvent): void {
    this.pageIndex.set(ev.pageIndex);
    this.pageSize.set(ev.pageSize);
  }

  onSubscriberTypeChange(value: SubscriberType): void {
    this.subscriberType.set(value);
    this.pageIndex.set(0);
  }

  onStatusChange(value: SubscriptionStatus): void {
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

  extendTrial(row: AdminSubscriptionRow): void {
    if (!row.id) return;

    const ref = this.dialog.open(AdminExtendTrialDialogComponent, {
      width: '520px',
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.runRowAction(
        row.id!,
        'EXTEND_TRIAL',
        () => this.api.extendTrial(row.id!, { days: result.days, reason: result.reason }),
        { days: result.days, reason: result.reason }
      );
    });
  }

  endTrial(row: AdminSubscriptionRow): void {
    if (!row.id) return;

    const ref = this.dialog.open(AdminConfirmDialogComponent, {
      width: '480px',
      data: {
        title: 'End trial now',
        message: 'This will end the trial immediately.',
        confirmLabel: 'End trial',
      },
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.runRowAction(row.id!, 'END_TRIAL', () => this.api.endTrial(row.id!));
    });
  }

  activate(row: AdminSubscriptionRow): void {
    if (!row.id) return;

    const ref = this.dialog.open(AdminConfirmDialogComponent, {
      width: '480px',
      data: {
        title: 'Activate subscription',
        message: 'This will mark the subscription as active.',
        confirmLabel: 'Activate',
      },
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.runRowAction(row.id!, 'ACTIVATE_SUBSCRIPTION', () => this.api.activate(row.id!));
    });
  }

  suspend(row: AdminSubscriptionRow): void {
    if (!row.id) return;

    const ref = this.dialog.open(AdminConfirmDialogComponent, {
      width: '480px',
      data: {
        title: 'Suspend subscription',
        message: 'This will suspend the subscription.',
        confirmLabel: 'Suspend',
      },
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.runRowAction(row.id!, 'SUSPEND_SUBSCRIPTION', () => this.api.suspend(row.id!));
    });
  }

  private runRowAction(id: string, action: string, call: () => Observable<void>, details?: Record<string, any>): void {
    this.setRowBusy(id, true);

    call()
      .pipe(finalize(() => this.setRowBusy(id, false)))
      .subscribe({
        next: () => {
          this.telemetry.recordAdminAction({
            action,
            entityType: 'Subscription',
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
            entityType: 'Subscription',
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

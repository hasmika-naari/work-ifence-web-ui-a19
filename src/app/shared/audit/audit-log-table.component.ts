import { CommonModule } from '@angular/common';
import { Component, Injector, Input, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {
  Subject,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  finalize,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import type { AuditEventRow, AuditQuery, PagedResponse } from 'src/app/models/audit.model';
import { AdminDetailDialogComponent } from 'src/app/pages/admin/dialogs/admin-detail-dialog.component';

@Component({
  selector: 'app-audit-log-table',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  templateUrl: './audit-log-table.component.html',
  styleUrls: ['./audit-log-table.component.scss'],
})
export class AuditLogTableComponent {
  private readonly injector = inject(Injector);
  private readonly dialog = inject(MatDialog);

  @Input({ required: true }) fetchPage!: (query: AuditQuery) => import('rxjs').Observable<PagedResponse<AuditEventRow>>;

  /** Optional fallback data source, e.g. local browser history. Used when backend endpoints are missing/disabled. */
  @Input() fallbackPage?: (query: AuditQuery) => import('rxjs').Observable<PagedResponse<AuditEventRow>>;

  @Input() title = 'Audit Log';

  readonly eventType = signal<string>('');
  readonly q = signal<string>('');
  readonly actor = signal<string>('');

  readonly pageIndex = signal<number>(0);
  readonly pageSize = signal<number>(20);

  readonly loading = signal<boolean>(false);
  readonly auditUnavailable = signal<boolean>(false);
  readonly errorMessage = signal<string>('');

  private readonly refresh$ = new Subject<void>();

  readonly displayedColumns = ['timestamp', 'eventType', 'outcome', 'actor', 'action', 'entity', 'message', 'details'];

  readonly page = toSignal(
    combineLatest({
      eventType: toObservable(this.eventType),
      q: toObservable(this.q).pipe(debounceTime(250), distinctUntilChanged()),
      actor: toObservable(this.actor).pipe(debounceTime(250), distinctUntilChanged()),
      pageIndex: toObservable(this.pageIndex),
      pageSize: toObservable(this.pageSize),
      refresh: this.refresh$.pipe(startWith(void 0)),
    }).pipe(
      tap(() => {
        this.loading.set(true);
        this.errorMessage.set('');
      }),
      switchMap(({ eventType, q, actor, pageIndex, pageSize }) => {
        if (!this.fetchPage) {
          return of({ content: [], totalElements: 0, number: pageIndex, size: pageSize } as PagedResponse<AuditEventRow>);
        }

        const query: AuditQuery = {
          page: pageIndex,
          size: pageSize,
          eventType: eventType || undefined,
          q: q?.trim() || undefined,
          actor: actor?.trim() || undefined,
          sort: 'timestamp,desc',
        };

        return this.fetchPage(query).pipe(
          catchError((err: any) => {
            const status = err?.status;
            if ((status === 404 || status === 501) && this.fallbackPage) {
              this.auditUnavailable.set(true);
              this.errorMessage.set('Audit service is not enabled on the backend. Showing local history (if available).');
              return this.fallbackPage(query).pipe(
                catchError(() =>
                  of({ content: [], totalElements: 0, number: pageIndex, size: pageSize } as PagedResponse<AuditEventRow>)
                )
              );
            }

            if (status === 404 || status === 501) {
              this.auditUnavailable.set(true);
              this.errorMessage.set('Audit service is not enabled on the backend.');
            } else if (status === 403) {
              this.errorMessage.set('Access denied.');
            } else if (status === 0) {
              this.errorMessage.set('Network error.');
            } else {
              this.errorMessage.set(err?.error?.message || 'Failed to load audit events.');
            }

            return of({ content: [], totalElements: 0, number: pageIndex, size: pageSize } as PagedResponse<AuditEventRow>);
          }),
          finalize(() => this.loading.set(false))
        );
      })
    ),
    {
      injector: this.injector,
      initialValue: { content: [], totalElements: 0, number: 0, size: 20 } as PagedResponse<AuditEventRow>,
    }
  );

  readonly total = computed(() => this.page().totalElements ?? 0);

  readonly eventTypeOptions: Array<{ label: string; value: string }> = [
    { label: 'All', value: '' },
    { label: 'Gate denied', value: 'GATE_DENIED' },
    { label: 'Admin action', value: 'ADMIN_ACTION' },
  ];

  refresh(): void {
    this.refresh$.next();
  }

  onPageChange(ev: PageEvent): void {
    this.pageIndex.set(ev.pageIndex);
    this.pageSize.set(ev.pageSize);
  }

  onEventTypeChange(value: string): void {
    this.eventType.set(value);
    this.pageIndex.set(0);
  }

  onSearchChange(value: string): void {
    this.q.set(value);
    this.pageIndex.set(0);
  }

  onActorChange(value: string): void {
    this.actor.set(value);
    this.pageIndex.set(0);
  }

  actorLabel(row: AuditEventRow): string {
    const email = row.actorEmail ? String(row.actorEmail) : '';
    const userId = row.actorUserId ? String(row.actorUserId) : '';
    const mode = row.actorMode ? String(row.actorMode) : '';
    const base = email || userId || '-';
    return mode ? `${base} (${mode})` : base;
  }

  entityLabel(row: AuditEventRow): string {
    const t = row.entityType ? String(row.entityType) : '';
    const id = row.entityId ? String(row.entityId) : '';
    if (!t && !id) return '-';
    return id ? `${t}:${id}` : t;
  }

  viewDetails(row: AuditEventRow): void {
    this.dialog.open(AdminDetailDialogComponent, {
      width: '820px',
      data: {
        title: `${row.eventType} • ${row.outcome}`,
        data: row,
      },
    });
  }
}

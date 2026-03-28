import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { BehaviorSubject, EMPTY, combineLatest, of } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { expand, reduce } from 'rxjs/operators';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { DashboardContextService } from 'src/app/services/dashboard-context.service';
import { UpgradeDrawerService } from 'src/app/shared/upgrade-drawer/upgrade-drawer.service';
import { EnterpriseApiService, EnterpriseRelationDto, PageDto } from 'src/app/services/enterprise-api.service';
import { isEntitlementError, isSeatLimitError, parseBackendError, toFriendlyErrorMessage } from 'src/app/utils/api-error';
import { EnterpriseInviteDialogComponent } from './enterprise-invite-dialog.component';

@Component({
  selector: 'wif-enterprise-members-page',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
  ],
  templateUrl: './enterprise-members-page.component.html',
  styleUrls: ['./enterprise-members-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseMembersPageComponent {
  private readonly accessFacade = inject(AccessFacadeService);
  private readonly enterpriseApi = inject(EnterpriseApiService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly dashboardContext = inject(DashboardContextService);
  private readonly upgradeDrawer = inject(UpgradeDrawerService);

  readonly accessMe = this.accessFacade.accessMeSignal;
  readonly enterpriseId = computed(() => this.accessMe()?.enterpriseId ?? '');

  readonly entLimit = computed(() => this.accessMe()?.entitlements?.enterpriseUsersLimit);

  readonly pageIndex = signal(0);
  readonly pageSize = signal(20);
  private readonly refresh$ = new BehaviorSubject<void>(void 0);
  private readonly page$ = new BehaviorSubject<{ page: number; size: number }>({ page: 0, size: 20 });

  readonly displayedColumns = ['userName', 'email', 'role', 'membershipStatus', 'startDate', 'invitedBy', 'actions'];

  private isSeatUsed(status?: string): boolean {
    const s = (status ?? '').toString().toUpperCase();
    return s === 'ACTIVE' || s === 'INVITED';
  }

  private fetchAllRelations$(enterpriseId: string) {
    const size = 200;
    return this.enterpriseApi.listRelations(enterpriseId, 0, size).pipe(
      expand((res) => {
        const page = res.number ?? 0;
        const total = res.totalElements ?? 0;
        const nextPage = page + 1;
        const loaded = nextPage * size;
        if (loaded >= total) return EMPTY;
        return this.enterpriseApi.listRelations(enterpriseId, nextPage, size);
      }),
      map((res) => res.content ?? []),
      reduce((acc, content) => acc.concat(content), [] as EnterpriseRelationDto[])
    );
  }

  readonly vm$ = combineLatest([
    this.accessFacade.accessMe$.pipe(
      filter((me) => !!me?.enterpriseId),
      distinctUntilChanged((a, b) => (a?.enterpriseId ?? '') === (b?.enterpriseId ?? ''))
    ),
    this.page$,
    this.refresh$,
  ]).pipe(
    map(([me, pageState]) => ({ me, enterpriseId: me?.enterpriseId ?? '', page: pageState.page, size: pageState.size })),
    switchMap(({ me, enterpriseId, page, size }) => {
      const limit = me?.entitlements?.enterpriseUsersLimit;

      return combineLatest([
        this.enterpriseApi.listRelations(enterpriseId, page, size),
        this.fetchAllRelations$(enterpriseId).pipe(catchError(() => of([] as EnterpriseRelationDto[]))),
      ]).pipe(
        map(([paged, all]) => {
          const usedSeats = all.filter((r) => this.isSeatUsed(r.membershipStatus)).length;
          const seatsFull = typeof limit === 'number' ? usedSeats >= limit : false;
          const seatsTooltip = seatsFull ? 'Seat limit reached, upgrade to invite more members.' : '';

          return {
            loading: false,
            page: paged,
            usedSeats,
            seatsFull,
            seatsTooltip,
            seatLimit: limit,
          };
        }),
        catchError((err) => {
          const parsed = parseBackendError(err);
          const msg = toFriendlyErrorMessage(parsed);
          if (isEntitlementError(parsed) || isSeatLimitError(parsed)) {
            this.upgradeDrawer.openForContext('ENTERPRISE', {
              title: 'Enterprise upgrade required',
              message: msg,
              returnUrl: this.router.url,
            });
          }
          return of({
            loading: false,
            error: msg,
            page: { content: [], totalElements: 0, number: page, size } as PageDto<EnterpriseRelationDto>,
            usedSeats: 0,
            seatsFull: false,
            seatsTooltip: '',
            seatLimit: limit,
          });
        }),
        startWith({ loading: true } as any)
      );
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  onPage(e: PageEvent) {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
    this.page$.next({ page: e.pageIndex, size: e.pageSize });
    this.refresh();
  }

  refresh() {
    this.refresh$.next();
  }

  openInvite(usedSeats: number, limit?: number) {
    this.dashboardContext.setEnterprise();

    if (typeof limit === 'number' && usedSeats >= limit) {
      this.snackBar.open('Seat limit reached, upgrade to invite more members.', 'OK', { duration: 3500 });
      this.upgradeDrawer.openForContext('ENTERPRISE', {
        title: 'Upgrade for more seats',
        message: 'Your team has reached its seat limit. Upgrade your enterprise plan to invite more members.',
        returnUrl: this.router.url,
      });
      return;
    }

    const ref = this.dialog.open(EnterpriseInviteDialogComponent, { width: '520px' });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;

      const enterpriseId = this.enterpriseId();
      if (!enterpriseId) return;

      const payload = {
        enterpriseId,
        email: result.email,
        role: result.role,
        note: result.note,
      };

      this.enterpriseApi.inviteMember(payload).subscribe({
        next: () => {
          this.snackBar.open('Invite sent', 'OK', { duration: 2500 });
          this.refresh();
        },
        error: (err) => {
          const parsed = parseBackendError(err);
          const msg = toFriendlyErrorMessage(parsed);
          this.snackBar.open(msg, 'OK', { duration: 4000 });
          if (isEntitlementError(parsed) || isSeatLimitError(parsed)) {
            this.upgradeDrawer.openForContext('ENTERPRISE', {
              title: isSeatLimitError(parsed) ? 'Upgrade for more seats' : 'Upgrade your enterprise plan',
              message: isSeatLimitError(parsed) ? 'This action needs more enterprise seats. Upgrade your plan to continue inviting members.' : `${msg} Review your enterprise plan to continue managing members.`,
              returnUrl: this.router.url,
            });
          }
        },
      });
    });
  }

  activate(id?: string) {
    if (!id) return;
    this.enterpriseApi.activateRelation(id).subscribe({
      next: () => {
        this.snackBar.open('Member activated', 'OK', { duration: 2000 });
        this.refresh();
      },
      error: (err) => this.snackBar.open(toFriendlyErrorMessage(parseBackendError(err)), 'OK', { duration: 4000 }),
    });
  }

  suspend(id?: string) {
    if (!id) return;
    this.enterpriseApi.suspendRelation(id).subscribe({
      next: () => {
        this.snackBar.open('Member suspended', 'OK', { duration: 2000 });
        this.refresh();
      },
      error: (err) => this.snackBar.open(toFriendlyErrorMessage(parseBackendError(err)), 'OK', { duration: 4000 }),
    });
  }

  remove(id?: string) {
    if (!id) return;
    this.enterpriseApi.removeRelation(id).subscribe({
      next: () => {
        this.snackBar.open('Member removed', 'OK', { duration: 2000 });
        this.refresh();
      },
      error: (err) => {
        const parsed = parseBackendError(err);
        this.snackBar.open(toFriendlyErrorMessage(parsed), 'OK', { duration: 4000 });
        if (isEntitlementError(parsed) || isSeatLimitError(parsed)) {
          this.upgradeDrawer.openForContext('ENTERPRISE', {
            title: isSeatLimitError(parsed) ? 'Upgrade for more seats' : 'Upgrade your enterprise plan',
            message: isSeatLimitError(parsed) ? 'This action needs more enterprise seats. Upgrade your plan to continue managing members.' : `${toFriendlyErrorMessage(parsed)} Review your enterprise plan to continue managing members.`,
            returnUrl: this.router.url,
          });
        }
      },
    });
  }
}

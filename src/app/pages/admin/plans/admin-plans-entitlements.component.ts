import { CommonModule } from '@angular/common';
import { Component, Injector, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  of,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import type {
  PlanEntitlementDto,
  PagedResponse,
  PlanScope,
  SubscriptionPlanDto,
  WifenceServiceDto,
} from 'src/app/models/plan-admin.model';
import { PlanAdminApiService } from 'src/app/services/plan-admin-api.service';
import { GateDeniedTelemetryService } from 'src/app/services/gate-denied-telemetry.service';
import { AdminConfirmDialogComponent } from '../dialogs/admin-confirm-dialog.component';
import { AdminAddEntitlementDialogComponent } from './admin-add-entitlement-dialog.component';

@Component({
  selector: 'app-admin-plans-entitlements',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  templateUrl: './admin-plans-entitlements.component.html',
  styleUrls: ['./admin-plans-entitlements.component.scss'],
})
export class AdminPlansEntitlementsComponent {
  private readonly injector = inject(Injector);
  private readonly api = inject(PlanAdminApiService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly accessFacade = inject(AccessFacadeService);
  private readonly telemetry = inject(GateDeniedTelemetryService);

  // Left-side filters
  readonly scope = signal<PlanScope | ''>('');
  readonly isActive = signal<boolean>(true);
  readonly search = signal<string>('');

  // Plans pagination
  readonly plansPageIndex = signal<number>(0);
  readonly plansPageSize = signal<number>(20);

  // Selection
  readonly selectedPlanId = signal<string | number | null>(null);

  // Refresh triggers
  private readonly refreshPlans$ = new Subject<void>();
  private readonly refreshEntitlements$ = new Subject<void>();

  readonly plansLoading = signal<boolean>(false);
  readonly entLoading = signal<boolean>(false);
  readonly savingPlan = signal<boolean>(false);

  readonly servicesPage = toSignal(
    this.api.listServices().pipe(
      catchError(() => of({ content: [], totalElements: 0, number: 0, size: 0 } as PagedResponse<WifenceServiceDto>))
    ),
    {
      injector: this.injector,
      initialValue: { content: [], totalElements: 0, number: 0, size: 0 } as PagedResponse<WifenceServiceDto>,
    }
  );

  readonly plansPage = toSignal(
    combineLatest({
      scope: toObservable(this.scope),
      active: toObservable(this.isActive),
      search: toObservable(this.search).pipe(debounceTime(250), distinctUntilChanged()),
      pageIndex: toObservable(this.plansPageIndex),
      pageSize: toObservable(this.plansPageSize),
      refresh: this.refreshPlans$.pipe(startWith(void 0)),
    }).pipe(
      switchMap(({ scope, active, search, pageIndex, pageSize }) => {
        this.plansLoading.set(true);
        return this.api
          .listPlans({
            scope: scope || undefined,
            isActive: active,
            page: pageIndex,
            size: pageSize,
            sort: 'sortOrder,asc',
          })
          .pipe(
            map((page) => {
              const normalized = { ...page, content: page.content ?? [] };
              const term = (search ?? '').trim().toLowerCase();
              if (!term) return normalized;
              const filtered = normalized.content.filter((p) => {
                const code = (p.code ?? '').toLowerCase();
                const name = (p.name ?? '').toLowerCase();
                return code.includes(term) || name.includes(term);
              });
              return { ...normalized, content: filtered };
            }),
            catchError((err) => {
              this.showError(err);
              return of({ content: [], totalElements: 0, number: pageIndex, size: pageSize } as PagedResponse<SubscriptionPlanDto>);
            }),
            finalize(() => this.plansLoading.set(false))
          );
      })
    ),
    {
      injector: this.injector,
      initialValue: { content: [], totalElements: 0, number: 0, size: 20 } as PagedResponse<SubscriptionPlanDto>,
    }
  );

  readonly plansTotal = computed(() => this.plansPage().totalElements ?? 0);

  readonly selectedPlan = signal<SubscriptionPlanDto | null>(null);

  // Plan form
  readonly planForm = new FormGroup({
    id: new FormControl<string | number | null>(null),
    code: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    scope: new FormControl<PlanScope>('INDIVIDUAL', { nonNullable: true, validators: [Validators.required] }),
    billingInterval: new FormControl<string>('MONTHLY', { nonNullable: true }),
    price: new FormControl<number | null>(null),
    currency: new FormControl<string>('USD', { nonNullable: true }),
    isActive: new FormControl<boolean>(true, { nonNullable: true }),
    trialDays: new FormControl<number | null>(null),

    resumeLimit: new FormControl<number | null>(null),
    templateAccessLevel: new FormControl<string>('BASIC', { nonNullable: true }),
    jobTrackingEnabled: new FormControl<boolean>(false, { nonNullable: true }),
    courseCentralEnabled: new FormControl<boolean>(false, { nonNullable: true }),
    alertsEnabled: new FormControl<boolean>(false, { nonNullable: true }),
    enterpriseUsersLimit: new FormControl<number | null>(null),
    storageLimitMb: new FormControl<number | null>(null),

    marketingTitle: new FormControl<string>('', { nonNullable: true }),
    marketingSubtitle: new FormControl<string>('', { nonNullable: true }),
    sortOrder: new FormControl<number | null>(null),

    featuresJson: new FormControl<string>('', { nonNullable: true }),
  });

  readonly featuresJsonError = signal<string>('');

  // Entitlements
  readonly entPageIndex = signal<number>(0);
  readonly entPageSize = signal<number>(20);
  readonly entDisplayedColumns = [
    'service',
    'included',
    'addonAllowed',
    'defaultQuantity',
    'status',
    'actions',
  ];

  private readonly entRowBusyMap = signal<Record<string, boolean>>({});
  readonly isEntRowBusy = (id?: string | number) => !!(id !== undefined && this.entRowBusyMap()[String(id)]);

  readonly entPage = toSignal(
    combineLatest({
      planId: toObservable(this.selectedPlanId),
      pageIndex: toObservable(this.entPageIndex),
      pageSize: toObservable(this.entPageSize),
      refresh: this.refreshEntitlements$.pipe(startWith(void 0)),
    }).pipe(
      switchMap(({ planId, pageIndex, pageSize }) => {
        if (!planId) {
          return of({ content: [], totalElements: 0, number: 0, size: pageSize } as PagedResponse<PlanEntitlementDto>);
        }

        this.entLoading.set(true);
        return this.api
          .listEntitlements({ planId, page: pageIndex, size: pageSize })
          .pipe(
            catchError((err) => {
              this.showError(err);
              return of({ content: [], totalElements: 0, number: pageIndex, size: pageSize } as PagedResponse<PlanEntitlementDto>);
            }),
            finalize(() => this.entLoading.set(false))
          );
      })
    ),
    {
      injector: this.injector,
      initialValue: { content: [], totalElements: 0, number: 0, size: 20 } as PagedResponse<PlanEntitlementDto>,
    }
  );

  readonly entTotal = computed(() => this.entPage().totalElements ?? 0);

  onPlansPageChange(ev: PageEvent): void {
    this.plansPageIndex.set(ev.pageIndex);
    this.plansPageSize.set(ev.pageSize);
  }

  onEntPageChange(ev: PageEvent): void {
    this.entPageIndex.set(ev.pageIndex);
    this.entPageSize.set(ev.pageSize);
  }

  refreshPlans(): void {
    this.refreshPlans$.next();
  }

  refreshEntitlements(): void {
    this.refreshEntitlements$.next();
  }

  newPlan(): void {
    this.selectedPlanId.set(null);
    this.selectedPlan.set(null);
    this.planForm.reset({
      id: null,
      code: '',
      name: '',
      scope: 'INDIVIDUAL',
      billingInterval: 'MONTHLY',
      price: null,
      currency: 'USD',
      isActive: true,
      trialDays: null,

      resumeLimit: null,
      templateAccessLevel: 'BASIC',
      jobTrackingEnabled: false,
      courseCentralEnabled: false,
      alertsEnabled: false,
      enterpriseUsersLimit: null,
      storageLimitMb: null,

      marketingTitle: '',
      marketingSubtitle: '',
      sortOrder: null,

      featuresJson: '',
    });
    this.featuresJsonError.set('');
    this.entPageIndex.set(0);
    this.refreshEntitlements();
  }

  selectPlan(plan: SubscriptionPlanDto): void {
    if (!plan.id) return;

    this.selectedPlanId.set(plan.id);
    this.selectedPlan.set(plan);

    this.planForm.patchValue({
      id: plan.id ?? null,
      code: plan.code ?? '',
      name: plan.name ?? '',
      scope: (plan.scope ?? 'INDIVIDUAL') as PlanScope,
      billingInterval: plan.billingInterval ?? 'MONTHLY',
      price: plan.price ?? null,
      currency: plan.currency ?? 'USD',
      isActive: plan.isActive ?? true,
      trialDays: plan.trialDays ?? null,

      resumeLimit: plan.resumeLimit ?? null,
      templateAccessLevel: (plan.templateAccessLevel ?? 'BASIC') as string,
      jobTrackingEnabled: plan.jobTrackingEnabled ?? false,
      courseCentralEnabled: plan.courseCentralEnabled ?? false,
      alertsEnabled: plan.alertsEnabled ?? false,
      enterpriseUsersLimit: plan.enterpriseUsersLimit ?? null,
      storageLimitMb: plan.storageLimitMb ?? null,

      marketingTitle: plan.marketingTitle ?? '',
      marketingSubtitle: plan.marketingSubtitle ?? '',
      sortOrder: plan.sortOrder ?? null,

      featuresJson: plan.featuresJson ?? '',
    });

    this.featuresJsonError.set('');
    this.entPageIndex.set(0);
    this.refreshEntitlements();
  }

  validateJson(): boolean {
    const raw = (this.planForm.controls.featuresJson.value ?? '').trim();
    if (!raw) {
      this.featuresJsonError.set('');
      return true;
    }

    try {
      JSON.parse(raw);
      this.featuresJsonError.set('');
      return true;
    } catch (e: any) {
      this.featuresJsonError.set(e?.message ?? 'Invalid JSON');
      return false;
    }
  }

  prettifyJson(): void {
    const raw = (this.planForm.controls.featuresJson.value ?? '').trim();
    if (!raw) {
      this.featuresJsonError.set('');
      return;
    }

    try {
      const obj = JSON.parse(raw);
      this.planForm.controls.featuresJson.setValue(JSON.stringify(obj, null, 2));
      this.featuresJsonError.set('');
    } catch (e: any) {
      this.featuresJsonError.set(e?.message ?? 'Invalid JSON');
    }
  }

  savePlan(): void {
    if (this.planForm.invalid) {
      this.planForm.markAllAsTouched();
      return;
    }

    if (!this.validateJson()) return;

    const dto = this.toPlanDto();

    this.savingPlan.set(true);
    this.api
      .savePlan(dto)
      .pipe(finalize(() => this.savingPlan.set(false)))
      .subscribe({
        next: (saved) => {
          this.telemetry.recordAdminAction({
            action: 'SAVE_PLAN',
            entityType: 'SubscriptionPlan',
            entityId: saved?.id ? String(saved.id) : dto.id ? String(dto.id) : undefined,
            outcome: 'SUCCESS',
            message: 'Plan saved.',
            details: { code: saved?.code ?? dto.code, scope: saved?.scope ?? dto.scope },
          });
          this.snackBar.open('Plan saved.', 'OK', { duration: 3000 });
          this.accessFacade.reload();
          this.refreshPlans();
          if (saved.id) {
            this.selectedPlanId.set(saved.id);
            this.selectedPlan.set(saved);
            this.planForm.controls.id.setValue(saved.id);
          }
        },
        error: (err) => {
          this.telemetry.recordAdminAction({
            action: 'SAVE_PLAN',
            entityType: 'SubscriptionPlan',
            entityId: dto.id ? String(dto.id) : undefined,
            outcome: 'FAILURE',
            message: err?.error?.message || 'Failed to save plan.',
            details: { code: dto.code, scope: dto.scope, status: err?.status },
          });
          this.showError(err);
        },
      });
  }

  addEntitlement(): void {
    const planId = this.selectedPlanId();
    if (!planId) {
      this.snackBar.open('Select a plan first.', 'OK', { duration: 2500 });
      return;
    }

    const services = this.servicesPage().content ?? [];
    const ref = this.dialog.open(AdminAddEntitlementDialogComponent, {
      width: '560px',
      data: { mode: 'create', services },
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;

      const ent: PlanEntitlementDto = {
        planId,
        serviceId: result.serviceId,
        serviceCode: result.serviceCode,
        included: result.included,
        isAddonAllowed: result.isAddonAllowed,
        defaultQuantity: result.defaultQuantity,
        status: result.status,
        notes: result.notes,
      };

      this.saveEntitlement(ent);
    });
  }

  editEntitlement(row: PlanEntitlementDto): void {
    const planId = this.selectedPlanId();
    if (!planId || !row) return;

    const services = this.servicesPage().content ?? [];
    const ref = this.dialog.open(AdminAddEntitlementDialogComponent, {
      width: '560px',
      data: { mode: 'edit', services, entitlement: row },
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;

      const updated: PlanEntitlementDto = {
        ...row,
        id: row.id ?? result.id,
        planId,
        included: result.included,
        isAddonAllowed: result.isAddonAllowed,
        defaultQuantity: result.defaultQuantity,
        status: result.status,
        notes: result.notes,
      };

      this.saveEntitlement(updated);
    });
  }

  saveEntitlement(ent: PlanEntitlementDto): void {
    const key = String(ent.id ?? `${ent.planId}:${ent.serviceCode ?? ent.serviceId ?? 'new'}`);
    this.setEntBusy(key, true);

    this.api
      .saveEntitlement(ent)
      .pipe(finalize(() => this.setEntBusy(key, false)))
      .subscribe({
        next: () => {
          this.telemetry.recordAdminAction({
            action: 'SAVE_ENTITLEMENT',
            entityType: 'PlanEntitlement',
            entityId: ent.id ? String(ent.id) : undefined,
            outcome: 'SUCCESS',
            message: 'Entitlement saved.',
            details: { planId: ent.planId, serviceCode: ent.serviceCode, serviceId: ent.serviceId },
          });
          this.snackBar.open('Entitlement saved.', 'OK', { duration: 2500 });
          this.accessFacade.reload();
          this.refreshEntitlements();
        },
        error: (err) => {
          this.telemetry.recordAdminAction({
            action: 'SAVE_ENTITLEMENT',
            entityType: 'PlanEntitlement',
            entityId: ent.id ? String(ent.id) : undefined,
            outcome: 'FAILURE',
            message: err?.error?.message || 'Failed to save entitlement.',
            details: { planId: ent.planId, serviceCode: ent.serviceCode, serviceId: ent.serviceId, status: err?.status },
          });
          this.showError(err);
        },
      });
  }

  deleteEntitlement(ent: PlanEntitlementDto): void {
    if (!ent.id) return;

    const ref = this.dialog.open(AdminConfirmDialogComponent, {
      width: '480px',
      data: {
        title: 'Remove entitlement',
        message: 'This will remove the entitlement from the plan.',
        confirmLabel: 'Remove',
      },
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      const key = String(ent.id);
      this.setEntBusy(key, true);

      this.api
        .deleteEntitlement(ent.id!)
        .pipe(finalize(() => this.setEntBusy(key, false)))
        .subscribe({
          next: () => {
            this.telemetry.recordAdminAction({
              action: 'DELETE_ENTITLEMENT',
              entityType: 'PlanEntitlement',
              entityId: ent.id ? String(ent.id) : undefined,
              outcome: 'SUCCESS',
              message: 'Entitlement removed.',
              details: { planId: ent.planId, serviceCode: ent.serviceCode, serviceId: ent.serviceId },
            });
            this.snackBar.open('Entitlement removed.', 'OK', { duration: 2500 });
            this.accessFacade.reload();
            this.refreshEntitlements();
          },
          error: (err) => {
            this.telemetry.recordAdminAction({
              action: 'DELETE_ENTITLEMENT',
              entityType: 'PlanEntitlement',
              entityId: ent.id ? String(ent.id) : undefined,
              outcome: 'FAILURE',
              message: err?.error?.message || 'Failed to remove entitlement.',
              details: { planId: ent.planId, serviceCode: ent.serviceCode, serviceId: ent.serviceId, status: err?.status },
            });
            this.showError(err);
          },
        });
    });
  }

  serviceNameFor(code?: string): string {
    if (!code) return '';
    const svc = (this.servicesPage().content ?? []).find((s) => s.code === code);
    return svc?.name ?? '';
  }

  private setEntBusy(key: string, busy: boolean): void {
    const current = this.entRowBusyMap();
    this.entRowBusyMap.set({ ...current, [key]: busy });
  }

  private toPlanDto(): SubscriptionPlanDto {
    const v = this.planForm.getRawValue();

    return {
      id: v.id ?? undefined,
      code: v.code?.trim() || undefined,
      name: v.name?.trim() || undefined,
      scope: v.scope,
      billingInterval: v.billingInterval || undefined,
      price: v.price ?? undefined,
      currency: v.currency?.trim() || undefined,
      isActive: v.isActive,
      trialDays: v.trialDays ?? undefined,

      resumeLimit: v.resumeLimit ?? undefined,
      templateAccessLevel: v.templateAccessLevel || undefined,
      jobTrackingEnabled: v.jobTrackingEnabled,
      courseCentralEnabled: v.courseCentralEnabled,
      alertsEnabled: v.alertsEnabled,
      enterpriseUsersLimit: v.enterpriseUsersLimit ?? undefined,
      storageLimitMb: v.storageLimitMb ?? undefined,

      marketingTitle: v.marketingTitle?.trim() || undefined,
      marketingSubtitle: v.marketingSubtitle?.trim() || undefined,
      sortOrder: v.sortOrder ?? undefined,

      featuresJson: v.featuresJson?.trim() || undefined,
    };
  }

  private showError(err: any): void {
    const status = err?.status;
    if (status === 403) {
      this.snackBar.open('Admin access required.', 'OK', { duration: 3500 });
      return;
    }
    const msg = err?.error?.message || 'Something went wrong.';
    this.snackBar.open(msg, 'OK', { duration: 4000 });
  }
}

import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, Observable, combineLatest, of, switchMap } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, shareReplay, startWith } from 'rxjs/operators';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { EnterpriseApiService, EnterpriseProfileDto } from 'src/app/services/enterprise-api.service';
import { DashboardContextService } from 'src/app/services/dashboard-context.service';
import { parseBackendError, toFriendlyErrorMessage, isEntitlementError } from 'src/app/utils/api-error';
import { Router } from '@angular/router';

@Component({
  selector: 'wif-enterprise-org-page',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './enterprise-org-page.component.html',
  styleUrls: ['./enterprise-org-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseOrgPageComponent {
  private readonly accessFacade = inject(AccessFacadeService);
  private readonly enterpriseApi = inject(EnterpriseApiService);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly dashboardContext = inject(DashboardContextService);

  private readonly refresh$ = new BehaviorSubject<void>(void 0);

  readonly accessMe = this.accessFacade.accessMeSignal;
  readonly enterpriseId: Signal<string> = computed(() => this.accessMe()?.enterpriseId ?? '');

  readonly vm$: Observable<{ loading: boolean; profile?: EnterpriseProfileDto; error?: string }> = combineLatest([
    this.refresh$,
    this.accessFacade.accessMe$,
  ]).pipe(
    map(([, me]) => me?.enterpriseId ?? ''),
    filter((id) => !!id),
    distinctUntilChanged(),
    switchMap((enterpriseId) =>
      this.enterpriseApi.getEnterpriseProfile(enterpriseId).pipe(
        map((profile) => ({ loading: false, profile })),
        catchError((err) => {
          const parsed = parseBackendError(err);
          const msg = toFriendlyErrorMessage(parsed);
          if (isEntitlementError(parsed)) {
            void this.router.navigate(['/pricing'], { queryParams: { scope: 'enterprise' } });
          }
          return of({ loading: false, error: msg });
        }),
        // emit loading state before request resolves
        startWith({ loading: true } as any)
      )
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly editing = signal(false);
  readonly saving = signal(false);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    description: [''],
    imageUrl: [''],
    emailId: ['', [Validators.email]],
    contactPh: [''],
    website: [''],
    linkedin: [''],
  });

  enterEdit(profile?: EnterpriseProfileDto) {
    if (!profile) return;

    // Ensure enterprise context when editing org
    this.dashboardContext.setEnterprise();

    this.form.reset(
      {
        name: profile.name ?? '',
        description: profile.description ?? '',
        imageUrl: profile.imageUrl ?? '',
        emailId: profile.emailId ?? '',
        contactPh: profile.contactPh ?? '',
        website: profile.website ?? '',
        linkedin: profile.linkedin ?? '',
      },
      { emitEvent: false }
    );
    this.editing.set(true);
  }

  cancelEdit() {
    this.editing.set(false);
  }

  save(profile?: EnterpriseProfileDto) {
    const enterpriseId = this.enterpriseId();
    if (!enterpriseId) return;
    if (!profile) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload: Partial<EnterpriseProfileDto> = {
      name: raw.name ?? undefined,
      description: raw.description ?? undefined,
      imageUrl: raw.imageUrl ?? undefined,
      emailId: raw.emailId ?? undefined,
      contactPh: raw.contactPh ?? undefined,
      website: raw.website ?? undefined,
      linkedin: raw.linkedin ?? undefined,
    };

    this.saving.set(true);
    this.enterpriseApi.updateEnterpriseProfile(enterpriseId, payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.editing.set(false);
        this.snackBar.open('Enterprise profile updated', 'OK', { duration: 2500 });
        this.refresh$.next();
      },
      error: (err) => {
        this.saving.set(false);
        const msg = toFriendlyErrorMessage(parseBackendError(err));
        this.snackBar.open(msg, 'OK', { duration: 4000 });
      },
    });
  }
}

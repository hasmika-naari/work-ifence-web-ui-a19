import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AppAdminDashboardSummary } from 'src/app/pages/dashboard-app-admin/app-admin-dashboard.api.models';
import { AppAdminDashboardService } from 'src/app/pages/dashboard-app-admin/app-admin-dashboard.service';
import { SessionContextStore } from './session-context.store';

@Injectable({ providedIn: 'root' })
export class AppAdminDashboardStore {
  private readonly dashboardService = inject(AppAdminDashboardService);
  private readonly sessionContext = inject(SessionContextStore);

  private readonly _summary = signal<AppAdminDashboardSummary | null>(null);
  readonly summary = this._summary.asReadonly();

  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private readonly _error = signal<string>('');
  readonly error = this._error.asReadonly();

  constructor() {
    this.sessionContext.selectedRole$.subscribe((role) => {
      if (!this.isAdminRole(role)) {
        this.reset();
      }
    });
  }

  loadSummary(): Observable<AppAdminDashboardSummary> {
    this._loading.set(true);
    this._error.set('');

    return this.dashboardService.getSummary().pipe(
      tap({
        next: (summary) => {
          this._summary.set(summary);
          this._loading.set(false);
        },
        error: () => {
          this._error.set('Unable to load admin dashboard summary.');
          this._loading.set(false);
        },
      }),
    );
  }

  load(): Observable<AppAdminDashboardSummary> {
    return this.loadSummary();
  }

  reset(): void {
    this._summary.set(null);
    this._loading.set(false);
    this._error.set('');
  }

  private isAdminRole(role: string | null): boolean {
    const normalized = (role ?? '').toUpperCase();
    return normalized === 'ROLE_ADMIN' || normalized === 'PLATFORM_ADMIN';
  }
}

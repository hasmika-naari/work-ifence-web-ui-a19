import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, map, of, shareReplay, startWith, switchMap } from 'rxjs';
import { DashboardApiService } from '../services/dashboard-api.service';
import { DashboardVm } from '../models/dashboard.dto';

@Injectable({ providedIn: 'root' })
export class DashboardFacadeService {
  private readonly refresh$ = new Subject<void>();

  readonly vm$: Observable<DashboardVm> = this.refresh$.pipe(
    startWith(void 0),
    switchMap(() =>
      this.dashboardApi.getMyDashboard().pipe(
        map((me) => ({ mode: 'PERSONAL' as const, me, loading: false })),
        startWith({ mode: 'PERSONAL' as const, loading: true } as DashboardVm),
        catchError((err: any) =>
          of({
            mode: 'PERSONAL' as const,
            loading: false,
            error: err?.userMessage || 'Failed to load your dashboard. Please try again.',
          })
        )
      )
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(private readonly dashboardApi: DashboardApiService) {}

  reload(): void {
    this.refresh$.next();
  }
}

import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { finalize, shareReplay, tap } from 'rxjs/operators';
import { MyDashboardApi } from '../api/my-dashboard.api';
import { MyEntitlementsDTO } from '../models/my-entitlements.model';
import { MyDashboardDTO } from '../models/my-dashboard.model';

@Injectable({ providedIn: 'root' })
export class MyContextStore {
  private readonly api = inject(MyDashboardApi);

  private readonly entitlementsSubject = new BehaviorSubject<MyEntitlementsDTO | null>(null);
  readonly entitlements$ = this.entitlementsSubject.asObservable();

  private readonly dashboardSubject = new BehaviorSubject<MyDashboardDTO | null>(null);
  readonly dashboard$ = this.dashboardSubject.asObservable();

  private entitlementsLoaded = false;
  private entitlementsInFlight$: Observable<MyEntitlementsDTO> | null = null;

  loadEntitlements(): Observable<MyEntitlementsDTO> {
    if (this.entitlementsLoaded && this.entitlementsSubject.value) {
      return of(this.entitlementsSubject.value);
    }

    if (this.entitlementsInFlight$) {
      return this.entitlementsInFlight$;
    }

    this.entitlementsInFlight$ = this.api.getMyEntitlements().pipe(
      tap((entitlements) => {
        this.entitlementsSubject.next(entitlements);
        this.entitlementsLoaded = true;
      }),
      finalize(() => {
        this.entitlementsInFlight$ = null;
      }),
      shareReplay(1),
    );

    return this.entitlementsInFlight$;
  }

  loadDashboard(): Observable<MyDashboardDTO> {
    return this.api.getMyDashboard().pipe(
      tap((dashboard) => {
        this.dashboardSubject.next(dashboard);
      }),
    );
  }
}

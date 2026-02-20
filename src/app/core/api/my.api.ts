import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MyDashboardDTO } from '../models/my-dashboard.model';
import { MyEntitlementsDTO } from '../models/my-entitlements.model';

@Injectable({ providedIn: 'root' })
export class MyApi {
  private readonly http = inject(HttpClient);

  getMyDashboard(): Observable<MyDashboardDTO> {
    return this.http.get<MyDashboardDTO>('/api/my/dashboard').pipe(
      catchError((error) => throwError(() => error)),
    );
  }

  getMyEntitlements(): Observable<MyEntitlementsDTO> {
    return this.http.get<MyEntitlementsDTO>('/api/my/entitlements').pipe(
      catchError((error) => throwError(() => error)),
    );
  }
}

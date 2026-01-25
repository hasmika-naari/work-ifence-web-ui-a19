import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import type {
  EnterpriseDashboardSummary,
  PersonalDashboardSummary,
} from '../models/dashboard-summary.model';

@Injectable({ providedIn: 'root' })
export class DashboardSummaryApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  getMySummary(): Observable<PersonalDashboardSummary> {
    return this.http.get<PersonalDashboardSummary>(
      `${this.getBaseUrl()}/api/dashboard/summary/me`
    );
  }

  getEnterpriseSummary(enterpriseId: string): Observable<EnterpriseDashboardSummary> {
    return this.http.get<EnterpriseDashboardSummary>(
      `${this.getBaseUrl()}/api/dashboard/summary/enterprise/${encodeURIComponent(enterpriseId)}`
    );
  }

  private getBaseUrl(): string {
    const base = (environment.backend ?? '').replace(/\/$/, '');
    return isPlatformBrowser(this.platformId) ? '' : base;
  }
}

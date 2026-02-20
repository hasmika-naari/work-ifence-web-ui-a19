import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

export interface MyDashboardResponse {
  lastUpdated?: string;
  resumeCount?: number;
  jobApplicationCount?: number;
  ongoingApplications?: number;
  offeredCount?: number;
  rejectedCount?: number;
  [key: string]: unknown;
}

export interface MyEntitlementsResponse {
  entitlements?: string[];
  features?: string[];
  [key: string]: unknown;
}

export interface RegularDashboardData {
  dashboard: MyDashboardResponse;
  entitlementKeys: string[];
}

@Injectable({ providedIn: 'root' })
export class RegularUserDashboardApiService {
  private readonly http = inject(HttpClient);

  getMyDashboard(): Observable<MyDashboardResponse> {
    return this.http.get<MyDashboardResponse>('/api/my/dashboard');
  }

  getMyEntitlements(): Observable<MyEntitlementsResponse | string[]> {
    return this.http.get<MyEntitlementsResponse | string[]>('/api/my/entitlements');
  }

  getDashboardData(): Observable<RegularDashboardData> {
    return forkJoin({
      dashboard: this.getMyDashboard(),
      entitlements: this.getMyEntitlements(),
    }).pipe(
      map(({ dashboard, entitlements }) => ({
        dashboard: dashboard ?? {},
        entitlementKeys: this.normalizeEntitlements(entitlements),
      })),
    );
  }

  private normalizeEntitlements(payload: MyEntitlementsResponse | string[] | null | undefined): string[] {
    if (!payload) {
      return [];
    }

    if (Array.isArray(payload)) {
      return payload.map((key) => String(key).trim()).filter(Boolean);
    }

    const candidates = [payload.entitlements, payload.features].find((value) => Array.isArray(value));

    if (Array.isArray(candidates)) {
      return candidates.map((key) => String(key).trim()).filter(Boolean);
    }

    return Object.entries(payload)
      .filter(([, value]) => value === true)
      .map(([key]) => String(key).trim())
      .filter(Boolean);
  }
}

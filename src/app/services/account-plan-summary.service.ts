import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface AccountPlanSummaryFeatureDTO {
  entitlementKey: string;
  title: string;
  description: string;
}

export interface AccountPlanSummaryDTO {
  planCode: string;
  planName: string;
  subscriptionStatus: string;
  features: AccountPlanSummaryFeatureDTO[];
}

@Injectable({ providedIn: 'root' })
export class AccountPlanSummaryService {
  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {}

  getCurrentPlanSummary(): Observable<AccountPlanSummaryDTO> {
    return this.http.get<AccountPlanSummaryDTO>(`${this.getBaseUrl()}/api/ext/account/plan-summary`);
  }

  private getBaseUrl(): string {
    const base = (environment.backend ?? '').replace(/\/$/, '');
    return isPlatformBrowser(this.platformId) ? '' : base;
  }
}

import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SubscriptionPlanDto, WifenceSubscriptionDto } from '../models/subscription.dto';

@Injectable({ providedIn: 'root' })
export class SubscriptionApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  getMySubscription(): Observable<WifenceSubscriptionDto> {
    return this.http.get<WifenceSubscriptionDto>(`${this.getBaseUrl()}/api/subscriptions/my`);
  }

  getActivePlans(scope?: 'INDIVIDUAL' | 'ENTERPRISE'): Observable<SubscriptionPlanDto[]> {
    const base = `${this.getBaseUrl()}/api/subscription-plans?active=true`;
    const url = scope ? `${base}&scope=${encodeURIComponent(scope)}` : base;
    return this.http.get<SubscriptionPlanDto[]>(url);
  }

  private getBaseUrl(): string {
    const base = (environment.backend ?? '').replace(/\/$/, '');
    return isPlatformBrowser(this.platformId) ? '' : base;
  }
}

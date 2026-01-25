import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { DashboardMeDto } from '../models/dashboard.dto';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  getMyDashboard(): Observable<DashboardMeDto> {
    return this.http
      .get<DashboardMeDto>(`${this.getBaseUrl()}/api/dashboard/me`)
      .pipe(
        catchError((err) => {
          const httpErr = err as HttpErrorResponse;
          (httpErr as any).userMessage = this.toUserMessage(httpErr);
          return throwError(() => httpErr);
        })
      );
  }

  private getBaseUrl(): string {
    const base = (environment.backend ?? '').replace(/\/$/, '');
    return isPlatformBrowser(this.platformId) ? '' : base;
  }

  private toUserMessage(error: HttpErrorResponse): string {
    const backendMessage =
      (error?.error && (error.error.detail || error.error.message)) || error?.message;

    if (error?.status === 0) {
      return 'Unable to reach the server. Please check your connection and try again.';
    }
    if (error?.status === 401) {
      return 'Your session has expired. Please sign in again.';
    }
    if (error?.status === 403) {
      return 'You do not have permission to view the dashboard.';
    }
    if (error?.status >= 500) {
      return backendMessage || 'The server ran into an error while loading your dashboard.';
    }

    return backendMessage || 'Failed to load your dashboard. Please try again.';
  }
}

import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardMeDto } from '../models/dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  getMyDashboard(): Observable<DashboardMeDto> {
    return this.http
      .get<DashboardMeDto>(`${this.getBaseUrl()}/api/dashboard/me`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  private getBaseUrl(): string {
    const envAny = environment as unknown as { apiUrl?: string; backend?: string };
    const configuredBaseUrl = (envAny.apiUrl ?? envAny.backend ?? '').replace(/\/$/, '');

    // Existing project pattern: browser uses relative '/api' (proxy), SSR uses absolute backend URL.
    return isPlatformBrowser(this.platformId) ? '' : configuredBaseUrl;
  }

  private handleError(error: unknown): Observable<never> {
    const httpError = error as HttpErrorResponse;

    const userMessage = this.toUserMessage(httpError);

    // Preserve the original error (status, headers, etc.) but attach a friendly message.
    (httpError as any).userMessage = userMessage;

    return throwError(() => httpError);
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

    if (error?.status === 404) {
      return 'Dashboard endpoint is not available.';
    }

    if (error?.status >= 500) {
      return backendMessage || 'The server ran into an error while loading your dashboard.';
    }

    return backendMessage || 'Failed to load your dashboard. Please try again.';
  }
}
